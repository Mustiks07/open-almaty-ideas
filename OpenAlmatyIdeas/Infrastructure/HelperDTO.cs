using Ganss.Xss;
using OpenAlmatyIdeas.Domain.Entities;
using OpenAlmatyIdeas.Domain.Enums;
using OpenAlmatyIdeas.Models;

namespace OpenAlmatyIdeas.Infrastructure;

public static class HelperDTO
{
    private static readonly HtmlSanitizer _sanitizer = new();

    public static ProposalDTO TransformProposal(Proposal entity)
    {
        return new ProposalDTO
        {
            Id = entity.Id,
            Title = entity.Title,
            DescriptionShort = entity.DescriptionShort,
            Description = entity.Description != null ? _sanitizer.Sanitize(entity.Description) : null,
            DistrictId = entity.DistrictId,
            DistrictName = entity.District?.Title,
            CategoryId = entity.CategoryId,
            CategoryName = entity.Category?.Title,
            AuthorId = entity.AuthorId,
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
            }).ToList() ?? [],
            AdminResponses = entity.AdminResponses?.Select(r => new AdminResponseDTO
            {
                Id = r.Id,
                Text = r.Text,
                AdminName = r.Admin?.UserName,
                DateCreated = r.DateCreated
            }).ToList() ?? []
        };
    }

    public static IEnumerable<ProposalDTO> TransformProposals(IEnumerable<Proposal> entities)
    {
        return entities.Select(TransformProposal);
    }

    public static string GetStatusLabel(ProposalStatusEnum status) => status switch
    {
        ProposalStatusEnum.Pending => "На рассмотрении",
        ProposalStatusEnum.Accepted => "Принято",
        ProposalStatusEnum.Rejected => "Отклонено",
        ProposalStatusEnum.Implemented => "Реализовано",
        _ => "Неизвестно"
    };
}
