using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAlmatyIdeas.Domain;
using OpenAlmatyIdeas.Domain.Entities;

namespace OpenAlmatyIdeas.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("admin/categories")]
public class CategoriesAdmin : Controller
{
    private readonly DataManager _dataManager;

    public Categories(DataManager dataManager)
    {
        _dataManager = dataManager;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index()
    {
        var categories = await _dataManager.Categories.GetCategoriesAsync();
        return View(categories);
    }

    [HttpGet("edit/{id?}")]
    public async Task<IActionResult> Edit(int id = 0)
    {
        var entity = id == 0
            ? new Category()
            : await _dataManager.Categories.GetCategoryByIdAsync(id) ?? new Category();

        return View(entity);
    }

    [HttpPost("edit/{id?}")]
    public async Task<IActionResult> Edit(Category entity)
    {
        if (!ModelState.IsValid)
            return View(entity);

        await _dataManager.Categories.SaveCategoryAsync(entity);
        return RedirectToAction("Index");
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _dataManager.Categories.DeleteCategoryAsync(id);
        return RedirectToAction("Index");
    }
}
