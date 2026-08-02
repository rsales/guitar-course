import { readdirSync, writeFileSync, statSync } from 'node:fs'
import { resolve, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const SRC_DIR = resolve(ROOT, 'content/media/videos')
const OUT_PATH = resolve(ROOT, 'content/generated/media-manifest.json')

interface MediaInfo {
  file: string
  durationSeconds: number
  width: number
  height: number
  sizeBytes: number
}

async function probe(filePath: string): Promise<{ duration: number; width: number; height: number }> {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height:format=duration',
    '-of', 'json',
    filePath,
  ])

  const data = JSON.parse(stdout)
  const stream = data.streams?.[0] ?? {}
  const duration = parseFloat(data.format?.duration ?? '0')

  return {
    duration: Math.round(duration * 10) / 10,
    width: stream.width ?? 0,
    height: stream.height ?? 0,
  }
}

async function main() {
  const mp4Files = readdirSync(SRC_DIR).filter((f) => extname(f).toLowerCase() === '.mp4')
  const results: MediaInfo[] = []

  console.log(`🔍 Analisando ${mp4Files.length} vídeos...`)

  let done = 0
  for (const file of mp4Files) {
    const fullPath = resolve(SRC_DIR, file)
    const { duration, width, height } = await probe(fullPath)
    const sizeBytes = statSync(fullPath).size

    results.push({
      file: basename(file, '.mp4'),
      durationSeconds: duration,
      width,
      height,
      sizeBytes,
    })

    done++
    process.stdout.write(`\r⏳ ${done}/${mp4Files.length}`)
  }

  writeFileSync(OUT_PATH, JSON.stringify(results, null, 2))

  const totalDuration = results.reduce((acc, r) => acc + r.durationSeconds, 0)
  console.log(`\n✅ media-manifest.json gerado — duração total: ${(totalDuration / 60).toFixed(1)} min`)
}

main()