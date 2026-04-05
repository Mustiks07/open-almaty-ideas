using Microsoft.EntityFrameworkCore;
using OpenAlmatyIdeas.Domain.Entities;
using OpenAlmatyIdeas.Domain.Repositories.Abstract;

namespace OpenAlmatyIdeas.Domain.Repositories.EntityFramework;

public class EFCategoriesRepository : ICategoriesRepository
{
    private readonly AppDbContext _context;

    public EFCategoriesRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetCategoriesAsync()
    {
        return await _context.Categories
            .Include(c => c.Proposals)
            .OrderBy(c => c.Title)
            .ToListAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(int id)
    {
        return await _context.Categories
            .Include(c => c.Proposals)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task SaveCategoryAsync(Category entity)
    {
        if (entity.Id == 0)
        {
            await _context.Categories.AddAsync(entity);
        }
        else
        {
            _context.Categories.Update(entity);
        }
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var entity = await _context.Categories.FindAsync(id);
        if (entity != null)
        {
            _context.Categories.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
