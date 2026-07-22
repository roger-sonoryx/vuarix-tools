// Fonte única de dados do produto.
// Adicionar uma nova ferramenta = adicionar um item aqui + criar o componente dela.
// Nada mais precisa mudar (Home, Categoria e SEO se atualizam sozinhos).

export type Tool = {
  slug: string;
  name: string;
  description: string;
  icon: string; // nome do ícone lucide-react, resolvido em components/ToolIcon.tsx
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tools: Tool[];
  faqs: { q: string; a: string }[];
};

export const categories: Category[] = [
  {
    slug: "pdf",
    name: "PDF",
    description:
      "Una, divida, compacte e converta arquivos PDF direto no navegador — rápido, gratuito e sem enviar seus documentos para nenhum servidor.",
    icon: "FileText",
    faqs: [
      {
        q: "Meus arquivos são enviados para algum servidor?",
        a: "Sempre que possível, o processamento acontece localmente no seu navegador. Seus arquivos não saem do seu computador.",
      },
      {
        q: "As ferramentas de PDF são realmente gratuitas?",
        a: "Sim. Todas as ferramentas de PDF da Vuarix são gratuitas, sem limite de uso e sem cadastro.",
      },
      {
        q: "Existe limite de tamanho de arquivo?",
        a: "Como o processamento é local, o limite depende da capacidade do seu dispositivo.",
      },
    ],
    tools: [
      { slug: "unir-pdf", name: "Unir PDF", description: "Combine vários arquivos em um único PDF", icon: "Combine" },
      { slug: "dividir-pdf", name: "Dividir PDF", description: "Separe páginas em arquivos independentes", icon: "Scissors" },
      { slug: "compactar-pdf", name: "Compactar PDF", description: "Reduza o tamanho sem perder qualidade", icon: "FileDown" },
      { slug: "jpg-para-pdf", name: "JPG para PDF", description: "Converta imagens JPG em documento PDF", icon: "Image" },
      { slug: "png-para-pdf", name: "PNG para PDF", description: "Converta imagens PNG em documento PDF", icon: "Image" },
      { slug: "organizar-paginas", name: "Organizar páginas", description: "Reordene as páginas do seu PDF", icon: "ListOrdered" },
      { slug: "extrair-paginas", name: "Extrair páginas", description: "Salve páginas específicas separadamente", icon: "FileOutput" },
      { slug: "girar-paginas", name: "Girar páginas", description: "Corrija a orientação das páginas", icon: "RotateCw" },
    ],
  },
  {
    slug: "imagens",
    name: "Imagens",
    description: "Comprima, redimensione e converta imagens sem perder qualidade, direto no navegador.",
    icon: "Image",
    faqs: [
      {
        q: "Quais formatos são suportados?",
        a: "JPG, PNG e WebP, com conversão entre os três formatos.",
      },
    ],
    tools: [
      { slug: "comprimir", name: "Comprimir Imagem", description: "Reduza o tamanho sem perder qualidade", icon: "FileDown" },
      { slug: "redimensionar", name: "Redimensionar Imagem", description: "Ajuste largura e altura", icon: "Maximize2" },
      { slug: "cortar", name: "Cortar Imagem", description: "Recorte a área desejada", icon: "Crop" },
      { slug: "converter-formato", name: "Converter JPG, PNG e WebP", description: "Converta entre os formatos mais usados", icon: "RefreshCw" },
      { slug: "gerar-icones", name: "Gerar Ícones", description: "Crie ícones em múltiplos tamanhos", icon: "LayoutGrid" },
      { slug: "gerar-favicon", name: "Gerar Favicon", description: "Crie o favicon do seu site", icon: "Sparkle" },
    ],
  },
  {
    slug: "texto",
    name: "Texto",
    description: "Contadores, geradores e utilitários de texto para o seu dia a dia.",
    icon: "Type",
    faqs: [],
    tools: [
      { slug: "contador-caracteres", name: "Contador de caracteres", description: "Conte caracteres em tempo real", icon: "Type" },
      { slug: "contador-palavras", name: "Contador de palavras", description: "Conte palavras em tempo real", icon: "CaseSensitive" },
      { slug: "qr-code", name: "Gerador de QR Code", description: "Crie QR Codes personalizados", icon: "QrCode" },
      { slug: "gerador-senhas", name: "Gerador de senhas", description: "Senhas fortes e aleatórias", icon: "KeyRound" },
      { slug: "maiusculas-minusculas", name: "Maiúsculas e minúsculas", description: "Converta a caixa do texto", icon: "CaseSensitive" },
      { slug: "tempo-leitura", name: "Tempo de leitura", description: "Estime o tempo de leitura de um texto", icon: "Clock" },
      { slug: "ordenar-linhas", name: "Ordenação de linhas", description: "Ordene linhas em ordem alfabética", icon: "ArrowDownAZ" },
      { slug: "remover-duplicados", name: "Remoção de duplicados", description: "Remova linhas duplicadas", icon: "CopyX" },
    ],
  },
  {
    slug: "calculadoras",
    name: "Calculadoras",
    description: "Calculadoras financeiras e do dia a dia, com resultado instantâneo.",
    icon: "Calculator",
    faqs: [],
    tools: [
      { slug: "financiamento", name: "Financiamento", description: "Simule parcelas de financiamento", icon: "Calculator" },
      { slug: "juros", name: "Juros", description: "Calcule juros simples e compostos", icon: "Percent" },
      { slug: "porcentagem", name: "Porcentagem", description: "Calcule porcentagens rapidamente", icon: "Percent" },
      { slug: "descontos", name: "Descontos", description: "Calcule o valor com desconto", icon: "Percent" },
      { slug: "combustivel", name: "Combustível", description: "Compare álcool ou gasolina", icon: "Fuel" },
      { slug: "divisao-contas", name: "Divisão de contas", description: "Divida contas entre amigos", icon: "Users" },
      { slug: "churrasco-calc", name: "Churrasco Calc", description: "Calcule a quantidade de carne e bebida", icon: "Flame" },
      { slug: "tinta", name: "Tinta", description: "Calcule a quantidade de tinta necessária", icon: "PaintBucket" },
      { slug: "piso", name: "Piso", description: "Calcule a quantidade de piso necessária", icon: "Square" },
      { slug: "concreto", name: "Concreto", description: "Calcule o volume de concreto necessário", icon: "Box" },
      { slug: "imc", name: "IMC", description: "Calcule seu índice de massa corporal", icon: "Ruler" },
      { slug: "idade", name: "Idade", description: "Calcule idade exata a partir da data de nascimento", icon: "Cake" },
      { slug: "dias-entre-datas", name: "Dias entre datas", description: "Calcule quantos dias há entre duas datas", icon: "CalendarDays" },
    ],
  },
  {
    slug: "conversores",
    name: "Conversores",
    description: "Converta unidades de peso, distância, temperatura e mais.",
    icon: "RefreshCw",
    faqs: [],
    tools: [
      { slug: "peso", name: "Peso", description: "kg, g, lb e mais", icon: "Weight" },
      { slug: "distancia", name: "Distância", description: "km, m, milhas e mais", icon: "Move" },
      { slug: "area", name: "Área", description: "m², hectares e mais", icon: "Square" },
      { slug: "volume", name: "Volume", description: "litros, m³ e mais", icon: "Box" },
      { slug: "temperatura", name: "Temperatura", description: "Celsius, Fahrenheit e Kelvin", icon: "Thermometer" },
      { slug: "velocidade", name: "Velocidade", description: "km/h, mph e mais", icon: "Gauge" },
      { slug: "arquivos", name: "Arquivos", description: "KB, MB, GB e mais", icon: "Archive" },
    ],
  },
  {
    slug: "web",
    name: "Web",
    description: "Formatadores, validadores e utilitários para desenvolvedores.",
    icon: "Globe",
    faqs: [],
    tools: [
      { slug: "json-formatter", name: "JSON Formatter", description: "Formate JSON de forma legível", icon: "Braces" },
      { slug: "json-validator", name: "JSON Validator", description: "Valide a estrutura de um JSON", icon: "ShieldCheck" },
      { slug: "html-formatter", name: "HTML Formatter", description: "Formate código HTML", icon: "FileCode" },
      { slug: "css-formatter", name: "CSS Formatter", description: "Formate código CSS", icon: "FileCode" },
      { slug: "javascript-formatter", name: "JavaScript Formatter", description: "Formate código JavaScript", icon: "FileCode" },
      { slug: "html-minifier", name: "HTML Minifier", description: "Minifique código HTML", icon: "Minimize2" },
      { slug: "css-minifier", name: "CSS Minifier", description: "Minifique código CSS", icon: "Minimize2" },
      { slug: "javascript-minifier", name: "JavaScript Minifier", description: "Minifique código JavaScript", icon: "Minimize2" },
      { slug: "base64", name: "Base64 Encode/Decode", description: "Codifique ou decodifique Base64", icon: "Binary" },
      { slug: "url-encode-decode", name: "URL Encode/Decode", description: "Codifique ou decodifique URLs", icon: "Link2" },
      { slug: "sitemap-xml", name: "Sitemap XML", description: "Gere um sitemap.xml", icon: "Map" },
      { slug: "robots-txt", name: "robots.txt", description: "Gere um arquivo robots.txt", icon: "FileText" },
      { slug: "slug-seo", name: "Slug SEO", description: "Gere slugs amigáveis para URLs", icon: "Tags" },
      { slug: "meta-tags", name: "Meta Tags", description: "Gere meta tags para SEO", icon: "Tags" },
      { slug: "open-graph", name: "Open Graph", description: "Gere tags Open Graph", icon: "Tags" },
      { slug: "schema-org", name: "Schema.org", description: "Gere dados estruturados Schema.org", icon: "Braces" },
      { slug: "uuid", name: "UUID", description: "Gere identificadores únicos", icon: "Fingerprint" },
      { slug: "md5", name: "MD5", description: "Gere hash MD5 de um texto", icon: "Hash" },
      { slug: "sha-256", name: "SHA-256", description: "Gere hash SHA-256 de um texto", icon: "Hash" },
      { slug: "color-picker", name: "Color Picker", description: "Escolha e copie cores", icon: "Pipette" },
      { slug: "conversor-hex-rgb-hsl", name: "Conversor HEX, RGB e HSL", description: "Converta cores entre formatos", icon: "Palette" },
    ],
  },
  {
    slug: "redes-sociais",
    name: "Redes Sociais",
    description: "Ferramentas para Instagram, Facebook, LinkedIn e YouTube.",
    icon: "Share2",
    faqs: [],
    tools: [
      { slug: "instagram", name: "Redimensionar para Instagram", description: "Ajuste imagens para o feed do Instagram", icon: "Instagram" },
      { slug: "stories", name: "Criar Stories", description: "Gere artes no formato de Stories", icon: "IdCard" },
      { slug: "carrossel", name: "Criar Carrossel", description: "Divida uma imagem em carrossel", icon: "LayoutGrid" },
      { slug: "facebook", name: "Redimensionar para Facebook", description: "Ajuste imagens para o Facebook", icon: "Facebook" },
      { slug: "linkedin", name: "Redimensionar para LinkedIn", description: "Ajuste imagens para o LinkedIn", icon: "Linkedin" },
      { slug: "youtube-thumbnail", name: "Thumbnail do YouTube", description: "Baixe a thumbnail de qualquer vídeo", icon: "Youtube" },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getTool(categorySlug: string, toolSlug: string) {
  const category = getCategory(categorySlug);
  const tool = category?.tools.find((t) => t.slug === toolSlug);
  return tool && category ? { tool, category } : undefined;
}

export function getAllToolPaths() {
  return categories.flatMap((c) => c.tools.map((t) => ({ category: c.slug, tool: t.slug })));
}
