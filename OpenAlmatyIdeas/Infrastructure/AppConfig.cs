namespace OpenAlmatyIdeas.Infrastructure;

public class AppConfig
{
    public TinyMCEConfig TinyMCE { get; set; } = new();
    public SiteConfig Site { get; set; } = new();
}

public class TinyMCEConfig
{
    public string ApiKey { get; set; } = string.Empty;
}

public class SiteConfig
{
    public string Name { get; set; } = "Open Almaty Ideas";
    public string City { get; set; } = "Алматы";
}
