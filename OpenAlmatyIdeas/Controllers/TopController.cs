using Microsoft.AspNetCore.Mvc;
using OpenAlmatyIdeas.Domain;
using OpenAlmatyIdeas.Infrastructure;

namespace OpenAlmatyIdeas.Controllers;

public class TopController : Controller
{
    private readonly DataManager _dataManager;

    public TopController(DataManager dataManager)
    {
        _dataManager = dataManager;
    }

    public async Task<IActionResult> Index()
    {
        var topProposals = await _dataManager.Proposals.GetTopProposalsAsync(20);
        return View(HelperDTO.TransformProposals(topProposals));
    }
}
