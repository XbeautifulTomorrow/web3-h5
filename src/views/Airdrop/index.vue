<template>
  <div class="wrapper_bg">
    <div class="airdrop_container">
      <div class="banner_container">
        <div class="banner_l">
          <div class="operation">CONNECT WALLET FOR</div>
          <div class="title">GET AIRDROP</div>
          <div class="description">
            Connect your wallets to earn points rewards, the transaction
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
      <div class="connect_wallet" v-if="!isConnect || !userInfo.id">
        <div class="connect_wallet_l">
          <img v-if="isTest" @click="showTest = true" src="@/assets/svg/user/default_avatar.svg" alt="" />
          <img v-else @click="showTest = true" src="@/assets/svg/user/default_avatar.svg" alt="" />
          <div class="user_box">
            <div class="username_text">Nobody</div>
            <div class="tips_text">
              <img src="@/assets/svg/airdrop/icon_wallet.svg" alt="" />
              <span>Wallet is not connected.</span>
            </div>
          </div>
        </div>
        <div class="connect_wallet_r">
          <div class="connect_btn" v-if="isLogin && userInfo && userInfo.id" @click="handleConnect()">Connect Wallet</div>
          <div class="connect_btn" v-else @click="pageType = 'login'">Login</div>
          <div class="connect_tips">
            The wallet will not be replaced when it is connected.
          </div>
        </div>
      </div>
      <div v-else class="content_container">
        <Point :airdrop="airdropData" v-if="currentActive == 'point'"></Point>
        <Leaderboard :airdrop="airdropData" v-if="currentActive == 'leaderboard'"></Leaderboard>
        <Referral v-if="currentActive == 'referral'"></Referral>
      </div>
    </div>
    <Connect v-if="showConnect" @connectMetaMask="connectMetaMask" @close="closeDialogFun"></Connect>

    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Register v-if="pageType === 'register'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />

    <el-dialog class="dialog_airdrop" v-model="showTest" width="43.75rem" lock-scroll :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="link_box">
        <div class="operating_title">
          <span>Test Connect Wallet</span>
        </div>
        <div class="operating_tips">Enter test wallet address</div>
        <el-input class="wallet_addr" v-model="walletAddr" placeholder="Enter test wallet address">
        </el-input>
        <div class="btns_box">
          <div class="btn_item cancel" @click="handleClose()">Cancel</div>
          <div class="btn_item submit" @click="bindTestWallet()">Submit</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Web3 from "web3";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { ElMessage } from "element-plus";
import {
  getKey
} from "@/services/api/user";

import {
  linkWallet,
  getAirdrop
} from "@/services/api/airdrop";

import Point from "./point.vue";
import Leaderboard from "./leaderboard.vue";
import Referral from "./referral.vue";
import Connect from "./connect.vue";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
export default {
  name: "AirdropX",
  components: {
    Point,
    Leaderboard,
    Referral,
    Connect,
    Login,
    Register,
    Forgot,
  },
  data() {
    return {
      pageType: null,
      currentActive: "point",
      showConnect: false,
      isConnect: false,
      walletAddr: null,
      airdropData: {},
      showTest: false,
      isTest: true // 测试模式
    };
  },
  watch: {
    isLogin(newV) {
      if (!newV) {
        this.isConnect = false;
      } else {
        this.getAirdropData();
      }
    },
    userInfo(newV) {
      if (!newV) {
        this.isConnect = false;
      } else {
        this.getAirdropData();
      }
    },
  },
  computed: {
    ...mapStores(useUserStore),
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
  },
  created() {
    if (this.isLogin) {
      this.getAirdropData();
    }
  },
  methods: {
    closeDialogFun() {
      this.pageType = "";
      this.showConnect = false;
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    handleChange(event) {
      this.currentActive = event;
      this.getAirdropData();
    },
    handleConnect() {
      if (!this.isLogin) {
        ElMessage.error("Please log in and try again.");
        return
      }

      this.showConnect = true;
    },
    // 连接小狐狸
    async connectMetaMask() {
      const _that = this;
      let web3 = new Web3(window.ethereum);
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
            //如果用户同意了登录请求，你就可以拿到用户的账号
            web3 = new Web3(window.ethereum);
            //如果用户同意了登录请求，你就可以拿到用户的账号
            web3.eth.defaultAccount = accounts[0];
            window.web3 = web3;
            _that.web3 = web3;
            _that.walletAddr = accounts[0];
            // 绑定钱包
            _that.bindWallet();
          });
      }
    },
    // 绑定钱包
    async bindWallet() {
      const _that = this;
      let web3 = window.web3;
      getKey().then(async (res) => {
        if (res.data) {
          console.log(web3.eth, "web3=== ");
          this.generateKey = web3.utils.toHex(res.data);
          let msg = this.generateKey;
          const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [_that.walletAddr, msg],
          });

          const bindRes = await linkWallet({
            key: res.data, //登录临时key
            signature: signature, //钱包签名
            chainId: 5, //链ID
            walletAddress: web3.eth.defaultAccount, //钱包地址
          });
          if (bindRes && bindRes.code == 200) {
            // 关闭弹窗
            this.closeDialogFun();
            this.getAirdropData();
          }
        }
      });
    },
    // 测试绑定钱包
    async bindTestWallet() {
      if (!this.walletAddr) {
        ElMessage.error("Please enter wallet address");
        return
      }
      const bindRes = await linkWallet({
        key: "xyz", //登录临时key
        signature: "xyz", //钱包签名
        chainId: 5, //链ID
        walletAddress: this.walletAddr, //钱包地址
      });
      if (bindRes && bindRes.code == 200) {
        // 关闭弹窗
        this.handleClose();
        this.getAirdropData();
      }
    },
    // 获取空投数据
    async getAirdropData() {
      this.airdropData = {};
      const res = await getAirdrop();
      if (res && res.code == 200) {
        if (!res.data) {
          this.isConnect = false;
          return
        }

        this.airdropData = res.data;
        this.isConnect = true;
      }
    },
    handleClose(done) {
      if (done) {
        done();
        return
      }
      this.showTest = false;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./components/index.scss";
</style>
