// import { createApp } from "vue";
import router from "./router";
import store from "./store/index";
import { createSSRApp } from "vue";
import App from "./App.vue";

// 暴露统一方法createApp
export function createApp() {
  const app = createSSRApp(App);
  // 先不挂载dom，在客户端和服务端分别挂载
  // - app.mount('#app')
  app.use(store)
  app.use(router);
  return { app, router };
}
