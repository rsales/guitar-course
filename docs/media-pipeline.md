# Pipeline de mídia (`scripts/`)

Os arquivos originais do DVD (`content/media/videos/*.flv`) precisam ser convertidos pra um formato que navegadores modernos reproduzem nativamente.

## Formato original vs convertido

| | Original (.flv) | Convertido (.mp4) |
|---|---|---|
| Vídeo | VP6F, 1280×720, ~2.1 Mbps | H.264, mesmo tamanho, maxrate 1.8 Mbps |
| Áudio | MP3, 262 kbps | AAC, 128 kbps |
| Tamanho total (383 arquivos) | ~3 GB | ~2.1 GB |

## Scripts

### `scripts/convert-videos.ts`

Converte todos os `.flv` em `content/media/videos/` para `.mp4`, no mesmo diretório.

```bash
npx tsx scripts/convert-videos.ts
```

- Roda com concorrência 4 (4 conversões ffmpeg em paralelo)
- **Resumível**: pula arquivos que já têm `.mp4` gerado — útil se a conversão for interrompida
- Usa `-crf 23 -maxrate 1800k -bufsize 3600k` — CRF com teto de bitrate. Sem o `maxrate`, cenas com muito detalhe visual (ex: close de dedos nas cordas) fazem o CRF puro gerar arquivos maiores que o original.
- `+faststart` — permite iniciar a reprodução antes de baixar o arquivo inteiro (essencial pra web)

### `scripts/generate-thumbnails.ts`

Extrai 1 frame de cada vídeo (aos 2 segundos) como thumbnail JPG, salvo em `content/thumbnails/`.

```bash
npx tsx scripts/generate-thumbnails.ts
```

### `scripts/media-manifest.ts`

Usa `ffprobe` para gerar `content/generated/media-manifest.json` com duração, resolução e tamanho de cada vídeo convertido.

```bash
npx tsx scripts/media-manifest.ts
```

## Nota sobre os `.flv` originais

Os arquivos `.flv` originais são mantidos como backup até a conversão ser totalmente validada. Depois disso, podem ser removidos manualmente (`rm content/media/videos/*.flv`) — recomenda-se manter uma cópia de segurança deles fora do repositório antes de apagar, já que são a única fonte original vinda do DVD físico.