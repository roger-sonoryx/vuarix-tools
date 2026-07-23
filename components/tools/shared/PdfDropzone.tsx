"use client";

import { useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";

export type LoadedPdf = { file: File; id: string };

export default function PdfDropzone({
  files,
  onAdd,
  onRemove,
  multiple = false,
}: {
  files: LoadedPdf[];
  onAdd: (files: LoadedPdf[]) => void;
  onRemove: (id: string) => void;
  multiple?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (fileList: FileList | File[]) => {
    const arr = Array.from(fileList)
      .filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))
      .map((f) => ({ file: f, id: `${f.name}-${f.size}-${Math.random()}` }));
    if (arr.length === 0) return;
    onAdd(multiple ? arr : [arr[0]]);
  };

  return (
    <div>
      {(multiple || files.length === 0) && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-colors duration-150 ${
            dragOver ? "border-action bg-action-soft" : "border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-action-soft mx-auto flex items-center justify-center mb-4">
            <UploadCloud size={22} className="text-action" />
          </div>
          <p className="font-medium text-[15px] mb-1">
            Arraste {multiple ? "seus PDFs" : "seu PDF"} aqui
          </p>
          <p className="text-sm text-muted-light dark:text-muted-dark mb-4">ou clique para selecionar</p>
          <label className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition bg-action">
            Selecionar {multiple ? "arquivos" : "arquivo"}
            <input
              type="file"
              accept="application/pdf"
              multiple={multiple}
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </label>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 rounded-xl border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 px-4 py-3">
              <FileText size={16} className="text-action shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{f.file.name}</div>
              </div>
              <div className="text-xs text-muted-light dark:text-muted-dark shrink-0">
                {(f.file.size / 1024).toFixed(0)} KB
              </div>
              <button
                type="button"
                onClick={() => onRemove(f.id)}
                aria-label="Remover arquivo"
                className="shrink-0 opacity-60 hover:opacity-100 transition"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
