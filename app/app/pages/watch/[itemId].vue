<script setup lang="ts">
import type { VideoWithContext } from '@guitar-course/shared'

const route = useRoute()
const itemId = route.params.itemId as string

const { data: video } = await useFetch<VideoWithContext>(`/api/videos/${itemId}`)

if (!video.value) {
  throw createError({ statusCode: 404, statusMessage: 'Vídeo não encontrado' })
}

const progressStore = useProgressStore()

function onTimeUpdate(e: Event) {
  const el = e.target as HTMLVideoElement
  if (el.duration > 0) {
    progressStore.updateProgress(itemId, el.currentTime, el.duration)
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-8">
    <UButton
      :to="`/sessions/${video?.sessionNum}`"
      icon="i-lucide-arrow-left"
      variant="ghost"
      class="mb-4"
    >
      Sessão {{ video?.sessionNum }} — {{ video?.sessionTitle }}
    </UButton>

    <div class="flex items-center gap-2 mb-2">
      <UBadge
        :color="video?.vidType === 'exercise' ? 'warning' : 'neutral'"
        variant="subtle"
      >
        {{ video?.vidType === 'exercise' ? `Exercício ${video.exerciseNum}` : 'Skill' }}
      </UBadge>
      <span class="text-sm text-(--ui-text-muted)">{{ video?.sectionTitle }}</span>
    </div>

    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">{{ video?.title }}</h1>
      <UButton
        :icon="progressStore.isFavorite(itemId) ? 'i-lucide-heart' : 'i-lucide-heart'"
        :color="progressStore.isFavorite(itemId) ? 'error' : 'neutral'"
        :variant="progressStore.isFavorite(itemId) ? 'solid' : 'outline'"
        square
        @click="progressStore.toggleFavorite(itemId)"
      />
    </div>

    <video
      v-if="video"
      :key="video.itemId"
      :src="`/videos/${video.mp4File}`"
      :poster="`/thumbnails/${video.mp4File.replace('.mp4', '.jpg')}`"
      controls
      class="w-full rounded-lg bg-black aspect-video"
      @timeupdate="onTimeUpdate"
    />

    <div class="mt-6">
      <label class="text-sm font-medium mb-2 block">Suas anotações</label>
      <UTextarea
        :model-value="progressStore.noteFor(itemId)"
        placeholder="Adicione uma nota sobre esse vídeo..."
        :rows="3"
        class="w-full"
        @update:model-value="(val) => progressStore.setNote(itemId, String(val))"
      />
    </div>
  </div>
</template>