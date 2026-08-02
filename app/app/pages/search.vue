<script setup lang="ts">
import type { SearchEntry } from '@guitar-course/shared'

const query = ref('')
const results = ref<SearchEntry[]>([])
const loading = ref(false)

let debounceTimer: ReturnType<typeof setTimeout>

watch(query, (value) => {
  clearTimeout(debounceTimer)

  if (!value.trim()) {
    results.value = []
    return
  }

  debounceTimer = setTimeout(async () => {
    loading.value = true
    results.value = await $fetch<SearchEntry[]>('/api/search', { query: { q: value } })
    loading.value = false
  }, 250)
})

function goTo(entry: SearchEntry) {
  if (entry.kind === 'video') {
    navigateTo(`/watch/${entry.itemId}`)
  } else {
    navigateTo('/bonus')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-4">Pesquisar</h1>

    <UInput
      v-model="query"
      icon="i-lucide-search"
      placeholder="Buscar por título, ex: afinação, power chord..."
      size="lg"
      class="w-full mb-6"
      autofocus
    />

    <div v-if="loading" class="text-sm text-(--ui-text-muted)">Buscando...</div>

    <div v-else-if="query && results.length === 0" class="text-sm text-(--ui-text-muted)">
      Nenhum resultado para "{{ query }}"
    </div>

    <div class="space-y-2">
      <UCard
        v-for="entry in results"
        :key="entry.itemId"
        :ui="{ body: 'p-3' }"
        class="hover:ring-2 hover:ring-primary transition-shadow cursor-pointer"
        @click="goTo(entry)"
      >
        <div class="flex items-center gap-3">
          <UBadge
            :color="entry.kind === 'bonus' ? 'success' : entry.vidType === 'exercise' ? 'warning' : 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ entry.kind === 'bonus' ? 'Bônus' : entry.vidType === 'exercise' ? `Ex ${entry.exerciseNum}` : 'Skill' }}
          </UBadge>
          <div>
            <p class="text-sm font-medium">{{ entry.title }}</p>
            <p v-if="entry.kind === 'video'" class="text-xs text-(--ui-text-muted)">
              Sessão {{ entry.sessionNum }} — {{ entry.sectionTitle }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>