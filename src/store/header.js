import { defineStore } from 'pinia';

import { getTheUserBalance } from '@/services/api/user';

export const useHeaderStore = defineStore('headerStore', {
  state: () => ({ balance: '' }),
  actions: {
    async getTheUserBalanceApi(params) {
      const res = await getTheUserBalance(params);
      if (res && res.data) {
        this.balance = res.data[0].balance;
      }
    },
  },
});
