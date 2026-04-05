using Microsoft.AspNetCore.Mvc;
using OpenAlmatyIdeas.Domain;

namespace OpenAlmatyIdeas.Controllers;

public class MapController : Controller
{
    private readonly DataManager _dataManager;

    public MapController(DataManager dataManager)
    {
        _dataManager = dataManager;
    }

    public async Task<IActionResult> Index()
    {
        var districts = await _dataManager.Districts.GetDistrictsAsync();
        return View(districts);
    }
}
