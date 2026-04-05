using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OpenAlmatyIdeas.Domain;
using OpenAlmatyIdeas.Domain.Repositories.EntityFramework;
using OpenAlmatyIdeas.Domain.Repositories.Abstract;
using OpenAlmatyIdeas.Infrastructure;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Чтение конфигурации
var appConfig = builder.Configuration
    .GetSection("Project")
    .Get<AppConfig>()!;

builder.Services.AddSingleton(appConfig);

// Настройка базы данных
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Настройка Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Настройка аутентификации через Cookie
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "OpenAlmatyIdeasAuth";
    options.Cookie.HttpOnly = true;
    options.LoginPath = "/account/login";
    options.AccessDeniedPath = "/admin/accessdenied";
    options.SlidingExpiration = true;
});

// Регистрация репозиториев
builder.Services.AddTransient<IProposalsRepository, EFProposalsRepository>();
builder.Services.AddTransient<IDistrictsRepository, EFDistrictsRepository>();
builder.Services.AddTransient<ICategoriesRepository, EFCategoriesRepository>();
builder.Services.AddTransient<IVotesRepository, EFVotesRepository>();
builder.Services.AddTransient<IAdminResponsesRepository, EFAdminResponsesRepository>();
builder.Services.AddTransient<DataManager>();

// Добавление контроллеров и представлений
builder.Services.AddControllersWithViews();

// Настройка Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

var app = builder.Build();

// Миграция и сид данных
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Настройка middleware
app.UseSerilogRequestLogging();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Маршруты для Admin
app.MapControllerRoute(
    name: "admin",
    pattern: "admin/{controller=Core}/{action=Index}/{id?}",
    defaults: new { area = "" },
    constraints: new { controller = "Core|Proposals|Districts|Categories" }
);

// Маршрут по умолчанию
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
