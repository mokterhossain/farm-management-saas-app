import { CalendarDays, Wallet } from "lucide-react";
import ExpenseActions from "./expense-actions";
import { Expense } from "@/types/expense";

type Props = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
};

export default function ExpenseCards({ expenses, onEdit, onDelete }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {expenses.map((e) => (
        <div
          key={e.id}
          className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:border-green-400/40 transition"
        >
          {/* Actions */}
          <div className="absolute right-4 top-4">
            <ExpenseActions
              expenseId={e.id!}
              onEdit={() => onEdit(e)}
              onDelete={() => onDelete(e.id!)}
            />
          </div>

          {/* Amount */}
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wallet size={16} />
            ৳ {e.amount.toFixed(2)}
          </h3>

          {/* Category */}
          <p className="mt-1 text-sm text-white/50">
            {e.category?.name || "Uncategorized"}
          </p>

          {/* Project */}
          {e.project?.name && (
            <p className="text-xs text-white/40 mt-1">
              Project: {e.project.name}
            </p>
          )}

          {/* Description */}
          {e.description && (
            <p className="mt-2 text-xs text-white/60 line-clamp-2">
              {e.description}
            </p>
          )}

          {/* Date */}
          <p className="mt-4 flex items-center gap-1 text-xs text-white/40">
            <CalendarDays size={14} />
            {new Date(e.expenseDate).toDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}