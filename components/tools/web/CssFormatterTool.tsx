"use client";

import CodeFormatterBase from "../shared/CodeFormatterBase";
import { formatCss } from "../shared/codeFormat";

export default function CssFormatterTool() {
  return (
    <CodeFormatterBase
      language="CSS"
      placeholder=".classe { color: red; margin: 0 }"
      formatFn={formatCss}
      downloadExt="css"
      downloadMime="text/css"
    />
  );
}
