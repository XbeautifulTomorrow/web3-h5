<template>
  <div class="wrapper_bg">
    <div class="my_setting_wrapper">
      <div class="wallet_panel" :style="{
        backgroundImage: `url(${userBg})`,
        height: '44.3125rem'
      }">
        <div class="user_panel">
          <div class="avatar_box">
            <div class="avatar_img" :style="{ backgroundImage: `url(${avatarImg})` }"></div>
            <img class="edit" src="@/assets/svg/user/icon_edit.svg" alt="">
          </div>
          <div class="username_box">
            <div class="name_text">Useranme</div>
            <div class="wallet_text">0x58484561648546f465s6dfs64d6f54s65d46f4</div>
          </div>
          <div class="username_modify">
            <el-input class="modify_input" v-model="username" placeholder="User name" />
            <div class="modify_btn">CHANGE PASSWORD</div>
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
            <div class="log_btn">LOG</div>
            <div class="history_btn">Unbox History</div>
            <div class="exit_btn">
              <span class="exit_text">Log out</span>
              <img src="@/assets/svg/user/log_out.svg" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>    
<script>
export default {
  name: 'myWallet',
  data() {
    return {
      avatarImg: require("@/assets/svg/user/default_avatar.svg"),
      username: null,
      communication: false,
      userBg: require("@/assets/svg/user/point_bg.svg"),
    };
  },
  methods: {
    upload() { }
  }
};
</script>
<style lang="scss" scoped>
@import "./components/setting.scss";
</style>
  