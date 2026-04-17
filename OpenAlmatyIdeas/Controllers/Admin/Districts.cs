using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAlmatyIdeas.Domain;
using OpenAlmatyIdeas.Domain.Entities;

namespace OpenAlmatyIdeas.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("admin/districts")]
public class DistrictsAdmin : Controller
{
    private readonly DataManager _dataManager;

    public DistrictsAdmin(DataManager dataManager)
    {
        _dataManager = dataManager;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index()
    {
        var districts = await _dataManager.Districts.GetDistrictsAsync();
        return View("~/Views/Admin/Districts/Index.cshtml", districts);
    }

    [HttpGet("edit/{id?}")]
    public async Task<IActionResult> Edit(int id = 0)
    {
        var entity = id == 0
            ? new District()
            : await _dataManager.Districts.GetDistrictByIdAsync(id) ?? new District();

        return View("~/Views/Admin/Districts/Edit.cshtml", entity);
    }

    [HttpPost("edit/{id?}")]
    public async Task<IActionResult> Edit(District entity)
    {
        if (!ModelState.IsValid)
            return View("~/Views/Admin/Districts/Edit.cshtml", entity);

        await _dataManager.Districts.SaveDistrictAsync(entity);
        return RedirectToAction("Index");
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _dataManager.Districts.DeleteDistrictAsync(id);
        return RedirectToAction("Index");
    }
}
