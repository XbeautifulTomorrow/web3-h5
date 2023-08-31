<template>
  <div class="header">
    <div class="header-main">
      <div class="header-left">
        <div class="header-logo">
          <img class="menu_btn" src="@/assets/svg/home/icon_menu.svg" alt="logo" />
          <img src="@/assets/img/headerFooter/logo.png" @click="goTo()" alt="logo" />
        </div>
        <ul class="header-nav">
          <li :class="['header-nav-text', active == item.page && 'active']" v-for="(item, index) in nav"
            :key="`nav-${index}`" @click="goTo(item.page)">
            {{ item.text }}
          </li>
        </ul>
      </div>
      <div class="header-right" v-if="!isLogin || !userInfo?.id">
        <div class="btn-box login" @click="changeTypeFun('login')">{{ $t("common.login") }}</div>
        <div class="btn-box register" @click="changeTypeFun('register')">
          {{ $t("common.register") }}
        </div>
      </div>
      <div v-if="(isLogin && userInfo?.id) || conncectAddress" class="header-login">
        <div class="header-wallet">
          <div class="balance">
            <img class="header-wallet-img" src="@/assets/svg/user/icon_profile.svg" alt="" />
            <span class="header-wallet-money">{{ Number(userPoints).toLocaleString() }}</span>
          </div>
        </div>
        <div class="header-wallet">
          <div class="balance">
            <img class="header-wallet-img" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            <span class="header-wallet-money">
              {{ Number(accurateDecimal(ethBalance, 4)).toLocaleString(undefined, {
                minimumFractionDigits: 4
              })
              }}</span>
          </div>
          <span class="header-wallet-add" @click="pageType = 'recharge'">
            <el-icon>
              <Plus />
            </el-icon>
          </span>
        </div>
        <div class="header-user" v-if="isLogin && userInfo?.id">
          <div class="user_info">
            <img class="header-user-img" src="@/assets/svg/user/default_avatar.svg" alt="" />
            <div class="new_dot header_dot" v-if="newStatus.oneNftStatus || newStatus.walletNftSystemStatus"></div>
            <span class="header-user-text text-ellipsis">
              {{ userInfo?.userName || userInfo?.email }}
            </span>
          </div>
          <img class="header-user-down" src="@/assets/img/headerFooter/icon-arrowup.png" alt="" />
          <div class="header-user-popup">
            <ul class="header-user-content">
              <li :class="['header-user-list']" v-for="(item, index) in userList" :key="`box-${index}`"
                @click="othersideBoxFun(item)">
                <div class="new_dot" v-if="item.showDot"></div>
                <img class="header-user-list-img" :src="item.icon" alt="">
                <span>{{ item.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Register v-if="pageType === 'register'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Modify v-if="pageType === 'modify'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun"></Modify>
    <Recharge v-if="pageType === 'recharge'" @closeDialogFun="closeDialogFun"></Recharge>
    <createVerification v-if="pageType === 'auth'" @closeDialogFun="changeNameFun">
    </createVerification>
  </div>
</template>

<script>
import { i18n } from '@/locales';
const { t } = i18n.global;
import { mapStores } from "pinia";
import { ElMessage } from "element-plus";

import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import Recharge from "@/views/user/recharge.vue";
import createVerification from "@/views/user/createVerification.vue";
import { accurateDecimal, openUrl } from "@/utils";
import emitter from "@/utils/event-bus.js";

export default {
  name: "HeaderCom",
  components: {
    Login,
    Register,
    Forgot,
    Modify,
    Recharge,
    createVerification
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
      timer: null
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
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
      return isLogin
    },
    regInfo() {
      const { regInfo } = this.userStore;
      return regInfo;
    },
    userList() {
      const { walletNftSystemStatus, oneNftStatus } = this.newStatus
      return [
        {
          text: t("header.profile"),
          page: "profile",
          icon: require("@/assets/svg/user/nav/icon_profile.svg"),
          showDota: false
        },
        {
          text: t("header.balances"),
          page: "balances",
          icon: require("@/assets/svg/user/nav/icon_balances.svg"),
          showDota: false
        },
        {
          text: t("header.inventory"),
          page: "inventory",
          icon: require("@/assets/svg/user/nav/icon_inventory.svg"),
          showDot: walletNftSystemStatus
        },
        {
          text: t("header.competition"),
          page: "competition",
          icon: require("@/assets/svg/user/nav/icon_competition.svg"),
          showDot: oneNftStatus
        },
        {
          text: t("header.history"),
          page: "history",
          icon: require("@/assets/svg/user/nav/icon_history.svg"),
          showDota: false
        },
        {
          text: t("header.referrals"),
          page: "referrals",
          icon: require("@/assets/svg/user/nav/icon_referrals.svg"),
          showDota: false
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
          showDota: false
        },
      ]
    }
  },
  methods: {
    accurateDecimal: accurateDecimal,
    closeDialogFun() {
      this.pageType = "";
      if (this.userInfo) {
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
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        if (this.isLogin && this.userInfo?.id) {
          this.getTheUserBalanceInfo();
          this.timer = null;
        }
        this.timeoutBalance();
      }, 30000);
    },
    goTo(page = "home") {
      if (page === "Whitebook") {
        openUrl("https://bitzing.gitbook.io/litepaper/");
        return
      }

      if (page == "Stake" || page == "INO" || page == "MarketPlace") {
        ElMessage({
          message: t("common.tipsText"),
          type: "warning",
        });
        return
      }
      this.$router.push({ path: `/${page}` });
    },
    othersideBoxFun(item) {
      if (item.page === "logout") {
        this.userStore.logoutApi();
        this.reload();
        return;
      }

      this.userStore.setUserPage(this.$route.path, item.page);
    },
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: function (newV) {
        this.active = newV.name;
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    emitter.on("pageTypeChange", (type) => {
      this.pageType = type;
    });
    this.active = this.$route.name;

    if (this.isLogin && this.userInfo?.id) {
      this.getTheUserBalanceInfo();
    }

    this.timeoutBalance();

    this.nav = [
      {
        text: t("header.home"),
        page: "Home",
      },
      // {
      //   text: t("header.airdrop"),
      //   page: "Airdrop",
      // },
      {
        text: t("header.mysteryBox"),
        page: "RaffleBoxesList",
      },
      {
        text: t("header.competitions"),
        page: "TreasureDraw",
      },
      {
        text: t("header.whitebook"),
        page: "Whitebook",
      },
      {
        text: t("header.faq"),
        page: "FAQ",
      },
    ]
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
