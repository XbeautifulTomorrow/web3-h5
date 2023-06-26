import { defineStore } from "pinia";

export const useWalletStore = defineStore("wallet", {
  state: () => ({ web3: undefined }),
  //   persist: {
  //     enabled: true,
  //     strategies: [{ key: "web3", storage: sessionStorage, paths: ["web3"] }],
  //   },
  actions: {
    setWeb3(data) {
      this.web3 = data;
    },
  },
});
