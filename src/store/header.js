import { defineStore } from "pinia";
import bigNumber from "bignumber.js";

import { getTheUserBalance, getTheUserPoint } from "@/services/api/user";
import { getGlobalNew } from "@/services/api/oneBuy";

export const useHeaderStore = defineStore("headerStore", {
  state: () => ({
    balance: "",
    usdBalance: "",
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
        let balanceVal = 0;
        res.data.forEach(element => {
          if (element.coinName == "USDT") {
            this.usdBalance = element.balance;
          }
          balanceVal += Number(new bigNumber(element.balance || 0).multipliedBy(element.usdt || 0).toFixed(2))
        });

        this.balance = balanceVal;
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
