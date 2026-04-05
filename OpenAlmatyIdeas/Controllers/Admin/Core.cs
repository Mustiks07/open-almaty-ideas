using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace OpenAlmatyIdeas.Controllers.Admin;

[Authorize(Roles = "Admin")]
public class Core : Controller
{
    public IActionResult Index()
    {
        return View();
    }

    public IActionResult AccessDenied()
    {
        return View();
    }
}
