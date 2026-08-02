import { readdirSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const SRC_DIR = resolve(ROOT, 'content/media/videos')
const OUT_DIR = resolve(ROOT, 'content/thumbnails')
const CONCURRENCY = 4
const SEEK_TIME = '00:00:02' // segundo do vídeo pra tirar o frame

function extractThumbnail(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const args = [
      '-y',
      '-ss', SEEK_TIME,
      '-i', inputPath,
      '-frames:v', '1',
      '-q:v', '3', // qualidade jpg (2-5 é uma boa faixa, menor = melhor)
      '-vf', 'scale=480:-1',
      outputPath,
    ]

    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let stderr = ''
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString() })

    proc.on('close', (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`ffmpeg exited with code ${code}\n${stderr.slice(-500)}`))
    })
    proc.on('error', reject)
  })
}

async function runWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let cursor = 0
  const results: { item: T; ok: boolean; error?: string }[] = []

  async function next(): Promise<void> {
    const index = cursor++
    if (index >= items.length) return
    const item = items[index]
    try {
      await worker(item)
      results.push({ item, ok: true })
    } catch (err) {
      results.push({ item, ok: false, error: (err as Error).message })
    }
    return next()
  }

  await Promise.all(Array.from({ length: limit }, () => next()))
  return results
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const mp4Files = readdirSync(SRC_DIR).filter((f) => extname(f).toLowerCase() === '.mp4')
  const toProcess = mp4Files.filter((f) => {
    const outPath = resolve(OUT_DIR, basename(f, '.mp4') + '.jpg')
    return !existsSync(outPath)
  })

  console.log(`🖼️  ${mp4Files.length} vídeos, ${toProcess.length} thumbnails a gerar`)

  if (toProcess.length === 0) {
    console.log('✅ Nada a fazer.')
    return
  }

  let done = 0
  const results = await runWithConcurrency(toProcess, CONCURRENCY, async (file) => {
    const inputPath = resolve(SRC_DIR, file)
    const outputPath = resolve(OUT_DIR, basename(file, '.mp4') + '.jpg')
    await extractThumbnail(inputPath, outputPath)
    done++
    process.stdout.write(`\r⏳ ${done}/${toProcess.length} thumbnails geradas`)
  })

  const failed = results.filter((r) => !r.ok)
  console.log(`\n✅ ${results.length - failed.length}/${results.length} geradas`)

  if (failed.length > 0) {
    console.log(`\n❌ ${failed.length} falharam:`)
    for (const f of failed) console.log(`  - ${f.item}: ${f.error}`)
  }
}

main()