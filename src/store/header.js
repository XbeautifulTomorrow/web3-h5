import { defineStore } from 'pinia';

import { getTheUserBalance } from '@/services/api/user';

export const useHeaderStore = defineStore('headerStore', {
  state: () => ({ balance: '', walletAddr: '' }),
  actions: {
    async getTheUserBalanceApi(params) {
      const res = await getTheUserBalance(params);
      if (res && res.data) {
        this.balance = res.data[0].balance;
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
