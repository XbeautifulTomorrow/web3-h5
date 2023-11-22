<template>
  <div>
    <el-dialog
      v-model="showModify"
      destroy-on-close
      :close-on-click-modal="true"
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="43.75rem"
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
        <p class="public-dialog-title">{{ $t("airdrop.pleaseNameTitle") }}</p>
        <el-form
          ref="ruleFormRef"
          label-position="top"
          label-width="max-content"
          :model="formUser"
          :rules="rules"
          :hide-required-asterisk="true"
          :status-icon="true"
          class="public-form"
        >
          <el-form-item prop="name">
            <el-input
              class="public-input"
              v-model="formUser.name"
              :placeholder="$t('airdrop.nameHint')"
            />
          </el-form-item>
          <div class="form-buttons">
            <el-button
              class="public-button cancel-button"
              @click="handleClose()"
            >
              {{ $t("common.cancelUpper") }}
            </el-button>
            <el-button
              class="public-button"
              @click="resetUserName('ruleFormRef')"
            >
              {{ $t("common.submit") }}
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { i18n } from "@/locales";
const { t } = i18n.global;
import { updateUserInfo, verifyNickname } from "@/services/api/user";
import { useUserStore } from "@/store/user.js";

export default {
  name: "modifyName",
  data() {
    return {
      showModify: true,
      isRepeat: false,
      formUser: {
        name: null,
      },
      rules: {},
    };
  },
  methods: {
    // 重复昵称校验
    async verifyNickname() {},
    // 更改用户名
    async resetUserName(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await updateUserInfo({
            userName: this.formUser.name, //用户名
          });
          if (res) {
            this.$emit("onModify");
            const userStore = useUserStore();
            const { userInfo } = userStore;
            const users = {
              ...userInfo,
              userName: this.formUser.name,
            };
            userStore.setLogin(users);
            this.handleClose();
            this.$message.success(t("common.operationTips"));
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 关闭弹窗
    handleClose(done) {
      this.formUser = {
        name: null,
      };

      this.$emit("closeDialogFun");
      if (done) {
        done();
        return;
      }
      this.showModify = false;
    },
  },
  created() {
    const validateName = async (rule, value, callback) => {
      const res = await verifyNickname({ name: value });
      if (res.data) {
        callback(new Error(t("errorTips.username_already_exist")));
      } else {
        callback();
      }
    };

    this.rules = {
      name: [
        {
          required: true,
          message: t("airdrop.pleaseName"),
          trigger: ["blur", "change"],
        },
        {
          min: 8,
          max: 20,
          message: t("airdrop.nameTips"),
          trigger: ["blur", "change"],
        },
        { validator: validateName, trigger: ["blur", "change"] },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./point.scss";
</style>
