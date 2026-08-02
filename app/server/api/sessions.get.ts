import { getSessions } from '@guitar-course/shared'

export default defineEventHandler(() => {
  return getSessions()
})