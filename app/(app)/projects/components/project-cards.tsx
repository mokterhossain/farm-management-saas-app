import { MapPin } from "lucide-react";
import ProjectActions from "./project-actions";

type Props = {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
};
export default function ProjectCards({ projects, onEdit, onDelete }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((p) => (
        <div
          key={p.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:border-green-400/40 transition"
        >
          <div className="absolute right-4 top-4">
            <ProjectActions
              projectId={p.id}
              onEdit={() => onEdit(p)}
              onDelete={() => onDelete(p.id)}
            />
          </div>
          <h3 className="text-lg font-semibold">{p.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/50">
            <MapPin size={14} />
            {p.location}
          </p>

          <span className="mt-4 inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
            {p.status}
          </span>
        </div>
      ))}
    </div>
  );
}
