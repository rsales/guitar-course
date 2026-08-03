<script setup lang="ts">
const showIntro = ref(true) // começa true — já cobre a tela desde o HTML inicial (SSR)

onMounted(() => {
  const seen = sessionStorage.getItem('guitar-course:intro-seen')
  if (seen) {
    showIntro.value = false // já viu nesta sessão: esconde sem nem montar a animação
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