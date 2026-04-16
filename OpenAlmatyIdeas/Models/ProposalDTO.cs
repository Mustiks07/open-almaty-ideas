using OpenAlmatyIdeas.Domain.Enums;

namespace OpenAlmatyIdeas.Models;

public class ProposalDTO
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? DescriptionShort { get; set; }
    public string? Description { get; set; }
    public string? DistrictName { get; set; }
    public int? DistrictId { get; set; }
    public string? CategoryName { get; set; }
    public int? CategoryId { get; set; }
    public string? AuthorId { get; set; }
    public string? AuthorName { get; set; }
    public ProposalStatusEnum Status { get; set; }
    public string? StatusLabel { get; set; }
    public int LikesCount { get; set; }
    public int DislikesCount { get; set; }
    public DateTime DateCreated { get; set; }
    public List<MediaDTO> Media { get; set; } = [];
    public List<AdminResponseDTO> AdminResponses { get; set; } = [];
}
