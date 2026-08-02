import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
	nitro: {
		publicAssets: [
			{
				dir: fileURLToPath(new URL('../content/media/videos', import.meta.url)),
				baseURL: '/videos',
				maxAge: 60 * 60 * 24 * 30,
			},
			{
				dir: fileURLToPath(new URL('../content/thumbnails', import.meta.url)),
				baseURL: '/thumbnails',
				maxAge: 60 * 60 * 24 * 30,
			},
			{
				dir: fileURLToPath(new URL('../content/media/audio', import.meta.url)),
				baseURL: '/audio',
				maxAge: 60 * 60 * 24 * 30,
			},
		],
	},
})