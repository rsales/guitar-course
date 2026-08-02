import { importAll } from './importer.js'

function main() {
  const { stats } = importAll()
  console.log(`✅ ${stats.sessions} sessions, ${stats.videos} videos, ${stats.bonusTracks} bonus tracks`)
}

main()