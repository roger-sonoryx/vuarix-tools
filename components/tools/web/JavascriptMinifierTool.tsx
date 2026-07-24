"use client";

import CodeMinifierBase from "../shared/CodeMinifierBase";
import { minifyJs } from "../shared/codeFormat";

export default function JavascriptMinifierTool() {
  return (
    <CodeMinifierBase
      language="JavaScript"
      placeholder="function soma(a, b) {\n  return a + b;\n}"
      minifyFn={minifyJs}
      downloadExt="js"
      downloadMime="text/javascript"
    />
  );
}
