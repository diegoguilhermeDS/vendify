import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  const clients = [
    { name: "Ana Silva", email: "ana@email.com" },
    { name: "Bruno Costa", email: "bruno@email.com" },
    { name: "Carla Mendes", email: "carla@email.com" },
  ];

  const products = [
    { name: "Notebook", price: 3500 },
    { name: "Mouse", price: 120 },
    { name: "Teclado", price: 250 },
    { name: "Monitor", price: 1800 },
    { name: "Headset", price: 350 },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { email: client.email },
      update: {},
      create: client,
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
