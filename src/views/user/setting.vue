<template>
  <div class="border_bg">
    <div class="my_setting_wrapper ">
      <div class="user_panel">
        <div class="avatar_box">
          <div class="avatar_img" :style="{ backgroundImage: `url(${avatarImg})` }"></div>
        </div>
        <div class="username_box">
          <div class="name_text">
            <span>Username</span>
            <img class="edit" src="@/assets/svg/user/icon_edit.svg" @click="changeTypeFun('modify')" alt="">
          </div>
          <div class="wallet_text">0x58484561648546f465s6dfs64d6f54s65d46f4</div>
        </div>
        <div class="username_modify">
          <div class="modify_btn" @click="changeTypeFun('forgot')">CHANGE PASSWORD</div>
        </div>
        <div class="communication_setting">
          <div class="setting_text">COMMUNICATION SETTINGS</div>
          <div class="email_setting">
            <el-switch v-model="communication"
              style="--el-switch-on-color: #927A51; --el-switch-off-color: rgba(60, 60, 67, 0.3)" />
            <span>Send me marketing emails from time to time</span>
          </div>
        </div>
        <div class="other_box">
          <div class="exit_btn">
            <span class="exit_text">Log out</span>
            <img src="@/assets/svg/user/log_out.svg" alt="">
          </div>
        </div>
      </div>
    </div>
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Modify v-if="pageType === 'modify'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun"></Modify>
  </div>
</template>    
<script>
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
export default {
  name: 'myWallet',
  components: {
    Forgot,
    Modify
  },
  data() {
    return {
      avatarImg: require("@/assets/svg/user/default_avatar.svg"),
      username: null,
      communication: false,
      pageType: null
    };
  },
  methods: {
    closeDialogFun() {
      this.pageType = "";
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
  }
};
</script>
<style lang="scss" scoped>
@import "./components/setting.scss";
</style>
  