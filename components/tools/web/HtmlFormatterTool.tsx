"use client";

import CodeFormatterBase from "../shared/CodeFormatterBase";
import { formatHtml } from "../shared/codeFormat";

export default function HtmlFormatterTool() {
  return (
    <CodeFormatterBase
      language="HTML"
      placeholder="<div><p>Exemplo</p></div>"
      formatFn={formatHtml}
      downloadExt="html"
      downloadMime="text/html"
    />
  );
}
