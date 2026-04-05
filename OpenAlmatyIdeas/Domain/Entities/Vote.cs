using Microsoft.AspNetCore.Identity;
using OpenAlmatyIdeas.Domain.Enums;

namespace OpenAlmatyIdeas.Domain.Entities;

public class Vote
{
    public int Id { get; set; }

    public string? UserId { get; set; }
    public IdentityUser? User { get; set; }

    public int ProposalId { get; set; }
    public Proposal? Proposal { get; set; }

    public VoteTypeEnum Type { get; set; }

    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
}
