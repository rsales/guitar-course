
<script setup lang="ts">
import type { BonusItem } from '@guitar-course/shared'

const { data: bonusItems } = await useFetch<BonusItem[]>('/api/bonus')
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
		<ULink 
			to="/"
		>
			<UIcon name="i-lucide-arrow-left" />
			Todas as sessões
		</ULink>
    <h1 class="text-2xl font-bold mb-1">Material Bônus</h1>
    <p class="text-(--ui-text-muted) mb-6">{{ bonusItems?.length }} faixas de áudio</p>

    <div class="space-y-4">
      <UCard v-for="item in bonusItems" :key="item.itemId">
        <h2 class="font-semibold mb-1">{{ item.title }}</h2>
        <p class="text-sm text-(--ui-text-muted) mb-3">{{ item.details }}</p>
        <audio :src="`/audio/${item.mp3File}`" controls class="w-full" />
      </UCard>
    </div>
  </div>
</template>