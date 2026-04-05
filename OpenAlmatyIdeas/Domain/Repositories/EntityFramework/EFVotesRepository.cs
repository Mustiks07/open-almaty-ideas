using Microsoft.EntityFrameworkCore;
using OpenAlmatyIdeas.Domain.Entities;
using OpenAlmatyIdeas.Domain.Repositories.Abstract;

namespace OpenAlmatyIdeas.Domain.Repositories.EntityFramework;

public class EFVotesRepository : IVotesRepository
{
    private readonly AppDbContext _context;

    public EFVotesRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Vote?> GetVoteAsync(string userId, int proposalId)
    {
        return await _context.Votes
            .FirstOrDefaultAsync(v => v.UserId == userId && v.ProposalId == proposalId);
    }

    public async Task SaveVoteAsync(Vote entity)
    {
        if (entity.Id == 0)
        {
            await _context.Votes.AddAsync(entity);
        }
        else
        {
            _context.Votes.Update(entity);
        }
        await _context.SaveChangesAsync();
    }

    public async Task DeleteVoteAsync(int id)
    {
        var entity = await _context.Votes.FindAsync(id);
        if (entity != null)
        {
            _context.Votes.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
