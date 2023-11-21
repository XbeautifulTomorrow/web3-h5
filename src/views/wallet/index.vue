<template>
  <div>
    <el-dialog
      v-model="newValue"
      destroy-on-close
      width="43.75rem"
      class="public-dialog recharge-coin"
      :show-close="false"
      :align-center="true"
      :before-close="closeDialogFun"
      :append-to-body="true"
    >
      <template #header="{ close }">
        <div class="close_btn" v-on="{ click: [close, closeDialogFun] }">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </template>
      <h2 class="wallet-title">{{ title }} NFT'S</h2>
      <p class="wallet-text">Choose a wallet connection method</p>
      <Link
        class="login-margin-top"
        v-loading="connectType == 1"
        :src="require('@/assets/svg/user/meta_mask.svg')"
        text="MetaMask"
        :showIcon="connectType == 1"
        link="home"
        @click="connectMetaMask"
      />
      <Link
        class="login-margin-top"
        v-loading="connectType == 2"
        :src="require('@/assets/svg/user/wallet_connect.svg')"
        text="WalletConnect"
        :showIcon="connectType == 2"
        link="https://translate.google.com"
        @click="connectWallet()"
      />
    </el-dialog>
  </div>
</template>
<script>
import Web3 from "web3";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { i18n } from "@/locales";
const { t } = i18n.global;
import { BigNumber } from "bignumber.js";
import { mapStores } from "pinia";
import { ElMessage } from "element-plus";
import { openUrl } from "@/utils";

import { getTheUserSPayoutAddress } from "@/services/api/user";
import { useHeaderStore } from "@/store/header.js";
import { useWalletStore } from "@/store/wallet.js";

import Link from "./link.vue";
export default {
  name: "LoginPage",
  components: {
    Link,
  },
  props: {
    title: {
      type: String,
      default: "Deposit",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      web3: null,
      connectType: 0,
      connectProvider: null,
    };
  },
  computed: {
    ...mapStores(useHeaderStore, useWalletStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    regInfo() {
      const { regInfo } = this.userStore;
      return regInfo;
    },
    newValue: {
      get: function () {
        return this.dialogVisible;
      },
      set: function (value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    // 连接小狐狸
    async connectMetaMask() {
      const _that = this;
      _that.connectType = 1;
      let web3 = new Web3(window.ethereum);
      let ethereum = window.ethereum;
      if (typeof ethereum === "undefined") {
        _that.connectType = 0;
        //没安装MetaMask钱包打开MetaMask链接
        openUrl(`https://metamask.app.link/dapp/${window.location.origin}`);
      } else {
        //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
        ethereum
          .enable()
          .then(async (accounts) => {
            web3 = new Web3(window.ethereum);
            //如果用户同意了登录请求，你就可以拿到用户的账号
            web3.eth.defaultAccount = accounts[0];
            _that.walletStore.setWeb3(web3);
            _that.web3 = web3;
            const headerStore = useHeaderStore();
            const _ethBalance = new BigNumber(
              await _that.web3.eth.getBalance(accounts[0])
            )
              .div(1e18)
              .toFixed(4);
            headerStore.setBalance(_ethBalance);
            headerStore.setWallet(accounts[0]);
            this.connectType = 0;
            _that.login();
          })
          .catch((reason) => {
            //如果用户拒绝了登录请求
            this.connectType = 0;
            if (reason === "User rejected provider access") {
              // 用户拒绝登录后执行语句；
            } else {
              // 本不该执行到这里，但是真到这里了，说明发生了意外
              ElMessage.error(t("airdrop.failedTips"));
            }
          });
      }
    },
    // 二维码连接钱包
    async connectWallet() {
      const _that = this;
      _that.connectType = 2;
      //  Create WalletConnect Provider
      this.connectProvider = await EthereumProvider.init({
        projectId: import.meta.env.VITE_APP_PROJECT_ID,
        chains: [1, 5],
        optionalMethods: ["eth_signTypedData_v4"],
        showQrModal: true,
        qrModalOptions: {
          themeMode: "dark",
          themeVariables: {
            "--wcm-z-index": 3100,
          },
        },
      });

      this.connectProvider.on("disconnect", (event) => {
        console.log(event);
        _that.connectType = 0;
      });

      //  Enable session (triggers QR Code modal)
      await this.connectProvider
        .enable()
        .then(async (accounts) => {
          const web3 = new Web3(this.connectProvider);
          //如果用户同意了登录请求，你就可以拿到用户的账号
          web3.eth.defaultAccount = accounts[0];
          _that.walletStore.setWeb3(web3);
          _that.web3 = web3;
          const headerStore = useHeaderStore();
          const _ethBalance = new BigNumber(
            await _that.web3.eth.getBalance(accounts[0])
          )
            .div(1e18)
            .toFixed(4);
          headerStore.setBalance(_ethBalance);
          headerStore.setWallet(accounts[0]);
          this.connectType = 0;
          _that.login();
        })
        .catch((reason) => {
          this.connectType = 0;
          //如果用户拒绝了登录请求
          if (reason === "User rejected provider access") {
            // 用户拒绝登录后执行语句；
          } else {
            // 本不该执行到这里，但是真到这里了，说明发生了意外
            ElMessage.error(t("airdrop.failedTips"));
          }
        });
    },
    getTheUserBalanceInfo() {
      this.headerStoreStore.getTheUserBalanceApi();
      // let res = await getTheUserBalance();
      // this.ethBalance = res.data[0].balance;
    },
    async login() {
      let web3 = this.walletStore.web3;
      if (!web3) return;
      let receiver = await getTheUserSPayoutAddress();
      this.receiver = receiver.data;
      localStorage.setItem("receiver", receiver.data);
      this.getTheUserBalanceInfo();
      this.closeDialogFun();
      this.$emit("linkWallet");
    },
    closeDialogFun() {
      this.$emit("closeDialogFun");
    },
  },
};
</script>
<style lang="scss" scoped>
.wallet-title {
  font-size: 2.625rem;
  color: #e4e7f5;
  font-weight: normal;
}

.wallet-text {
  color: #a9a4b4;
  font-size: 1.125rem;
  margin-top: 0.625rem;
}

:deep(.el-loading-mask) {
  background-color: rgba(29, 15, 54, 0.4);
  border-radius: 0.5rem;
  cursor: not-allowed;

  .el-loading-spinner {
    text-align: right;
    padding-right: 1.25rem;
    box-sizing: border-box;

    .circular {
      width: 1.5rem;
    }
  }
}
</style>
<style lang="scss">
@media screen and (max-width: 950px) {
  .recharge-coin {
    width: 90%;
    .wallet-title {
      font-size: 1.5rem;
    }
    .wallet-text {
      font-size: 0.75rem;
    }
    .link {
      height: 2.5rem;
      padding: 0 0.625rem;
      margin-top: 0.625rem;
      .link-img {
        width: 1.5rem;
        height: 1.5rem;
      }
      .link-text {
        font-size: 0.875rem;
      }
      .link-img-go {
        width: 1rem;
        height: 1rem;
      }
    }
  }
}
</style>
