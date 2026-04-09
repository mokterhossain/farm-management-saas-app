import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  // 🔐 Auth (Web + Mobile)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = token.tenantId as string;

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  const projectId = searchParams.get("projectId"); // optional filter
  const categoryId = searchParams.get("categoryId");

  try {
    const where: any = {
      tenantId,
      ...(projectId && { projectId }),
      ...(categoryId && { categoryId }),
    };

    const [data, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { expenseDate: "desc" },

        // 🔗 Include relations (very useful for UI)
        include: {
          project: true,
          batch: true,
          category: true,
          user: true,
        },
      }),

      prisma.expense.count({ where }),
    ]);

    return NextResponse.json({
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔒 Role protection
  if (token.role === "WORKER") {
    return NextResponse.json(
      { error: "Forbidden: Workers cannot create expenses" },
      { status: 403 }
    );
  }

  const tenantId = token.tenantId as string;
  const userId = token.sub as string;

  const body = await req.json();

  try {
    const expense = await prisma.expense.create({
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

        createdBy: userId,

        expenseDate: body.expenseDate
          ? new Date(body.expenseDate)
          : new Date(),
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}

