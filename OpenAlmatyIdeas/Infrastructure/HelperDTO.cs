using OpenAlmatyIdeas.Domain.Entities;
using OpenAlmatyIdeas.Domain.Enums;
using OpenAlmatyIdeas.Models;

namespace OpenAlmatyIdeas.Infrastructure;

public static class HelperDTO
{
    public static ProposalDTO TransformProposal(Proposal entity)
    {
        return new ProposalDTO
        {
            Id = entity.Id,
            Title = entity.Title,
            DescriptionShort = entity.DescriptionShort,
            Description = entity.Description,
            DistrictName = entity.District?.Title,
            CategoryName = entity.Category?.Title,
            AuthorName = entity.Author?.UserName,
            Status = entity.Status,
            StatusLabel = GetStatusLabel(entity.Status),
            LikesCount = entity.LikesCount,
            DislikesCount = entity.DislikesCount,
            DateCreated = entity.DateCreated,
            Media = entity.Media?.Select(m => new MediaDTO
            {
                Id = m.Id,
                Url = m.Url,
                FileName = m.FileName,
                Type = m.Type
            }).ToList() ?? []
        };
    }

    public static IEnumerable<ProposalDTO> TransformProposals(IEnumerable<Proposal> entities)
    {
        return entities.Select(TransformProposal);
    }

    private static string GetStatusLabel(ProposalStatusEnum status) => status switch
    {
        ProposalStatusEnum.Pending => "На рассмотрении",
        ProposalStatusEnum.Accepted => "Принято",
        ProposalStatusEnum.Rejected => "Отклонено",
        ProposalStatusEnum.Implemented => "Реализовано",
        _ => "Неизвестно"
    };
}
