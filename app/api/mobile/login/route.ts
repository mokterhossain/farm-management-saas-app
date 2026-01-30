import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your generated prisma client
import bcrypt from "bcrypt";
import { encode } from "next-auth/jwt";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email, password, subdomain } = await req.json();

    // 1. Find the Tenant first via subdomain
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain }
    });

    if (!tenant) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // 2. Find User within THAT tenant (using your unique constraint [email, tenantId])
    const user = await prisma.user.findUnique({
      where: {
        email_tenantId: {
          email,
          tenantId: tenant.id
        }
      },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Extract Role (highest level)
    const primaryRole = user.userRoles.sort((a, b) => b.role.level - a.role.level)[0]?.role.name || "Worker";

    // 4. Generate Tokens
    const accessToken = await encode({
      token: { 
        userId: user.id, 
        tenantId: tenant.id, 
        role: primaryRole 
      },
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: 60 * 60, // 1 hour
    });

    const refreshTokenValue = crypto.randomBytes(64).toString('hex');
    await prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days
      }
    });

    return NextResponse.json({
      accessToken,
      refreshToken: refreshTokenValue,
      role: primaryRole,
      tenant: { id: tenant.id, name: tenant.name },
      user: { id: user.id, name: user.name }
    });

  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}