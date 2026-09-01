import './assets/main.scss'

import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

registerSW({ immediate: true })

createApp(App).mount('#app')
