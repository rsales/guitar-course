import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDiscData } from './parser.js'
import type { CourseManifest, SearchEntry } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../..') // src -> importer -> packages -> raiz do monorepo

export const XML_PATH = resolve(ROOT, 'content/raw/discData.xml')
export const OUT_DIR = resolve(ROOT, 'content/generated')

function buildSearchIndex(manifest: CourseManifest): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const session of manifest.sessions) {
    for (const section of session.sections) {
      for (const item of section.items) {
        entries.push({
          itemId: item.itemId,
          title: item.title,
          kind: 'video',
          vidType: item.vidType,
          mp4File: item.mp4File,
          sessionNum: session.sessionNum,
          sessionTitle: session.title,
          sectionNum: section.sectionNum,
          sectionTitle: section.title,
          ...(item.exerciseNum !== undefined ? { exerciseNum: item.exerciseNum } : {}),
        })
      }
    }
  }

  for (const bonus of manifest.bonusMaterial) {
    entries.push({
      itemId: bonus.itemId,
      title: bonus.title,
      kind: 'bonus',
      mp3File: bonus.mp3File,
    })
  }

  return entries
}

export interface ImportResult {
  manifest: CourseManifest
  searchIndex: SearchEntry[]
  stats: {
    sessions: number
    videos: number
    bonusTracks: number
  }
}

export function importAll(): ImportResult {
  const manifest = parseDiscData(XML_PATH)
  const searchIndex = buildSearchIndex(manifest)

  mkdirSync(OUT_DIR, { recursive: true })

  writeFileSync(resolve(OUT_DIR, 'sessions.json'), JSON.stringify(manifest.sessions, null, 2))
  writeFileSync(resolve(OUT_DIR, 'bonus.json'), JSON.stringify(manifest.bonusMaterial, null, 2))
  writeFileSync(resolve(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
  writeFileSync(resolve(OUT_DIR, 'search.json'), JSON.stringify(searchIndex, null, 2))

  const totalVids = manifest.sessions.reduce(
    (acc, s) => acc + s.sections.reduce((a, sec) => a + sec.items.length, 0),
    0,
  )

  return {
    manifest,
    searchIndex,
    stats: {
      sessions: manifest.sessions.length,
      videos: totalVids,
      bonusTracks: manifest.bonusMaterial.length,
    },
  }
}