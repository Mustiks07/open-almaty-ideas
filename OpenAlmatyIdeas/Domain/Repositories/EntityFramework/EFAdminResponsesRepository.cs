using Microsoft.EntityFrameworkCore;
using OpenAlmatyIdeas.Domain.Entities;
using OpenAlmatyIdeas.Domain.Repositories.Abstract;

namespace OpenAlmatyIdeas.Domain.Repositories.EntityFramework;

public class EFAdminResponsesRepository : IAdminResponsesRepository
{
    private readonly AppDbContext _context;

    public EFAdminResponsesRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AdminResponse>> GetResponsesByProposalIdAsync(int proposalId)
    {
        return await _context.AdminResponses
            .Include(r => r.Admin)
            .Where(r => r.ProposalId == proposalId)
            .OrderBy(r => r.DateCreated)
            .ToListAsync();
    }

    public async Task<AdminResponse?> GetResponseByIdAsync(int id)
    {
        return await _context.AdminResponses
            .Include(r => r.Admin)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task SaveResponseAsync(AdminResponse entity)
    {
        if (entity.Id == 0)
        {
            await _context.AdminResponses.AddAsync(entity);
        }
        else
        {
            _context.AdminResponses.Update(entity);
        }
        await _context.SaveChangesAsync();
    }

    public async Task DeleteResponseAsync(int id)
    {
        var entity = await _context.AdminResponses.FindAsync(id);
        if (entity != null)
        {
            _context.AdminResponses.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
