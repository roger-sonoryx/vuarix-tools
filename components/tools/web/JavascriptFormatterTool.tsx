"use client";

import CodeFormatterBase from "../shared/CodeFormatterBase";
import { formatJs } from "../shared/codeFormat";

export default function JavascriptFormatterTool() {
  return (
    <CodeFormatterBase
      language="JavaScript"
      placeholder="function soma(a,b){return a+b}"
      formatFn={formatJs}
      downloadExt="js"
      downloadMime="text/javascript"
    />
  );
}
