import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  // 1. Unified Auth: Works for Web (Cookies) and Mobile (Bearer Token)
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use the property names defined in your JWT token/types
  const tenantId = token.tenantId as string;

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  try {
    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where: { tenantId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { startDate: "desc" }, // Project schema uses startDate instead of createdAt
      }),
      prisma.project.count({ where: { tenantId } }),
    ]);

    return NextResponse.json({
      data,
      meta: { 
        page, 
        pageSize, 
        total, 
        totalPages: Math.ceil(total / pageSize) 
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Role-based protection: Only Admins/Managers can create projects
  if (token.role === "WORKER") {
    return NextResponse.json({ error: "Forbidden: Workers cannot create projects" }, { status: 403 });
  }

  const tenantId = token.tenantId as string;
  const body = await req.json();

  try {
    const project = await prisma.project.create({
      data: {
        tenantId,
        name: body.name,
        location: body.location,
        status: body.status,
        // Ensure you match your schema fields
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}