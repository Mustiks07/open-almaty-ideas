using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenAlmatyIdeas.Models;

namespace OpenAlmatyIdeas.Controllers;

public class AccountController : Controller
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;

    public AccountController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [HttpGet]
    public IActionResult Login(string? returnUrl)
    {
        if (!string.IsNullOrEmpty(returnUrl) && returnUrl.StartsWith("/admin", StringComparison.OrdinalIgnoreCase))
        {
            return RedirectToAction("AdminLogin", new { returnUrl });
        }

        ViewBag.ReturnUrl = returnUrl;
        return View(new LoginViewModel());
    }

    [HttpPost]
    public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl)
    {
        if (!ModelState.IsValid)
            return View(model);

        var user = await _userManager.FindByNameAsync(model.UserName!) ?? await _userManager.FindByEmailAsync(model.UserName!);

        var result = await _signInManager.PasswordSignInAsync(
            user != null ? user.UserName! : model.UserName!,
            model.Password!,
            model.RememberMe,
            lockoutOnFailure: false);

        if (result.Succeeded)
        {
            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                return Redirect(returnUrl);

            return RedirectToAction("Index", "Home");
        }

        ModelState.AddModelError(string.Empty, "Неверный логин или пароль");
        return View(model);
    }

    [HttpGet]
    public IActionResult Register()
    {
        return View(new RegisterViewModel());
    }

    [HttpPost]
    public async Task<IActionResult> Register(RegisterViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        var user = new IdentityUser
        {
            UserName = model.UserName,
            Email = model.Email
        };

        var result = await _userManager.CreateAsync(user, model.Password!);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, "User");
            await _signInManager.SignInAsync(user, isPersistent: false);
            return RedirectToAction("Index", "Home");
        }

        foreach (var error in result.Errors)
            ModelState.AddModelError(string.Empty, error.Description);

        return View(model);
    }

    [HttpPost]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return RedirectToAction("Index", "Home");
    }

    [HttpGet]
    public IActionResult AdminLogin(string? returnUrl)
    {
        ViewBag.ReturnUrl = returnUrl ?? "/admin";
        return View(new LoginViewModel());
    }

    [HttpPost]
    public async Task<IActionResult> AdminLogin(LoginViewModel model, string? returnUrl)
    {
        if (!ModelState.IsValid)
            return View(model);

        var user = await _userManager.FindByNameAsync(model.UserName!) ?? await _userManager.FindByEmailAsync(model.UserName!);
        if (user != null)
        {
            var isRoleStr = await _userManager.IsInRoleAsync(user, "Admin");
            if (!isRoleStr)
            {
                ModelState.AddModelError(string.Empty, "Доступ запрещен. Эта страница только для администраторов.");
                return View(model);
            }
        }

        var result = await _signInManager.PasswordSignInAsync(
            user != null ? user.UserName! : model.UserName!,
            model.Password!,
            model.RememberMe,
            lockoutOnFailure: false);

        if (result.Succeeded)
        {
            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                return Redirect(returnUrl);

            return Redirect("/admin");
        }

        ModelState.AddModelError(string.Empty, "Неверный логин или пароль");
        return View(model);
    }
}
