import { defineStore } from "pinia";

import { getTheUserBalance, getTheUserPoint } from "@/services/api/user";
import { getGlobalNew } from "@/services/api/oneBuy";

export const useHeaderStore = defineStore("headerStore", {
  state: () => ({
    assetLists:[],
    balance: "",
    points: "",
    newStatus: {
      walletNftSystemStatus: false,
      oneNftStatus: false,
      enteredStatus: false,
      myTreasureDrawStatus: false
    },
    walletAddr: ""
  }),
  persist: {
    enabled: true,
    strategies: [
      { key: "balance", storage: sessionStorage, paths: ["balance"] },
    ],
  },
  actions: {
    async getTheUserBalanceApi(params) {
      const res = await getTheUserBalance(params);
      if (res && res.data) {
        this.balance = res.data[0].balance;
        this.assetLists = res.data;
      }
    },
    // 积分余额
    async fetchTheUserPoint() {
      const res = await getTheUserPoint();
      if (res && res.data) {
        this.points = res.data.balance;
      }
    },
    // 积分余额
    async fetchGlobalNew() {
      const res = await getGlobalNew();
      if (res && res.data) {
        this.newStatus = res.data
      }
    },
    setBalance(data) {
      this.balance = data;
    },
    setWallet(data) {
      this.walletAddr = data;
    },
  },
});
