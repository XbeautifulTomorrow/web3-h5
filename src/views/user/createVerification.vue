<template>
  <div>
    <el-dialog
      v-model="show"
      destroy-on-close
      :close-on-click-modal="false"
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="49.0625rem"
      :before-close="handleClose"
    >
      <template #header>
        <div class="close_btn" @click="handleClose()">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="public-dialog-content form-content">
        <p class="public-dialog-title">{{ $t("user.bindTitle") }}</p>
        <div class="explanation_box">
          <div class="explanation_text">
            <p>{{ $t("user.bindText1") }}</p>
            <p>{{ $t("user.bindText2") }}</p>
          </div>
          <img class="img_box" :src="qrCode" alt="" />
        </div>
        <div class="verification_code">
          <div class="label_text">
            <span>{{ $t("user.inputTitle") }} </span
            ><span class="required">*</span>
          </div>
          <el-input
            class="verification_input"
            @blur="onVerify('auth')"
            v-model="googleCode"
            placeholder="Code"
            type="number"
          ></el-input>
          <div class="error_box">
            <span>{{ walletAddrTips }}</span>
          </div>
        </div>
        <div class="form-buttons">
          <el-button class="public-button" @click="bindGoogleAuth()">
            <span>{{ $t("user.confirmBtn") }}</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { getGoogleQrCode, bindGoogleAuth } from "@/services/api/user";
import { i18n } from "@/locales";
const { t } = i18n.global;
export default {
  name: "modifyName",
  data() {
    return {
      show: true,
      qrCode: null,
      googleCode: null,
      walletAddrTips: null,
      verifys: false,
      setting: {},
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
    },
  },
  methods: {
    onConfirm() {
      this.$emit("closeDialogFun");
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
    /**
     * @description: 格式化地址
     */
    formatAddr(event) {
      if (!event) return "";
      var reg = /^(\S{6})\S+(\S{4})$/;
      return event.replace(reg, "$1...$2");
    },
    async fetchGoogleQrCode() {
      const res = await getGoogleQrCode({
        email: this.userInfo.email,
      });

      if (res) {
        let blob = new Blob([res.data], {
          type: res.headers.contentType,
        });

        this.qrCode = window.URL.createObjectURL(blob);
      }
    },
    // 绑定谷歌验证器
    async bindGoogleAuth() {
      this.onVerify("submit");
      if (!this.verifys) return;

      const res = await bindGoogleAuth({
        email: this.userInfo.email,
        code: this.googleCode,
      });

      if (res && res.code == 200) {
        this.$message.success("Bind successfully!");
        this.handleClose();
      }
    },
    // 关闭弹窗
    handleClose(done) {
      this.$emit("closeDialogFun");

      if (done) {
        done();
        return;
      }
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.fetchGoogleQrCode();
    }
  },
};
</script>

<style lang="scss" scoped>
.public-dialog-title {
  padding-top: 1.875rem;
}

.explanation_box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-top: 0.625rem;
  padding-bottom: 1.25rem;

  .explanation_text {
    opacity: 0.9;
    font-family: Inter;
    font-size: 1rem;
    line-height: 1.88;
    text-align: left;
    color: white;
  }
}

.img_box {
  width: 7.5rem;
  height: 7.5rem;
  padding: 0.25rem;
  box-sizing: border-box;
  background-color: #ffff;

  .nft_img {
    width: 100%;
    height: 100%;
  }
}

.verification_code {
  .label_text {
    opacity: 0.9;
    font-family: Inter;
    font-size: 1rem;
    line-height: 1.6;
    text-align: left;
    color: white;
    white-space: pre-wrap;

    .required {
      color: #df4328;
    }
  }

  :deep(.verification_input) {
    margin: 0.75rem 0;

    .el-input__wrapper {
      width: 100%;
      height: 4.375rem;
      border-radius: 0.5rem;
      border: solid 1px #363945;
      background-color: #13151f;
      box-shadow: none !important;
      outline: none !important;

      & > input {
        color: white;
        font-size: 1.25rem;
      }
    }
  }

  .error_box {
    // min-height: 2.875rem;
    opacity: 0.9;
    font-family: Inter;
    font-size: 1rem;
    font-weight: normal;
    text-align: left;
    color: #df4328;
    box-sizing: border-box;
    padding-bottom: 1.875rem;
  }
}

.form-buttons {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 1.875rem;

  & > .public-button + .public-button {
    margin: 1.5rem 0 0;
  }
}

@media screen and (max-width: 950px) {
  .public-dialog {
    .public-dialog-title {
      padding-top: 1rem;
      font-size: 1.5rem;
    }

    .explanation_box {
      padding-top: 0.5rem;
      padding-bottom: 1.25rem;

      .explanation_text {
        flex: 1;
        font-size: 0.75rem;
        line-height: 1.4;
      }
    }

    .img_box {
      width: 4rem;
      height: 4rem;
    }

    .verification_code {
      .label_text {
        font-size: 0.75rem;
        line-height: 1.6;

        .required {
          color: #df4328;
        }
      }

      :deep(.verification_input) {
        margin: 0.75rem 0;

        .el-input__wrapper {
          width: 100%;
          height: 2.5rem;
          border-radius: 0.25rem;

          & > input {
            color: white;
            font-size: 0.75rem;
          }
        }
      }

      .error_box {
        opacity: 0.9;
        font-family: Inter;
        font-size: 0.75rem;
        font-weight: normal;
        text-align: left;
        color: #df4328;
        box-sizing: border-box;
        padding-bottom: 1.5rem;
      }
    }

    .form-buttons {
      padding-bottom: 0;
    }
  }
}
</style>
