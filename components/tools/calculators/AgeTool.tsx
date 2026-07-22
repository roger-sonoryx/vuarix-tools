"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import ResultBox from "../shared/ResultBox";
import { ErrorMessage } from "../shared/Messages";

export default function AgeTool() {
  const [birthDate, setBirthDate] = useState("");

  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate + "T00:00:00");
    const now = new Date();
    if (isNaN(birth.getTime())) return { error: "Data inválida." } as const;
    if (birth > now) return { error: "A data de nascimento não pode ser no futuro." } as const;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays } as const;
  }, [birthDate]);

  return (
    <ToolPanel>
      <label htmlFor="age-birthdate" className="block text-sm font-medium mb-2">
        Data de nascimento
      </label>
      <input
        id="age-birthdate"
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition"
      />

      {result && "error" in result && (
        <div className="mt-4">
          <ErrorMessage>{result.error}</ErrorMessage>
        </div>
      )}

      {result && !("error" in result) && (
        <ResultBox
          items={[
            { label: "Idade", value: `${result.years} anos, ${result.months} meses e ${result.days} dias`, highlight: true },
            { label: "Total de dias vividos", value: `${result.totalDays.toLocaleString("pt-BR")}` },
          ]}
        />
      )}
    </ToolPanel>
  );
}
