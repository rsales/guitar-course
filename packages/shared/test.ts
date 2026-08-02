import { getSessions, getVideo, search } from './src/index.js'

console.log(getSessions().length, 'sessions')
console.log(getVideo('v1_001'))
console.log(search('afina').length, 'resultados para "afina"')