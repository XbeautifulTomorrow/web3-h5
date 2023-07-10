<template>
  <div class="header">
    <div class="header-main">
      <div class="header-left">
        <img class="header-logo" src="@/assets/img/headerFooter/logo.png" alt="logo" @click="goTo()" />
        <ul class="header-nav">
          <li :class="['header-nav-text', active == item.text && 'active']" v-for="(item, index) in nav"
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
          <img class="header-wallet-img" src="@/assets/img/headerFooter/eth_icon.png" alt="" />
          <span class="header-wallet-money">{{ ethBalance }}</span>
          <span class="header-wallet-add" @click="dialogVisible = true">+</span>
        </div>
        <div class="header-user" v-if="isLogin && userInfo?.id">
          <img class="header-user-img" src="@/assets/svg/user/default_avatar.svg" alt="" />
          <span class="header-user-text text-ellipsis">
            {{ userInfo?.userName || userInfo?.email }}
          </span>
          <img class="header-user-down" src="@/assets/img/headerFooter/icon-arrowup.png" alt="" />
          <div class="header-user-popup">
            <ul class="header-user-content">
              <li :class="['header-user-list']" v-for="(item, index) in userList" :key="`box-${index}`"
                @click="othersideBoxFun(item)">
                <span :class="['header-user-list-img', item.page]"></span>
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
  </div>
</template>

<script>
import { i18n } from '@/locales';
const { t } = i18n.global;
import { mapStores } from "pinia";
import { ElMessage } from "element-plus";

import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { getTheUserBalance } from "@/services/api/user";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import { openUrl } from "@/utils";

export default {
  name: "HeaderCom",
  components: {
    Login,
    Register,
    Forgot,
    Modify
  },
  data() {
    return {
      active: "",
      dialogVisible: false,
      conncectAddress: null,
      amountVal: [1],
      orderVal: "",
      tokenChoose: "1",
      web3: null,
      showConnect: false,
      pageType: "",
      nav: [],
      userList: [],
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
    };
  },
  mounted() {
    // this.connect();
  },
  created() {
    this.active = this.$route.name;
    if (this.isLogin && this.userInfo?.id) {
      this.getTheUserBalanceInfo();
    }

    this.nav = [
      {
        text: t("header.home"),
        page: "Home",
      },
      {
        text: t("header.airdrop"),
        page: "Airdrop",
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
        text: t("header.whitebook"),
        page: "Whitebook",
      },
      {
        text: t("header.faq"),
        page: "FAQ",
      },
    ]

    this.userList = [
      {
        text: "Profile",
        page: "Profile",
      },
      {
        text: "Wallet",
        page: "Wallet",
      },
      // {
      //   text: "Wallet Log",
      //   page: "walletLog",
      // },
      {
        text: "Competitions",
        page: "Competitions",
      },
      // {
      //   text: "My Collections",
      //   page: "myCollections",
      // },
      // {
      //   text: "Create",
      //   page: "create",
      // },
      {
        text: "Referral",
        page: "Referral",
      },
      {
        text: "Settings",
        page: "Settings",
      },
      {
        text: t("header.logout"),
        page: "Logout",
      },
    ]
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
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin
    },
    regInfo() {
      const { regInfo } = this.userStore;
      return regInfo;
    },
  },
  methods: {
    closeDialogFun() {
      this.pageType = "";
      if (this.userInfo) {
        this.getTheUserBalanceInfo();
      } else if (this.regInfo) {
        console.log(this.regInfo);
      }
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    async getTheUserBalanceInfo() {
      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
      let res = await getTheUserBalance();
      this.ethBalance = res.data[0].balance;
    },
    goTo(page = "home") {
      if (page === "Whitebook") {
        openUrl("https://bitzing.gitbook.io/bitzing-whitepaper/the-nft-market-landscape/what-are-nfts");
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
      if (item.page == "Profile") {
        this.$router.push({ name: "MyProfile" });
      } else if (item.page == "Wallet") {
        this.$router.push({ name: "Wallet" });
      } else if (item.page == "Competitions") {
        this.$router.push({ name: "Competitions", query: { type: "ENTERED" } });
      } else if (item.page == "My Collections") {
        this.$router.push({
          name: "Competitions",
          query: { type: "MY_COMPETITIONS" },
        });
      } else if (item.page == "Referral") {
        this.$router.push({ name: "Invite" });
      } else if (item.page == "Settings") {
        this.$router.push({ name: "Setting" });
      } else if (item.page === "Logout") {
        this.userStore.logoutApi();
      }
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
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
