# Importador (`packages/importer`)

Converte `content/raw/discData.xml` (formato original do Adobe Director) em JSON estruturado.

## Estrutura do XML original

```sh
HowToPlayGuitarDiscData
├── bookTitle, titlebarImg, jacketImg
├── homepage > homepageItem[]
├── bonusMaterial > bonusItem[] (10 faixas de áudio bônus)
└── sessions > session[] (10 sessões)
└── sections > section[] (88 seções no total)
└── sectionContent > vidItem[] (383 vídeos no total)
vidType="skill" | "exercise" (exercise tem exerciseNum)
```

## Arquivos gerados

Rodando `npm run import` dentro de `packages/importer`, são gerados em `content/generated/`:

- **`sessions.json`** — as 10 sessões com hierarquia completa (seções, vídeos)
- **`bonus.json`** — as 10 faixas de áudio bônus
- **`manifest.json`** — tudo junto (bookTitle, homepage, bonusMaterial, sessions)
- **`search.json`** — índice achatado (vídeos + bônus) usado pela busca

## Decisões técnicas importantes

- **`htmlEntities: true`** no `fast-xml-parser` — sem essa opção, entidades numéricas (`&#x00C7;`) não são decodificadas para acentos (Ç, Ã, etc). Foi a causa de um bug real durante o desenvolvimento — vale não remover essa flag.
- **`isArray`** customizado — força `homepageItem`, `bonusItem`, `session`, `section`, `vidItem` a sempre virarem array, mesmo quando só existe 1 elemento (comportamento padrão do fast-xml-parser colapsaria pra objeto único, quebrando o `.map()`).
- **Encoding**: o XML declara `ISO-8859-1`, mas na prática o arquivo é puro ASCII (acentos vêm como entidades numéricas), então é lido como UTF-8 sem problema.

## Rodando

```bash
cd packages/importer
npm run import
```

Saída esperada: `✅ 10 sessions, 383 videos, 10 bonus tracks`