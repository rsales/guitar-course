<script setup lang="ts">
import type { Session } from '@guitar-course/shared'

const { data: sessions } = await useFetch<Session[]>('/api/sessions')
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-2">Como Tocar Guitarra Passo a Passo</h1>
    <p class="text-(--ui-text-muted) mb-8">10 sessões · 383 vídeos</p>

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
            <div>
              <h2 class="font-semibold">{{ session.title }}</h2>
              <p class="text-sm text-(--ui-text-muted)">
                {{ session.sections.length }} seções
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>