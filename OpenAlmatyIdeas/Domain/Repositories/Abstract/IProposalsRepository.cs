using OpenAlmatyIdeas.Domain.Entities;

namespace OpenAlmatyIdeas.Domain.Repositories.Abstract;

public interface IProposalsRepository
{
    Task<IEnumerable<Proposal>> GetProposalsAsync(int? districtId = null, int? categoryId = null, string? search = null, string? sort = null, int page = 1, int pageSize = 12);
    Task<int> GetCountAsync();
    Task<int> GetFilteredCountAsync(int? districtId = null, int? categoryId = null, string? search = null);
    Task<IEnumerable<Proposal>> GetTopProposalsAsync(int count = 10);
    Task<IEnumerable<Proposal>> GetProposalsByAuthorAsync(string authorId);
    Task<Proposal?> GetProposalByIdAsync(int id);
    Task SaveProposalAsync(Proposal entity);
    Task DeleteProposalAsync(int id);
}
