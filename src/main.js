import { createApp } from 'vue';
import router from './router';
import App from './App.vue';

import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import '@/assets/font/font.css';
const app = createApp(App);
for (const name in ElementPlusIconsVue) {
  app.component(name, ElementPlusIconsVue[name]);
}
app.use(ElementPlus, { size: 'large', zIndex: 3000 });
app.use(router);
app.mount('#app');
