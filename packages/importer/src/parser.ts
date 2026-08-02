import { readFileSync } from 'node:fs'
import { XMLParser } from 'fast-xml-parser'
import type {
  CourseManifest,
  Session,
  Section,
  VidItem,
  BonusItem,
  HomepageItem,
} from '@guitar-course/shared'

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  htmlEntities: true,
  isArray: (name: string) =>
    ['homepageItem', 'bonusItem', 'session', 'section', 'vidItem'].includes(name),
}

function toMp4(flvFile: string): string {
  return flvFile.replace(/\.flv$/i, '.mp4')
}

// Some single-child text elements come back as plain strings by fast-xml-parser,
// others (with attributes) come back as objects with "#text". This normalizes both.
function text(node: unknown): string {
  if (node == null) return ''
  if (typeof node === 'string') return String(node)
  if (typeof node === 'object' && '#text' in (node as Record<string, unknown>)) {
    return String((node as Record<string, unknown>)['#text'])
  }
  return String(node)
}

export function parseDiscData(xmlPath: string): CourseManifest {
  const xml = readFileSync(xmlPath, 'utf-8')
  const parser = new XMLParser(parserOptions)
  const doc = parser.parse(xml)
  const root = doc.HowToPlayGuitarDiscData

  const homepage: HomepageItem[] = (root.homepage?.homepageItem ?? []).map((item: any) => ({
    link: item['@_link'],
    img: text(item.img),
    heading: text(item.heading),
    body: text(item.body),
  }))

  const bonusMaterial: BonusItem[] = (root.bonusMaterial?.bonusItem ?? []).map((item: any) => ({
    itemId: item['@_itemId'],
    mp3File: item['@_mp3file'],
    title: text(item.title),
    details: text(item.details),
  }))

  const sessions: Session[] = (root.sessions?.session ?? []).map((sess: any) => {
    const sections: Section[] = (sess.sections?.section ?? []).map((sec: any) => {
      const rawItems = sec.sectionContent?.vidItem ?? []
      const items: VidItem[] = rawItems.map((v: any) => ({
        itemId: v['@_itemId'],
        vidType: v['@_vidType'],
        flvFile: v['@_flvFile'],
        mp4File: toMp4(v['@_flvFile']),
        title: text(v),
        ...(v['@_exerciseNum'] !== undefined && v['@_exerciseNum'] !== ''
          ? { exerciseNum: Number(v['@_exerciseNum']) }
          : {}),
      }))

      return {
        sectionNum: Number(sec['@_sectionNum']),
        firstPage: Number(sec['@_firstPage']),
        lastPage: Number(sec['@_lastPage']),
        title: text(sec.sectionTitle),
        items,
      }
    })

    return {
      sessionNum: Number(sess['@_sessionNum']),
      menuImg: sess['@_menuImg'],
      title: text(sess.sessionTitle),
      sections,
    }
  })

  return {
    bookTitle: text(root.bookTitle),
    homepage,
    bonusMaterial,
    sessions,
  }
}