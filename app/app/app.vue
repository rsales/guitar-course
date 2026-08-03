<script setup lang="ts">
const showIntro = ref(true)

onMounted(() => {
  const seen = sessionStorage.getItem('guitar-course:intro-seen')
  if (seen) {
    showIntro.value = false
  }
})

function onIntroDone() {
  showIntro.value = false
  sessionStorage.setItem('guitar-course:intro-seen', '1')
}
</script>

<template>
  <IntroSplash v-if="showIntro" @done="onIntroDone" />
  <UApp>
    <div class="flex flex-col items-center min-h-screen pb-10">
      <NuxtPage class="w-full" />
      <UColorModeSelect />
    </div>
  </UApp>
</template>