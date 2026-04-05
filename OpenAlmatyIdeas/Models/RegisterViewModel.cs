using System.ComponentModel.DataAnnotations;

namespace OpenAlmatyIdeas.Models;

public class RegisterViewModel
{
    [Required(ErrorMessage = "Введите логин")]
    [Display(Name = "Логин")]
    [MaxLength(50)]
    public string? UserName { get; set; }

    [Required(ErrorMessage = "Введите email")]
    [EmailAddress(ErrorMessage = "Некорректный email")]
    [Display(Name = "Email")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Введите пароль")]
    [MinLength(6, ErrorMessage = "Пароль должен содержать не менее 6 символов")]
    [UIHint("password")]
    [Display(Name = "Пароль")]
    public string? Password { get; set; }

    [Required(ErrorMessage = "Подтвердите пароль")]
    [Compare("Password", ErrorMessage = "Пароли не совпадают")]
    [UIHint("password")]
    [Display(Name = "Подтверждение пароля")]
    public string? ConfirmPassword { get; set; }
}
