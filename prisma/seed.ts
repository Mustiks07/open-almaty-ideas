import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Алматының 8 ауданы
  const districts = [
    "Алмалы ауданы",
    "Әуезов ауданы",
    "Бостандық ауданы",
    "Жетісу ауданы",
    "Медеу ауданы",
    "Наурызбай ауданы",
    "Түрксіб ауданы",
    "Алатау ауданы",
  ];

  for (const name of districts) {
    await prisma.district.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Санаттар
  const categories = [
    "Көлік",
    "Экология",
    "Инфрақұрылым",
    "Қауіпсіздік",
    "Білім",
    "Денсаулық сақтау",
    "Мәдениет және спорт",
    "Басқа",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Админ аккаунт
  const adminPassword = await hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@openalmaty.kz" },
    update: {},
    create: {
      name: "Админ",
      email: "admin@openalmaty.kz",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Seed completed: 8 districts, 8 categories, 1 admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
