<script setup lang="ts">
import type { Session } from '@guitar-course/shared'

const { data: sessions } = await useFetch<Session[]>('/api/sessions')
const progressStore = useProgressStore()

function sessionProgress(session: Session) {
  const allItems = session.sections.flatMap((s) => s.items)
  const watched = allItems.filter((item) => progressStore.videoProgress[item.itemId]?.watched).length
  return { watched, total: allItems.length }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-2">Como Tocar Guitarra Passo a Passo</h1>
    <p class="text-(--ui-text-muted) mb-4">10 sessões · 383 vídeos</p>

    <div class="flex gap-2 mb-6">
      <UButton to="/search" icon="i-lucide-search" variant="soft">Pesquisar</UButton>
      <UButton to="/bonus" icon="i-lucide-music" variant="soft">Material Bônus</UButton>
      <UButton to="/favorites" icon="i-lucide-heart" variant="soft">Favoritos</UButton>
    </div>

    <div v-if="progressStore.recentlyWatched.length > 0" class="mb-8">
      <h2 class="text-lg font-semibold mb-3">Continuar assistindo</h2>
      <div class="flex gap-3 overflow-x-auto pb-2">
        <UButton
          v-for="p in progressStore.recentlyWatched"
          :key="p.itemId"
          :to="`/watch/${p.itemId}`"
          variant="soft"
          class="shrink-0"
        >
          {{ p.itemId }}
        </UButton>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <NuxtLink
        v-for="session in sessions"
        :key="session.sessionNum"
        :to="`/sessions/${session.sessionNum}`"
      >
        <UCard class="hover:ring-2 hover:ring-primary transition-shadow">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-bold shrink-0">
              {{ session.sessionNum }}
            </div>
            <div class="flex-1">
              <h2 class="font-semibold">{{ session.title }}</h2>
              <p class="text-sm text-(--ui-text-muted)">
                {{ session.sections.length }} seções
              </p>
              <UProgress
                :model-value="sessionProgress(session).watched"
                :max="sessionProgress(session).total"
                size="sm"
                class="mt-2"
              />
              <p class="text-xs text-(--ui-text-muted) mt-1">
                {{ sessionProgress(session).watched }}/{{ sessionProgress(session).total }} vídeos assistidos
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>