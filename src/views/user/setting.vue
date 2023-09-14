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
        <div class="safety_verification">
          <div class="verification_title">
            <div class="title_box">
              <div class="title_text">{{ $t("user.authTitle") }}</div>
              <div :class="['switch_btn', googleValidate && 'turn_on']">
                <span>{{ googleValidate ? $t("user.authStatus1") : $t("user.authStatus2") }}</span>
                <img v-if="!googleValidate" src="@/assets/svg/user/icon_shield.svg" alt="">
                <img v-else src="@/assets/svg/user/icon_shield_check.svg" alt="">
              </div>
            </div>
            <div class="recommended_info" v-if="!googleValidate">
              {{ $t("user.authRecommended") }}
            </div>
          </div>
          <div :class="['verification_operating', googleValidate && 'close']">
            <div class="verification_close" v-if="googleValidate">
              <div class="close_title">
                {{ $t("user.unAuthTitle") }}
              </div>
              <el-input class="verification_input" v-model="googleCode" @blur="onVerify('auth')" placeholder="Code"
                type="number"></el-input>
              <div class="error_box">
                {{ walletAddrTips }}
              </div>
            </div>
            <div class="create_verification_btn" v-if="googleValidate" @click="closeAuth()">
              {{ $t("user.close2FABtn") }}
            </div>
            <div class="create_verification_btn" v-else @click="pageType = 'auth'">
              {{ $t("user.confirmBtn") }}
            </div>
          </div>
        </div>
        <div :class="['other_box', googleValidate && 'close']">
          <div class="exit_btn" @click="onLogout()">
            <span class="exit_text">{{ $t("user.logout") }}</span>
            <img src="@/assets/svg/user/log_out.svg" alt="">
          </div>
        </div>
      </div>
    </div>
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" />
    <Modify v-if="pageType === 'modify'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun"></Modify>
    <createVerification v-if="pageType === 'auth'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun">
    </createVerification>
  </div>
</template>    
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import Forgot from "../forgot/changePass.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import createVerification from "./createVerification.vue";
import { updateUserInfo, getGoogleValidateStatus } from "@/services/api/user";
import { i18n } from '@/locales';
const { t } = i18n.global;
export default {
  name: 'myWallet',
  components: {
    Forgot,
    Modify,
    createVerification
  },
  inject: ["reload"],
  data() {
    return {
      avatarImg: require("@/assets/svg/user/default_avatar.svg"),
      username: null,
      communication: false,
      pageType: null,
      googleCode: null,
      googleValidate: false,
      walletAddrTips: null,
      verifys: false,
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
      this.fetchGoogleValidateStatus();
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
      if (this.pageType == "auth") {
        this.fetchGoogleValidateStatus();
      }
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
      if (res && res == 200) {
        const { userInfo } = this.userStore;
        const users = {
          ...userInfo,
          emailSubStatus: status
        }
        this.userStore.setLogin(users);
      }
    },
    async fetchGoogleValidateStatus() {
      const res = await getGoogleValidateStatus({
        email: this.userInfo.email
      })
      if (res && res.code == 200) {
        this.googleValidate = res.data == "TRUE"
      }
    },
    async closeAuth() {
      this.onVerify("submit");
      if (!this.verifys) return;

      let res = await updateUserInfo({
        "googleValidateStatus": "FALSE",
        code: this.googleCode
      });
      if (res && res.code == 200) {
        this.$message.success(t("common.operationTips"));
        this.fetchGoogleValidateStatus();
      }
    },
    // 验证
    onVerify(type) {
      const { googleCode } = this;
      if (type == "submit" || type == "auth") {
        if (!googleCode) {
          this.walletAddrTips = t("user.codeRequired");
          this.verifys = false;
          return;
        }

        this.walletAddrTips = "";
        this.verifys = true;
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
  