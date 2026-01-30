import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encode } from "next-auth/jwt";

export async function POST(req: Request) {
  const { refreshToken } = await req.json();

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { 
      user: { 
        include: { userRoles: { include: { role: true } } } 
      } 
    }
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "Session expired" }, { status: 403 });
  }

  const role = storedToken.user.userRoles[0]?.role.name || "Worker";

  const newAccessToken = await encode({
    token: { 
      userId: storedToken.user.id, 
      tenantId: storedToken.user.tenantId, 
      role 
    },
    secret: process.env.NEXTAUTH_SECRET!,
    maxAge: 60 * 60,
  });

  return NextResponse.json({ accessToken: newAccessToken });
}