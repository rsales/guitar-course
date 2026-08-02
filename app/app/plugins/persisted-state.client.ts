export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(({ store }) => {
    const key = `guitar-course:${store.$id}`

    const saved = localStorage.getItem(key)
    if (saved) {
      store.$patch(JSON.parse(saved))
    }

    store.$subscribe((_mutation, state) => {
      localStorage.setItem(key, JSON.stringify(state))
    })
  })
})