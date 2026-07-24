"use client";

import CodeMinifierBase from "../shared/CodeMinifierBase";
import { minifyHtml } from "../shared/codeFormat";

export default function HtmlMinifierTool() {
  return (
    <CodeMinifierBase
      language="HTML"
      placeholder="<div>\n  <p>Exemplo</p>\n</div>"
      minifyFn={minifyHtml}
      downloadExt="html"
      downloadMime="text/html"
    />
  );
}
