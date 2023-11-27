import { createApp } from "./main.js";
import dayjs from "dayjs";
import CScrollbar from 'c-scrollbar';
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { i18n } from "@/locales";

import "element-plus/dist/index.css";
import "@/assets/font/font.css";
import "@/assets/css/element.scss";

const { app, router } = createApp();

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
// 价格小数不满两位保留两位，超过显示全部,3位一逗号
const formatPrice = (el, value, maxDecimalPlaces = 2) => {
  if (value == null || value == undefined) {
    el.textContent = "0.00";
  } else {
    const multiplier = Math.pow(10, maxDecimalPlaces);
    const roundedNum = Math.floor(value * multiplier) / multiplier; // 向下取整并保留指定位数的小数
    const formattedNum = roundedNum.toLocaleString(undefined, {
      minimumFractionDigits: maxDecimalPlaces,
      maximumFractionDigits: maxDecimalPlaces,
    });
    el.textContent = formattedNum;
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
app.use(CScrollbar);
app.use(dayjs);
app.use(ElementPlus, { size: "large", zIndex: 3000 });

router.isReady().then(() => {
  app.mount('#app')
})
