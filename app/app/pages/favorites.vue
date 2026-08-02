<script setup lang="ts">
import type { Session, VideoWithContext } from '@guitar-course/shared'

const { data: sessions } = await useFetch<Session[]>('/api/sessions')
const progressStore = useProgressStore()

const favoriteVideos = computed<VideoWithContext[]>(() => {
  if (!sessions.value) return []

  const result: VideoWithContext[] = []

  for (const session of sessions.value) {
    for (const section of session.sections) {
      for (const item of section.items) {
        if (progressStore.isFavorite(item.itemId)) {
          result.push({
            ...item,
            sessionNum: session.sessionNum,
            sessionTitle: session.title,
            sectionNum: section.sectionNum,
            sectionTitle: section.title,
          })
        }
      }
    }
  }

  return result
})
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-1">Favoritos</h1>
    <p class="text-(--ui-text-muted) mb-6">{{ favoriteVideos.length }} vídeos favoritados</p>

    <div v-if="favoriteVideos.length === 0" class="text-sm text-(--ui-text-muted)">
      Você ainda não favoritou nenhum vídeo. Clique no ❤️ durante a reprodução pra salvar aqui.
    </div>

    <div class="space-y-2">
      <UCard
        v-for="video in favoriteVideos"
        :key="video.itemId"
        :ui="{ body: 'p-3' }"
        class="hover:ring-2 hover:ring-primary transition-shadow cursor-pointer"
        @click="navigateTo(`/watch/${video.itemId}`)"
      >
        <div class="flex items-center gap-3">
          <UBadge
            :color="video.vidType === 'exercise' ? 'warning' : 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ video.vidType === 'exercise' ? `Ex ${video.exerciseNum}` : 'Skill' }}
          </UBadge>
          <div>
            <p class="text-sm font-medium">{{ video.title }}</p>
            <p class="text-xs text-(--ui-text-muted)">
              Sessão {{ video.sessionNum }} — {{ video.sectionTitle }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>