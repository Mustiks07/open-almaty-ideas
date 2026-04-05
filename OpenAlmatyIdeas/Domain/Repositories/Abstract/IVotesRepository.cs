using OpenAlmatyIdeas.Domain.Entities;
using OpenAlmatyIdeas.Domain.Enums;

namespace OpenAlmatyIdeas.Domain.Repositories.Abstract;

public interface IVotesRepository
{
    Task<Vote?> GetVoteAsync(string userId, int proposalId);
    Task SaveVoteAsync(Vote entity);
    Task DeleteVoteAsync(int id);
}
