import './assets/main.scss'

import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'

registerSW({ immediate: true })

createApp(App).mount('#app')
