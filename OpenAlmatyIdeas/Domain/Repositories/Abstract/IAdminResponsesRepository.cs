using OpenAlmatyIdeas.Domain.Entities;

namespace OpenAlmatyIdeas.Domain.Repositories.Abstract;

public interface IAdminResponsesRepository
{
    Task<IEnumerable<AdminResponse>> GetResponsesByProposalIdAsync(int proposalId);
    Task<AdminResponse?> GetResponseByIdAsync(int id);
    Task SaveResponseAsync(AdminResponse entity);
    Task DeleteResponseAsync(int id);
}
