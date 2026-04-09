"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Expense = {
  id?: string;
  amount: number;
  description?: string;
  categoryId: string;
  projectId: string;
  expenseDate: string;
};

type Option = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  expense?: Expense | null;
  onClose: () => void;
  onSave: (data: Expense) => Promise<void>;
};

export default function ExpenseModal({
  open,
  expense,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Expense>({
    amount: 0,
    description: "",
    categoryId: "",
    projectId: "",
    expenseDate: new Date().toISOString().substring(0, 10),
  });

  const [projects, setProjects] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [saving, setSaving] = useState(false);

  /* Load dropdown data */
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/expense-categories"),
        ]);

        const pJson = await pRes.json();
        const cJson = await cRes.json();

        setProjects(pJson.data || []);
        setCategories(cJson.data || []);
      } catch {
        toast.error("Failed to load dropdown data");
      }
    };

    load();
  }, [open]);

  /* Sync form */
  useEffect(() => {
    if (!open) return;

    setForm(
      expense
        ? {
            ...expense,
            expenseDate: expense.expenseDate.substring(0, 10),
          }
        : {
            amount: 0,
            description: "",
            categoryId: "",
            projectId: "",
            expenseDate: new Date().toISOString().substring(0, 10),
          }
    );
  }, [expense, open]);

  /* ESC close */
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, saving, onClose]);

  if (!open) return null;

  const submit = async () => {
    if (!form.amount || form.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (!form.categoryId) {
      toast.error("Category is required");
      return;
    }

    if (!form.projectId) {
      toast.error("Project is required");
      return;
    }

    try {
      setSaving(true);
      await onSave(form);

      toast.success(
        expense ? "Expense updated" : "Expense created",
        {
          description: `৳ ${form.amount}`,
          duration: 2500,
        }
      );

      onClose();
    } catch {
      toast.error("Failed to save expense");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={!saving ? onClose : undefined}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95">
        <div className="rounded-2xl border border-white/10 bg-neutral-900/90 p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {expense ? "Edit Expense" : "New Expense"}
            </h2>

            <button
              disabled={saving}
              onClick={onClose}
              className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Amount */}
            <Input
              label="Amount"
              type="number"
              value={form.amount.toString()}
              onChange={(v) =>
                setForm({ ...form, amount: Number(v) })
              }
            />

            {/* Project */}
            <Select
              label="Project"
              value={form.projectId}
              options={projects}
              onChange={(v) =>
                setForm({ ...form, projectId: v })
              }
            />

            {/* Category */}
            <Select
              label="Category"
              value={form.categoryId}
              options={categories}
              onChange={(v) =>
                setForm({ ...form, categoryId: v })
              }
            />

            {/* Date */}
            <Input
              label="Expense Date"
              type="date"
              value={form.expenseDate}
              onChange={(v) =>
                setForm({ ...form, expenseDate: v })
              }
            />

            {/* Description */}
            <Textarea
              label="Description"
              value={form.description || ""}
              onChange={(v) =>
                setForm({ ...form, description: v })
              }
            />
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              disabled={saving}
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm text-white/60 hover:bg-white/10 disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-black hover:bg-green-400 disabled:opacity-60"
            >
              {saving && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {expense ? "Save Changes" : "Create Expense"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Inputs ---------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-white/50">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/40"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-white/50">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/40"
      >
        <option value="" style={{ color: "black", background: "white" }}>
          Select
        </option>

        {options.map((o) => (
          <option
            key={o.id}
            value={o.id}
            style={{ color: "black", background: "white" }}
          >
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-white/50">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/40"
      />
    </div>
  );
}