# Aplicação (`app/`)

Nuxt 4 + Nuxt UI (Tailwind v4 embutido).

## Rotas de página

| Rota | Descrição |
|---|---|
| `/` | Home — lista as 10 sessões |
| `/sessions/[sessionNum]` | Detalhe de uma sessão — seções e vídeos |
| `/watch/[itemId]` | Player de vídeo |
| `/search` | Busca por título (debounced, 250ms) |
| `/bonus` | Material bônus (áudios) |

## Rotas de API (Nitro server)

| Rota | Descrição |
|---|---|
| `GET /api/sessions` | Todas as sessões |
| `GET /api/sessions/[sessionNum]` | Uma sessão específica |
| `GET /api/videos/[itemId]` | Um vídeo com contexto de sessão/seção |
| `GET /api/search?q=...` | Busca |
| `GET /api/bonus` | Material bônus |

Essas rotas existem porque `@guitar-course/shared` lê arquivos do disco — isso só deve rodar server-side (Nitro), nunca no client.

## Servindo mídia

`content/media/videos`, `content/media/audio` e `content/thumbnails` são expostos como assets estáticos via `nitro.publicAssets` em `nuxt.config.ts`, sob `/videos`, `/audio` e `/thumbnails` respectivamente. Isso evita copiar/symlinkar arquivos pra dentro de `app/public/` — o Nitro serve direto do diretório original, com suporte a `Range` requests (necessário pro usuário arrastar a barra de progresso do vídeo).

**Importante**: mudanças em `nitro.publicAssets` exigem reiniciar o dev server — não fazem hot-reload.