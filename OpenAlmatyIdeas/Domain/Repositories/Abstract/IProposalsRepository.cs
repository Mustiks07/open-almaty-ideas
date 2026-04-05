using OpenAlmatyIdeas.Domain.Entities;

namespace OpenAlmatyIdeas.Domain.Repositories.Abstract;

public interface IProposalsRepository
{
    Task<IEnumerable<Proposal>> GetProposalsAsync(int? districtId = null, int? categoryId = null);
    Task<IEnumerable<Proposal>> GetTopProposalsAsync(int count = 10);
    Task<Proposal?> GetProposalByIdAsync(int id);
    Task SaveProposalAsync(Proposal entity);
    Task DeleteProposalAsync(int id);
}
