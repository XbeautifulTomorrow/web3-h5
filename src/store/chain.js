import { defineStore } from "pinia";
const envChain = "test" || process.env.VUE_APP_DOMAIN_CONFIG;
export const useChainStore = defineStore("chain", {
  state: () => ({
    chainUrl: {
      test: {
        Mumbai: "https://mumbai.polygonscan.com/tx/",
        OKT_TEST: "https://www.oklink.com/cn/oktc-test/tx/",
        BSC_TEST: "https://testnet.bscscan.com/tx/",
      },
      pro: {
        Mumbai: "https://mumbai.polygonscan.com/tx/",
        OKT_TEST: "https://www.oklink.com/cn/oktc-test/tx/",
        BSC_TEST: "https://testnet.bscscan.com/tx/",
      },
    }[envChain],
  }),
  actions: {},
});
