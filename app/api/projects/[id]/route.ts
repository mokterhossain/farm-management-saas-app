import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * UPDATE PROJECT
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ params is async in App Router
  const { id } = await context.params;

  const tenantId = (session.user as any).tenantId;
  const body = await req.json();

  const project = await prisma.project.update({
    where: {
      id,
      tenantId, // 🔐 tenant safety
    },
    data: {
      name: body.name,
      location: body.location,
      status: body.status,
    },
  });

  return NextResponse.json(project);
}

/**
 * DELETE PROJECT
 */
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ await params
  const { id } = await context.params;
  const tenantId = (session.user as any).tenantId;

  await prisma.project.delete({
    where: {
      id,
      tenantId, // 🔐 prevents cross-tenant delete
    },
  });

  return NextResponse.json({ success: true });
}
