using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace OpenAlmatyIdeas.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("admin")]
public class Core : Controller
{
    [HttpGet("")]
    public IActionResult Index()
    {
        return View("~/Views/Admin/Core/Index.cshtml");
    }

    [HttpGet("accessdenied")]
    public IActionResult AccessDenied()
    {
        return View("~/Views/Admin/Core/AccessDenied.cshtml");
    }
}
