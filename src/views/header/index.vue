<template>
  <div class="header">
    <div class="header-main">
      <div class="header-left">
        <img
          class="header-logo"
          src="@/assets/img/headerFooter/logo.png"
          alt="logo"
          @click="goTo()"
        />
        <ul class="header-nav">
          <li
            class="header-nav-text"
            v-for="(item, index) in nav"
            :key="`nav-${index}`"
            @click="goTo(item.page)"
          >
            {{ item.text }}
          </li>
        </ul>
      </div>
      <div class="header-login">
        <div class="header-right" v-if="!userInfo?.id">
          <div class="btn-box login" @click="changeTypeFun('login')">Login</div>
          <div class="btn-box register" @click="changeTypeFun('register')">
            Register
          </div>
        </div>
      </div>
      <div v-if="userInfo?.id" class="header-login">
        <div class="header-wallet">
          <img
            class="header-wallet-img"
            src="@/assets/img/headerFooter/eth_icon.png"
            alt=""
          />
          <span class="header-wallet-money">{{ ethBalance }}</span>
        </div>
        <div class="header-user" v-if="userInfo?.id">
          <img
            class="header-user-img"
            src="@/assets/svg/user/default_avatar.svg"
            alt=""
          />
          <span class="header-user-text text-ellipsis">
            {{ userInfo?.userName || userInfo?.email }}
          </span>
          <img
            class="header-user-down"
            src="@/assets/img/headerFooter/icon-arrowup.png"
            alt=""
          />
          <div class="header-user-popup">
            <ul class="header-user-content">
              <li
                :class="['header-user-list']"
                v-for="(item, index) in userList"
                :key="`box-${index}`"
                @click="othersideBoxFun(item)"
              >
                <span :class="['header-user-list-img', item.class]"></span>
                <span>{{ item.text }}</span>
              </li>
            </ul>
          </div>
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
  </div>
</template>

<script>
import { mapStores } from "pinia";

import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";

export default {
  name: "HeaderCom",
  components: {
    Login,
    Register,
    Forgot,
  },
  data() {
    return {
      pageType: "",
      nav: [
        {
          text: "Airdrop",
          page: "home",
        },
        {
          text: "Mystery Box",
          page: "MysteryBox",
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
          text: "Whitebook",
          page: "Whitebook",
        },
        {
          text: "FAQ",
          page: "FAQ",
        },
      ],
      userList: [
        {
          text: "Profile",
          class: "myProfile",
        },
        {
          text: "Wallet",
          class: "wallet",
        },
        // {
        //   text: "Wallet Log",
        //   class: "walletLog",
        // },
        {
          text: "Competitions",
          class: "competitions",
        },
        // {
        //   text: "My Collections",
        //   class: "myCollections",
        // },
        // {
        //   text: "Create",
        //   class: "create",
        // },
        {
          text: "Referral",
          class: "referral",
        },
        {
          text: "Settings",
          class: "settings",
        },
        {
          text: "Logout",
          class: "logout",
        },
      ],
    };
  },
  mounted() {
    // this.connect();
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
    getTheUserBalanceInfo() {
      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
      // let res = await getTheUserBalance();
      // this.ethBalance = res.data[0].balance;
    },

    goTo(page = "home") {
      this.$router.push({ path: `/${page}` });
    },
    othersideBoxFun(item) {
      if (item.text == "Profile") {
        this.$router.push({ name: "MyProfile" });
      } else if (item.text == "Wallet") {
        this.$router.push({ name: "Wallet" });
      } else if (item.text == "Competitions") {
        this.$router.push({ name: "Competitions", query: { type: "ENTERED" } });
      } else if (item.text == "My Collections") {
        this.$router.push({
          name: "Competitions",
          query: { type: "MY_COMPETITIONS" },
        });
      } else if (item.text == "Referral") {
        this.$router.push({ name: "Invite" });
      } else if (item.text == "Settings") {
        this.$router.push({ name: "Setting" });
      } else if (item.text === "Logout") {
        this.userStore.logoutApi();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("./index.scss");
</style>
