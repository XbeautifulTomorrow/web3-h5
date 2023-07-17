<template>
  <div class="wrapper_bg">
    <div class="index_wrapper">
      <div class="nav_box">
        <div :class="['nav_item', pageType == item.page && 'active']" @click="chooseNav(item)"
          v-for="(item, index) in navList" :key="index">
          <img class="default" :src="item.icon" alt="">
          <img class="active" :src="item.iconActive" alt="">
          <span>{{ item.text }}</span>
        </div>
      </div>
      <Setting v-if="pageType == 'profile'"></Setting>
    </div>
  </div>
</template>
<script>
import { i18n } from '@/locales';
const { t } = i18n.global;
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import Setting from "./setting.vue";
export default {
  name: "myIndex",
  components: {
    Setting
  },
  data() {
    return {
      pageType: "",
      navList: []
    };
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
  created() {
    this.navList = [
      {
        text: "Profile",
        page: "profile",
        icon: require("@/assets/svg/user/nav/icon_profile.svg"),
        iconActive: require("@/assets/svg/user/nav/icon_profile_active.svg")
      },
      {
        text: "Balances",
        page: "balances",
        icon: require("@/assets/svg/user/nav/icon_balances.svg"),
        iconActive: require("@/assets/svg/user/nav/icon_balances_active.svg")
      },
      {
        text: "Inventory",
        page: "inventory",
        icon: require("@/assets/svg/user/nav/icon_inventory.svg"),
        iconActive: require("@/assets/svg/user/nav/icon_inventory_active.svg")
      },
      {
        text: "Competition",
        page: "competition",
        icon: require("@/assets/svg/user/nav/icon_competition.svg"),
        iconActive: require("@/assets/svg/user/nav/icon_competition_active.svg")
      },
      {
        text: "Purchase History",
        page: "history",
        icon: require("@/assets/svg/user/nav/icon_history.svg"),
        iconActive: require("@/assets/svg/user/nav/icon_history_active.svg")
      },
      {
        text: "Referrals",
        page: "referrals",
        icon: require("@/assets/svg/user/nav/icon_referrals.svg"),
        iconActive: require("@/assets/svg/user/nav/icon_referrals_active.svg")
      },
      {
        text: "Settings",
        page: "settings",
        icon: require("@/assets/svg/user/nav/icon_setting.svg"),
        iconActive: require("@/assets/svg/user/nav/icon_setting_active.svg")
      },
      {
        text: t("header.logout"),
        page: "logout",
        icon: require("@/assets/svg/user/nav/icon_logout.svg"),
        iconActive: require("@/assets/svg/user/nav/icon_logout_active.svg")
      },
    ]


    // 获取类型
    const { type } = this.$route.query;
    this.pageType = type || "profile";
  },
  methods: {
    chooseNav(evnet) {
      this.pageType = evnet.page
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
  