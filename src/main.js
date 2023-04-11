import { createApp } from 'vue';
import App from './App.vue';
import { detectZoom } from './detectZoom.js';

const m = detectZoom();
//判断屏幕是否为4k
if (window.screen.width * window.devicePixelRatio >= 3840) {
  // switch (m) {
  //   // 4k屏时屏幕缩放比为100%
  //   case 100:
  //     document.body.style.zoom = 100 / 50;
  //     break;
  //     // 4k屏时屏幕缩放比为125%
  //   case 125:
  //     document.body.style.zoom = 100 / 62.5;
  //     break;
  //     // 4k屏时屏幕缩放比为150%
  //   case 150:
  //     document.body.style.zoom = 100 / 75;
  //     break;
  //     // 4k屏时屏幕缩放比为175%
  //   case 175:
  //     document.body.style.zoom = 100 / 87.4715;
  //     break;
  //     // 4k屏时屏幕缩放比为200%
  //   case 200:
  //     document.body.style.zoom = 100 / 100;
  //     break;
  //     // 4k屏时屏幕缩放比为225%
  //   case 225:
  //     document.body.style.zoom = 100 / 112.485;
  //     break;

  //   default:
  //     break;
  // }
  //   transform: scale()
  document.body.style.transform = `scale(${100 / (Number(m) / 2)})`;
} else {
  document.body.style.transform = `scale(${100 / Number(m)})`;
}

createApp(App).mount('#app');
