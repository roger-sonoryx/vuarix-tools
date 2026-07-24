"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import DownloadButton from "../shared/DownloadButton";

export default function RobotsTxtTool() {
  const [mode, setMode] = useState<"allow-all" | "disallow-all" | "custom">("allow-all");
  const [disallowPaths, setDisallowPaths] = useState("/admin/\n/api/");
  const [sitemapUrl, setSitemapUrl] = useState("https://vuarix.com/sitemap.xml");

  const output = (() => {
    let body = "User-agent: *\n";
    if (mode === "allow-all") {
      body += "Allow: /\n";
    } else if (mode === "disallow-all") {
      body += "Disallow: /\n";
    } else {
      const paths = disallowPaths.split("\n").map((p) => p.trim()).filter(Boolean);
      body += paths.length > 0 ? paths.map((p) => `Disallow: ${p}`).join("\n") + "\n" : "Allow: /\n";
    }
    if (sitemapUrl.trim()) body += `\nSitemap: ${sitemapUrl.trim()}\n`;
    return body;
  })();

  return (
    <ToolPanel>
      <label className="block text-sm font-medium mb-2">Regras de acesso</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            ["allow-all", "Permitir tudo"],
            ["disallow-all", "Bloquear tudo"],
            ["custom", "Personalizado"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
              mode === id
                ? "bg-action text-white border-action"
                : "border-border-light dark:border-border-dark hover:opacity-70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "custom" && (
        <div className="mb-4">
          <label htmlFor="robots-disallow" className="block text-sm font-medium mb-1.5">
            Caminhos a bloquear (um por linha)
          </label>
          <textarea
            id="robots-disallow"
            value={disallowPaths}
            onChange={(e) => setDisallowPaths(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-3 text-sm outline-none focus:border-action transition font-mono"
          />
        </div>
      )}

      <label htmlFor="robots-sitemap" className="block text-sm font-medium mb-1.5">
        URL do sitemap (opcional)
      </label>
      <input
        id="robots-sitemap"
        value={sitemapUrl}
        onChange={(e) => setSitemapUrl(e.target.value)}
        placeholder="https://seusite.com/sitemap.xml"
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
      />

      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-sm font-medium">robots.txt</span>
          <div className="flex gap-2">
            <CopyButton value={output} />
            <DownloadButton data={output} filename="robots.txt" mimeType="text/plain" label="Baixar" />
          </div>
        </div>
        <pre className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </ToolPanel>
  );
}
