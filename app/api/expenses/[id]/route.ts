import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

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

  await prisma.expense.delete({
    where: {
      id,
      tenantId, // 🔐 prevents cross-tenant delete
    },
  });

  return NextResponse.json({ success: true });
}