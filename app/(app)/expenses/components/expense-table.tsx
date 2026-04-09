import ExpenseActions from "./expense-actions";
import { Expense } from "@/types/expense";

type Props = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
};

export default function ExpenseTable({ expenses, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/60">
          <tr>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Project</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="border-t border-white/10">
              {/* Amount */}
              <td className="px-4 py-3 font-medium">
                ৳ {e.amount.toFixed(2)}
              </td>

              {/* Category */}
              <td className="px-4 py-3 text-white/60">
                {e.category?.name || "—"}
              </td>

              {/* Project */}
              <td className="px-4 py-3 text-white/60">
                {e.project?.name || "—"}
              </td>

              {/* Date */}
              <td className="px-4 py-3 text-white/60">
                {new Date(e.expenseDate).toLocaleDateString()}
              </td>

              {/* Description */}
              <td className="px-4 py-3 text-white/50 max-w-[200px] truncate">
                {e.description || "—"}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <ExpenseActions
                  expenseId={e.id!} // non-null assertion because id is required
                  onEdit={() => onEdit(e)}
                  onDelete={() => onDelete(e.id!)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}