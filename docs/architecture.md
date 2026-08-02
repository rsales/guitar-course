# Arquitetura

## Visão geral

```sh
discData.xml (fonte original do DVD)
│
▼
packages/importer ──▶ content/generated/*.json
│
▼
packages/shared (camada de acesso a dados, cacheada em memória)
│
▼
app/ (Nuxt 4 — Nitro server + páginas Vue)
```

## Por que separar `importer` e `shared`?

- **`importer`**: roda uma vez (ou sob demanda), lê o XML, escreve os JSONs em `content/generated/`. Depende de `fast-xml-parser`, não precisa rodar em produção.
- **`shared`**: roda toda vez que a aplicação inicia. Lê os JSONs já gerados, expõe funções tipadas (`getSessions`, `getVideo`, `search`, etc). É a única fonte de verdade sobre o formato dos dados — tanto `importer` quanto `app` importam os tipos dela.

Essa separação existe pra evitar duplicar a definição de tipos (`Session`, `VidItem`, etc.) em dois lugares — ver decisão registrada quando migramos pra npm workspaces.

## Fluxo de mídia

Vídeos e áudios **não passam pelo `shared`** — eles são servidos como arquivos estáticos direto do Nitro (ver `docs/media-pipeline.md` e a config `nitro.publicAssets` em `app/nuxt.config.ts`). O `shared` só sabe os **nomes** dos arquivos (`mp4File`, `mp3File`), não o conteúdo binário.

## Monorepo (npm workspaces)

```json
// package.json (raiz)
{
  "workspaces": ["app", "packages/*"]
}
```

Isso permite que `app` e `packages/importer` declarem `@guitar-course/shared` como dependência e o npm cria um symlink local em vez de precisar publicar num registry.