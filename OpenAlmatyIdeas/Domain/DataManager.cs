using OpenAlmatyIdeas.Domain.Repositories.Abstract;

namespace OpenAlmatyIdeas.Domain;

public class DataManager
{
    public IProposalsRepository Proposals { get; }
    public IDistrictsRepository Districts { get; }
    public ICategoriesRepository Categories { get; }
    public IVotesRepository Votes { get; }
    public IAdminResponsesRepository AdminResponses { get; }
    public AppDbContext Context { get; }

    public DataManager(
        IProposalsRepository proposalsRepository,
        IDistrictsRepository districtsRepository,
        ICategoriesRepository categoriesRepository,
        IVotesRepository votesRepository,
        IAdminResponsesRepository adminResponsesRepository,
        AppDbContext context)
    {
        Proposals = proposalsRepository;
        Districts = districtsRepository;
        Categories = categoriesRepository;
        Votes = votesRepository;
        AdminResponses = adminResponsesRepository;
        Context = context;
    }
}
