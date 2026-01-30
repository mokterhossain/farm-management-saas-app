"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

type Props = {
  projectId: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProjectActions({
  projectId,
  onEdit,
  onDelete,
}: Props) {
  const { data: session } = useSession();
  const permissions = (session?.user as any)?.permissions ?? [];

  const canEdit = true; // permissions.includes("project:edit");
  const canDelete = true; //  permissions.includes("project:delete");

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
