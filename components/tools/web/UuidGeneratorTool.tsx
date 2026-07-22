"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>(() => [crypto.randomUUID()]);

  const generate = (n = count) => {
    setUuids(Array.from({ length: n }, () => crypto.randomUUID()));
  };

  const allText = uuids.join("\n");

  return (
    <ToolPanel>
      <label htmlFor="uuid-count" className="flex items-center justify-between text-sm font-medium mb-2">
        <span>Quantidade</span>
        <span className="font-mono">{count}</span>
      </label>
      <input
        id="uuid-count"
        type="range"
        min={1}
        max={50}
        value={count}
        onChange={(e) => {
          const v = Number(e.target.value);
          setCount(v);
          generate(v);
        }}
        className="w-full accent-action"
      />

      <div className="mt-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 max-h-64 overflow-y-auto">
        {uuids.map((id) => (
          <div key={id} className="font-mono text-sm py-1 select-all">
            {id}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-5">
        <button type="button"
          onClick={() => generate()}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition"
        >
          Gerar {count > 1 ? "novos" : "novo"} UUID{count > 1 ? "s" : ""}
        </button>
        <CopyButton value={allText} label={count > 1 ? "Copiar todos" : "Copiar"} />
      </div>
    </ToolPanel>
  );
}
