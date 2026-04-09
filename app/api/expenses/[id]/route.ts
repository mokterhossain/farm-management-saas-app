import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// ------------------ DELETE EXPENSE ------------------
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params; // ✅ unwrap the promise
  const tenantId = (session.user as any).tenantId;

  try {
    await prisma.expense.delete({
      where: {
        id, // must have id
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// ------------------ UPDATE EXPENSE ------------------
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params; // ✅ unwrap the promise
  const tenantId = (session.user as any).tenantId;
  const updatedBy = (session.user as any).sub || (session.user as any).id;

  const body = await req.json();

  try {
    const expense = await prisma.expense.update({
      where: {
        id, // must have the ID
      },
      data: {
        tenantId,
        projectId: body.projectId,
        batchId: body.batchId || null,
        categoryId: body.categoryId,
        amount: Number(body.amount),
        quantity: body.quantity ? Number(body.quantity) : null,
        unit: body.unit || null,
        unitPrice: body.unitPrice ? Number(body.unitPrice) : null,
        paymentMethod: body.paymentMethod || null,
        description: body.description || null,
        attachmentUrl: body.attachmentUrl || null,
        isRecurring: body.isRecurring ?? false,
        recurringInterval: body.recurringInterval || null,
        updatedBy,
        expenseDate: body.expenseDate ? new Date(body.expenseDate) : new Date(),
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
}