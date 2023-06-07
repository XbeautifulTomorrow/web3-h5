<template>
  <div class="login">
    <popup-page
      :model-value="test"
      title="Connect wallet"
      @closePopup="closePopup"
    >
      <p class="explain-text">Choose a wallet connection method</p>
      <Link
        class="login-margin-top"
        :src="require('@/assets/img/login/icon-metamask.png')"
        text="MetaMask"
        link="home"
        @click="connectParent"
      />
      <Link
        class="login-margin-top"
        :src="require('@/assets/img/login/icon-walletconnect.png')"
        text="WalletConnect"
        link="https://translate.google.com"
      />
    </popup-page>
  </div>
</template>
<script>
import Web3 from "web3";
import { BigNumber } from "bignumber.js";
import { mapStores } from "pinia";

import {
  getKey,
  authLogin,
  getTheUserSPayoutAddress,
} from "@/services/api/user";
import { useHeaderStore } from "@/store/header.js";

import PopupPage from "@/components/popup/index.vue";
import Link from "./link.vue";
export default {
  name: "LoginPage",
  components: {
    PopupPage,
    Link,
  },
  props: ["connect", "close"],
  data() {
    return {
      test: true,
      web3: null,
    };
  },
  computed: {
    ...mapStores(useHeaderStore),
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
  },
  methods: {
    async connectParent() {
      let web3 = new Web3(window.ethereum);
      const _that = this;
      let ethereum = window.ethereum;
      if (typeof ethereum === "undefined") {
        //没安装MetaMask钱包进行弹框提示
        alert("请安装MetaMask");
      } else {
        //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
        ethereum
          .enable()
          .catch(function (reason) {
            //如果用户拒绝了登录请求
            if (reason === "User rejected provider access") {
              // 用户拒绝登录后执行语句；
            } else {
              // 本不该执行到这里，但是真到这里了，说明发生了意外
              alert("There was a problem signing you in");
            }
          })
          .then(async function (accounts) {
            // 判断是否连接以太
            // if (ethereum.networkVersion !== desiredNetwork) {
            // }
            // let web3Provider = new Web3.providers.HttpProvider(
            //   "https://eth.llamarpc.com"
            // );
            // web3 = new Web3("https://goerli.infura.io/v3/60e51d66a38e4624bfb90643cff08d0b");
            web3 = new Web3(window.ethereum);
            //如果用户同意了登录请求，你就可以拿到用户的账号
            web3.eth.defaultAccount = accounts[0];
            window.web3 = web3;
            _that.web3 = web3;
            const headerStore = useHeaderStore();
            const _ethBalance = new BigNumber(
              await _that.web3.eth.getBalance(accounts[0])
            )
              .div(1e18)
              .toFixed(4);
            headerStore.setBalance(_ethBalance);
            headerStore.setWallet(accounts[0]);
            _that.login();
            //这里返回用户钱包地址
            // callback(accounts[0]);
          });
      }
    },
    async login() {
      let web3 = window.web3;
      getKey().then(async (res) => {
        if (res.data) {
          this.generateKey = web3.utils.toHex(res.data);
          let msg = this.generateKey;
          const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [web3.eth.defaultAccount, msg],
          });
          let loginData = await authLogin({
            key: res.data, //登录临时key
            signature: signature, //钱包签名
            chainId: 5, //链ID
            walletAddress: web3.eth.defaultAccount, //钱包地址
            walletName: "METAMASK", //钱包名称(META_MASK,WALLET_CONNECT)
            inviteCode: "", //邀请码
          });
          if (loginData.data.certificate) {
            localStorage.setItem("certificate", loginData.data.certificate);
          }
          let receiver = await getTheUserSPayoutAddress();
          this.getTheUserBalanceInfo();
          this.closeDialogFun();
          this.receiver = receiver.data;
          localStorage.setItem("receiver", this.receiver);
        }
      });
    },
    closePopup() {
      this.test = false;
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped></style>
<style lang="scss" scoped>
.popup {
  z-index: 999;
}
.explain-text {
  font-size: 18px;
  color: #a896b5;
}
.login-margin-top {
  margin-top: 16px;
}
</style>
