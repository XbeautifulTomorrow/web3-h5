<template>
  <div class="wrapper_bg">
    <div class="airdrop_container">
      <div class="banner_container">
        <div class="banner_l">
          <!-- <div class="operation">{{ $t("airdrop.airdropText1") }}</div> -->
          <!-- <div class="title">{{ $t("airdrop.airdropText2") }}</div> -->
          <div class="title">{{ $t("airdrop.airdropText3") }}</div>
          <!-- <div class="description">{{ $t("airdrop.airdropTips") }}</div> -->
        </div>
        <div class="banner_r">
          <img
            v-if="isTest"
            @click="handleConnect()"
            src="@/assets/img/airdrop/banner.webp"
            alt=""
          />
          <img v-else src="@/assets/img/airdrop/banner.webp" alt="" />
        </div>
      </div>
      <div class="taps_box">
        <div
          :class="[
            'taps_item',
            currentActive == 'point' && 'border_bg',
            currentActive == 'point' && 'active',
          ]"
          @click="handleChange('point')"
        >
          <img
            v-show="currentActive == 'point'"
            src="@/assets/svg/airdrop/icon_point_active.svg"
            alt=""
          />
          <img
            v-show="currentActive != 'point'"
            src="@/assets/svg/airdrop/icon_point.svg"
            alt=""
          />
          <span>{{ $t("airdrop.tabText1") }}</span>
        </div>
        <div
          :class="[
            'taps_item',
            currentActive == 'leaderboard' && 'border_bg',
            currentActive == 'leaderboard' && 'active',
          ]"
          @click="handleChange('leaderboard')"
        >
          <img
            v-show="currentActive == 'leaderboard'"
            src="@/assets/svg/airdrop/icon_leaderboard_active.svg"
            alt=""
          />
          <img
            v-show="currentActive != 'leaderboard'"
            src="@/assets/svg/airdrop/icon_leaderboard.svg"
            alt=""
          />
          <span>{{ $t("airdrop.tabText2") }}</span>
        </div>
        <div
          :class="[
            'taps_item',
            currentActive == 'referral' && 'border_bg',
            currentActive == 'referral' && 'active',
          ]"
          @click="handleChange('referral')"
        >
          <img
            v-show="currentActive == 'referral'"
            src="@/assets/svg/airdrop/icon_referral_active.svg"
            alt=""
          />
          <img
            v-show="currentActive != 'referral'"
            src="@/assets/svg/airdrop/icon_referral.svg"
            alt=""
          />
          <span>{{ $t("airdrop.tabText3") }}</span>
        </div>
      </div>
      <div class="connect_wallet" v-if="!isConnect || !userInfo?.id">
        <div class="connect_wallet_l">
          <img
            class="default_avatar"
            v-if="isTest"
            @click="showTest = true"
            src="@/assets/svg/user/default_avatar.svg"
            alt=""
          />
          <img
            class="default_avatar"
            v-else
            src="@/assets/svg/user/default_avatar.svg"
            alt=""
          />
          <div class="user_box">
            <div class="username_text">
              <span class="text-ellipsis">{{
                userInfo?.id ? userInfo.userName : $t("airdrop.defaultName")
              }}</span>
              <img
                v-if="userInfo?.id"
                @click="pageType = 'modify'"
                src="@/assets/svg/user/icon_modify.svg"
                alt=""
              />
            </div>
            <div class="tips_text">
              <img src="@/assets/svg/airdrop/icon_wallet.svg" alt="" />
              <span>{{ $t("airdrop.walletTips") }}</span>
            </div>
          </div>
        </div>
        <!-- <div class="connect_wallet_r">
          <div class="connect_btn" v-if="!userInfo?.id" @click="pageType = 'login'">{{ $t("common.login") }}</div>
          <div v-else-if="dateDiff(setting.regCountdownTime) != 'ENDED'">
            <div class="countdown_tips external">{{ $t("airdrop.timeTips") }}</div>
            <div class="countdown">
              <countDown v-slot="timeObj" @onEnd="fetchAirdropData()" :time="setting.regCountdownTime">
                <div class="countdown_tips internal">{{ $t("airdrop.timeTips") }}</div>
                <div class="countdown_time_box">
                  <div class="countdown_item">
                    <div class="val">{{ timeObj.dd }}</div>
                    <div class="text">{{ $t("airdrop.day") }}</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">:</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">{{ timeObj.hh }}</div>
                    <div class="text">{{ $t("airdrop.hour") }}</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">:</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">{{ timeObj.mm }}</div>
                    <div class="text">{{ $t("airdrop.minutes") }}</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">:</div>
                  </div>
                  <div class="countdown_item">
                    <div class="val">{{ timeObj.ss }}</div>
                    <div class="text">{{ $t("airdrop.seconds") }}</div>
                  </div>
                </div>
              </countDown>
            </div>
          </div>
          <div class="connect_btn" v-else @click="handleConnect()">{{ $t("airdrop.connectBtn") }}</div>
          <div class="connect_tips" v-if="dateDiff(setting.regCountdownTime) == 'ENDED'">
            {{ $t("airdrop.connectTips") }}
          </div>
        </div> -->
      </div>
      <div v-else class="content_container">
        <Point
          @onModify="fetchAirdropData()"
          :airdrop="airdropData"
          v-if="currentActive == 'point'"
        ></Point>
      </div>
      <Leaderboard
        :airdrop="airdropData"
        v-if="currentActive == 'leaderboard'"
      ></Leaderboard>
      <Referral
        v-if="isLogin && userInfo?.id && currentActive == 'referral'"
      ></Referral>
    </div>
    <Connect
      v-if="showConnect"
      @connectWallet="onConnectType"
      :loadingType="connectType"
      @close="closeDialogFun"
    >
    </Connect>

    <el-dialog
      class="dialog_airdrop"
      v-model="showTest"
      width="43.75rem"
      :close-on-click-modal="false"
      :align-center="true"
      lock-scroll
      :before-close="handleClose"
    >
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="link_box">
        <div class="operating_title">
          <span>TEST CONNECT WALLET</span>
        </div>
        <div class="operating_tips">Enter test wallet address</div>
        <el-input
          class="wallet_addr"
          v-model="walletAddr"
          placeholder="Enter test wallet address"
        >
        </el-input>
        <div class="btns_box">
          <div class="btn_item cancel" @click="handleClose()">Cancel</div>
          <div class="btn_item submit" @click="bindTestWallet()">Submit</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      class="dialog_airdrop public-dialog"
      v-model="showSucceess"
      width="43.75rem"
      :close-on-click-modal="false"
      :align-center="true"
      lock-scroll
      :before-close="handleClose"
    >
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="link_box">
        <div class="operating_title">
          <span>{{ $t("airdrop.connectBtn") }}</span>
        </div>
        <p class="public-dialog-illustrate">
          {{ $t("airdrop.syncTips") }}
        </p>
        <el-button class="public-button cancel" @click="handleClose()">
          {{ $t("airdrop.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="dialog_airdrop public-dialog"
      v-model="showSend"
      width="43.75rem"
      :close-on-click-modal="false"
      :align-center="true"
      lock-scroll
      :before-close="handleClose"
    >
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="link_box">
        <div class="operating_title">
          <span>{{ $t("airdrop.verifyTips") }}</span>
        </div>
        <p class="public-dialog-illustrate">
          <span v-html="$t('airdrop.verifyText1')"></span>
          <br /><br />
          <span
            v-html="$t('airdrop.verifyText2', { address: walletAddr })"
          ></span>
        </p>
        <el-button class="public-button" @click="bindWallet()">
          {{ $t("airdrop.verifyBtn") }}
        </el-button>
        <el-button class="public-button cancel" @click="handleClose()">
          {{ $t("common.cancel") }}
        </el-button>
      </div>
    </el-dialog>
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
    <Modify
      v-if="pageType === 'modify'"
      @onModify="fetchAirdropData"
      @closeDialogFun="closeDialogFun"
    ></Modify>
  </div>
</template>
<script>
import Web3 from "web3";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { useUserStore } from "@/store/user.js";
import { ElMessage } from "element-plus";
import { getKey } from "@/services/api/user";

import { linkWallet, getAirdrop } from "@/services/api/airdrop";

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
import { dateDiff, handleWindowResize, openUrl } from "@/utils";

import countDown from "@/components/countDown";
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
    // eslint-disable-next-line vue/no-unused-components
    countDown,
    Modify,
  },
  data() {
    return {
      pageType: "",
      currentActive: "point",
      showConnect: false,
      isConnect: false,
      walletAddr: null,
      currentChainId: null,
      airdropData: {},
      connectType: 0,
      connectProvider: null,
      showSucceess: false,
      showSend: false, // 验证
      showTest: false,
      isTest: false, // 测试模式
      setting: {
        regCountdownTime: null,
      },
      timer: null,
      screenWidth: null, // 媒体宽度
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
    isLogin() {
      const userStore = useUserStore();
      return userStore.isLogin;
    },
    userInfo() {
      const userStore = useUserStore();
      return userStore.userInfo;
    },
  },
  created() {
    if (config.ENV == "dev") {
      this.isTest = true;
    }

    if (config.ENV == "test") {
      this.isTest = true;
    }

    this.fetchSetting();

    if (this.isLogin && this.userInfo?.id) {
      this.fetchAirdropData();
    }
  },
  methods: {
    dateDiff: dateDiff,
    closeDialogFun() {
      this.pageType = "";
      this.connectType = 0;
      this.showConnect = false;
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    handleChange(event) {
      this.currentActive = event;

      if (!this.isLogin || !this.userInfo?.id) return;
      this.fetchAirdropData();
    },
    handleConnect() {
      if (!this.isLogin) {
        ElMessage.error(this.$t("airdrop.loginText"));
        return;
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
            window.web3 = web3;
            _that.web3 = web3;
            _that.walletAddr = accounts[0];

            // 绑定钱包
            _that.bindWallet();
          })
          .catch((reason) => {
            //如果用户拒绝了登录请求
            this.connectType = 0;
            if (reason === "User rejected provider access") {
              // 用户拒绝登录后执行语句；
            } else {
              // 本不该执行到这里，但是真到这里了，说明发生了意外
              ElMessage.error(this.$t("airdrop.failedTips"));
            }
          });
      }
    },
    // 二维码连接钱包
    async connectWallet() {
      const _that = this;
      //  Create WalletConnect Provider
      this.connectProvider = await EthereumProvider.init({
        projectId: import.meta.env.VITE_APP_PROJECT_ID,
        chains: [1],
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
        _that.showSend = false;
        _that.connectType = 0;
      });

      //  Enable session (triggers QR Code modal)
      await this.connectProvider
        .enable()
        .then(async (accounts) => {
          const web3 = new Web3(this.connectProvider);
          //如果用户同意了登录请求，你就可以拿到用户的账号
          web3.eth.defaultAccount = accounts[0];
          window.web3 = web3;
          _that.web3 = web3;
          _that.walletAddr = accounts[0];
          // 绑定钱包
          // _that.bindWallet();
          _that.showSend = true;
        })
        .catch((reason) => {
          this.connectType = 0;
          //如果用户拒绝了登录请求
          if (reason === "User rejected provider access") {
            // 用户拒绝登录后执行语句；
          } else {
            // 本不该执行到这里，但是真到这里了，说明发生了意外
            ElMessage.error(this.$t("airdrop.failedTips"));
          }
        });
    },
    // 绑定钱包
    async bindWallet() {
      const _that = this;
      let web3 = window.web3;
      this.currentChainId = await web3.eth.getChainId();
      if (this.currentChainId != 1) {
        ElMessage.error(this.$t("airdrop.chainErr"));
        this.connectType = 0;
        return;
      }
      getKey().then(async (res) => {
        if (res.data) {
          let signature = null;
          this.generateKey = res.data;

          // Let's assume we're signing an email message
          const message = {
            Description:
              "Welcom to Bitzing! This request will not trigger a blockchain transaction or cost any gas fees.",
            Contents: this.generateKey,
          };

          // Our domain will include details about our app
          const domain = {
            name: "Ether Mail",
            version: "1",
            chainId: 1,
          };

          // Here we define the different types our message uses
          const types = {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
            ],
            Mail: [
              { name: "Description", type: "string" },
              { name: "Contents", type: "string" },
            ],
          };

          const msgParams = JSON.stringify({
            domain: domain,
            primaryType: "Mail",
            message: message,
            types: types,
          });

          if (this.connectType == 1) {
            console.log(web3.eth, "web3=== ");
            signature = await window.ethereum
              .request({
                method: "eth_signTypedData_v4",
                params: [_that.walletAddr, msgParams],
                from: _that.walletAddr,
              })
              .catch((error) => {
                console.error(error.message);
                this.connectType = 0;
                return;
              });
          } else {
            console.log(web3.eth, "web3=== ");
            signature = await this.connectProvider
              .request({
                method: "eth_signTypedData_v4",
                params: [_that.walletAddr, msgParams],
                from: _that.walletAddr,
              })
              .catch((error) => {
                console.error(error.message);
                this.connectType = 0;
                return;
              });
          }

          if (!signature) return;

          this.connectType = 0;
          const bindRes = await linkWallet({
            key: res.data, //登录临时key
            signature: signature, //钱包签名
            chainId: 1, //链ID
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
        ElMessage.error(this.$t("airdrop.enterTips"));
        return;
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
          return;
        }

        this.isConnect = true;
        this.airdropData = res.data;
      }
    },
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: "ETH",
      });

      if (res && res.code == 200) {
        this.setting = res.data;
        this.$forceUpdate();
      }
    },
    async handleClose(done) {
      if (this.connectProvider) {
        this.connectProvider.disconnect();
      }

      this.closeDialogFun();

      if (done) {
        done();
        return;
      }

      this.showSucceess = false;
      this.showSend = false;
    },
  },
  mounted() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;

    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "./components/index.scss";
</style>
