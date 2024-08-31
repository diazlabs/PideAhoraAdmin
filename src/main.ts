import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ThemePresets from '@/presets/aura'
import './assets/style.css'
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)
app.use(PrimeVue, {
  unstyled: true,
  pt: ThemePresets
})

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
