# Astana Board — Техническое задание

## 1. Обзор проекта

**Astana Board** — гиперлокальная доска объявлений для жителей Астаны. Соседи публикуют объявления: найдено/потеряно, аренда, продажа вещей, поиск мастеров. Фильтр по категории и району. Голосование за полезность. Модератор удаляет спам.

**Репозиторий**: `AstanaBoard`
**Язык интерфейса**: Русский
**Целевая аудитория**: Жители Астаны

---

## 2. Технический стек

| Компонент | Технология |
|---|---|
| Backend | ASP.NET Core 10 MVC |
| ORM | Entity Framework Core 10 |
| БД | SQL Server (LocalDB для разработки) |
| Аутентификация | ASP.NET Identity + Cookie Auth |
| Frontend | Razor Views + Bootstrap 5.3 (CDN) |
| Иконки | Bootstrap Icons (CDN) |
| Шрифты | Google Fonts: Playfair Display + Inter |
| Логирование | Serilog |
| Карта | Leaflet.js (CDN) |

---

## 3. Архитектура проекта

```
AstanaBoard/
├── AstanaBoard.Domain/
│   ├── Entities/
│   │   ├── Ad.cs
│   │   ├── Category.cs
│   │   ├── District.cs
│   │   ├── AdVote.cs
│   │   ├── Comment.cs
│   │   └── ApplicationUser.cs
│   └── Enums/
│       └── AdStatusEnum.cs
├── AstanaBoard.Infrastructure/
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Repositories/
│   │   ├── Interfaces/
│   │   │   ├── IAdsRepository.cs
│   │   │   ├── ICategoriesRepository.cs
│   │   │   ├── IDistrictsRepository.cs
│   │   │   └── ICommentsRepository.cs
│   │   └── EF/
│   │       ├── AdsRepository.cs
│   │       ├── CategoriesRepository.cs
│   │       ├── DistrictsRepository.cs
│   │       └── CommentsRepository.cs
│   └── DataManager.cs
└── AstanaBoard/
    ├── Controllers/
    │   ├── HomeController.cs
    │   ├── AdsController.cs
    │   ├── AccountController.cs
    │   ├── ProfileController.cs
    │   └── Admin/
    │       ├── Core.cs
    │       ├── AdsAdmin.cs
    │       ├── CategoriesAdmin.cs
    │       └── DistrictsAdmin.cs
    ├── Models/
    │   ├── AdDTO.cs
    │   └── HelperDTO.cs
    ├── Views/
    │   ├── Shared/
    │   │   ├── _Layout.cshtml
    │   │   ├── _NavMenu.cshtml
    │   │   └── _AdminLayout.cshtml
    │   ├── Home/
    │   │   ├── Index.cshtml
    │   │   └── About.cshtml
    │   ├── Ads/
    │   │   ├── Index.cshtml
    │   │   ├── Show.cshtml
    │   │   ├── New.cshtml
    │   │   └── Edit.cshtml
    │   ├── Account/
    │   │   ├── Login.cshtml
    │   │   └── Register.cshtml
    │   ├── Profile/
    │   │   └── Index.cshtml
    │   └── Admin/
    │       ├── Core/
    │       │   └── Index.cshtml
    │       ├── Ads/
    │       │   ├── Index.cshtml
    │       │   └── Edit.cshtml
    │       ├── Categories/
    │       │   ├── Index.cshtml
    │       │   └── Edit.cshtml
    │       └── Districts/
    │           ├── Index.cshtml
    │           └── Edit.cshtml
    ├── wwwroot/
    │   └── css/
    │       └── site.css
    ├── Program.cs
    └── appsettings.example.json
```

---

## 4. База данных

### 4.1 Сущности

#### Ad (Объявление)
```csharp
public class Ad
{
    public int Id { get; set; }
    public string Title { get; set; }           // Заголовок
    public string Description { get; set; }     // Описание
    public string? ContactInfo { get; set; }    // Контакт (телефон/email)
    public decimal? Price { get; set; }         // Цена (null = договорная/бесплатно)
    public bool IsFree { get; set; }            // Отдам даром
    public AdStatusEnum Status { get; set; }    // Статус
    public DateTime DateCreated { get; set; }
    public DateTime DateExpires { get; set; }   // DateCreated + 30 дней
    public bool IsActive { get; set; }          // Активно (не удалено)

    public int CategoryId { get; set; }
    public Category Category { get; set; }

    public int DistrictId { get; set; }
    public District District { get; set; }

    public string AuthorId { get; set; }
    public ApplicationUser Author { get; set; }

    public ICollection<AdVote> Votes { get; set; }
    public ICollection<Comment> Comments { get; set; }
}
```

#### AdStatusEnum
```csharp
public enum AdStatusEnum
{
    Active = 0,      // Активно
    Expired = 1,     // Истёк срок
    Closed = 2,      // Закрыто автором
    Removed = 3      // Удалено модератором
}
```

#### Category (Категория)
```csharp
public class Category
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Icon { get; set; }            // Bootstrap icon name
    public ICollection<Ad> Ads { get; set; }
}
```

Стартовые категории:
- 🔍 Найдено / Потеряно
- 🏠 Аренда недвижимости
- 🛒 Продажа вещей
- 🔧 Услуги / Мастера
- 🎁 Отдам даром
- ❓ Разное

#### District (Район)
```csharp
public class District
{
    public int Id { get; set; }
    public string Title { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public ICollection<Ad> Ads { get; set; }
}
```

Районы Астаны:
- Алматы район
- Байқоңыр район
- Есіл район
- Нұра район
- Сарыарқа район
- Жетісу район
- Алатау район
- Байтерек район

#### AdVote (Голос за объявление)
```csharp
public class AdVote
{
    public int Id { get; set; }
    public int AdId { get; set; }
    public Ad Ad { get; set; }
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }
    public bool IsUseful { get; set; }         // true = полезно, false = спам
    public DateTime DateCreated { get; set; }
}
```

#### Comment (Комментарий)
```csharp
public class Comment
{
    public int Id { get; set; }
    public string Text { get; set; }
    public DateTime DateCreated { get; set; }
    public bool IsModeratorNote { get; set; }   // Пометка модератора

    public int AdId { get; set; }
    public Ad Ad { get; set; }

    public string AuthorId { get; set; }
    public ApplicationUser Author { get; set; }
}
```

#### ApplicationUser
```csharp
public class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; }
    public DateTime DateRegistered { get; set; }
    public ICollection<Ad> Ads { get; set; }
    public ICollection<Comment> Comments { get; set; }
    public ICollection<AdVote> Votes { get; set; }
}
```

---

## 5. DTO

```csharp
public class AdDTO
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string? ContactInfo { get; set; }
    public decimal? Price { get; set; }
    public bool IsFree { get; set; }
    public string PriceLabel { get; set; }      // "5 000 ₸" / "Договорная" / "Бесплатно"
    public AdStatusEnum Status { get; set; }
    public string StatusLabel { get; set; }
    public string CategoryName { get; set; }
    public string CategoryIcon { get; set; }
    public string DistrictName { get; set; }
    public string AuthorName { get; set; }
    public string AuthorId { get; set; }
    public int UsefulCount { get; set; }        // Полезно
    public int SpamCount { get; set; }          // Спам
    public int CommentsCount { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateExpires { get; set; }
    public bool IsExpired { get; set; }
}
```

---

## 6. Репозитории

### IAdsRepository
```csharp
public interface IAdsRepository
{
    IQueryable<Ad> GetAll();
    Ad? GetById(int id);
    Ad? GetByIdWithDetails(int id);     // Include Category, District, Author, Votes, Comments
    void Create(Ad ad);
    void Update(Ad ad);
    void Delete(int id);
    void Save();
}
```

### ICommentsRepository
```csharp
public interface ICommentsRepository
{
    IQueryable<Comment> GetByAdId(int adId);
    void Create(Comment comment);
    void Delete(int id);
    void Save();
}
```

### DataManager
```csharp
public class DataManager
{
    public IAdsRepository Ads { get; }
    public ICategoriesRepository Categories { get; }
    public IDistrictsRepository Districts { get; }
    public ICommentsRepository Comments { get; }
}
```

---

## 7. Контроллеры и маршруты

### HomeController
| Маршрут | Метод | Действие |
|---|---|---|
| `/` | GET | Главная страница |
| `/about` | GET | О проекте |

### AdsController
| Маршрут | Метод | Действие |
|---|---|---|
| `/ads` | GET | Список объявлений |
| `/ads/{id}` | GET | Просмотр объявления |
| `/ads/new` | GET | Форма создания |
| `/ads/new` | POST | Сохранить объявление |
| `/ads/edit/{id}` | GET | Форма редактирования |
| `/ads/edit/{id}` | POST | Обновить объявление |
| `/ads/close/{id}` | POST | Закрыть объявление (автор) |
| `/ads/vote/{id}` | POST | Проголосовать (useful/spam) |
| `/ads/comment/{id}` | POST | Добавить комментарий |

### AccountController
| Маршрут | Метод | Действие |
|---|---|---|
| `/account/login` | GET/POST | Вход |
| `/account/register` | GET/POST | Регистрация |
| `/account/logout` | POST | Выход |

### ProfileController
| Маршрут | Метод | Действие |
|---|---|---|
| `/profile` | GET | Мои объявления |

### Admin — Core (`[Route("admin")]`)
| Маршрут | Метод | Действие |
|---|---|---|
| `/admin` | GET | Дашборд |
| `/admin/accessdenied` | GET | Доступ запрещён |

### Admin — AdsAdmin (`[Route("admin/ads")]`)
| Маршрут | Метод | Действие |
|---|---|---|
| `/admin/ads` | GET | Список всех объявлений |
| `/admin/ads/edit/{id?}` | GET | Форма редактирования |
| `/admin/ads/edit/{id?}` | POST | Сохранить |
| `/admin/ads/delete/{id}` | POST | Удалить |

### Admin — CategoriesAdmin (`[Route("admin/categories")]`)
| Маршрут | Метод | Действие |
|---|---|---|
| `/admin/categories` | GET | Список |
| `/admin/categories/edit/{id?}` | GET/POST | Создать/Редактировать |
| `/admin/categories/delete/{id}` | POST | Удалить |

### Admin — DistrictsAdmin (`[Route("admin/districts")]`)
| Маршрут | Метод | Действие |
|---|---|---|
| `/admin/districts` | GET | Список |
| `/admin/districts/edit/{id?}` | GET/POST | Создать/Редактировать |
| `/admin/districts/delete/{id}` | POST | Удалить |

---

## 8. Страницы и описание UI

### 8.1 Главная страница `/`

**Hero секция:**
- Заголовок: "Доска объявлений Астаны"
- Подзаголовок: "Найдите нужное или опубликуйте объявление для соседей"
- Кнопки: "Подать объявление" (зелёная), "Смотреть объявления" (контурная)
- Фон: тёмный градиент `#020617` с двумя размытыми цветными orb-ами

**Статистика (3 карточки):**
- Всего объявлений
- Активных объявлений
- Районов

**Последние объявления:**
- 6 карточек с заголовком, категорией, районом, ценой, датой
- Кнопка "Смотреть все"

**Категории:**
- Сетка карточек с иконкой и названием каждой категории
- Клик = фильтр на `/ads?category=...`

**Районы:**
- Горизонтальный список кнопок-пилюль
- Клик = фильтр на `/ads?district=...`

---

### 8.2 Список объявлений `/ads`

**Фильтры (форма GET):**
- Поиск по тексту (`q`)
- Выбор категории (`categoryId`)
- Выбор района (`districtId`)
- Статус (`status`): Все / Активные / Истёкшие
- Сортировка (`sort`): Новые / По полезности / По цене ↑ / По цене ↓

**Карточка объявления:**
- Заголовок
- Описание (обрезанное до 120 символов)
- Бейдж категории
- Бейдж района
- Цена (`5 000 ₸` / `Договорная` / `Бесплатно`)
- Счётчик "Полезно 👍"
- Дата публикации
- Кнопка "Подробнее"

---

### 8.3 Детальная страница `/ads/{id}`

**Левая колонка (основной контент):**
- Заголовок
- Статус-бейдж
- Полное описание
- Кнопки голосования: "Полезно 👍 (N)" / "Спам 🚩 (N)"
- Секция комментариев:
  - Список комментариев с аватаром, именем, датой
  - Форма добавления комментария (только для авторизованных)
- Кнопки автора: "Редактировать" / "Закрыть объявление"

**Правая колонка (сайдбар):**
- Контактная информация
- Категория и район
- Дата публикации
- Дата истечения
- Автор

**Заметки модератора:**
- Выделены оранжевой рамкой слева

---

### 8.4 Форма создания `/ads/new`

Поля:
- Заголовок (required, max 150)
- Описание (required, textarea, max 2000)
- Категория (select, required)
- Район (select, required)
- Цена (number, optional) + чекбокс "Договорная" + чекбокс "Отдам даром"
- Контактная информация (телефон/email, optional)

---

### 8.5 Профиль `/profile`

- Таблица объявлений пользователя
- Колонки: Заголовок, Категория, Район, Статус, Дата, Действия
- Действия: Редактировать, Закрыть, Удалить
- Пагинация

---

### 8.6 Карта (опционально) `/map`

- Leaflet.js карта с тёмной темой (CSS filter)
- Маркеры по районам с количеством объявлений
- Клик на маркер = попап с названием района и ссылкой на фильтр

---

### 8.7 Топ объявлений `/top`

- Ранжированный список по количеству голосов "Полезно"
- Места 1-3 с золотым/серебряным/бронзовым фоном
- Место 1: золотой орнамент `🥇`

---

## 9. Аутентификация и роли

**Роли:**
- `Admin` — полный доступ к admin-панели
- `User` — обычный пользователь (по умолчанию при регистрации)

**Правила доступа:**
- Просматривать объявления — все (включая анонимных)
- Создавать объявления — только авторизованные (`[Authorize]`)
- Редактировать/закрывать — только автор объявления
- Голосовать и комментировать — только авторизованные
- Admin-панель — только роль `Admin` (`[Authorize(Roles = "Admin")]`)

**Seeding начальных данных:**
- Пользователь `admin@astanaboard.kz` / `Admin123!` с ролью `Admin`
- 6 категорий
- 8 районов
- 10 тестовых объявлений

---

## 10. Дизайн

**Цветовая схема (тёмная тема):**
```css
--brand-500: #22C55E;     /* Зелёный акцент */
--brand-600: #16A34A;
--dark-950: #020617;      /* Основной фон */
--dark-900: #0F172A;
--dark-800: #1E293B;
--dark-700: #334155;
--text-primary: #F8FAFC;
--text-muted: #94A3B8;
```

**Glassmorphism карточки:**
```css
.glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
}
```

**Шрифты:**
- Заголовки: `Playfair Display` (Google Fonts)
- Текст: `Inter` (Google Fonts)

**Navbar:**
- Фиксированный сверху
- `backdrop-filter: blur(16px)`
- Логотип: зелёный квадрат 40×40px с буквами "AB"
- Выпадающее меню пользователя с аватаром-инициалами

**Admin-панель:**
- Боковое меню (sidebar) на десктопе
- Тёмный фон `#0F172A`
- Красный топбар для Admin-зоны

---

## 11. Логика истечения объявлений

- При создании: `DateExpires = DateCreated.AddDays(30)`
- Фоновая задача или при загрузке списка: помечать объявления как `Expired` если `DateExpires < DateTime.UtcNow`
- Автор может "продлить" объявление (сбросить `DateExpires = DateTime.UtcNow.AddDays(30)`) через кнопку в профиле

---

## 12. Admin-панель

### Дашборд `/admin`
Статистика в карточках:
- Всего объявлений
- Активных
- Пользователей
- Комментариев

### Объявления `/admin/ads`
- Таблица всех объявлений
- Колонки: #, Заголовок, Категория, Район, Автор, Статус, Полезно, Дата, Действия
- Действия: Изменить, Удалить
- Статус-бейджи: зелёный (Активно), жёлтый (Истёк), серый (Закрыто), красный (Удалено)

### Категории `/admin/categories`
- Таблица с колонками: #, Название, Иконка, Кол-во объявлений, Действия

### Районы `/admin/districts`
- Таблица с колонками: #, Название, Кол-во объявлений, Действия

---

## 13. Program.cs — конфигурация

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options => {
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options => {
    options.LoginPath = "/account/login";
    options.AccessDeniedPath = "/admin/accessdenied";
});

builder.Services.AddScoped<IAdsRepository, AdsRepository>();
builder.Services.AddScoped<ICategoriesRepository, CategoriesRepository>();
builder.Services.AddScoped<IDistrictsRepository, DistrictsRepository>();
builder.Services.AddScoped<ICommentsRepository, CommentsRepository>();
builder.Services.AddScoped<DataManager>();

// Маршрут по умолчанию
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
```

---

## 14. AppDbContext

```csharp
public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<Ad> Ads { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<District> Districts { get; set; }
    public DbSet<AdVote> AdVotes { get; set; }
    public DbSet<Comment> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Уникальный голос: один пользователь — один голос за объявление
        builder.Entity<AdVote>()
            .HasIndex(v => new { v.AdId, v.UserId })
            .IsUnique();

        // Seeding категорий, районов, admin-пользователя
    }
}
```

---

## 15. appsettings.example.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=AstanaBoardDb;Trusted_Connection=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

---

## 16. Отличия от open-almaty-ideas

| Параметр | open-almaty-ideas | astana-board |
|---|---|---|
| Сущность | Предложение (Proposal) | Объявление (Ad) |
| Голосование | Лайк (одно действие) | Полезно / Спам (два действия) |
| Комментарии | Только ответ администратора | Комментарии пользователей |
| Цена | Нет | Есть (опционально) |
| Истечение | Нет | 30 дней |
| Статусы | На рассмотрении / Принято / Реализовано / Отклонено | Активно / Истёк / Закрыто / Удалено |
| Контакт | Нет | Есть (телефон/email) |

---

## 17. Порядок реализации

1. Создать solution с тремя проектами (Domain, Infrastructure, Web)
2. Настроить EF Core, AppDbContext, миграции
3. Создать сущности и репозитории
4. Настроить Identity и роли
5. Реализовать HomeController (Index, About)
6. Реализовать AdsController (CRUD, голосование, комментарии)
7. Реализовать AccountController (Login, Register, Logout)
8. Реализовать ProfileController
9. Реализовать Admin-контроллеры с атрибутными маршрутами `[Route("admin/...")]`
10. Создать все Views с тёмной темой Bootstrap 5
11. Написать site.css с glassmorphism дизайном
12. Добавить Leaflet карту (опционально)
13. Протестировать все роли и маршруты
