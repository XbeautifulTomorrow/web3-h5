// import { createApp } from "vue";
import { createSSRApp } from 'vue'
import App from "./App.vue";
// 暴露统一方法createApp
export function createApp() {
  const app = createSSRApp(App)
  // 先不挂载dom，在客户端和服务端分别挂载
  // - app.mount('#app')
  return { app }
}


