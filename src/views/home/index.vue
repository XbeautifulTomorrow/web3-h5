<template>
  <div class="home">
    <banner @bannerGo="bannerGo" />
    <mystery-boxes :boxList="boxList" />
    <nft-tickets />
    <contents-info />
    <Login
      v-if="pageType === 'login'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
  </div>
</template>

<script>
import { parseQuery } from "vue-router";
import { useUserStore } from "@/store/user.js";
import Banner from "./banner.vue";
import MysteryBoxes from "./mysteryBoxes.vue";
import NftTickets from "./nftTickets.vue";
import ContentsInfo from "./contentsInfo.vue";
import Login from "../login/index.vue";
import WarPoster from "./warGame/warPoster";
import { getBoxList, getNFTList } from "@/services/api/index";
import { setSessionStore, getSessionStore } from "@/utils";

export default {
  name: "IndexPage",
  components: {
    Login,
    Banner,
    MysteryBoxes,
    NftTickets,
    ContentsInfo,
    WarPoster,
  },
  beforeRouteLeave(to, from, next) {
    if (to.meta.requiresAuth && (!this.isLogin || !this.userInfo?.id)) {
      this.pageType = "login";
      return;
    }
    next();
  },
  computed: {
    userInfo() {
      const userStore = useUserStore();
      return userStore.userInfo;
    },
    isLogin() {
      const userStore = useUserStore();
      return userStore.isLogin;
    },
  },
  data() {
    return {
      pageType: null,
      boxList: [],
      NFTList: [],
      generateKey: "",
      isWarPosterShow: false,
    };
  },
  created() {
    this.showWarPoster();
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
    showWarPoster() {
      const showTips = getSessionStore("showWarTips");
      if (showTips && showTips == 2) {
        this.isWarPosterShow = false;
      } else {
        const image = new Image();
        image.onload = () => {
          this.isWarPosterShow = true;
          if (this.isLogin) {
            setSessionStore("showWarTips", 2);
          }
        };
        image.src = require("@/assets/img/home/poster/bg_02.webp");
      }
    },
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
