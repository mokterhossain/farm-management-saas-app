import ProjectActions from "./project-actions";

type Props = {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
};

export default function ProjectTable({
  projects,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/60">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} className="border-t border-white/10">
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td className="px-4 py-3 text-white/60">{p.location}</td>
              <td className="px-4 py-3">
                <span className="text-green-400">{p.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <ProjectActions
                  projectId={p.id}
                  onEdit={() => onEdit(p)}
                  onDelete={() => onDelete(p.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
