using System.ComponentModel.DataAnnotations;

namespace OpenAlmatyIdeas.Domain.Entities;

public class District : EntityBase
{
    public ICollection<Proposal>? Proposals { get; set; }
}
