<template>
  <div class="wrapper_bg">
    <div class="airdrop_container">
      <div class="banner_container">
        <div class="banner_l">
          <div class="operation">CONNECT YOUR WALLET TO</div>
          <div class="title">CLAIM AIRDROP</div>
          <div class="description">
            To earn point rewards, connect your wallets. The rewards you can earn
            will be determined by the transaction history of your wallet.
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
          <img v-show="currentActive == 'point'" src="@/assets/svg/airdrop/icon_point_active.svg" alt="" />
          <img v-show="currentActive != 'point'" src="@/assets/svg/airdrop/icon_point.svg" alt="" />
          <span>MY POINTS</span>
        </div>
        <div :class="[
          'taps_item',
          currentActive == 'leaderboard' && 'border_bg',
          currentActive == 'leaderboard' && 'active',
        ]" @click="handleChange('leaderboard')">
          <img v-show="currentActive == 'leaderboard'" src="@/assets/svg/airdrop/icon_leaderboard_active.svg" alt="" />
          <img v-show="currentActive != 'leaderboard'" src="@/assets/svg/airdrop/icon_leaderboard.svg" alt="" />
          <span>LEADERBOARD</span>
        </div>
        <div :class="[
          'taps_item',
          currentActive == 'referral' && 'border_bg',
          currentActive == 'referral' && 'active',
        ]" @click="handleChange('referral')">
          <img v-show="currentActive == 'referral'" src="@/assets/svg/airdrop/icon_referral_active.svg" alt="" />
          <img v-show="currentActive != 'referral'" src="@/assets/svg/airdrop/icon_referral.svg" alt="" />
          <span>MY REFERRAL LINK</span>
        </div>
      </div>
      <div class="connect_wallet" v-if="!isConnect || !userInfo?.id">
        <div class="connect_wallet_l">
          <img class="default_avatar" v-if="isTest" @click="showTest = true" src="@/assets/svg/user/default_avatar.svg"
            alt="" />
          <img class="default_avatar" v-else src="@/assets/svg/user/default_avatar.svg" alt="" />
          <div class="user_box">
            <div class="username_text">
              <span class="text-ellipsis">{{ userInfo?.id ? userInfo.userName : 'Nobody' }}</span>
              <img v-if="userInfo?.id" @click="pageType = 'modify'" src="@/assets/svg/user/icon_modify.svg" alt="">
            </div>
            <div class="tips_text">
              <img src="@/assets/svg/airdrop/icon_wallet.svg" alt="" />
              <span>Wallet is not connected.</span>
            </div>
          </div>
        </div>
        <div class="connect_wallet_r">
          <div class="connect_btn" v-if="!userInfo?.id" @click="pageType = 'login'">Login</div>
          <div v-else-if="dateDiff(setting.regCountdownTime, currentTime) != 'ENDED'">
            <div class="countdown_tips external">START IN</div>
            <div class="countdown">
              <countDown v-slot="timeObj" @onEnd="fetchAirdropData()" :time="setting.regCountdownTime" :end="currentTime">
                <div class="countdown_tips internal">START IN</div>
                <div class="countdown_time_box">
                  <div class="countdown_item">
                    <div class="val">{{ timeObj.dd }}</div>
                    <div class="text">DAYS</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">:</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">{{ timeObj.hh }}</div>
                    <div class="text">HRS</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">:</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">{{ timeObj.mm }}</div>
                    <div class="text">MINS</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">:</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">{{ timeObj.ss }}</div>
                    <div class="text">SECS</div>
                  </div>
                </div>
              </countDown>
            </div>
          </div>
          <div class="connect_btn" v-else @click="handleConnect()">Connect Wallet</div>
          <div class="connect_tips" v-if="dateDiff(setting.regCountdownTime, currentTime) == 'ENDED'">
            The wallet will not be replaced when it is connected.
          </div>
        </div>
      </div>
      <div v-else class="content_container">
        <Point @onModify="fetchAirdropData()" :airdrop="airdropData" v-if="currentActive == 'point'"></Point>
      </div>
      <Leaderboard :airdrop="airdropData" v-if="currentActive == 'leaderboard'"></Leaderboard>
      <Referral v-if="isLogin && userInfo?.id && currentActive == 'referral'"></Referral>
    </div>
    <Connect v-if="showConnect" @connectWallet="onConnectType" @close="closeDialogFun"></Connect>

    <el-dialog class="dialog_airdrop" v-model="showTest" width="700" :close-on-click-modal="false" :align-center="true"
      lock-scroll :before-close="handleClose">
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
    <el-dialog class="dialog_airdrop public-dialog" v-model="showSucceess" width="700" :close-on-click-modal="false"
      :align-center="true" lock-scroll :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="link_box">
        <div class="operating_title">
          <span>Connect Wallet</span>
        </div>
        <p class="public-dialog-illustrate">
          Synchronizing wallet transaction data, please refresh this page after 10 minutes.
        </p>
        <el-button class="public-button cancel" @click="handleClose()">
          CONFIRM
        </el-button>
      </div>
    </el-dialog>
    <el-dialog class="dialog_airdrop public-dialog" v-model="showSend" width="700" :close-on-click-modal="false"
      :align-center="true" lock-scroll :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="link_box">
        <div class="operating_title">
          <span>Verify your account</span>
        </div>
        <p class="public-dialog-illustrate">
          To finish connecting, you must sign a message in your wallet to verify that you are the owner of this account.
        </p>
        <el-button class="public-button" @click="bindWallet()">
          Send message
        </el-button>
        <el-button class="public-button cancel" @click="handleClose()">
          Cancel
        </el-button>
      </div>
    </el-dialog>
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Register v-if="pageType === 'register'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Modify v-if="pageType === 'modify'" @onModify="fetchAirdropData" @closeDialogFun="closeDialogFun"></Modify>
  </div>
</template>
<script>
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
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
import Modify from "./components/modify.vue";

import { getSetting } from "@/services/api/invite";
import config from "@/services/env";
import { dateDiff } from "@/utils";

import countDown from '@/components/countDown';
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
    countDown,
    Modify
  },
  data() {
    return {
      pageType: "",
      currentActive: "point",
      showConnect: false,
      isConnect: false,
      walletAddr: null,
      airdropData: {},
      connectType: 1,
      connectProvider: null,
      showSucceess: false,
      showSend: false, // 验证
      showTest: false,
      isTest: false, // 测试模式
      setting: {
        regCountdownTime: null
      },
      currentTime: null,
      timer: null
    };
  },
  watch: {
    isLogin(newV) {
      if (!newV) {
        this.isConnect = false;
      } else {
        this.fetchAirdropData();
      }
    },
    userInfo(newV) {
      if (!newV) {
        this.isConnect = false;
      } else {
        this.fetchAirdropData();
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
    this.isTest = config.ENV == "dev";
    this.fetchSetting();

    if (this.isLogin && this.userInfo?.id) {
      this.fetchAirdropData();
    }
  },
  methods: {
    dateDiff: dateDiff,
    closeDialogFun() {
      this.pageType = "";
      this.showConnect = false;
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    handleChange(event) {
      this.currentActive = event;

      if (!this.isLogin || !this.userInfo?.id) return
      this.fetchAirdropData();
    },
    handleConnect() {
      if (!this.isLogin) {
        ElMessage.error("Please log in and try again.");
        return
      }

      this.showConnect = true;
    },
    // 连接类型
    onConnectType(event) {
      this.connectType = event;

      if (event == 1) {
        this.connectMetaMask();
      } else {
        this.connectWallet();
      }
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
            // _that.bindWallet();
            _that.showSend = true;
          });
      }
    },
    // 二维码连接钱包
    async connectWallet() {
      const _that = this;
      //  Create WalletConnect Provider
      this.connectProvider = new WalletConnectProvider({
        infuraId: "ae25803f3d394a5da4c863280b651037",
      });
      //  Enable session (triggers QR Code modal)
      await this.connectProvider.enable().catch((reason) => {
        //如果用户拒绝了登录请求
        if (reason === "User rejected provider access") {
          // 用户拒绝登录后执行语句；
        } else {
          // 本不该执行到这里，但是真到这里了，说明发生了意外
          ElMessage.error("There was a problem signing you in");
        }
      })
        .then(async (accounts) => {
          const web3 = new Web3(this.connectProvider);
          //如果用户同意了登录请求，你就可以拿到用户的账号
          web3.eth.defaultAccount = accounts[0];
          window.web3 = web3;
          _that.web3 = web3;
          _that.walletAddr = accounts[0];
          // 绑定钱包
          _that.bindWallet();
        });
    },
    // 绑定钱包
    async bindWallet() {
      const _that = this;
      let web3 = window.web3;
      getKey().then(async (res) => {
        if (res.data) {
          let signature = null;
          this.generateKey = web3.utils.toHex(res.data);
          if (this.connectType == 1) {
            console.log(web3.eth, "web3=== ");
            signature = await window.ethereum.request({
              method: "personal_sign",
              params: [_that.walletAddr, this.generateKey],
            });
          }
          else {
            console.log(web3.eth, "web3=== ");
            signature = await this.connectProvider.request({
              method: "personal_sign",
              params: [_that.walletAddr, this.generateKey],
            });
          }

          const bindRes = await linkWallet({
            key: res.data, //登录临时key
            signature: signature, //钱包签名
            chainId: 5, //链ID
            walletAddress: web3.eth.defaultAccount, //钱包地址
          });
          if (bindRes && bindRes.code == 200) {
            // 关闭弹窗
            this.closeDialogFun();
            this.handleClose();
            this.showSucceess = true;
            this.fetchAirdropData();
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
        this.closeDialogFun();
        this.handleClose();
        this.showSucceess = true;
        this.fetchAirdropData();
      }
    },
    // 获取空投数据
    async fetchAirdropData() {
      this.airdropData = {};
      const res = await getAirdrop();
      if (res && res.code == 200) {
        if (!res.data) {
          this.isConnect = false;
          return
        }

        this.isConnect = true;
        this.airdropData = res.data;
      }
    },
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: "ETH"
      });
      if (res && res.code == 200) {
        this.setting = res.data;
        this.currentTime = res.localDateTime;
        this.$forceUpdate();
      }
    },
    async handleClose(done) {
      if (this.connectProvider) {
        this.connectProvider.disconnect();
      }

      if (done) {
        done();
        return
      }

      this.showSucceess = false;
      this.showTest = false;
      this.showSend = false;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./components/index.scss";
</style>
