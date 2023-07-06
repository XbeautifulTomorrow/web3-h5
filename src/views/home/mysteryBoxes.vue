<template>
  <div class="mystery-boxes">
    <div class="home-public-title">
      <div class="title_text">{{ $t("home.boxTitle") }}</div>
      <div class="title_description">{{ $t("home.boxTips") }}</div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in boxList">
        <li class="mystery-boxes-item" @click="handleMysteryBoxes(item)" v-if="index < 4" :key="`mystery-${index}`">
          <div class="img_box">
            <img class="mystery-boxs-list-img" :src="item.boxImg" alt="" />
          </div>
          <div class="mystery-boxs-title text-ellipsis">
            <div class="box-name text-ellipsis">{{ item.boxName }}</div>
            <img src="@/assets/svg/box/icon_eth.svg" alt="">
          </div>
          <div class="box-price">
            <div class="price-box">
              {{ `${item.price} ${item.coin}` }}
            </div>
          </div>
          <div class="other">
            <div class="sale">{{ $t("home.sale") }}</div>
            <div class="sale-val">{{ item.sales }}</div>
          </div>
          <p class="mystery-boxs-text text-ellipsis">
          </p>
          <div class="boxes-button buy-btn text-ellipsis">
            <span class="boxes-button-name">{{ $t("home.buyBtn") }}</span>
          </div>
        </li>
      </template>
    </ul>
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Register v-if="pageType === 'register'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Modify v-if="pageType === 'modify'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun"></Modify>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
export default {
  name: 'MysteryBoxes',
  props: ['boxList'],
  components: {
    Login,
    Register,
    Forgot,
    Modify
  },
  data() {
    return {
      pageType: null,
      boxLists: [{
        boxImg: require("@/assets/img/home/win_bayc.png"),
        boxName: "Win BAYC for 0.01 ETH",
        price: 0.01,
        coin: "ETH",
        sales: "0"
      }, {
        boxImg: require("@/assets/img/home/teamazuki_collections.png"),
        boxName: "TeamAzuki Collections",
        price: 0.02,
        coin: "ETH",
        sales: "0"
      }, {
        boxImg: require("@/assets/img/home/yugalabs_collections.png"),
        boxName: "Yugalabs Collections",
        price: 0.05,
        coin: "ETH",
        sales: "0"
      }, {
        boxImg: require("@/assets/img/home/blue_chip_package.png"),
        boxName: "Blue-Chip Package",
        price: 0.15,
        coin: "ETH",
        sales: "0"
      }]
    };
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
  methods: {
    handleMysteryBoxes(event) {
      if (this.isLogin && this.userInfo?.id) {
        this.$router.push({ path: "/mysteryBox", query: { boxId: event.id } });
      } else {
        this.changeTypeFun('login');
      }
    },
    closeDialogFun() {
      this.pageType = "";
      this.showConnect = false;
      if (this.userInfo) {
        this.getTheUserBalanceInfo();
      } else if (this.regInfo) {
        console.log(this.regInfo);
      }
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
  }
};
</script>
<style lang="scss" scoped>
@import "./components/mysteryBoxes.scss";
</style>
