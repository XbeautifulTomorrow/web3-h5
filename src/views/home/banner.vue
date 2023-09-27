<template>
  <div class="banner_wrapper">
    <div class="banner_box">
      <div class="banner_l">
        <!-- <div class="level_description">{{ $t("home.bannerText1") }}</div>
        <div class="level_description">{{ $t("home.bannerText2") }}</div>
        <div class="level_description">{{ $t("home.bannerText3") }}</div> -->
        <!-- <div class="level_description_text">
          {{ $t('home.bannerTips') }}
        </div> -->
      </div>
    </div>
    <div class="join_btn" @click="goUrl">
      <p>JOIN NOW</p>
    </div>
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
  </div>
</template>
  
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import Login from "../login/index.vue";
export default {
  name: 'BannerPage',
  components: {
    Login
  },
  data() {
    return {
      pageType:null
    }
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
  methods: {
    goUrl() {
      if (!this.isLogin || !this.userInfo?.id) {
        this.pageType = "login";
        return;
      }
      this.$router.push({ path:'/user/promotions' });
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
  
<style lang="scss" scoped>
@import "./components/banner.scss";
</style>
  