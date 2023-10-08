<template>
  <div class="home">
    <banner @bannerGo="bannerGo" />
    <mystery-boxes :boxList="boxList" />
    <nft-tickets />
    <contents-info />
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
  </div>
</template>

<script>
import { parseQuery } from "vue-router";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import Banner from "./banner.vue";
import MysteryBoxes from "./mysteryBoxes.vue";
import NftTickets from "./nftTickets.vue";
import ContentsInfo from "./contentsInfo.vue";
import Login from "../login/index.vue";
import { getBoxList, getNFTList } from "@/services/api/index";

export default {
  name: "IndexPage",
  components: {
    Login,
    Banner,
    MysteryBoxes,
    NftTickets,
    ContentsInfo,
  },
  beforeRouteLeave(to, from, next) {
    if (to.meta.requiresAuth && (!this.isLogin || !this.userInfo?.id)) {
      this.pageType = "login";
      return;
    }
    next();
  },
  computed: {
    ...mapStores(useUserStore),
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
  },
  data() {
    return {
      pageType: null,
      boxList: [],
      NFTList: [],
      generateKey: "",
    };
  },
  created() {
    getBoxList().then((res) => {
      if (res.data && res.data.length > 0) {
        this.boxList = res.data;
      }
    });
    getNFTList().then((res) => {
      if (res.data && res.data.length > 0) {
        this.NFTList = res.data;
      }
    });
  },
  methods: {
    bannerGo(data) {
      let query = {};
      if (data.split("?").length > 1) {
        query = parseQuery(data.split("?")[1]);
      }
      this.$router.push({ path: data, query });
    },
    closeDialogFun() {
      this.pageType = "";
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
  },
};
</script>
