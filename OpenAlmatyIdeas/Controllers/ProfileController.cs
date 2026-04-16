using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenAlmatyIdeas.Domain;
using OpenAlmatyIdeas.Infrastructure;

namespace OpenAlmatyIdeas.Controllers;

[Authorize]
public class ProfileController : Controller
{
    private readonly DataManager _dataManager;
    private readonly UserManager<IdentityUser> _userManager;

    public ProfileController(DataManager dataManager, UserManager<IdentityUser> userManager)
    {
        _dataManager = dataManager;
        _userManager = userManager;
    }

    public async Task<IActionResult> Index()
    {
        var userId = _userManager.GetUserId(User);
        var proposals = await _dataManager.Proposals.GetProposalsByAuthorAsync(userId!);
        return View(HelperDTO.TransformProposals(proposals));
    }
}
