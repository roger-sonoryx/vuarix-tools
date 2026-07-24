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
import QrCodeTool from "./text/QrCodeTool";

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
import CssFormatterTool from "./web/CssFormatterTool";
import CssMinifierTool from "./web/CssMinifierTool";
import HtmlFormatterTool from "./web/HtmlFormatterTool";
import HtmlMinifierTool from "./web/HtmlMinifierTool";
import JavascriptFormatterTool from "./web/JavascriptFormatterTool";
import JavascriptMinifierTool from "./web/JavascriptMinifierTool";
import MetaTagsTool from "./web/MetaTagsTool";
import OpenGraphTool from "./web/OpenGraphTool";
import RobotsTxtTool from "./web/RobotsTxtTool";
import SchemaOrgTool from "./web/SchemaOrgTool";
import SitemapXmlTool from "./web/SitemapXmlTool";

// Calculadoras
import FinancingTool from "./calculators/FinancingTool";
import InterestTool from "./calculators/InterestTool";
import PercentageTool from "./calculators/PercentageTool";
import DiscountTool from "./calculators/DiscountTool";
import FuelTool from "./calculators/FuelTool";
import SplitBillTool from "./calculators/SplitBillTool";
import BarbecueTool from "./calculators/BarbecueTool";
import PaintTool from "./calculators/PaintTool";
import FlooringTool from "./calculators/FlooringTool";
import ConcreteTool from "./calculators/ConcreteTool";
import BmiTool from "./calculators/BmiTool";
import AgeTool from "./calculators/AgeTool";
import DaysBetweenDatesTool from "./calculators/DaysBetweenDatesTool";

// Conversores
import WeightConverterTool from "./converters/WeightConverterTool";
import DistanceConverterTool from "./converters/DistanceConverterTool";
import AreaConverterTool from "./converters/AreaConverterTool";
import VolumeConverterTool from "./converters/VolumeConverterTool";
import TemperatureConverterTool from "./converters/TemperatureConverterTool";
import SpeedConverterTool from "./converters/SpeedConverterTool";
import FileSizeConverterTool from "./converters/FileSizeConverterTool";

// Imagens
import CompressImageTool from "./images/CompressImageTool";
import ResizeImageTool from "./images/ResizeImageTool";
import CropImageTool from "./images/CropImageTool";
import ConvertFormatTool from "./images/ConvertFormatTool";
import IconGeneratorTool from "./images/IconGeneratorTool";
import FaviconGeneratorTool from "./images/FaviconGeneratorTool";
import ConvertToJpgTool from "./images/ConvertToJpgTool";

// PDF
import MergePdfTool from "./pdf/MergePdfTool";
import SplitPdfTool from "./pdf/SplitPdfTool";
import CompressPdfTool from "./pdf/CompressPdfTool";
import JpgToPdfTool from "./pdf/JpgToPdfTool";
import PngToPdfTool from "./pdf/PngToPdfTool";
import OrganizePagesTool from "./pdf/OrganizePagesTool";
import ExtractPagesTool from "./pdf/ExtractPagesTool";
import RotatePagesTool from "./pdf/RotatePagesTool";

// Redes Sociais
import InstagramResizeTool from "./social/InstagramResizeTool";
import StoriesTool from "./social/StoriesTool";
import CarouselTool from "./social/CarouselTool";
import FacebookResizeTool from "./social/FacebookResizeTool";
import LinkedinResizeTool from "./social/LinkedinResizeTool";
import YoutubeThumbnailTool from "./social/YoutubeThumbnailTool";

// Mapa central slug -> componente. Cada slug aqui precisa existir em
// lib/data.ts. As 69 ferramentas do escopo original estão todas mapeadas.
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
  "html-formatter": HtmlFormatterTool,
  "css-formatter": CssFormatterTool,
  "javascript-formatter": JavascriptFormatterTool,
  "html-minifier": HtmlMinifierTool,
  "css-minifier": CssMinifierTool,
  "javascript-minifier": JavascriptMinifierTool,
  "slug-seo": SlugGeneratorTool,
  "conversor-hex-rgb-hsl": ColorConverterTool,
  "color-picker": ColorPickerTool,
  "meta-tags": MetaTagsTool,
  "open-graph": OpenGraphTool,
  "robots-txt": RobotsTxtTool,
  "schema-org": SchemaOrgTool,
  "sitemap-xml": SitemapXmlTool,

  // Calculadoras
  financiamento: FinancingTool,
  juros: InterestTool,
  porcentagem: PercentageTool,
  descontos: DiscountTool,
  combustivel: FuelTool,
  "divisao-contas": SplitBillTool,
  "churrasco-calc": BarbecueTool,
  tinta: PaintTool,
  piso: FlooringTool,
  concreto: ConcreteTool,
  imc: BmiTool,
  idade: AgeTool,
  "dias-entre-datas": DaysBetweenDatesTool,

  // Conversores
  peso: WeightConverterTool,
  distancia: DistanceConverterTool,
  area: AreaConverterTool,
  volume: VolumeConverterTool,
  temperatura: TemperatureConverterTool,
  velocidade: SpeedConverterTool,
  arquivos: FileSizeConverterTool,

  // Imagens
  comprimir: CompressImageTool,
  redimensionar: ResizeImageTool,
  cortar: CropImageTool,
  "converter-formato": ConvertFormatTool,
  "gerar-icones": IconGeneratorTool,
  "gerar-favicon": FaviconGeneratorTool,
  "converter-para-jpg": ConvertToJpgTool,

  // PDF
  "unir-pdf": MergePdfTool,
  "dividir-pdf": SplitPdfTool,
  "compactar-pdf": CompressPdfTool,
  "jpg-para-pdf": JpgToPdfTool,
  "png-para-pdf": PngToPdfTool,
  "organizar-paginas": OrganizePagesTool,
  "extrair-paginas": ExtractPagesTool,
  "girar-paginas": RotatePagesTool,

  // Redes Sociais
  instagram: InstagramResizeTool,
  stories: StoriesTool,
  carrossel: CarouselTool,
  facebook: FacebookResizeTool,
  linkedin: LinkedinResizeTool,
  "youtube-thumbnail": YoutubeThumbnailTool,
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
