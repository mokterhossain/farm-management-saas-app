export default  function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav className="mb-4 text-sm text-white/50">
      {items.map((item, i) => (
        <span key={i}>
          {item}
          {i < items.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
}
