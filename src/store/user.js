import { defineStore } from "pinia";
import { getLocalStore } from "@/utils";

import localeZH from 'element-plus/lib/locale/lang/zh-tw';
import localeEN from 'element-plus/lib/locale/lang/en';
import { getLang } from "@/locales";

// const cookiesStorage = {
//     setItem (key, state) {
//       return Cookies.set('accessToken', state.accessToken, { expires: 3 })
//     },
//     getItem (key) {
//       return JSON.stringify({
//         accessToken: Cookies.getJSON('accessToken'),
//       })
//     },
//   }

// const storageFun = (key,storage,state )=>{

// }

export const useUserStore = defineStore("user", {
  state: () => ({
    locale: getLang() == "en" ? localeEN : localeZH,
    userInfo: undefined,
    regInfo: undefined,
    isLogin: getLocalStore("certificate") ? true : false
  }),
  persist: {
    enabled: true,
    strategies: [
      { key: "userInfo", storage: sessionStorage, paths: ["userInfo"] },
      { key: "regInfo", storage: sessionStorage, paths: ["regInfo"] },
    ],
  },
  actions: {
    setLogin(data) {
      this.userInfo = data;
      this.isLogin = true;
    },
    setReg(data) {
      this.regInfo = data;
    },
    setLocale(data) {
      this.locale = data == "en" ? localeEN : localeZH;
    },
    logoutApi() {
      sessionStorage.clear();
      localStorage.removeItem("certificate");
      this.isLogin = false;
      this.userInfo = undefined;
      this.regInfo = undefined;
    },
  },
});
