using Microsoft.EntityFrameworkCore;
using OpenAlmatyIdeas.Domain.Entities;
using OpenAlmatyIdeas.Domain.Repositories.Abstract;

namespace OpenAlmatyIdeas.Domain.Repositories.EntityFramework;

public class EFProposalsRepository : IProposalsRepository
{
    private readonly AppDbContext _context;

    public EFProposalsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Proposal>> GetProposalsAsync(
        int? districtId = null, int? categoryId = null,
        string? search = null, string? sort = null,
        int page = 1, int pageSize = 12)
    {
        var query = BuildFilteredQuery(districtId, categoryId, search);

        query = sort == "popular"
            ? query.OrderByDescending(p => p.LikesCount)
            : query.OrderByDescending(p => p.DateCreated);

        return await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    }

    public async Task<int> GetCountAsync()
    {
        return await _context.Proposals.CountAsync();
    }

    public async Task<int> GetFilteredCountAsync(int? districtId = null, int? categoryId = null, string? search = null)
    {
        return await BuildFilteredQuery(districtId, categoryId, search).CountAsync();
    }

    private IQueryable<Proposal> BuildFilteredQuery(int? districtId, int? categoryId, string? search)
    {
        var query = _context.Proposals
            .Include(p => p.District)
            .Include(p => p.Category)
            .Include(p => p.Author)
            .Include(p => p.Media)
            .AsQueryable();

        if (districtId.HasValue)
            query = query.Where(p => p.DistrictId == districtId);

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p =>
                p.Title!.Contains(search) ||
                (p.DescriptionShort != null && p.DescriptionShort.Contains(search)) ||
                (p.Description != null && p.Description.Contains(search)));

        return query;
    }

    public async Task<IEnumerable<Proposal>> GetTopProposalsAsync(int count = 10)
    {
        return await _context.Proposals
            .Include(p => p.District)
            .Include(p => p.Category)
            .Include(p => p.Author)
            .Include(p => p.Media)
            .OrderByDescending(p => p.LikesCount)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<Proposal>> GetProposalsByAuthorAsync(string authorId)
    {
        return await _context.Proposals
            .Include(p => p.District)
            .Include(p => p.Category)
            .Include(p => p.Media)
            .Where(p => p.AuthorId == authorId)
            .OrderByDescending(p => p.DateCreated)
            .ToListAsync();
    }

    public async Task<Proposal?> GetProposalByIdAsync(int id)
    {
        return await _context.Proposals
            .Include(p => p.District)
            .Include(p => p.Category)
            .Include(p => p.Author)
            .Include(p => p.Media)
            .Include(p => p.AdminResponses)!.ThenInclude(r => r.Admin)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task SaveProposalAsync(Proposal entity)
    {
        if (entity.Id == 0)
            await _context.Proposals.AddAsync(entity);
        else
            _context.Proposals.Update(entity);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteProposalAsync(int id)
    {
        var entity = await _context.Proposals.FindAsync(id);
        if (entity != null)
        {
            _context.Proposals.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
