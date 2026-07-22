"use client";

import { useMemo, useState } from "react";

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function SimpleToolInterface({ slug }: { slug: string }) {
  const [text, setText] = useState("");
  const [value, setValue] = useState(100);
  const [percent, setPercent] = useState(10);

  const textResult = useMemo(() => {
    if (slug === "contador-caracteres") return `${text.length} caracteres`;
    if (slug === "contador-palavras") return `${text.trim() ? text.trim().split(/\s+/).length : 0} palavras`;
    if (slug === "maiusculas-minusculas") return text.toUpperCase();
    if (slug === "tempo-leitura") {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      return `${Math.max(1, Math.ceil(words / 200))} min de leitura`;
    }
    if (slug === "remover-duplicados") return [...new Set(text.split(/\r?\n/))].filter(Boolean).join("\n");
    if (slug === "ordenar-linhas") return text.split(/\r?\n/).filter(Boolean).sort((a, b) => a.localeCompare(b, "pt-BR")).join("\n");
    if (slug === "slug-seo") return slugify(text);
    if (slug === "json-formatter") {
      try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text ? "JSON inválido" : ""; }
    }
    if (slug === "json-validator") {
      try { JSON.parse(text); return text ? "JSON válido" : ""; } catch { return "JSON inválido"; }
    }
    if (slug === "base64") {
      try { return typeof window !== "undefined" ? window.btoa(unescape(encodeURIComponent(text))) : ""; } catch { return "Não foi possível codificar"; }
    }
    if (slug === "url-encode-decode") return encodeURIComponent(text);
    return "";
  }, [slug, text]);

  const textTools = ["contador-caracteres", "contador-palavras", "maiusculas-minusculas", "tempo-leitura", "remover-duplicados", "ordenar-linhas", "slug-seo", "json-formatter", "json-validator", "base64", "url-encode-decode"];

  if (textTools.includes(slug)) {
    return (
      <div className="tool-panel">
        <label className="tool-label" htmlFor="tool-input">Digite ou cole o conteúdo</label>
        <textarea id="tool-input" value={text} onChange={(event) => setText(event.target.value)} className="tool-textarea" placeholder="Comece a digitar aqui..." />
        <div className="tool-result" aria-live="polite">
          <span className="tool-label">Resultado</span>
          <pre className="whitespace-pre-wrap break-words font-sans mt-2">{textResult || "O resultado aparecerá aqui."}</pre>
        </div>
      </div>
    );
  }

  if (["porcentagem", "descontos", "juros"].includes(slug)) {
    const result = slug === "descontos" ? value - value * percent / 100 : value * percent / 100;
    return (
      <div className="tool-panel">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="tool-label">Valor<input className="tool-input" type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>
          <label className="tool-label">Porcentagem<input className="tool-input" type="number" value={percent} onChange={(e) => setPercent(Number(e.target.value))} /></label>
        </div>
        <div className="tool-result"><span className="tool-label">Resultado</span><div className="text-3xl font-bold mt-2">{result.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</div></div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-8 text-center">
      <div className="font-semibold">Ferramenta em preparação</div>
      <p className="mt-2 text-sm text-muted-light dark:text-muted-dark">A página já está estruturada para produção. A lógica específica será ativada nos próximos ciclos.</p>
    </div>
  );
}
