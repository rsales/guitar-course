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
| `/favorites` | Vídeos favoritados |

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

## Persistência local (Pinia)

O progresso do usuário (favoritos, histórico de vídeos assistidos, notas) é gerenciado por um store Pinia (`app/stores/progress.ts`) e persistido no `localStorage` do navegador via um plugin customizado (`app/plugins/persisted-state.client.ts`) — não existe backend/banco de dados para esses dados, já que o curso é de uso pessoal (sem autenticação multi-usuário).

### Store: `useProgressStore()`

| Estado/getter/ação | Descrição |
|---|---|
| `favorites` | Record de `itemId → true` |
| `videoProgress` | Record de `itemId → { watched, lastPositionSeconds, lastWatchedAt }` |
| `notes` | Record de `itemId → { text, updatedAt }` |
| `isFavorite(itemId)` | Getter — se um item está favoritado |
| `watchedCount` | Getter — total de vídeos assistidos |
| `recentlyWatched` | Getter — últimos 5 vídeos assistidos, mais recente primeiro |
| `totalWatchedSeconds` | Getter — soma do tempo assistido de todos os vídeos |
| `toggleFavorite(itemId)` | Ação — adiciona/remove dos favoritos |
| `updateProgress(itemId, pos, duration)` | Ação — atualiza posição; marca `watched: true` ao atingir 90% |
| `setNote(itemId, text)` | Ação — salva ou remove (se texto vazio) uma nota |

### Continuação automática

A página `/watch/[itemId]` retoma automaticamente a posição salva ao carregar o vídeo, desde que o progresso salvo seja maior que 5s e menor que 95% da duração total (evita retomar vídeos já concluídos do início).

### Importante — `.client.ts`

O plugin de persistência tem o sufixo `.client.ts` no nome do arquivo — isso garante que só roda no navegador (onde `localStorage` existe), nunca durante SSR no servidor Nitro.