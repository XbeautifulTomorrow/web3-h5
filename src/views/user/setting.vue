<template>
  <div class="border_bg">
    <div class="my_setting_wrapper ">
      <div class="user_panel">
        <div class="avatar_box">
          <div class="avatar_img" :style="{ backgroundImage: `url(${avatarImg})` }"></div>
        </div>
        <div class="username_box">
          <div class="name_text">
            <span>{{ userInfo?.id ? userInfo.userName : $t("airdrop.defaultName") }}</span>
            <img class="edit" src="@/assets/svg/user/icon_edit.svg" @click="changeTypeFun('modify')" alt="">
          </div>
          <div class="wallet_text">{{ userInfo?.id && userInfo.email || "--" }}</div>
        </div>
        <div class="username_modify">
          <div class="modify_btn" @click="changeTypeFun('forgot')">{{ $t("user.changePwd") }}</div>
        </div>
        <div class="communication_setting">
          <div class="setting_text">{{ $t("user.setting") }}</div>
          <div class="email_setting">
            <el-switch v-model="communication" @change="changeEmail()"
              style="--el-switch-on-color: #927A51; --el-switch-off-color: rgba(60, 60, 67, 0.3)" />
            <span>{{ $t("user.sendSetting") }}</span>
          </div>
        </div>
        <div class="other_box">
          <div class="exit_btn" @click="onLogout()">
            <span class="exit_text">{{ $t("user.logout") }}</span>
            <img src="@/assets/svg/user/log_out.svg" alt="">
          </div>
        </div>
      </div>
    </div>
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" />
    <Modify v-if="pageType === 'modify'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun"></Modify>
  </div>
</template>    
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import Forgot from "../forgot/changePass.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import { updateUserInfo } from "@/services/api/user";
export default {
  name: 'myWallet',
  components: {
    Forgot,
    Modify
  },
  inject: ["reload"],
  data() {
    return {
      avatarImg: require("@/assets/svg/user/default_avatar.svg"),
      username: null,
      communication: false,
      pageType: null
    };
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
    }
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      const { emailSubStatus } = this.userInfo;
      this.communication = emailSubStatus == "TRUE";
    }
  },
  watch: {
    userInfo() {
      const { emailSubStatus } = this.userInfo;
      this.communication = emailSubStatus == "TRUE"
    }
  },
  methods: {
    closeDialogFun() {
      this.pageType = "";
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
    async changeEmail() {
      const status = this.communication ? "TRUE" : "FALSE";
      let res = await updateUserInfo({
        "emailSubStatus": status
      });
      if (res) {
        const { userInfo } = this.userStore;
        const users = {
          ...userInfo,
          emailSubStatus: status
        }
        this.userStore.setLogin(users);
      }
    },
    onLogout() {
      this.userStore.logoutApi();
      this.reload();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./components/setting.scss";
</style>
  