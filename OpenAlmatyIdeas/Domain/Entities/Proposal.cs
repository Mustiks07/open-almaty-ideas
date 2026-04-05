using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using OpenAlmatyIdeas.Domain.Enums;

namespace OpenAlmatyIdeas.Domain.Entities;

public class Proposal : EntityBase
{
    [Display(Name = "Выберите район")]
    public int? DistrictId { get; set; }
    public District? District { get; set; }

    [Display(Name = "Выберите категорию")]
    public int? CategoryId { get; set; }
    public Category? Category { get; set; }

    [Display(Name = "Краткое описание")]
    [MaxLength(3_000)]
    public string? DescriptionShort { get; set; }

    [Display(Name = "Описание")]
    [MaxLength(100_000)]
    public string? Description { get; set; }

    [Display(Name = "Статус")]
    public ProposalStatusEnum Status { get; set; } = ProposalStatusEnum.Pending;

    public int LikesCount { get; set; } = 0;
    public int DislikesCount { get; set; } = 0;

    // Автор предложения (из ASP.NET Identity)
    public string? AuthorId { get; set; }
    public IdentityUser? Author { get; set; }

    public ICollection<Vote>? Votes { get; set; }
    public ICollection<Media>? Media { get; set; }
    public ICollection<AdminResponse>? AdminResponses { get; set; }
}
