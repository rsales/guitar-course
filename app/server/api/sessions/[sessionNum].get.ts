import { getSession } from '@guitar-course/shared'

export default defineEventHandler((event) => {
  const sessionNum = Number(getRouterParam(event, 'sessionNum'))

  if (!sessionNum || Number.isNaN(sessionNum)) {
    throw createError({ statusCode: 400, statusMessage: 'sessionNum inválido' })
  }

  const session = getSession(sessionNum)

  if (!session) {
    throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' })
  }

  return session
})