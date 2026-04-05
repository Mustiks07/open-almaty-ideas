using OpenAlmatyIdeas.Domain.Repositories.Abstract;

namespace OpenAlmatyIdeas.Domain;

public class DataManager
{
    public IProposalsRepository Proposals { get; set; }
    public IDistrictsRepository Districts { get; set; }
    public ICategoriesRepository Categories { get; set; }
    public IVotesRepository Votes { get; set; }
    public IAdminResponsesRepository AdminResponses { get; set; }

    public DataManager(
        IProposalsRepository proposalsRepository,
        IDistrictsRepository districtsRepository,
        ICategoriesRepository categoriesRepository,
        IVotesRepository votesRepository,
        IAdminResponsesRepository adminResponsesRepository)
    {
        Proposals = proposalsRepository;
        Districts = districtsRepository;
        Categories = categoriesRepository;
        Votes = votesRepository;
        AdminResponses = adminResponsesRepository;
    }
}
