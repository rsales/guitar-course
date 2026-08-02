import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CourseManifest, Session, Section, VidItem, BonusItem, SearchEntry } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../..') // src -> shared -> packages -> raiz do monorepo
const GENERATED_DIR = resolve(ROOT, 'content/generated')

let cachedManifest: CourseManifest | null = null

export function getManifest(): CourseManifest {
  if (!cachedManifest) {
    const raw = readFileSync(resolve(GENERATED_DIR, 'manifest.json'), 'utf-8')
    cachedManifest = JSON.parse(raw) as CourseManifest
  }
  return cachedManifest
}

export function getSessions(): Session[] {
  return getManifest().sessions
}

export function getSession(sessionNum: number): Session | undefined {
  return getSessions().find((s) => s.sessionNum === sessionNum)
}

export function getSection(sessionNum: number, sectionNum: number): Section | undefined {
  return getSession(sessionNum)?.sections.find((sec) => sec.sectionNum === sectionNum)
}

export interface VideoWithContext extends VidItem {
  sessionNum: number
  sessionTitle: string
  sectionNum: number
  sectionTitle: string
}

export function getVideo(itemId: string): VideoWithContext | undefined {
  for (const session of getSessions()) {
    for (const section of session.sections) {
      const item = section.items.find((v) => v.itemId === itemId)
      if (item) {
        return {
          ...item,
          sessionNum: session.sessionNum,
          sessionTitle: session.title,
          sectionNum: section.sectionNum,
          sectionTitle: section.title,
        }
      }
    }
  }
  return undefined
}

export function getBonusMaterial(): BonusItem[] {
  return getManifest().bonusMaterial
}

export function getBonusItem(itemId: string): BonusItem | undefined {
  return getBonusMaterial().find((b) => b.itemId === itemId)
}

let cachedSearchIndex: SearchEntry[] | null = null

function getSearchIndex(): SearchEntry[] {
  if (!cachedSearchIndex) {
    const raw = readFileSync(resolve(GENERATED_DIR, 'search.json'), 'utf-8')
    cachedSearchIndex = JSON.parse(raw) as SearchEntry[]
  }
  return cachedSearchIndex
}

export function search(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return getSearchIndex().filter((entry) => entry.title.toLowerCase().includes(q))
}