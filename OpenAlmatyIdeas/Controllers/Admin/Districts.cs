using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAlmatyIdeas.Domain;
using OpenAlmatyIdeas.Domain.Entities;

namespace OpenAlmatyIdeas.Controllers.Admin;

[Authorize(Roles = "Admin")]
public class Districts : Controller
{
    private readonly DataManager _dataManager;

    public Districts(DataManager dataManager)
    {
        _dataManager = dataManager;
    }

    public async Task<IActionResult> Index()
    {
        var districts = await _dataManager.Districts.GetDistrictsAsync();
        return View(districts);
    }

    [HttpGet]
    public async Task<IActionResult> Edit(int id = 0)
    {
        var entity = id == 0
            ? new District()
            : await _dataManager.Districts.GetDistrictByIdAsync(id) ?? new District();

        return View(entity);
    }

    [HttpPost]
    public async Task<IActionResult> Edit(District entity)
    {
        if (!ModelState.IsValid)
            return View(entity);

        await _dataManager.Districts.SaveDistrictAsync(entity);
        return RedirectToAction("Index");
    }

    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        await _dataManager.Districts.DeleteDistrictAsync(id);
        return RedirectToAction("Index");
    }
}
