import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 在开发环境下启用性能分析
if (process.env.NODE_ENV === 'development') {
  app.config.performance = true
}

app.use(createPinia())
app.use(router)

app.mount('#app')
