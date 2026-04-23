using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OpenAlmatyIdeas.Domain.Entities;

namespace OpenAlmatyIdeas.Domain;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public DbSet<Proposal> Proposals { get; set; } = null!;
    public DbSet<District> Districts { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Vote> Votes { get; set; } = null!;
    public DbSet<Media> Media { get; set; } = null!;
    public DbSet<AdminResponse> AdminResponses { get; set; } = null!;

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Уникальный голос — один на пользователя за предложение
        builder.Entity<Vote>()
            .HasIndex(v => new { v.UserId, v.ProposalId })
            .IsUnique();

        // Предзаполнение ролей
        var adminRoleId = "1";
        var userRoleId = "2";

        builder.Entity<IdentityRole>().HasData(
            new IdentityRole
            {
                Id = adminRoleId,
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole
            {
                Id = userRoleId,
                Name = "User",
                NormalizedName = "USER"
            }
        );

        // Предзаполнение администратора
        // ⚠️ ВАЖНО: Смените пароль после первого запуска!
        var adminId = "admin-user-id";
        var hasher = new PasswordHasher<IdentityUser>();
        var adminUser = new IdentityUser
        {
            Id = adminId,
            UserName = "admin",
            NormalizedUserName = "ADMIN",
            Email = "admin@openalmaty.kz",
            NormalizedEmail = "ADMIN@OPENALMATY.KZ",
            EmailConfirmed = true,
        };
        adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin@2026!");

        builder.Entity<IdentityUser>().HasData(adminUser);
        builder.Entity<IdentityUserRole<string>>().HasData(
            new IdentityUserRole<string>
            {
                UserId = adminId,
                RoleId = adminRoleId
            }
        );

        var seedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        // Предзаполнение районов Алматы
        builder.Entity<District>().HasData(
            new District { Id = 1, Title = "Алмалы", DateCreated = seedDate },
            new District { Id = 2, Title = "Әуезов", DateCreated = seedDate },
            new District { Id = 3, Title = "Бостандық", DateCreated = seedDate },
            new District { Id = 4, Title = "Жетісу", DateCreated = seedDate },
            new District { Id = 5, Title = "Медеу", DateCreated = seedDate },
            new District { Id = 6, Title = "Наурызбай", DateCreated = seedDate },
            new District { Id = 7, Title = "Түрксіб", DateCreated = seedDate },
            new District { Id = 8, Title = "Алатау", DateCreated = seedDate }
        );

        // Предзаполнение категорий
        builder.Entity<Category>().HasData(
            new Category { Id = 1, Title = "Көлік", DateCreated = seedDate },
            new Category { Id = 2, Title = "Экология", DateCreated = seedDate },
            new Category { Id = 3, Title = "Инфрақұрылым", DateCreated = seedDate },
            new Category { Id = 4, Title = "Қауіпсіздік", DateCreated = seedDate },
            new Category { Id = 5, Title = "Білім", DateCreated = seedDate },
            new Category { Id = 6, Title = "Денсаулық сақтау", DateCreated = seedDate },
            new Category { Id = 7, Title = "Мәдениет және спорт", DateCreated = seedDate },
            new Category { Id = 8, Title = "Басқа", DateCreated = seedDate }
        );
    }
}
