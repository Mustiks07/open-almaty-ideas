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
        var categories = await _dataManager.Categories.GetCategoriesAsync();
        var totalProposals = await _dataManager.Proposals.GetCountAsync();

        ViewBag.TopProposals = HelperDTO.TransformProposals(topProposals);
        ViewBag.Districts = districts;
        ViewBag.TotalProposals = totalProposals;
        ViewBag.TotalDistricts = districts.Count();
        ViewBag.TotalCategories = categories.Count();

        return View();
    }

    public IActionResult About()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error(int? id)
    {
        if (id == 404)
            return View("NotFound");

        return View();
    }
}
