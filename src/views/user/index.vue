<template>
  <div class="wrapper_bg">
    <div class="index_wrapper">
      <div class="nav_box">
        <div :class="['nav_item', userPage == item.page && 'active',item.className]" @click="chooseNav(item)"
          v-for="(item, index) in navList" :key="index">
          <div class="new_dot" v-if="item.showDot"></div>
          <img class="default" :src="item.icon" alt="">
          <img class="active" :src="item.iconActive" alt="">
          <span>{{ item.text }}</span>
        </div>
      </div>
      <div class="page_box">
        <Setting v-if="userPage == 'profile'"></Setting>
        <Wallet v-if="userPage == 'balances'"></Wallet>
        <Inventory v-if="userPage == 'inventory'"></Inventory>
        <Promotions v-if="userPage == 'promotions'"></Promotions>
        <Competitions v-if="userPage == 'competition'"></Competitions>
        <History v-if="userPage == 'history'"></History>
        <Referrals v-if="userPage == 'referrals'"></Referrals>
      </div>
    </div>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";

import { i18n } from '@/locales';
const { t } = i18n.global;
import Setting from "./setting.vue";
import Wallet from "./wallet.vue";
import Inventory from "./inventory.vue";
import Competitions from "./competitions.vue";
import History from "./history.vue";
import Referrals from "./invite.vue";
import Promotions from "./promotions.vue";
export default {
  name: "myIndex",
  components: {
    Setting,
    Wallet,
    Inventory,
    Competitions,
    History,
    Referrals,
    Promotions
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
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
    navList() {
      const { walletNftSystemStatus, oneNftStatus } = this.newStatus
      return [
        {
          text: t("header.profile"),
          page: "profile",
          icon: require("@/assets/svg/user/nav/icon_profile.svg"),
          iconActive: require("@/assets/svg/user/nav/icon_profile_active.svg"),
          showDot: false
        },
        {
          text: t("header.balances"),
          page: "balances",
          icon: require("@/assets/svg/user/nav/icon_balances.svg"),
          iconActive: require("@/assets/svg/user/nav/icon_balances_active.svg"),
          showDot: false
        },
        {
          text: t("header.inventory"),
          page: "inventory",
          icon: require("@/assets/svg/user/nav/icon_inventory.svg"),
          iconActive: require("@/assets/svg/user/nav/icon_inventory_active.svg"),
          showDot: walletNftSystemStatus
        },
        {
          text: t("header.promotions"),
          page: "promotions",
          icon: require("@/assets/img/user/icon_Promotions.gif"),
          iconActive: require("@/assets/img/user/icon_Promotions.gif"),
          showDot: false,
          className: "promotions_nav",
        },
        {
          text: t("header.competition"),
          page: "competition",
          icon: require("@/assets/svg/user/nav/icon_competition.svg"),
          iconActive: require("@/assets/svg/user/nav/icon_competition_active.svg"),
          showDot: oneNftStatus
        },
        {
          text: t("header.history"),
          page: "history",
          icon: require("@/assets/svg/user/nav/icon_history.svg"),
          iconActive: require("@/assets/svg/user/nav/icon_history_active.svg"),
          showDot: false
        },
        {
          text: t("header.referrals"),
          page: "referrals",
          icon: require("@/assets/svg/user/nav/icon_referrals.svg"),
          iconActive: require("@/assets/svg/user/nav/icon_referrals_active.svg"),
          showDot: false
        },
        // {
        //   text: "Settings",
        //   page: "settings",
        //   icon: require("@/assets/svg/user/nav/icon_setting.svg"),
        //   iconActive: require("@/assets/svg/user/nav/icon_setting_active.svg")
        // }
      ]
    }
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      // 获取类型
      const { id } = this.$route.params;
      this.userStore.setUserPage(this.$route.path, id);
    }
  },
  methods: {
    chooseNav(evnet) {
      this.userStore.setUserPage(this.$route.path, evnet.page);
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
<style lang="scss">
.tips_box {
  max-width: 90%;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.3125rem;
  background-color: #2c115b !important;
  box-sizing: border-box;

  .tips_title {
    font-family: 'Medium';
    font-size: 0.75rem;
    line-height: 1.3;
    text-align: left;
    color: #a9a4b4;
  }

  .tips_text {
    font-family: 'Medium';
    font-size: 0.75rem;
    line-height: 1.3;
    text-align: left;
    color: white;
    word-break: break-all;
  }

  .el-popper__arrow::before {
    background-color: #2c115b !important;
  }
}
</style>