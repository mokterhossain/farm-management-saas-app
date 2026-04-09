import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("🚀 Starting database seeding...");

  // 1. Create Animal Types
  const poultry = await prisma.animalType.upsert({
    where: { id: "poultry-id" },
    update: {},
    create: { id: "poultry-id", name: "Poultry" },
  });

  // 2. Create System Roles (The Fixed Part)
  let adminRole = await prisma.role.findFirst({
    where: { name: "Admin", tenantId: null },
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: "Admin", isSystem: true, level: 100, tenantId: null },
    });
  }

  // 3. Create Demo Tenant
  const hashedPassword = await bcrypt.hash("password123", 10);
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: "demo" },
    update: {},
    create: {
      name: "Demo Farm Corp",
      subdomain: "demo",
      plan: "Premium",
      status: "Active",
      users: {
        create: {
          email: "admin@demo.com",
          password: hashedPassword,
          name: "Admin User",
          userRoles: {
            create: { roleId: adminRole.id }
          }
        }
      }
    },
    include: { users: true }
  });
// 4. Create System Expense Category (The Fixed Part)
  const categories = [
    { name: "Feed / Raw Materials", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Seeds / Plants", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Fertilizers", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Medicine", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Wages / Labor", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Contractor Payments", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Staff Salary", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Fuel", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Transport", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Maintenance", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Utilities", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Equipment Purchase", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Equipment Repair", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Machinery Maintenance", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Electricity Bill", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Internet / Mobile", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Office", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
    { name: "Miscellaneous", tenantId: "20c78c74-5124-4700-a8f4-c123113c236c" },
  ];

await prisma.expenseCategory.createMany({
  data: categories,
  skipDuplicates: true, // avoids duplicate errors
});

console.log("✅ Multiple categories seeded!");
}

main()
  .catch((e) => { console.error("❌ Seed error:", e); process.exit(1); })
  .finally(async () => { process.exit(0); });