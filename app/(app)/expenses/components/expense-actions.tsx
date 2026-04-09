"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

type Props = {
  expenseId: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ExpenseActions({
  expenseId,
  onEdit,
  onDelete,
}: Props) {
  const { data: session } = useSession();

  const permissions = (session?.user as any)?.permissions ?? [];

  // 🔐 You can enable real permission later
  const canEdit = true; // permissions.includes("expense:edit");
  const canDelete = true; // permissions.includes("expense:delete");

  if (!canEdit && !canDelete) return null;

  return (
    <div className="flex gap-2">
      {canEdit && (
        <button
          onClick={onEdit}
          className="rounded-lg p-2 hover:bg-white/10"
        >
          <Pencil size={16} />
        </button>
      )}

      {canDelete && (
        <button
          onClick={onDelete}
          className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}