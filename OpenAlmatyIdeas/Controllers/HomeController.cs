using Microsoft.AspNetCore.Mvc;
using OpenAlmatyIdeas.Domain;
using OpenAlmatyIdeas.Infrastructure;

namespace OpenAlmatyIdeas.Controllers;

public class HomeController : Controller
{
    private readonly DataManager _dataManager;

    public HomeController(DataManager dataManager)
    {
        _dataManager = dataManager;
    }

    public async Task<IActionResult> Index()
    {
        var topProposals = await _dataManager.Proposals.GetTopProposalsAsync(3);
        var districts = await _dataManager.Districts.GetDistrictsAsync();
        var proposals = await _dataManager.Proposals.GetProposalsAsync();

        ViewBag.TopProposals = HelperDTO.TransformProposals(topProposals);
        ViewBag.Districts = districts;
        ViewBag.TotalProposals = proposals.Count();

        return View();
    }

    public IActionResult About()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View();
    }
}
