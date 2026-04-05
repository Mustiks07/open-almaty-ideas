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

    public async Task<IActionResult> Index(int? districtId, int? categoryId)
    {
        var proposals = await _dataManager.Proposals.GetProposalsAsync(districtId, categoryId);
        var districts = await _dataManager.Districts.GetDistrictsAsync();
        var categories = await _dataManager.Categories.GetCategoriesAsync();

        ViewBag.Districts = districts;
        ViewBag.Categories = categories;
        ViewBag.CurrentDistrictId = districtId;
        ViewBag.CurrentCategoryId = categoryId;

        return View(HelperDTO.TransformProposals(proposals));
    }

    public async Task<IActionResult> Show(int id)
    {
        var proposal = await _dataManager.Proposals.GetProposalByIdAsync(id);
        if (proposal == null)
            return NotFound();

        // Голос текущего пользователя
        if (User.Identity?.IsAuthenticated == true)
        {
            var userId = _userManager.GetUserId(User);
            var vote = await _dataManager.Votes.GetVoteAsync(userId!, id);
            ViewBag.CurrentVote = vote?.Type;
        }

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
    [HttpPost]
    public async Task<IActionResult> Vote(int proposalId, VoteTypeEnum voteType)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null)
            return Unauthorized();

        var proposal = await _dataManager.Proposals.GetProposalByIdAsync(proposalId);
        if (proposal == null)
            return NotFound();

        var existingVote = await _dataManager.Votes.GetVoteAsync(userId, proposalId);

        if (existingVote != null)
        {
            // Убрать голос если тот же тип
            if (existingVote.Type == voteType)
            {
                if (voteType == VoteTypeEnum.Like) proposal.LikesCount--;
                else proposal.DislikesCount--;

                await _dataManager.Votes.DeleteVoteAsync(existingVote.Id);
                await _dataManager.Proposals.SaveProposalAsync(proposal);
                return RedirectToAction("Show", new { id = proposalId });
            }

            // Изменить голос
            if (existingVote.Type == VoteTypeEnum.Like) proposal.LikesCount--;
            else proposal.DislikesCount--;

            existingVote.Type = voteType;
            await _dataManager.Votes.SaveVoteAsync(existingVote);
        }
        else
        {
            var vote = new Vote
            {
                UserId = userId,
                ProposalId = proposalId,
                Type = voteType
            };
            await _dataManager.Votes.SaveVoteAsync(vote);
        }

        if (voteType == VoteTypeEnum.Like) proposal.LikesCount++;
        else proposal.DislikesCount++;

        await _dataManager.Proposals.SaveProposalAsync(proposal);
        return RedirectToAction("Show", new { id = proposalId });
    }
}
