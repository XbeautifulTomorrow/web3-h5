<template>
  <div class="header">
    <div class="header-main">
      <div class="header-left">
        <img
          class="header-logo"
          src="@/assets/img/headerFooter/logo.png"
          alt="logo"
          @click="goTo()"
        />
        <ul class="header-nav">
          <li
            class="header-nav-text"
            v-for="(item, index) in nav"
            :key="`nav-${index}`"
            @click="goTo(item.page)"
          >
            {{ item.text }}
          </li>
        </ul>
      </div>
      <div class="header-login">
        <div class="header-right" v-if="!userInfo?.id">
          <div class="btn-box login" @click="changeTypeFun('login')">Login</div>
          <div class="btn-box register" @click="changeTypeFun('register')">
            Register
          </div>
        </div>
        <div
          class="header-button"
          @click="showConnect = true"
          v-if="!userInfo?.id && !conncectAddress"
        >
          {{ conncectAddress ? conncectAddress : "Connect Wallet" }}
        </div>
      </div>
      <div v-if="userInfo?.id || conncectAddress" class="header-login">
        <div class="header-wallet">
          <img
            class="header-wallet-img"
            src="@/assets/img/headerFooter/eth_icon.png"
            alt=""
          />
          <span class="header-wallet-money">{{ ethBalance }}</span>
        </div>
        <div class="header-user" v-if="userInfo?.id">
          <img
            class="header-user-img"
            src="@/assets/svg/user/default_avatar.svg"
            alt=""
          />
          <span class="header-user-text text-ellipsis">
            {{ userInfo?.userName || userInfo?.email }}
          </span>
          <img
            class="header-user-down"
            src="@/assets/img/headerFooter/icon-arrowup.png"
            alt=""
          />
          <div class="header-user-popup">
            <ul class="header-user-content">
              <li
                :class="['header-user-list']"
                v-for="(item, index) in userList"
                :key="`box-${index}`"
                @click="othersideBoxFun(item)"
              >
                <span :class="['header-user-list-img', item.class]"></span>
                <span>{{ item.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <WalletList
      v-if="showConnect"
      @connectWallet="connect"
      @close="closeDialogFun"
    />
    <Login
      v-if="pageType === 'login'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Register
      v-if="pageType === 'register'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Forgot
      v-if="pageType === 'forgot'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
  </div>
</template>

<script>
import Web3 from "web3";
import { mapStores } from "pinia";
import { BigNumber } from "bignumber.js";

import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";

import {
  getKey,
  authLogin,
  getTheUserSPayoutAddress,
} from "@/services/api/user";

import WalletList from "../wallet/index.vue";
import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";

export default {
  name: "HeaderCom",
  components: {
    WalletList,
    Login,
    Register,
    Forgot,
  },
  data() {
    return {
      dialogVisible: true,
      conncectAddress: null,
      web3: null,
      showConnect: false,
      pageType: "",
      nav: [
        {
          text: "Airdrop",
          page: "home",
        },
        {
          text: "Mystery Box",
          page: "MysteryBox",
        },
        {
          text: "Stake",
          page: "Stake",
        },
        {
          text: "INO",
          page: "INO",
        },
        {
          text: "Market Place",
          page: "MarketPlace",
        },
        {
          text: "Whitebook",
          page: "Whitebook",
        },
        {
          text: "FAQ",
          page: "FAQ",
        },
      ],
      userList: [
        {
          text: "Profile",
          class: "myProfile",
        },
        {
          text: "Wallet",
          class: "wallet",
        },
        // {
        //   text: "Wallet Log",
        //   class: "walletLog",
        // },
        {
          text: "Competitions",
          class: "competitions",
        },
        // {
        //   text: "My Collections",
        //   class: "myCollections",
        // },
        // {
        //   text: "Create",
        //   class: "create",
        // },
        {
          text: "Referral",
          class: "referral",
        },
        {
          text: "Settings",
          class: "settings",
        },
        {
          text: "Logout",
          class: "logout",
        },
      ],
      receiver: "0x7ef9873d3D85724A59aC2C56c1C7Ae0d1D27dACB", //收款地址
    };
  },
  mounted() {
    // this.connect();
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
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
    closeDialogFun() {
      this.pageType = "";
      this.showConnect = false;
      if (this.userInfo) {
        this.getTheUserBalanceInfo();
      } else if (this.regInfo) {
        console.log(this.regInfo);
      }
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    getTheUserBalanceInfo() {
      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
      // let res = await getTheUserBalance();
      // this.ethBalance = res.data[0].balance;
    },
    async login() {
      const _that = this;
      let web3 = window.web3;
      getKey().then(async (res) => {
        if (res.data) {
          console.log(web3.eth, "web3=== ");
          this.generateKey = web3.utils.toHex(res.data);
          let msg = this.generateKey;
          const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [_that.conncectAddress, msg],
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
    async connect() {
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
            _that.conncectAddress = accounts[0];
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
    goTo(page = "home") {
      this.$router.push({ path: `/${page}` });
    },
    othersideBoxFun(item) {
      if (item.text == "Profile") {
        this.$router.push({ name: "MyProfile" });
      } else if (item.text == "Wallet") {
        this.$router.push({ name: "Wallet" });
      } else if (item.text == "Competitions") {
        this.$router.push({ name: "Competitions", query: { type: "ENTERED" } });
      } else if (item.text == "My Collections") {
        this.$router.push({
          name: "Competitions",
          query: { type: "MY_COMPETITIONS" },
        });
      } else if (item.text == "Referral") {
        this.$router.push({ name: "Invite" });
      } else if (item.text == "Settings") {
        this.$router.push({ name: "Setting" });
      } else if (item.text === "Logout") {
        this.userStore.logoutApi();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("./index.scss");
</style>
