# Integração Stitch + desenvolvimento existente

Esta versão preserva a arquitetura Next.js, as rotas dinâmicas, o catálogo em `lib/data.ts` e as ferramentas leves já implementadas, aplicando a linguagem visual oficial exportada do Stitch.

## O que foi integrado
- Header translúcido e navegação mobile do Stitch
- Hero Deep Navy com busca central
- Paleta, cartões, bordas, tipografia e espaçamentos do design exportado
- Home, categorias, páginas internas e footer alinhados ao mesmo sistema visual
- 14 utilitários leves preservados e funcionais
- Sitemap, robots, metadata e exportação estática para Cloudflare Pages

## Cloudflare Pages
- Build: `npm run build`
- Output: `out`
- Node.js: 20
