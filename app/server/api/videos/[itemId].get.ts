import { getVideo } from '@guitar-course/shared'

export default defineEventHandler((event) => {
  const itemId = getRouterParam(event, 'itemId')

  if (!itemId) {
    throw createError({ statusCode: 400, statusMessage: 'itemId inválido' })
  }

  const video = getVideo(itemId)

  if (!video) {
    throw createError({ statusCode: 404, statusMessage: 'Vídeo não encontrado' })
  }

  return video
})