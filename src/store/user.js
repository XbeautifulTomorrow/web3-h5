import { defineStore } from "pinia";
import {
  getLocalStore,
} from "@/utils";

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
    },
    setReg(data) {
      this.regInfo = data;
    },
    logoutApi() {
      sessionStorage.clear();
      localStorage.removeItem("certificate");
      this.userInfo = undefined;
      this.regInfo = undefined;
    },
  },
});
