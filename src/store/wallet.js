import { defineStore } from "pinia";

export const useWalletStore = defineStore("wallet", {
  state: () => ({ web3: undefined }),
  actions: {
    setWeb3(data) {
      this.web3 = data;
    },
  },
});
