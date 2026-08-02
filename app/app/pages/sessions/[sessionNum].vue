<script setup lang="ts">
import type { Session } from '@guitar-course/shared'

const route = useRoute()
const sessionNum = Number(route.params.sessionNum)

const { data: session } = await useFetch<Session>(`/api/sessions/${sessionNum}`)

if (!session.value) {
  throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' })
}

const progressStore = useProgressStore()
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <UButton
      to="/"
      icon="i-lucide-arrow-left"
      variant="ghost"
      class="mb-4"
    >
      Todas as sessões
    </UButton>

    <h1 class="text-3xl font-bold mb-1">
      Sessão {{ session?.sessionNum }} — {{ session?.title }}
    </h1>
    <p class="text-(--ui-text-muted) mb-8">
      {{ session?.sections.length }} seções
    </p>

    <div class="space-y-6">
      <div v-for="section in session?.sections" :key="section.sectionNum">
        <h2 class="text-lg font-semibold mb-1">
          {{ section.sectionNum }}. {{ section.title }}
        </h2>
        <p class="text-sm text-(--ui-text-muted) mb-3">
          Páginas {{ section.firstPage }}–{{ section.lastPage }}
        </p>

        <div class="grid gap-2 sm:grid-cols-2">
					<UCard
						v-for="item in section.items"
						:key="item.itemId"
						:ui="{ body: 'p-3' }"
						class="hover:ring-2 hover:ring-primary transition-shadow cursor-pointer"
						@click="navigateTo(`/watch/${item.itemId}`)"
					>
						<div class="flex items-center gap-3">
							<UBadge
								:color="item.vidType === 'exercise' ? 'warning' : 'neutral'"
								variant="subtle"
								size="sm"
							>
								{{ item.vidType === 'exercise' ? `Ex ${item.exerciseNum}` : 'Skill' }}
							</UBadge>
							<span class="text-sm flex-1">{{ item.title }}</span>
							<UIcon
								v-if="progressStore.videoProgress[item.itemId]?.watched"
								name="i-lucide-check-circle"
								class="text-success shrink-0"
							/>
							<UIcon
								v-if="progressStore.isFavorite(item.itemId)"
								name="i-lucide-heart"
								class="text-error shrink-0"
							/>
						</div>
					</UCard>
        </div>
      </div>
    </div>
  </div>
</template>