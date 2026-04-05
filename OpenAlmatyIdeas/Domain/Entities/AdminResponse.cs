using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace OpenAlmatyIdeas.Domain.Entities;

public class AdminResponse
{
    public int Id { get; set; }

    public int ProposalId { get; set; }
    public Proposal? Proposal { get; set; }

    public string? AdminId { get; set; }
    public IdentityUser? Admin { get; set; }

    [Required(ErrorMessage = "Заполните текст ответа")]
    [Display(Name = "Ответ администратора")]
    [MaxLength(10_000)]
    public string? Text { get; set; }

    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
}
