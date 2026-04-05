using System.ComponentModel.DataAnnotations;

namespace OpenAlmatyIdeas.Domain.Entities;

public class Category : EntityBase
{
    public ICollection<Proposal>? Proposals { get; set; }
}
