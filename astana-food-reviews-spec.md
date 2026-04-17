# Astana Food Reviews — Техническое задание

## Общее описание

Платформа отзывов о ресторанах и кафе Астана. Жители города оставляют отзывы о заведениях, оценивают еду, сервис и цену, голосуют за полезность отзывов. Владельцы заведений могут отвечать на отзывы через администратора.

**Стек:** ASP.NET Core 10 MVC, Entity Framework Core 10, SQL Server, ASP.NET Identity, Bootstrap 5.3, тёмная тема (аналогично Open Almaty Ideas).

---

## Архитектура проекта

Структура папок полностью повторяет проект Open Almaty Ideas:

```
AstanaFoodReviews/
├── Controllers/
│   ├── HomeController.cs
│   ├── RestaurantsController.cs
│   ├── ReviewsController.cs
│   ├── TopController.cs
│   ├── MapController.cs
│   ├── ProfileController.cs
│   ├── AccountController.cs
│   └── Admin/
│       ├── Core.cs          [Route("admin")]
│       ├── Restaurants.cs   [Route("admin/restaurants")]
│       ├── Reviews.cs       [Route("admin/reviews")]
│       ├── Cuisines.cs      [Route("admin/cuisines")]
│       └── Districts.cs     [Route("admin/districts")]
├── Domain/
│   ├── Entities/
│   │   ├── EntityBase.cs
│   │   ├── Restaurant.cs
│   │   ├── Review.cs
│   │   ├── ReviewVote.cs
│   │   ├── District.cs
│   │   ├── Cuisine.cs
│   │   └── OwnerResponse.cs
│   ├── Enums/
│   │   ├── PriceRangeEnum.cs
│   │   └── ReviewVoteTypeEnum.cs
│   ├── Repositories/
│   │   ├── Abstract/
│   │   │   ├── IRestaurantsRepository.cs
│   │   │   ├── IReviewsRepository.cs
│   │   │   ├── IDistrictsRepository.cs
│   │   │   ├── ICuisinesRepository.cs
│   │   │   └── IOwnerResponsesRepository.cs
│   │   └── EntityFramework/
│   │       ├── EFRestaurantsRepository.cs
│   │       ├── EFReviewsRepository.cs
│   │       ├── EFDistrictsRepository.cs
│   │       ├── EFCuisinesRepository.cs
│   │       └── EFOwnerResponsesRepository.cs
│   ├── AppDbContext.cs
│   └── DataManager.cs
├── Infrastructure/
│   ├── HelperDTO.cs
│   └── AppConfig.cs
├── Models/
│   ├── RestaurantDTO.cs
│   ├── ReviewDTO.cs
│   ├── OwnerResponseDTO.cs
│   ├── LoginViewModel.cs
│   ├── RegisterViewModel.cs
│   ├── CreateReviewViewModel.cs
│   └── CreateRestaurantViewModel.cs
├── Views/
│   ├── Shared/
│   │   ├── _Layout.cshtml
│   │   ├── _AdminLayout.cshtml
│   │   ├── _NavMenu.cshtml
│   │   └── _ValidationScriptsPartial.cshtml
│   ├── Home/
│   │   ├── Index.cshtml
│   │   ├── About.cshtml
│   │   └── Error.cshtml
│   ├── Restaurants/
│   │   ├── Index.cshtml
│   │   ├── Show.cshtml
│   │   ├── New.cshtml
│   │   └── Edit.cshtml
│   ├── Reviews/
│   │   └── New.cshtml
│   ├── Top/
│   │   └── Index.cshtml
│   ├── Map/
│   │   └── Index.cshtml
│   ├── Profile/
│   │   └── Index.cshtml
│   ├── Account/
│   │   ├── Login.cshtml
│   │   └── Register.cshtml
│   └── Admin/
│       ├── Core/
│       │   ├── Index.cshtml
│       │   └── AccessDenied.cshtml
│       ├── Restaurants/
│       │   ├── Index.cshtml
│       │   └── Edit.cshtml
│       ├── Reviews/
│       │   └── Index.cshtml
│       ├── Cuisines/
│       │   ├── Index.cshtml
│       │   └── Edit.cshtml
│       └── Districts/
│           ├── Index.cshtml
│           └── Edit.cshtml
└── wwwroot/
    └── css/
        └── site.css
```

---

## Сущности (Domain/Entities)

### EntityBase.cs
```csharp
public abstract class EntityBase
{
    public int Id { get; set; }
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
}
```

### District.cs
```csharp
public class District : EntityBase
{
    public ICollection<Restaurant> Restaurants { get; set; } = [];
}
```
Сид-данные (8 районов Астана): Алматы, Байқоңыр, Есіл, Нұра, Сарыарқа, Жетісу, Алатау, Байтерек.

### Cuisine.cs
```csharp
public class Cuisine : EntityBase
{
    public ICollection<Restaurant> Restaurants { get; set; } = [];
}
```
Сид-данные: Казахская, Европейская, Итальянская, Японская, Китайская, Кавказская, Фастфуд, Кофейня.

### Restaurant.cs
```csharp
public class Restaurant : EntityBase
{
    // Title — название заведения (из EntityBase)
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string? ImageUrl { get; set; }
    public PriceRangeEnum PriceRange { get; set; } = PriceRangeEnum.Medium;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public bool IsVerified { get; set; } = false;

    public int DistrictId { get; set; }
    public District? District { get; set; }

    public int CuisineId { get; set; }
    public Cuisine? Cuisine { get; set; }

    public string? OwnerId { get; set; }  // IdentityUser FK (опционально)
    public IdentityUser? Owner { get; set; }

    public ICollection<Review> Reviews { get; set; } = [];

    // Вычисляемые (не хранятся в БД)
    [NotMapped]
    public double AverageRating => Reviews.Any() ? Reviews.Average(r => r.Rating) : 0;
    [NotMapped]
    public int ReviewCount => Reviews.Count;
}
```

### Review.cs
```csharp
public class Review : EntityBase
{
    // Title — заголовок отзыва (из EntityBase)
    public string? Text { get; set; }        // Подробный текст
    public int Rating { get; set; }          // 1–5 звёзд
    public int FoodRating { get; set; }      // 1–5 (еда)
    public int ServiceRating { get; set; }   // 1–5 (сервис)
    public int PriceRating { get; set; }     // 1–5 (цена/качество)

    public int RestaurantId { get; set; }
    public Restaurant? Restaurant { get; set; }

    public string? AuthorId { get; set; }
    public IdentityUser? Author { get; set; }

    public int UsefulCount { get; set; } = 0;    // Полезных голосов
    public int NotUsefulCount { get; set; } = 0; // Бесполезных голосов

    public ICollection<ReviewVote> Votes { get; set; } = [];
    public ICollection<OwnerResponse> OwnerResponses { get; set; } = [];
}
```

### ReviewVote.cs
```csharp
public class ReviewVote
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public IdentityUser? User { get; set; }
    public int ReviewId { get; set; }
    public Review? Review { get; set; }
    public ReviewVoteTypeEnum VoteType { get; set; }
    // Уникальный индекс: (UserId, ReviewId)
}
```

### OwnerResponse.cs
```csharp
public class OwnerResponse
{
    public int Id { get; set; }
    public int ReviewId { get; set; }
    public Review? Review { get; set; }
    public string? AdminId { get; set; }
    public IdentityUser? Admin { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
}
```

---

## Перечисления (Domain/Enums)

### PriceRangeEnum.cs
```csharp
public enum PriceRangeEnum
{
    Budget,   // До 2000 тг
    Medium,   // 2000–5000 тг
    Premium,  // 5000–15000 тг
    Luxury    // Выше 15000 тг
}
```

### ReviewVoteTypeEnum.cs
```csharp
public enum ReviewVoteTypeEnum
{
    Useful,
    NotUseful
}
```

---

## DTO-модели (Models/)

### RestaurantDTO.cs
```csharp
public class RestaurantDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string? ImageUrl { get; set; }
    public string PriceRangeLabel { get; set; } = string.Empty;
    public PriceRangeEnum PriceRange { get; set; }
    public string DistrictName { get; set; } = string.Empty;
    public int DistrictId { get; set; }
    public string CuisineName { get; set; } = string.Empty;
    public int CuisineId { get; set; }
    public bool IsVerified { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public DateTime DateCreated { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}
```

### ReviewDTO.cs
```csharp
public class ReviewDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Text { get; set; }
    public int Rating { get; set; }
    public int FoodRating { get; set; }
    public int ServiceRating { get; set; }
    public int PriceRating { get; set; }
    public int RestaurantId { get; set; }
    public string RestaurantName { get; set; } = string.Empty;
    public string? AuthorId { get; set; }
    public string? AuthorName { get; set; }
    public int UsefulCount { get; set; }
    public int NotUsefulCount { get; set; }
    public DateTime DateCreated { get; set; }
    public List<OwnerResponseDTO> OwnerResponses { get; set; } = [];
}
```

### OwnerResponseDTO.cs
```csharp
public class OwnerResponseDTO
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string? AdminName { get; set; }
    public DateTime DateCreated { get; set; }
}
```

### CreateReviewViewModel.cs
```csharp
public class CreateReviewViewModel
{
    public int RestaurantId { get; set; }
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;  // Заголовок отзыва
    public string? Text { get; set; }
    [Range(1, 5)]
    public int Rating { get; set; } = 5;        // Общая оценка
    [Range(1, 5)]
    public int FoodRating { get; set; } = 5;
    [Range(1, 5)]
    public int ServiceRating { get; set; } = 5;
    [Range(1, 5)]
    public int PriceRating { get; set; } = 5;
}
```

### CreateRestaurantViewModel.cs
```csharp
public class CreateRestaurantViewModel
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    [Required]
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string? ImageUrl { get; set; }
    [Required]
    public int DistrictId { get; set; }
    [Required]
    public int CuisineId { get; set; }
    public PriceRangeEnum PriceRange { get; set; } = PriceRangeEnum.Medium;
    public IEnumerable<District> Districts { get; set; } = [];
    public IEnumerable<Cuisine> Cuisines { get; set; } = [];
}
```

---

## Репозитории (Domain/Repositories)

### IRestaurantsRepository.cs
```csharp
public interface IRestaurantsRepository
{
    Task<IEnumerable<Restaurant>> GetRestaurantsAsync(
        int? districtId = null,
        int? cuisineId = null,
        string? search = null,
        string? sort = null,   // "rating" | "reviews" | "new"
        PriceRangeEnum? priceRange = null);
    Task<IEnumerable<Restaurant>> GetTopRestaurantsAsync(int count = 10);
    Task<Restaurant?> GetRestaurantByIdAsync(int id);
    Task SaveRestaurantAsync(Restaurant entity);
    Task DeleteRestaurantAsync(int id);
}
```

### IReviewsRepository.cs
```csharp
public interface IReviewsRepository
{
    Task<IEnumerable<Review>> GetReviewsByRestaurantAsync(int restaurantId);
    Task<IEnumerable<Review>> GetReviewsByAuthorAsync(string authorId);
    Task<Review?> GetReviewByIdAsync(int id);
    Task<ReviewVote?> GetVoteAsync(string userId, int reviewId);
    Task SaveReviewAsync(Review entity);
    Task DeleteReviewAsync(int id);
    Task SaveVoteAsync(ReviewVote vote);
    Task DeleteVoteAsync(ReviewVote vote);
}
```

### EFRestaurantsRepository.cs — логика
- `GetRestaurantsAsync`: Include District, Cuisine, Reviews. Фильтр по districtId/cuisineId/search (Contains на Title, Description, Address). Сортировка: "rating" → OrderByDescending(AverageRating через Reviews.Average), "reviews" → OrderByDescending(Reviews.Count), иначе DateCreated desc. Take(100).
- `GetTopRestaurantsAsync`: OrderByDescending по среднему рейтингу, Take(count).
- `GetRestaurantByIdAsync`: Include District, Cuisine, Reviews (с Author), OwnerResponses (с Admin).

### EFReviewsRepository.cs — логика
- `GetReviewsByRestaurantAsync`: Include Author, Votes, OwnerResponses. OrderByDescending DateCreated.
- Логика голосования как в Open Almaty Ideas (toggle: повторный клик удаляет голос).

---

## AppDbContext.cs

```csharp
public class AppDbContext : IdentityDbContext
{
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<ReviewVote> ReviewVotes { get; set; }
    public DbSet<District> Districts { get; set; }
    public DbSet<Cuisine> Cuisines { get; set; }
    public DbSet<OwnerResponse> OwnerResponses { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Уникальный индекс голоса
        builder.Entity<ReviewVote>()
            .HasIndex(v => new { v.UserId, v.ReviewId })
            .IsUnique();

        // Сид: роли Admin + User
        // Сид: пользователь admin/admin с ролью Admin
        // Сид: 8 районов Астана
        // Сид: 8 кухонь
        // Все сид-даты: new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
    }
}
```

---

## DataManager.cs

```csharp
public class DataManager
{
    public IRestaurantsRepository Restaurants { get; }
    public IReviewsRepository Reviews { get; }
    public IDistrictsRepository Districts { get; }
    public ICuisinesRepository Cuisines { get; }
    public IOwnerResponsesRepository OwnerResponses { get; }

    public DataManager(
        IRestaurantsRepository restaurants,
        IReviewsRepository reviews,
        IDistrictsRepository districts,
        ICuisinesRepository cuisines,
        IOwnerResponsesRepository ownerResponses)
    { ... }
}
```

---

## HelperDTO.cs

```csharp
public static class HelperDTO
{
    public static RestaurantDTO Transform(Restaurant r) => new()
    {
        Id = r.Id,
        Title = r.Title,
        Description = r.Description,
        Address = r.Address,
        Phone = r.Phone,
        Website = r.Website,
        ImageUrl = r.ImageUrl,
        PriceRange = r.PriceRange,
        PriceRangeLabel = r.PriceRange switch
        {
            PriceRangeEnum.Budget  => "до 2000 ₸",
            PriceRangeEnum.Medium  => "2000–5000 ₸",
            PriceRangeEnum.Premium => "5000–15000 ₸",
            PriceRangeEnum.Luxury  => "от 15000 ₸",
            _ => ""
        },
        DistrictName = r.District?.Title ?? "",
        DistrictId = r.DistrictId,
        CuisineName = r.Cuisine?.Title ?? "",
        CuisineId = r.CuisineId,
        IsVerified = r.IsVerified,
        AverageRating = r.Reviews.Any() ? Math.Round(r.Reviews.Average(x => x.Rating), 1) : 0,
        ReviewCount = r.Reviews.Count,
        DateCreated = r.DateCreated,
        Latitude = r.Latitude,
        Longitude = r.Longitude,
    };

    public static IEnumerable<RestaurantDTO> TransformRestaurants(IEnumerable<Restaurant> list)
        => list.Select(Transform);

    public static ReviewDTO TransformReview(Review r) => new()
    {
        Id = r.Id,
        Title = r.Title,
        Text = r.Text,
        Rating = r.Rating,
        FoodRating = r.FoodRating,
        ServiceRating = r.ServiceRating,
        PriceRating = r.PriceRating,
        RestaurantId = r.RestaurantId,
        RestaurantName = r.Restaurant?.Title ?? "",
        AuthorId = r.AuthorId,
        AuthorName = r.Author?.UserName,
        UsefulCount = r.UsefulCount,
        NotUsefulCount = r.NotUsefulCount,
        DateCreated = r.DateCreated,
        OwnerResponses = r.OwnerResponses?.Select(o => new OwnerResponseDTO
        {
            Id = o.Id,
            Text = o.Text,
            AdminName = o.Admin?.UserName,
            DateCreated = o.DateCreated
        }).ToList() ?? []
    };
}
```

---

## Controllers

### RestaurantsController.cs

```
GET  /restaurants              → Index(search, districtId, cuisineId, sort, priceRange)
GET  /restaurants/{id}         → Show(id)   — показывает ресторан + все отзывы
GET  /restaurants/new          → New()      [Authorize]
POST /restaurants/new          → New(vm)    [Authorize]
GET  /restaurants/edit/{id}    → Edit(id)   [Authorize] — только автор или Admin
POST /restaurants/edit/{id}    → Edit(id, vm) [Authorize]
POST /restaurants/delete/{id}  → Delete(id)  [Authorize]
```

**Show**: передаёт в ViewBag: текущий пользователь, его голоса за каждый отзыв (Dictionary<int, ReviewVoteTypeEnum?>), isAdmin.

### ReviewsController.cs

```
GET  /reviews/new/{restaurantId}  → New(restaurantId)  [Authorize]
POST /reviews/new                 → New(vm)             [Authorize]
POST /reviews/delete/{id}         → Delete(id)          [Authorize]
POST /reviews/vote                → Vote(reviewId, voteType) [Authorize]
```

**Vote**: toggle-логика как в Open Almaty Ideas. При повторном голосе того же типа — удаляет голос. При другом типе — меняет. Обновляет `UsefulCount`/`NotUsefulCount` на ресторане через пересчёт.

### TopController.cs
```
GET /top → GetTopRestaurantsAsync(20), сортировка по AverageRating
```

### MapController.cs
```
GET /map → GetDistrictsAsync() с Include(Restaurants)
```
Leaflet-карта с маркерами по районам, попап показывает кол-во ресторанов.

### ProfileController.cs [Authorize]
```
GET /profile → GetReviewsByAuthorAsync(userId) — мои отзывы
```

### Admin/Restaurants.cs [Route("admin/restaurants")]
```
GET  ""           → Index() — все рестораны
GET  "edit/{id}"  → Edit(id) — форма: верификация, изменение данных
POST "edit/{id}"  → Edit(id, isVerified, ...)
POST "delete/{id}" → Delete(id)
```

### Admin/Reviews.cs [Route("admin/reviews")]
```
GET  ""           → Index() — все отзывы
POST "delete/{id}" → Delete(id)
POST "respond/{id}" → Respond(id, text) — ответ владельца заведения
```

---

## Страницы (Views)

### Главная (Home/Index)
- Hero: тёмный градиент, заголовок "Astana Food Reviews", подзаголовок
- Статистика: кол-во заведений, отзывов, средний рейтинг по городу
- Топ-3 ресторана (карточки со звёздами)
- 8 кухонь-кнопок (фильтр)
- CTA для незарегистрированных

### Список ресторанов (Restaurants/Index)
- Фильтры: поиск по названию, район, кухня, ценовой диапазон, сортировка
- Карточки ресторанов: фото (или плейсхолдер), название, адрес, кухня, район, рейтинг звёздами (★★★★☆), кол-во отзывов, ценовой диапазон, бейдж "✓ Верифицировано"

### Страница ресторана (Restaurants/Show)
- Название, адрес, телефон, сайт, кухня, район, ценовой диапазон
- Средний рейтинг крупно + разбивка по трём критериям (еда / сервис / цена)
- Бейдж верификации
- Кнопка "+ Оставить отзыв" [Authorize]
- Список отзывов: заголовок, текст, автор, дата, 3 оценки, кнопки "Полезно / Не полезно", ответы администратора

### Топ (Top/Index)
- Ranked список ресторанов: номер (золото/серебро/бронза), название, кухня, район, рейтинг ★, кол-во отзывов

### Карта (Map/Index)
- Leaflet-карта с маркерами по районам
- Карточки районов с кол-вом ресторанов ниже

### Профиль (Profile/Index) [Authorize]
- Таблица: мои отзывы — ресторан, оценка, дата, действия

### Новый отзыв (Reviews/New)
- Форма: заголовок, текст, 4 оценки (общая + еда + сервис + цена) в виде radio-кнопок 1–5 звёзд

---

## Program.cs — ключевые настройки

```csharp
// Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>();

// Cookie
builder.Services.ConfigureApplicationCookie(options => {
    options.LoginPath = "/account/login";
    options.AccessDeniedPath = "/admin/accessdenied";
});

// DbContext с подавлением PendingModelChangesWarning
builder.Services.AddDbContext<AppDbContext>(options => {
    options.UseSqlServer(connectionString);
    options.ConfigureWarnings(w =>
        w.Ignore(RelationalEventId.PendingModelChangesWarning));
});

// DI репозиториев
builder.Services.AddScoped<IRestaurantsRepository, EFRestaurantsRepository>();
builder.Services.AddScoped<IReviewsRepository, EFReviewsRepository>();
builder.Services.AddScoped<IDistrictsRepository, EFDistrictsRepository>();
builder.Services.AddScoped<ICuisinesRepository, EFCuisinesRepository>();
builder.Services.AddScoped<IOwnerResponsesRepository, EFOwnerResponsesRepository>();
builder.Services.AddScoped<DataManager>();

// Роутинг — только default (admin-контроллеры используют attribute routing)
app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");
```

---

## appsettings.example.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_CONNECTION_STRING"
  },
  "Project": {
    "Site": {
      "Name": "Astana Food Reviews",
      "City": "Астана"
    }
  }
}
```

---

## Дизайн (site.css)

Полностью идентичен Open Almaty Ideas:
- Фон: `#020617` (dark-950)
- Бренд: `#F97316` (оранжевый вместо зелёного — цвет еды)
- Glassmorphism карточки: `rgba(255,255,255,0.04)` + `backdrop-filter: blur(12px)`
- Шрифты: Playfair Display (заголовки) + Inter (текст)
- Фиксированный navbar с blur-backdrop
- Bootstrap 5.3 CDN + custom CSS overrides

**Отличие от Open Almaty Ideas:** бренд-цвет `#F97316` (оранжевый) вместо `#22C55E` (зелёный). Все CSS-переменные `--brand-*` меняются соответственно.

---

## Звёздный рейтинг

Отображение рейтинга через CSS + символы ★/☆:

```csharp
// Helper в HelperDTO или View
public static string StarsHtml(double rating)
{
    var full = (int)Math.Round(rating);
    return string.Concat(
        Enumerable.Range(1, 5).Select(i =>
            $"<span style='color:{(i <= full ? "#F97316" : "rgba(255,255,255,0.15)")}'>★</span>")
    );
}
```

Ввод рейтинга в форме — radio-кнопки с CSS-стилизацией под звёзды (1–5).

---

## Команды запуска

```bash
# Скопировать конфиг
cp appsettings.example.json appsettings.json
# Заполнить строку подключения в appsettings.json

# Миграции
dotnet ef migrations add Initial
dotnet ef database update

# Запуск
dotnet run
```

Логин администратора по умолчанию: `admin` / `admin`
