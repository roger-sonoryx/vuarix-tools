"use client";

export default function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  step = "any",
  min,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  step?: string;
  min?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition"
        />
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-light dark:text-muted-dark">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
