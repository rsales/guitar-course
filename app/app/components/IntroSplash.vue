<script setup lang="ts">
import { gsap } from 'gsap'

const emit = defineEmits<{ done: [] }>()

const introRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let particles: { x: number; y: number; scale: number; rotate: number; img: HTMLImageElement }[] = []
let resizeHandler: (() => void) | null = null
let tl: gsap.core.Timeline | null = null
let exitTimeout: ReturnType<typeof setTimeout> | null = null
let cw = 0
let ch = 0
let radius = 0

const LOOP_DURATION_MS = 3000
const VARIANTS = 21 // flair-2.webp até flair-22.webp

// idêntico ao draw() do pen original, mas com drawImage em vez de fillText
function draw() {
  if (!ctx) return
  particles.sort((a, b) => a.scale - b.scale)
  ctx.clearRect(0, 0, cw, ch)
  particles.forEach((p) => {
    ctx!.translate(cw / 2, ch / 2)
    ctx!.rotate(p.rotate)
    ctx!.drawImage(p.img, p.x, p.y, p.img.width * p.scale, p.img.height * p.scale)
    ctx!.resetTransform()
  })
}

onMounted(async () => {
  await nextTick()

  if (!introRef.value || !canvasRef.value) {
    emit('done')
    return
  }

  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')

  cw = canvas.width = window.innerWidth
  ch = canvas.height = window.innerHeight
  radius = Math.max(cw, ch)

  const COUNT = 99

  particles = Array.from({ length: COUNT }, (_, i) => {
    const img = new Image()
    img.src = `/images/flair/flair-${2 + (i % VARIANTS)}.webp`
    return { x: 0, y: 0, scale: 0, rotate: 0, img }
  })

  tl = gsap.timeline({ onUpdate: draw })
    .fromTo(
      particles,
      {
        x: (i: number) => {
          const angle = (i / particles.length) * Math.PI * 2 - Math.PI / 2
          return Math.cos(angle * 10) * radius
        },
        y: (i: number) => {
          const angle = (i / particles.length) * Math.PI * 2 - Math.PI / 2
          return Math.sin(angle * 10) * radius
        },
        scale: 1.1,
        rotate: 0,
      },
      {
        duration: 5,
        ease: 'sine',
        x: 0,
        y: 0,
        scale: 0,
        rotate: -3,
        stagger: { each: -0.05, repeat: -1 },
      },
      0,
    )
    .seek(99)

  gsap.set(introRef.value, { opacity: 1 })

  exitTimeout = setTimeout(() => {
    gsap.to(introRef.value, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => emit('done'),
    })
  }, LOOP_DURATION_MS)

  resizeHandler = () => {
    cw = canvas.width = window.innerWidth
    ch = canvas.height = window.innerHeight
    radius = Math.max(cw, ch)
    tl?.invalidate()
  }
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  tl?.kill()
  if (exitTimeout) clearTimeout(exitTimeout)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <div
    ref="introRef"
    class="fixed inset-0 z-50 flex items-center justify-center bg-(--ui-bg) opacity-0"
  >
    <canvas ref="canvasRef" class="absolute inset-0" />
  </div>
</template>