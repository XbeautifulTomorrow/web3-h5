<template>
  <div class="wrapper_bg">
    <div class="index_wrapper">
      <div class="nav_box">
        <div
          :class="[
            'nav_item',
            userPage == item.page && 'active',
            item.className,
          ]"
          @click="chooseNav(item)"
          v-for="(item, index) in navList"
          :key="index"
        >
          <div class="new_dot" v-if="item.showDot"></div>
          <img class="default" :src="item.icon" alt="" />
          <img class="active" :src="item.iconActive" alt="" />
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
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";

import Setting from "./setting.vue";
import Wallet from "./wallet.vue";
import Inventory from "./inventory.vue";
import Competitions from "./competitions.vue";
import History from "./history.vue";
import Referrals from "./invite.vue";
import Promotions from "./promotions.vue";

import icon_promotions from "@/assets/img/user/icon_Promotions.gif";

export default {
  name: "myIndex",
  components: {
    Setting,
    Wallet,
    Inventory,
    Competitions,
    History,
    Referrals,
    Promotions,
  },
  data() {
    return {
      userNav: {},
    };
  },
  computed: {
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
    newStatus() {
      const headerStore = useHeaderStore();
      return headerStore.newStatus;
    },
    isLogin() {
      const userStore = useUserStore();
      return userStore.isLogin;
    },
    userInfo() {
      const userStore = useUserStore();
      return userStore.userInfo;
    },
    userPage() {
      const userStore = useUserStore();
      return userStore.userPage || "profile";
    },
    navList() {
      const { walletNftSystemStatus, oneNftStatus } = this.newStatus;
      const { userNav } = this;

      return [
        {
          text: this.$t("header.profile"),
          page: "profile",
          icon: userNav.icon_profile,
          iconActive: userNav.icon_profile_active,
          showDot: false,
        },
        {
          text: this.$t("header.balances"),
          page: "balances",
          icon: userNav.icon_balances,
          iconActive: userNav.icon_balances_active,
          showDot: false,
        },
        {
          text: this.$t("header.inventory"),
          page: "inventory",
          icon: userNav.icon_inventory,
          iconActive: userNav.icon_inventory_active,
          showDot: walletNftSystemStatus,
        },
        {
          text: this.$t("header.promotions"),
          page: "promotions",
          icon: icon_promotions,
          iconActive: icon_promotions,
          showDot: false,
          className: "promotions_nav",
        },
        {
          text: this.$t("header.competition"),
          page: "competition",
          icon: userNav.icon_competition,
          iconActive: userNav.icon_competition_active,
          showDot: oneNftStatus,
        },
        {
          text: this.$t("header.history"),
          page: "history",
          icon: userNav.icon_history,
          iconActive: userNav.icon_history_active,
          showDot: false,
        },
        {
          text: this.$t("header.referrals"),
          page: "referrals",
          icon: userNav.icon_referrals,
          iconActive: userNav.icon_referrals_active,
          showDot: false,
        },
        // {
        //   text: "Settings",
        //   page: "settings",
        //   icon: userNav.icon_setting,
        //   iconActive: userNav.icon_setting_active
        // }
      ];
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      // 获取类型
      const { id } = this.$route.params;
      const userStore = useUserStore();
      userStore.setUserPage(this.$route.path, id);
    }

    this.getUserNav();
  },
  methods: {
    chooseNav(evnet) {
      const userStore = useUserStore();
      userStore.setUserPage(this.$route.path, evnet.page);
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
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
<style lang="scss">
.tips_box {
  max-width: 90%;
  width: auto !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.3125rem;
  background-color: #2c115b !important;
  box-sizing: border-box;

  .tips_title {
    font-family: "Medium";
    font-size: 0.75rem;
    line-height: 1.3;
    text-align: left;
    color: #a9a4b4;
  }

  .tips_text {
    font-family: "Medium";
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
