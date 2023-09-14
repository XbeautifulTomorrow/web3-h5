import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import dayjs from "dayjs";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { i18n } from "@/locales";

import store from "./store/index";

import "element-plus/dist/index.css";
import "@/assets/font/font.css";
import "@/assets/css/element.scss";
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
  };
};

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
};
// 价格小数不满两位保留两位，超过显示全部
const formatPrice = (el, value, maxDecimalPlaces) => {
  if (value == null || value == undefined) {
    el.textContent = "0.0";
  } else if (value % 1 === 0) {
    el.textContent = parseFloat(value).toFixed(2);
  } else {
    if (maxDecimalPlaces) {
      const decimalPlaces = value.toString().split(".")[1].length;
      if (decimalPlaces > maxDecimalPlaces) {
        el.textContent = parseFloat(value).toFixed(maxDecimalPlaces);
      } else {
        el.textContent = parseFloat(value).toFixed(Math.max(value.toString().split(".")[1].length, 2));
      }
    } else {
      el.textContent = parseFloat(value).toFixed(Math.max(value.toString().split(".")[1].length, 2));
    }
  }
};
app.directive("priceFormat", {
  beforeMount(el, binding) {
    formatPrice(el, binding.value, binding.arg);
  },
  updated(el, binding) {
    formatPrice(el, binding.value, binding.arg);
  },
});

app.use(i18n);
app.use(store);
app.use(dayjs);
app.use(ElementPlus, { size: "large", zIndex: 3000 });
app.use(router);
app.mount("#app");
