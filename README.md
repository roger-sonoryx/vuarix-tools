# Vuarix Tools

Estrutura Next.js do `tools.vuarix.com`, organizada para crescer de dezenas
para centenas de ferramentas sem mudar a arquitetura.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Estrutura de pastas

```
app/
  layout.tsx              ← layout raiz (fontes, <html>, <body>)
  page.tsx                ← Home
  [category]/
    page.tsx               ← Página de Categoria (serve PDF, Imagens, Texto... automaticamente)
    [tool]/
      page.tsx              ← Página de Ferramenta (serve qualquer ferramenta automaticamente)

components/                ← peças reutilizáveis (Lego)
  Header.tsx
  Footer.tsx
  Breadcrumb.tsx
  SearchInput.tsx
  ThemeToggle.tsx
  CategoryCard.tsx
  ToolCard.tsx
  FAQAccordion.tsx
  ToolIcon.tsx

lib/
  data.ts                  ← ÚNICA fonte de verdade: todas as categorias e ferramentas
```

## Como adicionar uma nova ferramenta

1. Abra `lib/data.ts`.
2. Adicione um objeto na lista `tools` da categoria certa (ou crie uma nova categoria).
3. A página `/[category]/[tool]` já existe e vai servir essa ferramenta automaticamente,
   com breadcrumb, FAQ e "relacionadas" prontos.
4. Se a ferramenta precisar de uma interface própria (ex: realmente unir PDFs),
   crie o componente em `components/tools/NomeDaFerramenta.tsx` e coloque-o no
   lugar do placeholder dentro de `app/[category]/[tool]/page.tsx`.

Nenhuma outra parte do site precisa ser tocada — é exatamente o critério de
aceite do Design System: **sem duplicação, código reutilizável**.

## Próximos passos sugeridos

- Implementar a lógica real da primeira ferramenta (ex: Unir PDF com `pdf-lib`).
- Adicionar `sitemap.xml` e `robots.txt` (SEO, Sprint 9 do Master Plan).
- Configurar deploy no Cloudflare Pages.
