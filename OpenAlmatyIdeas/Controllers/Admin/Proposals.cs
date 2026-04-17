using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenAlmatyIdeas.Domain;
using OpenAlmatyIdeas.Domain.Entities;
using OpenAlmatyIdeas.Domain.Enums;
using OpenAlmatyIdeas.Infrastructure;

namespace OpenAlmatyIdeas.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("admin/proposals")]
public class ProposalsAdmin : Controller
{
    private readonly DataManager _dataManager;
    private readonly UserManager<IdentityUser> _userManager;

    public ProposalsAdmin(DataManager dataManager, UserManager<IdentityUser> userManager)
    {
        _dataManager = dataManager;
        _userManager = userManager;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index()
    {
        var proposals = await _dataManager.Proposals.GetProposalsAsync();
        return View(HelperDTO.TransformProposals(proposals));
    }

    [HttpGet("edit/{id}")]
    public async Task<IActionResult> Edit(int id)
    {
        var proposal = await _dataManager.Proposals.GetProposalByIdAsync(id);
        if (proposal == null)
            return NotFound();

        ViewBag.Districts = await _dataManager.Districts.GetDistrictsAsync();
        ViewBag.Categories = await _dataManager.Categories.GetCategoriesAsync();
        ViewBag.Statuses = Enum.GetValues<ProposalStatusEnum>();

        return View(proposal);
    }

    [HttpPost("edit/{id}")]
    public async Task<IActionResult> Edit(int id, ProposalStatusEnum status, string? adminResponseText)
    {
        var proposal = await _dataManager.Proposals.GetProposalByIdAsync(id);
        if (proposal == null)
            return NotFound();

        proposal.Status = status;
        await _dataManager.Proposals.SaveProposalAsync(proposal);

        // Если есть ответ — добавляем
        if (!string.IsNullOrWhiteSpace(adminResponseText))
        {
            var adminId = _userManager.GetUserId(User);
            var response = new AdminResponse
            {
                ProposalId = id,
                AdminId = adminId,
                Text = adminResponseText
            };
            await _dataManager.AdminResponses.SaveResponseAsync(response);
        }

        return RedirectToAction("Index");
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _dataManager.Proposals.DeleteProposalAsync(id);
        return RedirectToAction("Index");
    }
}
