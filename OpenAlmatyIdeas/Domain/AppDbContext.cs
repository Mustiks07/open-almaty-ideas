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

        // Предзаполнение администратора (логин: admin, пароль: admin)
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
        adminUser.PasswordHash = hasher.HashPassword(adminUser, "admin");

        builder.Entity<IdentityUser>().HasData(adminUser);
        builder.Entity<IdentityUserRole<string>>().HasData(
            new IdentityUserRole<string>
            {
                UserId = adminId,
                RoleId = adminRoleId
            }
        );

        // Предзаполнение районов Алматы
        builder.Entity<District>().HasData(
            new District { Id = 1, Title = "Алмалы" },
            new District { Id = 2, Title = "Әуезов" },
            new District { Id = 3, Title = "Бостандық" },
            new District { Id = 4, Title = "Жетісу" },
            new District { Id = 5, Title = "Медеу" },
            new District { Id = 6, Title = "Наурызбай" },
            new District { Id = 7, Title = "Түрксіб" },
            new District { Id = 8, Title = "Алатау" }
        );

        // Предзаполнение категорий
        builder.Entity<Category>().HasData(
            new Category { Id = 1, Title = "Көлік" },
            new Category { Id = 2, Title = "Экология" },
            new Category { Id = 3, Title = "Инфрақұрылым" },
            new Category { Id = 4, Title = "Қауіпсіздік" },
            new Category { Id = 5, Title = "Білім" },
            new Category { Id = 6, Title = "Денсаулық сақтау" },
            new Category { Id = 7, Title = "Мәдениет және спорт" },
            new Category { Id = 8, Title = "Басқа" }
        );
    }
}
