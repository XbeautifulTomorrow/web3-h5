<template>
  <div class="wrapper_bg">
    <div class="airdrop_container">
      <div class="banner_container">
        <div class="banner_l">
          <div class="operation">CONNECT WALLET FOR</div>
          <div class="title">GET AIRDROP</div>
          <div class="description">
            Connect your usual wallets to earn points rewards, the transaction
            history of your wallet will determine the rewards you can earn.
          </div>
        </div>
        <div class="banner_r">
          <img src="@/assets/svg/airdrop/banner.svg" alt="" />
        </div>
      </div>
      <div class="taps_box">
        <div :class="[
          'taps_item',
          currentActive == 'point' && 'border_bg',
          currentActive == 'point' && 'active',
        ]" @click="handleChange('point')">
          <img src="@/assets/svg/airdrop/icon_point_active.svg" alt="" />
          <span>MY POINT</span>
        </div>
        <div :class="[
          'taps_item',
          currentActive == 'leaderboard' && 'border_bg',
          currentActive == 'leaderboard' && 'active',
        ]" @click="handleChange('leaderboard')">
          <img src="@/assets/svg/airdrop/icon_leaderboard.svg" alt="" />
          <span>LEADERBOARD</span>
        </div>
        <div :class="[
          'taps_item',
          currentActive == 'referral' && 'border_bg',
          currentActive == 'referral' && 'active',
        ]" @click="handleChange('referral')">
          <img src="@/assets/svg/airdrop/icon_referral.svg" alt="" />
          <span>MY REFERRAL LINK</span>
        </div>
      </div>
      <div class="connect_wallet" v-if="!isConnect">
        <div class="connect_wallet_l">
          <img src="@/assets/svg/user/default_avatar.svg" alt="" />
          <div class="user_box">
            <div class="username_text">Nobody</div>
            <div class="tips_text">
              <img src="@/assets/svg/airdrop/icon_wallet.svg" alt="" />
              <span>Wallet is not connected.</span>
            </div>
          </div>
        </div>
        <div class="connect_wallet_r">
          <div class="connect_btn" @click="handleConnect()">Connect Wallet</div>
          <div class="connect_tips">
            The wallet will not be replaced when it is connected.
          </div>
        </div>
      </div>
      <div v-else class="content_container">
        <Point v-if="currentActive == 'point'"></Point>
        <Leaderboard v-if="currentActive == 'leaderboard'"></Leaderboard>
        <Referral v-if="currentActive == 'referral'"></Referral>
      </div>
    </div>
    <Connect v-if="showConnect" @connectMetaMask="connectMetaMask" @close="closeDialogFun"></Connect>
  </div>
</template>

<script>
import Web3 from "web3";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { ElMessage } from "element-plus";

import Point from "./point.vue";
import Leaderboard from "./leaderboard.vue";
import Referral from "./referral.vue";
import Connect from "./connect.vue";
export default {
  name: "AirdropX",
  components: {
    Point,
    Leaderboard,
    Referral,
    Connect
  },
  data() {
    return {
      currentActive: "point",
      showConnect: false,
      isConnect: false,
      conncectAddress: null
    };
  },
  computed: {
    ...mapStores(useUserStore),
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin
    }
  },
  methods: {
    handleChange(event) {
      this.currentActive = event;
    },
    handleConnect() {
      if (!this.isLogin) {
        ElMessage.error("Please log in and try again.");
        return
      }


      this.showConnect = true;
    },
    // 连接小狐狸
    connectMetaMask() {
      let web3 = new Web3(window.ethereum);
      const _that = this;
      let ethereum = window.ethereum;
      if (typeof ethereum === "undefined") {
        //没安装MetaMask钱包进行弹框提示
        ElMessage.error("Please install MetaMask");
      } else {
        //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
        ethereum
          .enable()
          .catch((reason) => {
            //如果用户拒绝了登录请求
            if (reason === "User rejected provider access") {
              // 用户拒绝登录后执行语句；
            } else {
              // 本不该执行到这里，但是真到这里了，说明发生了意外
              ElMessage.error("There was a problem signing you in");
            }
          })
          .then(async (accounts) => {
            web3 = new Web3(window.ethereum);
            //如果用户同意了登录请求，你就可以拿到用户的账号
            web3.eth.defaultAccount = accounts[0];
            window.web3 = web3;
            _that.web3 = web3;
            _that.conncectAddress = accounts[0];
            _that.isConnect = true;
            this.closeDialogFun();
          });
      }
    },
    closeDialogFun() {
      this.showConnect = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./components/index.scss";
</style>
