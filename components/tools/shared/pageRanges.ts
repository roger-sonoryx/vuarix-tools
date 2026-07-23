// Interpreta strings como "1-3,5,8-10" em uma lista de índices de página
// (1-based, como o usuário vê) validados contra o total de páginas.

export function parsePageRanges(input: string, totalPages: number): number[] | { error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { error: "Informe ao menos uma página ou intervalo." };

  const pages = new Set<number>();
  const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start < 1 || end > totalPages || start > end) {
        return { error: `Intervalo inválido: "${part}". O documento tem ${totalPages} página(s).` };
      }
      for (let i = start; i <= end; i++) pages.add(i);
    } else if (/^\d+$/.test(part)) {
      const n = parseInt(part, 10);
      if (n < 1 || n > totalPages) {
        return { error: `Página ${n} não existe. O documento tem ${totalPages} página(s).` };
      }
      pages.add(n);
    } else {
      return { error: `Não entendi "${part}". Use formatos como 1-3,5,8.` };
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
