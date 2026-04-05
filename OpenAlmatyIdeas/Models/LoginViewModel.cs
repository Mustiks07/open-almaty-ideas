using System.ComponentModel.DataAnnotations;

namespace OpenAlmatyIdeas.Models;

public class LoginViewModel
{
    [Required(ErrorMessage = "Введите логин")]
    [Display(Name = "Логин")]
    public string? UserName { get; set; }

    [Required(ErrorMessage = "Введите пароль")]
    [UIHint("password")]
    [Display(Name = "Пароль")]
    public string? Password { get; set; }

    [Display(Name = "Запомнить меня?")]
    public bool RememberMe { get; set; }
}
