using System.ComponentModel.DataAnnotations;
using OpenAlmatyIdeas.Domain.Entities;

namespace OpenAlmatyIdeas.Models;

public class CreateProposalViewModel
{
    [Required(ErrorMessage = "Введите название предложения")]
    [Display(Name = "Название")]
    [MaxLength(200)]
    public string? Title { get; set; }

    [Display(Name = "Краткое описание")]
    [MaxLength(3_000)]
    public string? DescriptionShort { get; set; }

    [Display(Name = "Полное описание")]
    [MaxLength(100_000)]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Выберите район")]
    [Display(Name = "Район")]
    public int? DistrictId { get; set; }

    [Required(ErrorMessage = "Выберите категорию")]
    [Display(Name = "Категория")]
    public int? CategoryId { get; set; }

    // Для select-списков
    public IEnumerable<District>? Districts { get; set; }
    public IEnumerable<Category>? Categories { get; set; }
}
