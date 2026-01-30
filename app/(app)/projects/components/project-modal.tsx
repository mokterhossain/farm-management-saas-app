"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Project = {
  id?: string;
  name: string;
  location: string;
  status: string;
};

type Props = {
  open: boolean;
  project?: Project | null;
  onClose: () => void;
  onSave: (data: Project) => Promise<void>;
};

export default function ProjectModal({
  open,
  project,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Project>({
    name: "",
    location: "",
    status: "Active",
  });

  const [saving, setSaving] = useState(false);

  /* Sync form when modal opens */
  useEffect(() => {
    if (!open) return;
    setForm(
      project ?? { name: "", location: "", status: "Active" }
    );
  }, [project, open]);

  /* ESC to close */
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
    if (!form.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setSaving(true);
      await onSave(form);

      toast.success(
        project ? "Project updated" : "Project created",
        {
          description: form.name,
          duration: 2500,
        }
      );

      onClose();
    } catch (err) {
      toast.error("Failed to save project");
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
              {project ? "Edit Project" : "New Project"}
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
            <Input
              label="Project Name"
              placeholder="e.g. Organic Farm Expansion"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />

            <Input
              label="Location"
              placeholder="e.g. Field A"
              value={form.location}
              onChange={(v) => setForm({ ...form, location: v })}
            />

            <div>
              <label className="mb-1 block text-xs text-white/50">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
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
              {project ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Input ---------- */

function Input({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-white/50">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/40"
      />
    </div>
  );
}
