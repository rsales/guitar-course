# Guitar Course Remastered

Preservando e modernizando o curso multimídia **"Como Tocar Guitarra Passo a Passo"** — originalmente distribuído em DVD com Adobe Director/Flash — para uma aplicação web moderna.

## Stack

- **Frontend**: Nuxt 4, Vue 3, TypeScript, Tailwind CSS v4, Nuxt UI
- **Build/Dados**: Node.js, TypeScript, fast-xml-parser, ffmpeg
- **Monorepo**: npm workspaces

## Estrutura
```sh
guitar-course/
├── app/ # Aplicação Nuxt 4
├── content/
│ ├── raw/discData.xml # Dado fonte original do DVD (versionado)
│ ├── media/ # Vídeos, áudios, imagens (NÃO versionado — ver docs/media-pipeline.md)
│ ├── generated/ # JSONs gerados pelo importer (NÃO versionado, reproduzível)
│ └── thumbnails/ # Thumbnails geradas (NÃO versionado)
├── packages/
│ ├── importer/ # Parser do XML → JSON
│ └── shared/ # Camada de acesso a dados, usada por importer e app
├── scripts/ # Scripts de build de mídia (conversão, thumbnails, manifesto)
└── docs/ # Documentação técnica detalhada
```
Veja `docs/` para detalhes de cada parte do sistema.

## Quick Start

Pré-requisitos: Node.js 20+, ffmpeg instalado (`brew install ffmpeg`).

```bash
# instala tudo (workspaces)
npm install

# 1. gera os JSONs a partir do XML original
cd packages/importer
npm run import

# 2. converte os vídeos originais (.flv) para .mp4 web-friendly
cd ../..
npx tsx scripts/convert-videos.ts

# 3. gera thumbnails e o manifesto de mídia
npx tsx scripts/generate-thumbnails.ts
npx tsx scripts/media-manifest.ts

# 4. roda a aplicação
cd app
npm run dev
```

## Status do projeto

| Sprint | Descrição | Status |
|---|---|---|
| 0 | Preparação | ✅ |
| 1 | Importador (XML → JSON) | ✅ |
| 2 | Processamento de mídia (FLV → MP4, thumbnails) | ✅ |
| 3 | Motor de dados (`@guitar-course/shared`) | ✅ |
| 4 | Interface (Home, Sessões, Player, Pesquisa, Bônus) | ✅ |
| 5 | UX (favoritos, progresso, notas, continuação automática) | ✅ |
| 6 | Busca inteligente | ⏳ |
| 7 | Livro + vídeos | ⏳ |
| 8 | Progressive Web App | ⏳ |
| 9 | Recursos avançados (IA, quiz, flashcards) | ⏳ |

Detalhes de cada sprint em `docs/roadmap.md`.

## Licença

Projeto pessoal de preservação de conteúdo educacional próprio.
