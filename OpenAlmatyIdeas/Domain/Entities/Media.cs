using System.ComponentModel.DataAnnotations;
using OpenAlmatyIdeas.Domain.Enums;

namespace OpenAlmatyIdeas.Domain.Entities;

public class Media
{
    public int Id { get; set; }

    public int ProposalId { get; set; }
    public Proposal? Proposal { get; set; }

    [MaxLength(500)]
    public string? Url { get; set; }

    [MaxLength(300)]
    public string? FileName { get; set; }

    public long SizeBytes { get; set; }

    public MediaTypeEnum Type { get; set; }

    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
}
