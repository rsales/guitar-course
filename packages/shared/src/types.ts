export type VidType = 'skill' | 'exercise'

export interface VidItem {
  itemId: string
  vidType: VidType
  flvFile: string
  mp4File: string
  title: string
  exerciseNum?: number
}

export interface Section {
  sectionNum: number
  firstPage: number
  lastPage: number
  title: string
  items: VidItem[]
}

export interface Session {
  sessionNum: number
  menuImg: string
  title: string
  sections: Section[]
}

export interface BonusItem {
  itemId: string
  mp3File: string
  title: string
  details: string
}

export interface HomepageItem {
  link: string
  img: string
  heading: string
  body: string
}

export interface CourseManifest {
  bookTitle: string
  homepage: HomepageItem[]
  bonusMaterial: BonusItem[]
  sessions: Session[]
}

export interface SearchEntry {
  itemId: string
  title: string
  kind: 'video' | 'bonus'
  vidType?: VidType
  mp4File?: string
  mp3File?: string
  sessionNum?: number
  sessionTitle?: string
  sectionNum?: number
  sectionTitle?: string
  exerciseNum?: number
}