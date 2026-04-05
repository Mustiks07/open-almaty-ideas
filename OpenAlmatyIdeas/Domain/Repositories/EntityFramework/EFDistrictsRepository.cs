using Microsoft.EntityFrameworkCore;
using OpenAlmatyIdeas.Domain.Entities;
using OpenAlmatyIdeas.Domain.Repositories.Abstract;

namespace OpenAlmatyIdeas.Domain.Repositories.EntityFramework;

public class EFDistrictsRepository : IDistrictsRepository
{
    private readonly AppDbContext _context;

    public EFDistrictsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<District>> GetDistrictsAsync()
    {
        return await _context.Districts
            .Include(d => d.Proposals)
            .OrderBy(d => d.Title)
            .ToListAsync();
    }

    public async Task<District?> GetDistrictByIdAsync(int id)
    {
        return await _context.Districts
            .Include(d => d.Proposals)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task SaveDistrictAsync(District entity)
    {
        if (entity.Id == 0)
        {
            await _context.Districts.AddAsync(entity);
        }
        else
        {
            _context.Districts.Update(entity);
        }
        await _context.SaveChangesAsync();
    }

    public async Task DeleteDistrictAsync(int id)
    {
        var entity = await _context.Districts.FindAsync(id);
        if (entity != null)
        {
            _context.Districts.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
