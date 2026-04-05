using OpenAlmatyIdeas.Domain.Entities;

namespace OpenAlmatyIdeas.Domain.Repositories.Abstract;

public interface ICategoriesRepository
{
    Task<IEnumerable<Category>> GetCategoriesAsync();
    Task<Category?> GetCategoryByIdAsync(int id);
    Task SaveCategoryAsync(Category entity);
    Task DeleteCategoryAsync(int id);
}
