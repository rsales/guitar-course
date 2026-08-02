import { search } from '@guitar-course/shared'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const q = String(query.q ?? '')

  return search(q)
})