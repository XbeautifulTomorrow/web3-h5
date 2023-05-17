import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({ userInfo: undefined, regInfo: undefined }),
  actions: {
    setLogin(data) {
      this.userInfo = data;
    },
    setReg(data) {
      this.regInfo = data;
    },
  },
});
