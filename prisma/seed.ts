import { prisma } from "../src/core/database/prisma";

async function main() {
  console.log("Seeding database...");
  // Add seed data here as features are built
  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
