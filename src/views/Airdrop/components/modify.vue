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
      <p class="public-dialog-title">PLEASE ENTER THE USER NAME</p>
      <el-form ref="ruleFormRef" label-position="top" label-width="max-content" :model="formUser" :rules="rules"
        :hide-required-asterisk="true" :status-icon="true" class="public-form">
        <el-form-item prop="email">
          <el-input class="public-input" v-model="formUser.name" placeholder="Please enter 8-32 characters" />
        </el-form-item>
        <div class="form-buttons">
          <el-button class="public-button cancel-button" @click="handleClose()">
            CANCEL
          </el-button>
          <el-button class="public-button" @click="resetUserName('ruleFormRef')">
            SUBMIT
          </el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>
    
<script>
import { updateUserInfo } from "@/services/api/user";

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
            this.handleClose();
            this.$message.success('Operation succeeded!');
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
        { required: true, message: "please enter user name", trigger: ["blur", "change"] },
        { min: 8, max: 20, message: 'Username must be 8-32 characters', trigger: ["blur", "change"] }
      ]
    }
  }
};
</script>
    
<style lang="scss" scoped>
@import "./point.scss";
</style>