import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import dayjs from 'dayjs';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import store from './store/index';

import 'element-plus/dist/index.css';
import '@/assets/font/font.css';
import '@/assets/css/element.scss';
const app = createApp(App);
for (const name in ElementPlusIconsVue) {
  app.component(name, ElementPlusIconsVue[name]);
}
app.config.globalProperties.$dayjs = dayjs;
app.use(store);
app.use(dayjs);
app.use(ElementPlus, { size: 'large', zIndex: 3000 });
app.use(router);
app.mount('#app');
