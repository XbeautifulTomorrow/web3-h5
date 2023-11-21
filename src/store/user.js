import { defineStore } from "pinia";
import { getLocalStore, setSessionStore, getSessionStore } from "@/utils";
import { getWithdrawalChain } from "@/services/api/user";

import localeZH from "element-plus/dist/locale/zh-tw.mjs";
import localeEN from "element-plus/dist/locale/en.mjs";
import { getLang } from "@/locales";
import router from "@/router";

import eth from "@/assets/svg/user/coin/icon_eth.svg";
import weth from "@/assets/svg/user/coin/icon_weth.svg";
import usdt from "@/assets/svg/user/coin/icon_usdt.svg";
import bnb from "@/assets/svg/user/coin/icon_bnb.svg";
import busd from "@/assets/svg/user/coin/icon_busd.svg";
import usdc from "@/assets/svg/user/coin/icon_usdc.svg";


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
      { name: "ETH", img: eth },
      { name: "WETH", img: weth },
      { name: "USDT", img: usdt },
      { name: "BNB", img: bnb },
      { name: "BUSD", img: busd },
      { name: "USDC", img: usdc },
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
    // 积分余额
    async getCoinList() {
      if (this.isLogin) {
        const res = await getWithdrawalChain();
        if (res && res.data) {
          const networkList = res.data;
          this.currencyData = this.currencyData.map((data) => {
            const matchingCoin = networkList.find(
              (x) => x.coinName === data.name,
            );
            if (matchingCoin && matchingCoin.img) {
              return { ...data, img: matchingCoin.img };
            } else {
              return data;
            }
          });
        }
      }
    },
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
