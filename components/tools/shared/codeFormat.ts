// Formatadores e minificadores simples, escritos à mão (sem dependência
// externa como Prettier/Terser) para evitar risco de incompatibilidade de
// versão/tipagem. São formatadores estruturais básicos — não têm o nível
// de sofisticação de um parser completo de AST, mas cobrem o caso comum
// de "colei um código bagunçado, quero organizado/comprimido".

// ---------- HTML ----------

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

export function formatHtml(input: string, indentSize = 2): string {
  const indent = " ".repeat(indentSize);
  // Separa tags e texto em tokens, preservando conteúdo de <script>/<style> intacto.
  const tokens = input
    .replace(/>\s*</g, "><")
    .split(/(<[^>]+>)/g)
    .map((t) => t.trim())
    .filter(Boolean);

  let depth = 0;
  const lines: string[] = [];

  for (const token of tokens) {
    if (/^<\/[a-zA-Z]/.test(token)) {
      depth = Math.max(depth - 1, 0);
      lines.push(indent.repeat(depth) + token);
    } else if (/^<[a-zA-Z!][^>]*\/>$/.test(token) || /^<!DOCTYPE/i.test(token)) {
      lines.push(indent.repeat(depth) + token);
    } else if (/^<[a-zA-Z]/.test(token)) {
      const tagName = token.match(/^<([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase() ?? "";
      lines.push(indent.repeat(depth) + token);
      if (!VOID_TAGS.has(tagName) && !token.endsWith("/>") && !/^<\/?script/i.test(token) && !/^<\/?style/i.test(token)) depth++;
    } else {
      lines.push(indent.repeat(depth) + token);
    }
  }

  return lines.join("\n");
}

export function minifyHtml(input: string): string {
  return input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ---------- CSS ----------

export function formatCss(input: string, indentSize = 2): string {
  const indent = " ".repeat(indentSize);
  const clean = input.replace(/\/\*[\s\S]*?\*\//g, "").trim();
  let depth = 0;
  let result = "";
  let buffer = "";

  for (const char of clean) {
    if (char === "{") {
      result += indent.repeat(depth) + buffer.trim() + " {\n";
      buffer = "";
      depth++;
    } else if (char === "}") {
      if (buffer.trim()) {
        result += indent.repeat(depth) + buffer.trim().replace(/;?$/, ";") + "\n";
      }
      buffer = "";
      depth = Math.max(depth - 1, 0);
      result += indent.repeat(depth) + "}\n";
    } else if (char === ";") {
      result += indent.repeat(depth) + buffer.trim() + ";\n";
      buffer = "";
    } else if (char === "\n" && !buffer.trim()) {
      // ignora quebras de linha sem conteúdo acumulado
    } else {
      buffer += char;
    }
  }
  return result.trim();
}

export function minifyCss(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ---------- JavaScript ----------

type JsToken = { type: "code" | "string" | "comment"; value: string };

function tokenizeJs(input: string): JsToken[] {
  const tokens: JsToken[] = [];
  let i = 0;
  let buffer = "";

  const flush = () => {
    if (buffer) tokens.push({ type: "code", value: buffer });
    buffer = "";
  };

  while (i < input.length) {
    const c = input[i];
    const next = input[i + 1];

    if (c === "/" && next === "/") {
      flush();
      let j = i;
      while (j < input.length && input[j] !== "\n") j++;
      tokens.push({ type: "comment", value: input.slice(i, j) });
      i = j;
      continue;
    }

    if (c === "/" && next === "*") {
      flush();
      const end = input.indexOf("*/", i + 2);
      const j = end === -1 ? input.length : end + 2;
      tokens.push({ type: "comment", value: input.slice(i, j) });
      i = j;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      flush();
      let j = i + 1;
      while (j < input.length && input[j] !== c) {
        if (input[j] === "\\") j++;
        j++;
      }
      j = Math.min(j + 1, input.length);
      tokens.push({ type: "string", value: input.slice(i, j) });
      i = j;
      continue;
    }

    buffer += c;
    i++;
  }
  flush();
  return tokens;
}

export function formatJs(input: string, indentSize = 2): string {
  const indentUnit = " ".repeat(indentSize);
  const tokens = tokenizeJs(input);

  let depth = 0;
  let out = "";

  for (const token of tokens) {
    if (token.type !== "code") {
      out += token.value;
      continue;
    }
    for (const ch of token.value) {
      if (ch === "{") {
        out = out.replace(/[ \t]+$/, "");
        out += " {\n" + indentUnit.repeat(depth + 1);
        depth++;
      } else if (ch === "}") {
        depth = Math.max(depth - 1, 0);
        out = out.replace(/[ \t]+$/, "");
        out += "\n" + indentUnit.repeat(depth) + "}";
      } else if (ch === ";") {
        out += ";\n" + indentUnit.repeat(depth);
      } else if (ch === "\n") {
        out = out.replace(/[ \t]+$/, "") + "\n" + indentUnit.repeat(depth);
      } else {
        out += ch;
      }
    }
  }

  return out
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .filter((l, idx, arr) => !(l.trim() === "" && arr[idx - 1]?.trim() === ""))
    .join("\n")
    .trim();
}

export function minifyJs(input: string): string {
  const tokens = tokenizeJs(input);
  let out = "";
  for (const token of tokens) {
    if (token.type === "comment") continue;
    if (token.type === "string") {
      out += token.value;
      continue;
    }
    const compact = token.value
      .replace(/\s+/g, " ")
      .replace(/\s*([{}();,:=+\-*/%<>!&|?])\s*/g, "$1")
      .replace(/;}/g, "}");
    out += compact;
  }
  return out.replace(/\n{2,}/g, "\n").trim();
}
