import { defineStore } from "pinia";
import { getLocalStore, setSessionStore, getSessionStore, encryptCBC, getUrlParams } from "@/utils";
import { productionOfThirdPartyCoin, authGoogleLogin, getWithdrawalChain } from "@/services/api/user";
import localeZH from "element-plus/dist/locale/zh-tw.mjs";
import localeEN from "element-plus/dist/locale/en.mjs";
import localeJA from "element-plus/dist/locale/ja.mjs";
import localePT from "element-plus/dist/locale/pt.mjs";
import { getLang } from "@/locales";
import router from "@/router";
import { useHeaderStore } from "@/store/header.js";

const langMenu = {
  zh_CN: localeZH,
  en_US: localeEN,
  ja_JP: localeJA,
  pt_PT: localePT,
};

export const useUserStore = defineStore("user", {
  state: () => ({
    locale: langMenu[getLang()],
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
    buyCryptoCoinRates: {},
    three_pay_widget_id: "67710925-8b40-4767-846e-3b88db69f04d",
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
            const matchingCoin = networkList.find((x) => x.coinName === data.name);
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
    // 获取法币交易币种和汇率
    async exchangeLegalRate() {
      const res = await productionOfThirdPartyCoin({ widget_id: this.three_pay_widget_id });
      if (res && res.data) {
        this.buyCryptoCoinRates = res?.data?.buy?.USDT;
      }
    },

    // google登录
    async googleLogin() {
      var googleLoginCode = getUrlParams("googleLoginCode");
      if (!googleLoginCode) return;
      // 如果langdingPage入金
      const boxBounsKey = localStorage.getItem("boxBounsKey") || null;
      const res = await authGoogleLogin({ code: googleLoginCode, boxBounsKey });
      if (res && res.code === 200) {
        if (res.data.certificate) {
          localStorage.setItem("certificate", encryptCBC(res.data.certificate));
        }
        router.push({ path: "/home" });
        this.setLogin(res.data);
        const headerStore = useHeaderStore();
        headerStore.getTheUserBalanceApi();
        headerStore.fetchTheUserPoint();
      }
    },
  },
});
