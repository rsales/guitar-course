# Camada de dados (`packages/shared`)

Expõe uma API tipada em cima dos JSONs gerados pelo `importer`, com cache em memória (os arquivos só são lidos do disco uma vez por processo).

## API

```typescript
import {
  getSessions,      // Session[]
  getSession,       // (sessionNum: number) => Session | undefined
  getSection,       // (sessionNum, sectionNum) => Section | undefined
  getVideo,         // (itemId: string) => VideoWithContext | undefined
  getBonusMaterial, // BonusItem[]
  getBonusItem,     // (itemId: string) => BonusItem | undefined
  search,           // (query: string) => SearchEntry[]
} from '@guitar-course/shared'
```

- `getVideo()` retorna o vídeo já enriquecido com `sessionNum`, `sessionTitle`, `sectionNum`, `sectionTitle` — evita ter que caminhar a árvore de sessões toda vez que se precisa saber "de onde" um vídeo vem.
- `search()` é busca simples por substring (case-insensitive, sem acentuação inteligente ainda). Substituição por algo mais robusto (fuzzy search, normalização de acentos) está prevista no Sprint 6.

## Por que os tipos vivem aqui (não no `importer`)

`packages/shared/src/types.ts` é a única definição de `Session`, `VidItem`, `CourseManifest`, etc. Tanto `packages/importer` quanto `app` importam esses tipos via `@guitar-course/shared` — evita duplicação e garante que um formato de dado nunca diverge entre quem gera e quem consome.