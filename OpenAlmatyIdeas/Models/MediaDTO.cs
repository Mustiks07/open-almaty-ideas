using OpenAlmatyIdeas.Domain.Enums;

namespace OpenAlmatyIdeas.Models;

public class MediaDTO
{
    public int Id { get; set; }
    public string? Url { get; set; }
    public string? FileName { get; set; }
    public MediaTypeEnum Type { get; set; }
}
