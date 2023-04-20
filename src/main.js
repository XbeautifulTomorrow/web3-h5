import { createApp } from 'vue';
import router from "./router"
import App from './App.vue';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/font/font.css'
const app = createApp(App)
app.use(ElementPlus, { size: 'large', zIndex: 3000 })
app.use(router)
app.mount('#app');