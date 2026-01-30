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

  console.log("✅ Seed finished!");
}

main()
  .catch((e) => { console.error("❌ Seed error:", e); process.exit(1); })
  .finally(async () => { process.exit(0); });