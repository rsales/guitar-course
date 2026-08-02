import { readdirSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const SRC_DIR = resolve(ROOT, 'content/media/videos')
const OUT_DIR = resolve(ROOT, 'content/media/videos') // mesmo diretório, output .mp4 ao lado do .flv
const CONCURRENCY = 4

function runFfmpeg(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const args = [
			'-y',
			'-i', inputPath,
			'-c:v', 'libx264',
			'-preset', 'medium',
			'-crf', '23',
			'-maxrate', '1800k',
			'-bufsize', '3600k',
			'-c:a', 'aac',
			'-b:a', '128k',
			'-movflags', '+faststart',
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

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>,
) {
  let cursor = 0
  const results: { item: T; ok: boolean; error?: string }[] = []

  async function next(): Promise<void> {
    const index = cursor++
    if (index >= items.length) return
    const item = items[index]
    try {
      await worker(item, index)
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
  if (!existsSync(SRC_DIR)) {
    console.error(`❌ Diretório não encontrado: ${SRC_DIR}`)
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })

  const flvFiles = readdirSync(SRC_DIR).filter((f) => extname(f).toLowerCase() === '.flv')

  const toConvert = flvFiles.filter((f) => {
    const outPath = resolve(OUT_DIR, basename(f, '.flv') + '.mp4')
    return !existsSync(outPath) // pula se já converteu (permite retomar)
  })

  console.log(`🎬 ${flvFiles.length} arquivos .flv encontrados, ${toConvert.length} a converter (${flvFiles.length - toConvert.length} já convertidos)`)

  if (toConvert.length === 0) {
    console.log('✅ Nada a fazer.')
    return
  }

  let done = 0
  const startTime = Date.now()

  const results = await runWithConcurrency(toConvert, CONCURRENCY, async (file) => {
    const inputPath = resolve(SRC_DIR, file)
    const outputPath = resolve(OUT_DIR, basename(file, '.flv') + '.mp4')
    await runFfmpeg(inputPath, outputPath)
    done++
    process.stdout.write(`\r⏳ ${done}/${toConvert.length} convertidos`)
  })

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const failed = results.filter((r) => !r.ok)

  console.log(`\n✅ ${results.length - failed.length}/${results.length} convertidos em ${elapsed}s`)

  if (failed.length > 0) {
    console.log(`\n❌ ${failed.length} falharam:`)
    for (const f of failed) {
      console.log(`  - ${f.item}: ${f.error}`)
    }
    process.exit(1)
  }
}

main()