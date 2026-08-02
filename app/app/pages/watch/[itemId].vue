<script setup lang="ts">
import type { VideoWithContext } from '@guitar-course/shared'

const route = useRoute()
const itemId = route.params.itemId as string

const { data: video } = await useFetch<VideoWithContext>(`/api/videos/${itemId}`)

if (!video.value) {
  throw createError({ statusCode: 404, statusMessage: 'Vídeo não encontrado' })
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

    <h1 class="text-2xl font-bold mb-4">{{ video?.title }}</h1>

    <video
      v-if="video"
      :key="video.itemId"
      :src="`/videos/${video.mp4File}`"
      :poster="`/thumbnails/${video.mp4File.replace('.mp4', '.jpg')}`"
      controls
      class="w-full rounded-lg bg-black aspect-video"
    />
  </div>
</template>