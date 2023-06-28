<template>
  <el-dialog v-model="showModify" destroy-on-close :close-on-click-modal="true" :show-close="false" :align-center="true"
    class="public-dialog" width="780" :before-close="handleClose">
    <template #header>
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content form-content">
      <p class="public-dialog-title">{{ $t("airdrop.pleaseNameTitle") }}</p>
      <el-form ref="ruleFormRef" label-position="top" label-width="max-content" :model="formUser" :rules="rules"
        :hide-required-asterisk="true" :status-icon="true" class="public-form">
        <el-form-item prop="name">
          <el-input class="public-input" v-model="formUser.name" :placeholder="$t('airdrop.nameHint')" />
        </el-form-item>
        <div class="form-buttons">
          <el-button class="public-button cancel-button" @click="handleClose()">
            {{ $t("common.cancelUpper") }}
          </el-button>
          <el-button class="public-button" @click="resetUserName('ruleFormRef')">
            {{ $t("common.submit") }}
          </el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>
    
<script>
import { updateUserInfo } from "@/services/api/user";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";

export default {
  name: 'modifyName',
  data() {
    return {
      showModify: true,
      formUser: {
        name: null
      },
      rules: {}
    };
  },
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    // 更改用户名
    async resetUserName(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await updateUserInfo({
            "userName": this.formUser.name, //用户名
          });
          if (res) {
            this.$emit("onModify");
            const { userInfo } = this.userStore;
            const users = {
              ...userInfo,
              userName: this.formUser.name
            }
            this.userStore.setLogin(users);
            this.handleClose();
            this.$message.success(this.$t("common.operationTips"));
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 关闭弹窗
    handleClose(done) {
      this.formUser = {
        name: null
      }

      this.$emit("closeDialogFun");
      if (done) {
        done();
        return
      }
      this.showModify = false;
    },
  },
  created() {
    this.rules = {
      name: [
        { required: true, message: this.$t("airdrop.pleaseName"), trigger: ["blur", "change"] },
        { min: 8, max: 20, message: this.$t("airdrop.nameTips"), trigger: ["blur", "change"] }
      ]
    }
  }
};
</script>
    
<style lang="scss" scoped>
@import "./point.scss";
</style>