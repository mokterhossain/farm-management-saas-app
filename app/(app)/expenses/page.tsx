"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useSession } from "next-auth/react";
import ExpenseCards from "./components/expense-cards";
import ExpenseTable from "./components/expense-table";
import ExpenseSkeletonGrid from "./components/expense-skeleton";
import ExpenseModal from "./components/expense-modal";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";

type Expense = {
  id: string;
  amount: number;
  description?: string;
  expenseDate: string;
  category?: { name: string };
  project?: { name: string };
};

type ExpenseInput = {
  id?: string;
  amount: number;
  description?: string;
  categoryId: string;
  projectId: string;
  expenseDate: string;
};

export default function ExpensesPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const { status } = useSession();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    loadExpenses();
  }, [status, page]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/expenses?page=${page}&pageSize=9`);
      const json = await res.json();
      setExpenses(json.data);
      setTotalPages(json.meta.totalPages);
    } finally {
      setLoading(false);
    }
  };

  const saveExpense = async (data: ExpenseInput) => {
    try {
      const method = editing?.id ? "PUT" : "POST";
      const url = editing?.id
        ? `/api/expenses/${editing.id}`
        : "/api/expenses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save expense");

      toast.success(
        `Expense ${editing ? "updated" : "created"} successfully!`
      );

      setModalOpen(false);
      setEditing(null);
      loadExpenses();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditing(expense);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setConfirmOpen(false);

    try {
      setExpenses((prev) => prev.filter((e) => e.id !== deleteId));

      const res = await fetch(`/api/expenses/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete expense");

      toast.success("Expense deleted successfully!");
      loadExpenses();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      loadExpenses();
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <Breadcrumb items={["Dashboard", "Expenses"]} />

      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-semibold">Expenses</h1>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`rounded-lg p-2 ${
              view === "grid"
                ? "bg-green-500/20 text-green-400"
                : "text-white/50"
            }`}
          >
            <LayoutGrid size={18} />
          </button>

          <button
            onClick={() => setView("table")}
            className={`rounded-lg p-2 ${
              view === "table"
                ? "bg-green-500/20 text-green-400"
                : "text-white/50"
            }`}
          >
            <List size={18} />
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="ml-auto sm:ml-4 flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-black hover:bg-green-400 transition"
          >
            <Plus size={16} /> New Expense
          </button>
        </div>
      </header>

      {/* Content */}
      {loading ? (
        <ExpenseSkeletonGrid />
      ) : view === "grid" ? (
        <ExpenseCards
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      ) : (
        <ExpenseTable
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Pagination */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-white/60">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="hover:text-white disabled:opacity-40"
        >
          ← Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="hover:text-white disabled:opacity-40"
        >
          Next →
        </button>
      </div>

      {/* Modals */}
      {modalOpen && (
        <ExpenseModal
          open={modalOpen}
          expense={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={saveExpense}
        />
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}