"use client";

import type { ComponentType } from "react";

// Texto
import CharacterCounterTool from "./text/CharacterCounterTool";
import WordCounterTool from "./text/WordCounterTool";
import TextCaseTool from "./text/TextCaseTool";
import ReadingTimeTool from "./text/ReadingTimeTool";
import SortLinesTool from "./text/SortLinesTool";
import RemoveDuplicatesTool from "./text/RemoveDuplicatesTool";
import PasswordGeneratorTool from "./text/PasswordGeneratorTool";

// Web
import Base64Tool from "./web/Base64Tool";
import UrlEncodeDecodeTool from "./web/UrlEncodeDecodeTool";
import UuidGeneratorTool from "./web/UuidGeneratorTool";
import Sha256Tool from "./web/Sha256Tool";
import Md5Tool from "./web/Md5Tool";
import JsonFormatterTool from "./web/JsonFormatterTool";
import JsonValidatorTool from "./web/JsonValidatorTool";
import SlugGeneratorTool from "./web/SlugGeneratorTool";
import ColorConverterTool from "./web/ColorConverterTool";
import ColorPickerTool from "./web/ColorPickerTool";
import QrCodeTool from "./text/QrCodeTool";

// Mapa central slug -> componente.
// Cada slug aqui precisa existir em lib/data.ts. Ferramentas ainda não
// implementadas (PDF, Imagens, Calculadoras, Conversores, Redes Sociais)
// simplesmente não aparecem neste mapa e caem no aviso abaixo — de forma
// clara e honesta, sem fingir funcionamento.
const toolComponents: Record<string, ComponentType> = {
  // Texto
  "contador-caracteres": CharacterCounterTool,
  "contador-palavras": WordCounterTool,
  "maiusculas-minusculas": TextCaseTool,
  "tempo-leitura": ReadingTimeTool,
  "ordenar-linhas": SortLinesTool,
  "remover-duplicados": RemoveDuplicatesTool,
  "gerador-senhas": PasswordGeneratorTool,
  "qr-code": QrCodeTool,

  // Web
  base64: Base64Tool,
  "url-encode-decode": UrlEncodeDecodeTool,
  uuid: UuidGeneratorTool,
  "sha-256": Sha256Tool,
  md5: Md5Tool,
  "json-formatter": JsonFormatterTool,
  "json-validator": JsonValidatorTool,
  "slug-seo": SlugGeneratorTool,
  "conversor-hex-rgb-hsl": ColorConverterTool,
  "color-picker": ColorPickerTool,
};

export default function ToolInterface({ slug }: { slug: string }) {
  const Component = toolComponents[slug];

  if (!Component) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border-light dark:border-border-dark p-10 text-center text-muted-light dark:text-muted-dark text-sm">
        Esta ferramenta ainda está em desenvolvimento e será implementada em
        uma próxima etapa.
      </div>
    );
  }

  return <Component />;
}
