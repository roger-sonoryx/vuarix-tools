export default function ResultBox({
  items,
}: {
  items: { label: string; value: string; highlight?: boolean }[];
}) {
  return (
    <div className="mt-5 rounded-xl border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex items-center justify-between px-4 py-3 ${
            item.highlight ? "bg-action-soft" : ""
          }`}
        >
          <span className="text-sm text-muted-light dark:text-muted-dark">{item.label}</span>
          <span className={`font-mono text-sm ${item.highlight ? "font-semibold text-action" : ""}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
