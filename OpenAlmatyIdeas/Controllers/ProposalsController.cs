using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenAlmatyIdeas.Domain;
using OpenAlmatyIdeas.Domain.Entities;
using OpenAlmatyIdeas.Domain.Enums;
using OpenAlmatyIdeas.Infrastructure;
using OpenAlmatyIdeas.Models;

namespace OpenAlmatyIdeas.Controllers;

public class ProposalsController : Controller
{
    private readonly DataManager _dataManager;
    private readonly UserManager<IdentityUser> _userManager;

    public ProposalsController(DataManager dataManager, UserManager<IdentityUser> userManager)
    {
        _dataManager = dataManager;
        _userManager = userManager;
    }

    public async Task<IActionResult> Index(int? districtId, int? categoryId, string? search, string? sort, int page = 1)
    {
        const int pageSize = 12;
        var proposals = await _dataManager.Proposals.GetProposalsAsync(districtId, categoryId, search, sort, page, pageSize);
        var totalCount = await _dataManager.Proposals.GetFilteredCountAsync(districtId, categoryId, search);
        var districts = await _dataManager.Districts.GetDistrictsAsync();
        var categories = await _dataManager.Categories.GetCategoriesAsync();

        ViewBag.Districts = districts;
        ViewBag.Categories = categories;
        ViewBag.CurrentDistrictId = districtId;
        ViewBag.CurrentCategoryId = categoryId;
        ViewBag.Search = search;
        ViewBag.Sort = sort;
        ViewBag.CurrentPage = page;
        ViewBag.TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        ViewBag.TotalCount = totalCount;

        return View(HelperDTO.TransformProposals(proposals));
    }

    public async Task<IActionResult> Show(int id)
    {
        var proposal = await _dataManager.Proposals.GetProposalByIdAsync(id);
        if (proposal == null) return NotFound();

        VoteTypeEnum? currentVote = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var userId = _userManager.GetUserId(User);
            var vote = await _dataManager.Votes.GetVoteAsync(userId!, id);
            currentVote = vote?.Type;
        }

        ViewBag.CurrentVote = currentVote;
        ViewBag.CurrentUserId = _userManager.GetUserId(User);
        return View(HelperDTO.TransformProposal(proposal));
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> New()
    {
        var model = new CreateProposalViewModel
        {
            Districts = await _dataManager.Districts.GetDistrictsAsync(),
            Categories = await _dataManager.Categories.GetCategoriesAsync()
        };
        return View(model);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> New(CreateProposalViewModel model)
    {
        if (!ModelState.IsValid)
        {
            model.Districts = await _dataManager.Districts.GetDistrictsAsync();
            model.Categories = await _dataManager.Categories.GetCategoriesAsync();
            return View(model);
        }

        var userId = _userManager.GetUserId(User);
        var proposal = new Proposal
        {
            Title = model.Title,
            DescriptionShort = model.DescriptionShort,
            Description = model.Description,
            DistrictId = model.DistrictId,
            CategoryId = model.CategoryId,
            AuthorId = userId,
            Status = ProposalStatusEnum.Pending
        };

        await _dataManager.Proposals.SaveProposalAsync(proposal);
        return RedirectToAction("Show", new { id = proposal.Id });
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Edit(int id)
    {
        var proposal = await _dataManager.Proposals.GetProposalByIdAsync(id);
        if (proposal == null) return NotFound();

        var userId = _userManager.GetUserId(User);
        if (proposal.AuthorId != userId) return Forbid();

        var model = new CreateProposalViewModel
        {
            Title = proposal.Title,
            DescriptionShort = proposal.DescriptionShort,
            Description = proposal.Description,
            DistrictId = proposal.DistrictId,
            CategoryId = proposal.CategoryId,
            Districts = await _dataManager.Districts.GetDistrictsAsync(),
            Categories = await _dataManager.Categories.GetCategoriesAsync()
        };

        ViewBag.ProposalId = id;
        return View(model);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Edit(int id, CreateProposalViewModel model)
    {
        var proposal = await _dataManager.Proposals.GetProposalByIdAsync(id);
        if (proposal == null) return NotFound();

        var userId = _userManager.GetUserId(User);
        if (proposal.AuthorId != userId) return Forbid();

        if (!ModelState.IsValid)
        {
            model.Districts = await _dataManager.Districts.GetDistrictsAsync();
            model.Categories = await _dataManager.Categories.GetCategoriesAsync();
            ViewBag.ProposalId = id;
            return View(model);
        }

        proposal.Title = model.Title;
        proposal.DescriptionShort = model.DescriptionShort;
        proposal.Description = model.Description;
        proposal.DistrictId = model.DistrictId;
        proposal.CategoryId = model.CategoryId;

        await _dataManager.Proposals.SaveProposalAsync(proposal);
        return RedirectToAction("Show", new { id });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        var proposal = await _dataManager.Proposals.GetProposalByIdAsync(id);
        if (proposal == null) return NotFound();

        var userId = _userManager.GetUserId(User);
        var isAdmin = User.IsInRole("Admin");

        if (proposal.AuthorId != userId && !isAdmin) return Forbid();

        await _dataManager.Proposals.DeleteProposalAsync(id);
        return RedirectToAction("Index", "Profile");
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Vote(int proposalId, VoteTypeEnum voteType)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        await using var transaction = await _dataManager.Context.Database.BeginTransactionAsync();
        try
        {
            var proposal = await _dataManager.Proposals.GetProposalByIdAsync(proposalId);
            if (proposal == null) return NotFound();

            var existingVote = await _dataManager.Votes.GetVoteAsync(userId, proposalId);

            if (existingVote != null)
            {
                if (existingVote.Type == voteType)
                {
                    // Убираем голос (повторный клик)
                    if (voteType == VoteTypeEnum.Like) proposal.LikesCount--;
                    else proposal.DislikesCount--;
                    await _dataManager.Votes.DeleteVoteAsync(existingVote.Id);
                }
                else
                {
                    // Меняем тип голоса
                    if (existingVote.Type == VoteTypeEnum.Like) proposal.LikesCount--;
                    else proposal.DislikesCount--;

                    existingVote.Type = voteType;
                    await _dataManager.Votes.SaveVoteAsync(existingVote);

                    if (voteType == VoteTypeEnum.Like) proposal.LikesCount++;
                    else proposal.DislikesCount++;
                }
            }
            else
            {
                // Новый голос
                var vote = new Vote { UserId = userId, ProposalId = proposalId, Type = voteType };
                await _dataManager.Votes.SaveVoteAsync(vote);

                if (voteType == VoteTypeEnum.Like) proposal.LikesCount++;
                else proposal.DislikesCount++;
            }

            await _dataManager.Proposals.SaveProposalAsync(proposal);
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }

        return RedirectToAction("Show", new { id = proposalId });
    }
}
