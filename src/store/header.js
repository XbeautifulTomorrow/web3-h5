import { defineStore } from "pinia";

import { getTheUserBalance, getTheUserPoint } from "@/services/api/user";
import { getGlobalNew } from "@/services/api/oneBuy";

export const useHeaderStore = defineStore("headerStore", {
  state: () => ({
    balance: "",
    points: "",
    newStatus: {
      walletNftSystemStatus: false,
      oneNftStatus: false,
      enteredStatus: false,
      myTreasureDrawStatus: false,
    },
    walletAddr: "",
    userRechargeShowList: [],
  }),
  persist: {
    enabled: true,
    strategies: [{ key: "balance", storage: sessionStorage, paths: ["balance"] }],
  },
  actions: {
    async getTheUserBalanceApi(params) {
      const res = await getTheUserBalance(params);
      if (res && res.data) {
        this.balance = res.data.balanceList[0].balance;
        this.userRechargeShowList = res.data.userRechargeShowList;
        let totalPrice = this.userRechargeShowList.reduce((sum, item) => sum + item.price, 0);
        try {
          // eslint-disable-next-line no-undef
          dataLayer.push({
            event: "top_up_status",
            price: totalPrice,
          });
        } catch (err) {
          console.log(err);
        }
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
        this.newStatus = res.data;
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
