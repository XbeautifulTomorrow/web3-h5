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

// 解决 ElTable 自动宽度高度导致的「ResizeObserver loop limit exceeded」问题
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}

app.use(store);
app.use(dayjs);
app.use(ElementPlus, { size: 'large', zIndex: 3000 });
app.use(router);
app.mount('#app');
