import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Limpa o banco de dados
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Cria usuários fake
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: await bcrypt.hash("password123", 10),
        role: i === 0 ? "admin" : "user",
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  console.log(`Created ${users.length} users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
