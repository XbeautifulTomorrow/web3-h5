<template>
  <div class="header">
    <div class="header-main" v-if="isShowNav">
      <div class="header-left">
        <div class="header-logo">
          <img
            class="menu_btn"
            src="@/assets/svg/home/icon_menu.svg"
            @click="showNav = true"
          />
          <img
            src="@/assets/img/headerFooter/logo.svg"
            @click="goTo()"
            alt="logo"
          />
        </div>
        <ul class="header-nav">
          <li
            :class="['header-nav-text', active == item.page && 'active']"
            v-for="(item, index) in nav"
            :key="`nav-${index}`"
            @click="goTo(item.page)"
          >
            {{ item.text }}
          </li>
        </ul>
        <el-drawer
          v-model="showNav"
          direction="ltr"
          lock-scroll
          class="menu_drawer"
          :with-header="false"
        >
          <ul class="menu-list">
            <li
              :class="['menu-list-text', active == item.page && 'active']"
              v-for="(item, index) in nav"
              :key="`nav-${index}`"
              @click="goTo(item.page)"
            >
              <img :src="item.icon" alt="" />
              <span>{{ item.text }}</span>
            </li>
          </ul>
        </el-drawer>
      </div>
      <div class="header-right" v-if="!isLogin || !userInfo?.id">
        <div class="btn-box login" @click="changeTypeFun('login')">
          {{ $t("common.login") }}
        </div>
        <div class="btn-box register" @click="changeTypeFun('register')">
          {{ $t("common.register") }}
        </div>
      </div>
      <div
        v-if="(isLogin && userInfo?.id) || conncectAddress"
        class="header-login"
      >
        <div class="header-wallet">
          <div class="balance">
            <img
              class="header-wallet-img"
              src="@/assets/svg/user/icon_point.svg"
              alt=""
            />
            <span class="header-wallet-money">
              {{ Number(userPoints).toLocaleString() }}
            </span>
          </div>
        </div>
        <div class="header-wallet">
          <div class="balance">
            <img
              class="header-wallet-img"
              src="@/assets/svg/user/icon_usdt_gold.svg"
              alt=""
            />
            <span class="header-wallet-money">
              {{
                Number(accurateDecimal(usdBalance, 2)).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                  }
                )
              }}
            </span>
          </div>
          <span class="header-wallet-add" @click="pageType = 'recharge'">
            <el-icon>
              <Plus />
            </el-icon>
          </span>
        </div>
        <div
          class="header-user"
          @click="openUser()"
          v-if="isLogin && userInfo?.id"
        >
          <div class="user_info">
            <img
              class="header-user-img"
              src="@/assets/svg/user/default_avatar.svg"
              alt=""
            />
            <div
              class="new_dot header_dot"
              v-if="
                newStatus.oneNftStatus ||
                newStatus.walletNftSystemStatus ||
                newStatus.welcomeBounsStatus ||
                newStatus.welcomeBounsReceiveStatus
              "
            ></div>
            <span class="header-user-text text-ellipsis">
              {{ userInfo?.userName || userInfo?.email }}
            </span>
          </div>
          <img
            class="header-user-down"
            src="@/assets/img/headerFooter/icon-arrowup.png"
            alt=""
          />
          <div class="header-user-popup">
            <ul class="header-user-content">
              <li
                :class="['header-user-list', item.className]"
                v-for="(item, index) in userList"
                :key="`box-${index}`"
                @click="othersideBoxFun(item)"
              >
                <div class="new_dot" v-if="item.showDot"></div>
                <img class="header-user-list-img" :src="item.icon" alt="" />
                <span>{{ item.text }}</span>
              </li>
            </ul>
          </div>
          <el-drawer
            v-model="showUser"
            direction="rtl"
            lock-scroll
            class="menu_drawer"
            :with-header="false"
          >
            <ul class="menu-list">
              <div class="user_info">
                <img
                  class="header-user-img"
                  src="@/assets/svg/user/default_avatar.svg"
                  alt=""
                />
                <div
                  class="new_dot header_dot"
                  v-if="
                    newStatus.oneNftStatus ||
                    newStatus.walletNftSystemStatus ||
                    newStatus.welcomeBounsStatus ||
                    newStatus.welcomeBounsReceiveStatus
                  "
                ></div>
                <span class="header-user-text text-ellipsis">
                  {{ userInfo?.userName || userInfo?.email }}
                </span>
              </div>
              <li
                :class="['menu-list-text']"
                v-for="(item, index) in userList"
                :key="`box-${index}`"
                @click="othersideBoxFun(item)"
              >
                <div class="new_dot" v-if="item.showDot"></div>
                <img class="header-user-list-img" :src="item.icon" alt="" />
                <span>{{ item.text }}</span>
              </li>
            </ul>
          </el-drawer>
        </div>
      </div>
    </div>
    <div class="header-main" v-else>
      <div class="header-left">
        <div class="header-logo">
          <img src="@/assets/img/headerFooter/logo.svg" alt="logo" />
        </div>
      </div>
    </div>
    <Login
      v-if="pageType === 'login'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Register
      v-if="pageType === 'register'"
      :isAuth="registerIsAuth"
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
      @onModify="closeDialogFun"
      @closeDialogFun="closeDialogFun"
    ></Modify>
    <Recharge
      v-if="pageType === 'recharge'"
      @closeDialogFun="closeDialogFun"
    ></Recharge>
    <createVerification
      v-if="pageType === 'auth'"
      @closeDialogFun="changeNameFun"
    >
    </createVerification>
  </div>
</template>

<script>
import { i18n } from "@/locales";
const { t } = i18n.global;
import { mapStores } from "pinia";
import { ElMessage } from "element-plus";
import googleOneTap from "google-one-tap";

import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { authGoogleLogin } from "@/services/api/user";
import { getSetting } from "@/services/api/invite";
import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import Recharge from "@/views/user/recharge.vue";
import createVerification from "@/views/user/createVerification.vue";
import {
  accurateDecimal,
  openUrl,
  handleWindowResize,
  encryptCBC,
  getUrlParams,
  parseURLParams,
  delCookie
} from "@/utils";
import emitter from "@/utils/event-bus.js";

export default {
  name: "HeaderCom",
  components: {
    Login,
    Register,
    Forgot,
    Modify,
    Recharge,
    createVerification,
  },
  inject: ["reload"],
  data() {
    return {
      active: "",
      conncectAddress: null,
      amountVal: [1],
      orderVal: "",
      tokenChoose: "1",
      web3: null,
      showConnect: false,
      pageType: "",
      nav: [],
      NFTID: {
        tokenid: "",
        amount: 1,
      },
      transferNFTAddress: [""],
      transferNFTID: [[{ tokenid: "", amount: 1 }]],
      transferAmounts: [],
      usdtAddress: "0x6712957c6b71d6dc7432ca7ebb16a4dbca76e535",
      nftTokenAddress: "0x74dA78c4A6cEf9809FeaC2Cd557778b848EDC931", //nft充值
      receiver: "0x7ef9873d3D85724A59aC2C56c1C7Ae0d1D27dACB", //收款地址
      transferAddress: "0x927e481e98e01bef13d1486be2fcc23a00761524",
      // lottContractAddress: "0xfe05ed99354bef7d5f7e47a60ba06ef2a04a66c1", //抽奖合约 bsc
      lottContractAddress: "0x4bc6a8b7b471493c4f99d36a2d123d0aa60df59d", //抽奖合约
      timer: null,
      showNav: false,
      showUser: false,
      screenWidth: null,
      isRecursive: true,
      isShowNav: true,
      hideNavPage: ["Lootboxes"],
      registerIsAuth: false,
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    usdBalance() {
      const headerStore = useHeaderStore();
      return headerStore.usdBalance;
    },
    userPoints() {
      const headerStore = useHeaderStore();
      return headerStore.points;
    },
    newStatus() {
      const headerStore = useHeaderStore();
      return headerStore.newStatus;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    userPage() {
      const { userPage } = this.userStore;
      return userPage || "profile";
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
    regInfo() {
      const { regInfo } = this.userStore;
      return regInfo;
    },
    setting() {
      const headerStore = useHeaderStore();
      return headerStore.setting;
    },
    userList() {
      const {
        walletNftSystemStatus,
        oneNftStatus,
        welcomeBounsStatus,
        welcomeBounsReceiveStatus,
      } = this.newStatus;
      return [
        {
          text: t("header.profile"),
          page: "profile",
          icon: require("@/assets/svg/user/nav/icon_profile.svg"),
          showDota: false,
        },
        {
          text: t("header.balances"),
          page: "balances",
          icon: require("@/assets/svg/user/nav/icon_balances.svg"),
          showDota: false,
        },
        {
          text: t("header.inventory"),
          page: "inventory",
          icon: require("@/assets/svg/user/nav/icon_inventory.svg"),
          showDot: walletNftSystemStatus,
        },
        {
          text: t("header.promotions"),
          page: "promotions",
          icon: require("@/assets/img/user/icon_Promotions.gif"),
          showDot: welcomeBounsStatus || welcomeBounsReceiveStatus,
          className: "promotions_nav",
        },
        {
          text: t("header.competition"),
          page: "competition",
          icon: require("@/assets/svg/user/nav/icon_competition.svg"),
          showDot: oneNftStatus,
        },
        {
          text: t("header.history"),
          page: "history",
          icon: require("@/assets/svg/user/nav/icon_history.svg"),
          showDota: false,
        },
        {
          text: t("header.referrals"),
          page: "referrals",
          icon: require("@/assets/svg/user/nav/icon_referrals.svg"),
          showDota: false,
        },
        // {
        //   text: t("header.settings"),
        //   page: "settings",
        //   icon: require("@/assets/svg/user/nav/icon_setting.svg"),
        // },
        {
          text: t("header.logout"),
          page: "logout",
          icon: require("@/assets/svg/user/nav/icon_logout.svg"),
          showDota: false,
        },
      ];
    },
  },
  methods: {
    accurateDecimal: accurateDecimal,
    hideNavFunc() {
      if (this.hideNavPage.includes(this.$route.name)) {
        this.isShowNav = false;
      }
    },
    closeDialogFun() {
      this.pageType = "";
      if (this.userInfo) {
        if (!this.isShowNav) {
          window.location.href = this.setting?.jumpAddress || "/home";
        }
        this.getTheUserBalanceInfo();
      } else if (this.regInfo) {
        console.log(this.regInfo);
      }
    },
    changeNameFun() {
      this.pageType = "modify";
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    async getTheUserBalanceInfo() {
      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
      headerStore.fetchTheUserPoint();
      headerStore.fetchGlobalNew();
    },
    timeoutBalance() {
      if (this.isRecursive) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          if (this.isLogin && this.userInfo?.id) {
            this.getTheUserBalanceInfo();
          }
          this.timeoutBalance();
        }, 30000);
      }
    },
    goTo(page = "home") {
      this.showNav = false;
      if (page === "Whitebook") {
        openUrl("https://bitzing.gitbook.io/litepaper/");
        return;
      }

      if (page == "Stake" || page == "INO" || page == "MarketPlace") {
        ElMessage({
          message: t("common.tipsText"),
          type: "warning",
        });
        return;
      }
      this.$router.push({ path: `/${page}` });
    },
    othersideBoxFun(item) {
      this.showUser = false;
      if (item.page === "logout") {
        this.userStore.logoutApi();
        this.reload();
        return;
      }

      this.userStore.setUserPage(this.$route.path, item.page);
    },
    openUser() {
      if (this.screenWidth <= 950) {
        this.showUser = true;
      }
    },
    watchVisibilitychange() {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          // 当浏览器窗口重新获得焦点时
          this.isRecursive = true;
          if (this.isLogin && this.userInfo?.id) {
            this.getTheUserBalanceInfo();
          }
          this.timeoutBalance();
        } else {
          // 当浏览器窗口失去焦点时
          this.isRecursive = false;
        }
      });
    },
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: "USDT",
      });
      if (res && res.code == 200) {
        const setting = res.data;
        if (localStorage.getItem("boxBounsKey")) {
          const queryParams = parseURLParams(setting?.jumpAddress);
          this.$router.push({
            path: setting?.jumpAddress || "/home",
            query: queryParams,
          });
        } else {
          this.$router.push({ path: "/home" });
        }
        localStorage.removeItem("boxBounsKey");
      }
    },
    // google登录
    async googleLogin(credentialData) {
      var googleLoginCode = null;
      var credential = null;
      if(!credentialData) {
        googleLoginCode = getUrlParams("googleLoginCode");
        if (!googleLoginCode) return;
      } else {
        credential = credentialData
      }
      // 如果langdingPage入金
      const boxBounsKey = localStorage.getItem("boxBounsKey") || null;
      const res = await authGoogleLogin({ code: googleLoginCode, credential, boxBounsKey });
      if (res && res.code === 200) {
        if (res.data.certificate) {
          localStorage.setItem("certificate", encryptCBC(res.data.certificate));
        }
        this.fetchSetting();
        if (res.data.firstStatus == "TRUE") {
          this.registerIsAuth = true;
          setTimeout(() => {
            this.pageType = "register";
          }, 500);
        }
        this.userStore.setLogin(res.data);
        this.getTheUserBalanceInfo();
        try {
          // eslint-disable-next-line no-undef
          dataLayer.push({
            event: "app_start",
            ecommerce: "ok",
          });
        } catch (err) {
          console.log(err);
        }
      }
    },
    async googleoneTapLogin(){
      console.log(process.env.VUE_APP_GOOGLE_CLIENT_ID,'tap')
      const options = {
        client_id:process.env.VUE_APP_GOOGLE_CLIENT_ID,
        auto_select:false,
        cancel_on_tap_outside:false,
        context:'signin'
      }
      googleOneTap(options,async(res)=>{
       this.googleLogin(res.credential)
      })
    }
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: function (newV) {
        this.active = newV.name;
      },
      // 深度观察监听
      deep: true,
    },
  },
  created() {
    this.hideNavFunc();
    this.googleLogin();

    emitter.on("pageTypeChange", (type) => {
      this.pageType = type;
    });
    this.active = this.$route.name;
    console.log(this.$route.name)
    console.log(!this.hideNavPage.includes(this.$route.name))
    console.log(window.location.protocol)
    console.log(window.location.protocol === 'https:')
    console.log((!this.hideNavPage.includes(this.$route.name)&&window.location.protocol === 'https:'))
    if (this.isLogin && this.userInfo?.id) {
      this.getTheUserBalanceInfo();
    } else if(!this.hideNavPage.includes(this.$route.name)&&window.location.protocol === 'https:') {
      delCookie('g_state')
      this.googleoneTapLogin();
    }
    this.timeoutBalance();

    this.nav = [
      {
        text: t("header.home"),
        page: "Home",
        icon: require("@/assets/svg/home/mini/icon_home.svg"),
      },
      // {
      //   text: t("header.airdrop"),
      //   page: "Airdrop",
      //   icon: require("@/assets/svg/home/mini/icon_aridrop.svg"),
      // },
      {
        text: t("header.mysteryBox"),
        page: "RaffleBoxesList",
        icon: require("@/assets/svg/home/mini/icon_boxs.svg"),
      },
      {
        text: t("header.competitions"),
        page: "TreasureDraw",
        icon: require("@/assets/svg/home/mini/icon_treasure_draw.svg"),
      },
      {
        text: t("header.tokenWar"),
        page: "TokenWar",
        icon: require("@/assets/svg/home/mini/icon_token_war.svg"),
      },
      {
        text: t("header.whitebook"),
        page: "Whitebook",
        icon: require("@/assets/svg/home/mini/icon_white_book.svg"),
      },
      {
        text: t("header.faq"),
        page: "FAQ",
        icon: require("@/assets/svg/home/mini/icon_faq.svg"),
      },
    ];
  },
  mounted() {
    this.watchVisibilitychange();
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
@import "./index.scss";
</style>
