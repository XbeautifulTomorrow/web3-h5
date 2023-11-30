import { defineStore } from "pinia";
import bigNumber from "bignumber.js";

import { getTheUserBalance, getTheUserPoint } from "@/services/api/user";
import { getGlobalNew } from "@/services/api/oneBuy";
import { getSetting } from "@/services/api/invite";

import notifyMessage from "@/views/user/notifyMessage.vue";
import { ElNotification } from "element-plus";
import { h } from "vue";
import { i18n } from "@/locales";
const { t } = i18n.global;

export const useHeaderStore = defineStore("headerStore", {
  state: () => ({
    assetLists: [],
    balance: "",
    usdBalance: "",
    points: "",
    newStatus: {
      walletNftSystemStatus: false,
      oneNftStatus: false,
      enteredStatus: false,
      myTreasureDrawStatus: false,
    },
    walletAddr: "",
    userRechargeShowList: [],
    setting:{}
  }),
  persist: {
    enabled: true,
    strategies: [{ key: "balance", storage: sessionStorage, paths: ["balance"] }],
  },
  actions: {
    async getTheUserBalanceApi(params) {
      const res = await getTheUserBalance(params);
      if (res && res.data) {
        let balanceVal = 0;
        res.data.balanceList.forEach((element) => {
          if (element.coinName == "USDT") {
            this.usdBalance = element.balance;
          }
          balanceVal += Number(new bigNumber(element.balance || 0).multipliedBy(element.usdt || 0).toFixed(2));
        });

        this.balance = balanceVal;
        this.assetLists = res.data.balanceList;
        // 充值数据
        this.userRechargeShowList = res.data.userRechargeShowList;
        let totalPrice = this.userRechargeShowList.reduce((sum, item) => sum + item.price, 0);
        if (totalPrice > 0) {
          try {
            // eslint-disable-next-line no-undef
            dataLayer.push({
              event: "top_up_status",
              price: totalPrice,
            });
          } catch (err) {
            console.log(err);
          }
          this.userRechargeShowList.map((x) => {
            let notifyTxt =
              x.oldCoin != x.newCoin
                ? t("user.depositNotify1", { oldPrice: x.oldPrice, price: x.price })
                : t("user.depositNotify2", { price: x.price });
            setTimeout(() => {
              ElNotification({
                customClass: "custom-notify",
                position: "bottom-right",
                duration: 0,
                dangerouslyUseHTMLString: true,
                message: h(notifyMessage, { type: "success", notifyTxt }),
              });
            });
          });
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
    getCoinBalance(coin) {
      coin = coin === "WETH" ? "ETH" : coin;
      const res = this.assetLists.filter((x) => x.coinName === coin);
      if (res?.length > 0) {
        return res[0]?.balance;
      } else {
        return 0;
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
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: "ETH",
      });

      if (res && res.code == 200) {
        this.setting = res.data;
      }
    },
  },
});
