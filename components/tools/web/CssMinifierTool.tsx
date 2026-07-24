"use client";

import CodeMinifierBase from "../shared/CodeMinifierBase";
import { minifyCss } from "../shared/codeFormat";

export default function CssMinifierTool() {
  return (
    <CodeMinifierBase
      language="CSS"
      placeholder=".classe {\n  color: red;\n  margin: 0;\n}"
      minifyFn={minifyCss}
      downloadExt="css"
      downloadMime="text/css"
    />
  );
}
