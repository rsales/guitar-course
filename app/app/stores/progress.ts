import { defineStore } from 'pinia'

export interface VideoProgress {
  itemId: string
  watched: boolean
  lastPositionSeconds: number
  lastWatchedAt: string // ISO date
}

export interface NoteEntry {
  itemId: string
  text: string
  updatedAt: string
}

interface ProgressState {
  favorites: Record<string, true>
  videoProgress: Record<string, VideoProgress>
  notes: Record<string, NoteEntry>
}

export const useProgressStore = defineStore('progress', {
  state: (): ProgressState => ({
    favorites: {},
    videoProgress: {},
    notes: {},
  }),

  getters: {
    isFavorite: (state) => (itemId: string) => !!state.favorites[itemId],

    watchedCount: (state) =>
      Object.values(state.videoProgress).filter((p) => p.watched).length,

    recentlyWatched: (state) =>
      Object.values(state.videoProgress)
        .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime())
        .slice(0, 5),

    noteFor: (state) => (itemId: string) => state.notes[itemId]?.text ?? '',
  },

  actions: {
    toggleFavorite(itemId: string) {
      if (this.favorites[itemId]) {
        delete this.favorites[itemId]
      } else {
        this.favorites[itemId] = true
      }
    },

    updateProgress(itemId: string, positionSeconds: number, durationSeconds: number) {
      const watched = durationSeconds > 0 && positionSeconds / durationSeconds >= 0.9

      this.videoProgress[itemId] = {
        itemId,
        watched: watched || this.videoProgress[itemId]?.watched || false,
        lastPositionSeconds: positionSeconds,
        lastWatchedAt: new Date().toISOString(),
      }
    },

    setNote(itemId: string, text: string) {
      if (!text.trim()) {
        delete this.notes[itemId]
        return
      }

      this.notes[itemId] = {
        itemId,
        text,
        updatedAt: new Date().toISOString(),
      }
    },
  },
})