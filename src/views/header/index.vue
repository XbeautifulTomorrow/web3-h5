<template>
  <div class="header">
    <div class="header-main">
      <div class="header-left">
        <div class="header-logo">
          <img
            class="menu_btn"
            src="@/assets/svg/home/icon_menu.svg"
            @click="showNav = true"
          />
          <img
            src="@/assets/img/headerFooter/logo.png"
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
              src="@/assets/svg/user/icon_profile.svg"
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
                  },
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
              v-if="newStatus.oneNftStatus || newStatus.walletNftSystemStatus"
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
                    newStatus.oneNftStatus || newStatus.walletNftSystemStatus
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
import { ElMessage } from "element-plus";

import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import Recharge from "@/views/user/recharge.vue";
import createVerification from "@/views/user/createVerification.vue";
import { accurateDecimal, openUrl, handleWindowResize } from "@/utils";
import emitter from "@/utils/event-bus.js";

import icon_promotions from "@/assets/img/user/icon_Promotions.gif";

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

      userNav: {},
    };
  },
  computed: {
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
      const userStore = useUserStore();
      return userStore.userInfo;
    },
    userPage() {
      const userStore = useUserStore();
      return userStore.userPage || "profile";
    },
    isLogin() {
      const userStore = useUserStore();
      return userStore.isLogin;
    },
    regInfo() {
      const userStore = useUserStore();
      return userStore.regInfo;
    },
    userList() {
      const { walletNftSystemStatus, oneNftStatus } = this.newStatus;
      const { userNav } = this;

      return [
        {
          text: this.$t("header.profile"),
          page: "profile",
          icon: userNav.icon_profile,
          showDota: false,
        },
        {
          text: this.$t("header.balances"),
          page: "balances",
          icon: userNav.icon_balances,
          showDota: false,
        },
        {
          text: this.$t("header.inventory"),
          page: "inventory",
          icon: userNav.icon_inventory,
          showDot: walletNftSystemStatus,
        },
        {
          text: this.$t("header.promotions"),
          page: "promotions",
          icon: icon_promotions,
          showDot: false,
          className: "promotions_nav",
        },
        {
          text: this.$t("header.competition"),
          page: "competition",
          icon: userNav.icon_competition,
          showDot: oneNftStatus,
        },
        {
          text: this.$t("header.history"),
          page: "history",
          icon: userNav.icon_history,
          showDota: false,
        },
        {
          text: this.$t("header.referrals"),
          page: "referrals",
          icon: userNav.icon_referrals,
          showDota: false,
        },
        // {
        //   text: this.$t("header.settings"),
        //   page: "settings",
        //   icon: userNav.icon_setting,
        // },
        {
          text: this.$t("header.logout"),
          page: "logout",
          icon: userNav.icon_logout,
          showDota: false,
        },
      ];
    },
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
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        if (this.isLogin && this.userInfo?.id) {
          this.getTheUserBalanceInfo();
        }
        this.timeoutBalance();
      }, 30000);
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
      const userStore = useUserStore();
      if (item.page === "logout") {
        userStore.logoutApi();
        this.reload();
        return;
      }

      userStore.setUserPage(this.$route.path, item.page);
    },
    openUser() {
      if (this.screenWidth <= 950) {
        this.showUser = true;
      }
    },
    async getUserNav() {
      const userIcon = import.meta.glob("@/assets/svg/user/nav/*.svg", {
        eager: true,
      });

      for (const key in userIcon) {
        let name = key.split("/").slice(-1)[0].split(".")[0];
        const flie = await userIcon[key]();
        this.userNav[name] = flie.default;
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
      deep: true,
    },
  },
  async created() {
    emitter.on("pageTypeChange", (type) => {
      this.pageType = type;
    });
    this.active = this.$route.name;

    if (this.isLogin && this.userInfo?.id) {
      this.getTheUserBalanceInfo();
    }

    this.timeoutBalance();
    const homeIcon = import.meta.glob("@/assets/svg/home/mini/*.svg", {
      eager: true,
    });

    const homeNav = {};
    for (const key in homeIcon) {
      let name = key.split("/").slice(-1)[0].split(".")[0];
      const flie = await homeIcon[key]();
      homeNav[name] = flie.default;
    }

    this.nav = [
      {
        text: t("header.home"),
        page: "Home",
        icon: homeNav.icon_home,
      },
      // {
      //   text: t("header.airdrop"),
      //   page: "Airdrop",
      //   icon: homeNav.icon_aridrop,
      // },
      {
        text: t("header.mysteryBox"),
        page: "RaffleBoxesList",
        icon: homeNav.icon_boxs,
      },
      {
        text: t("header.competitions"),
        page: "TreasureDraw",
        icon: homeNav.icon_treasure_draw,
      },
      {
        text: t("header.tokenWar"),
        page: "TokenWar",
        icon: homeNav.icon_token_war,
      },
      {
        text: t("header.whitebook"),
        page: "Whitebook",
        icon: homeNav.icon_white_book,
      },
      {
        text: t("header.faq"),
        page: "FAQ",
        icon: homeNav.icon_faq,
      },
    ];

    this.getUserNav();
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
@import "./index.scss";
</style>
