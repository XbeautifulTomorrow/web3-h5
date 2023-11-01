import { defineStore } from "pinia";
import { getLocalStore, setSessionStore, getSessionStore } from "@/utils";

import localeZH from "element-plus/dist/locale/zh-tw.mjs";
import localeEN from "element-plus/dist/locale/en.mjs";
import { getLang } from "@/locales";
import router from "@/router";

export const useUserStore = defineStore("user", {
  state: () => ({
    locale: getLang() == "en_US" ? localeEN : localeZH,
    userInfo: undefined,
    regInfo: undefined,
    userPage: null,
    currentTime: null,
    isLogin: getLocalStore("certificate") ? true : false,
    loadLog: false,
    currencyData: [
      { name: "ETH", img: require("@/assets/svg/user/coin/icon_eth.svg") },
      { name: "WETH", img: require("@/assets/svg/user/coin/icon_weth.svg") },
      { name: "USDT", img: require("@/assets/svg/user/coin/icon_usdt.svg") },
      { name: "BNB", img: require("@/assets/svg/user/coin/icon_bnb.svg") },
      { name: "BUSD", img: require("@/assets/svg/user/coin/icon_busd.svg") },
      { name: "USDC", img: require("@/assets/svg/user/coin/icon_usdc.svg") },
    ],
  }),
  persist: {
    enabled: true,
    strategies: [
      { key: "userInfo", storage: localStorage, paths: ["userInfo"] },
      { key: "regInfo", storage: localStorage, paths: ["regInfo"] },
    ],
  },
  actions: {
    getCoin(event) {
      const { currencyData } = this;
      const coin = currencyData.find((e) => e.name == event);
      return coin?.img || event;
    },
    setLogin(data) {
      if (data.certificate) {
        delete data.certificate;
      }
      this.userInfo = data;
      this.isLogin = true;
    },
    setLoad(data) {
      this.loadLog = data;
    },
    setReg(data) {
      if (data.certificate) {
        delete data.certificate;
      }
      this.regInfo = data;
    },
    setLocale(data) {
      this.locale = data == "en_US" ? localeEN : localeZH;
    },
    setCurrentTime(data) {
      this.currentTime = data;
    },
    setUserPage(path, data) {
      if (!path.indexOf("/user") > -1) {
        router.push({ path: `/user/${data}` });
      }
      this.userPage = data;
    },
    logoutApi() {
      const invateCode = getSessionStore("invateCode");
      sessionStorage.clear();
      setSessionStore("invateCode", invateCode);

      localStorage.removeItem("regInfo");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("certificate");
      this.isLogin = false;
      this.userInfo = undefined;
      this.regInfo = undefined;
      window.NavigationPreloadManager;
      window.location.href = "/home";
      // router.push({ path: "/home" });
    },
  },
});
