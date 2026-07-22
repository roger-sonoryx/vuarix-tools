"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import ResultBox from "../shared/ResultBox";
import { ErrorMessage } from "../shared/Messages";

export default function DaysBetweenDatesTool() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const result = useMemo(() => {
    if (!start || !end) return null;
    const d1 = new Date(start + "T00:00:00");
    const d2 = new Date(end + "T00:00:00");
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return { error: "Datas inválidas." } as const;

    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    const businessDays = (() => {
      let count = 0;
      const step = diffDays >= 0 ? 1 : -1;
      const cursor = new Date(d1);
      for (let i = 0; i < Math.abs(diffDays); i++) {
        cursor.setDate(cursor.getDate() + step);
        const day = cursor.getDay();
        if (day !== 0 && day !== 6) count++;
      }
      return count;
    })();

    return { diffDays, businessDays } as const;
  }, [start, end]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="days-start" className="block text-sm font-medium mb-2">
            Data inicial
          </label>
          <input
            id="days-start"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
        <div>
          <label htmlFor="days-end" className="block text-sm font-medium mb-2">
            Data final
          </label>
          <input
            id="days-end"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition"
          />
        </div>
      </div>

      {result && "error" in result && (
        <div className="mt-4">
          <ErrorMessage>{result.error}</ErrorMessage>
        </div>
      )}

      {result && !("error" in result) && (
        <ResultBox
          items={[
            { label: "Dias corridos", value: `${result.diffDays}`, highlight: true },
            { label: "Dias úteis (aprox.)", value: `${result.businessDays}` },
          ]}
        />
      )}
    </ToolPanel>
  );
}
