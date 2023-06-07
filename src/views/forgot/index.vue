<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-dialog v-model="visible" destroy-on-close :close-on-click-modal="true" :show-close="false" :align-center="true"
    class="public-dialog" width="700" :before-close="closeDialogFun">
    <template #header="{ close }">
      <div class="public-dialog-header">
        <el-icon v-on="{ click: [close, closeDialogFun] }" color="#2d313f" size="16" class="public-dialog-header-icon">
          <CircleCloseFilled />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content form-content">
      <h2 class="public-dialog-title">{{ title }}</h2>
      <el-form v-if="type === 0" ref="ruleFormRef" label-position="top" label-width="max-content" :model="formLogin"
        :rules="rules" :hide-required-asterisk="true" :status-icon="true" class="public-login">
        <el-form-item label="Email" prop="email">
          <el-input v-model="formLogin.email" placeholder="Enter your email" />
        </el-form-item>
        <div class="form-buttons">
          <el-button class="public-button cancel-button" v-on="{ click: [close, closeDialogFun] }">
            Cancel
          </el-button>
          <el-button class="public-button" @click="resetFun(ruleFormRef)">
            Reset password
          </el-button>
        </div>
      </el-form>
      <code-popup v-else-if="type === 1" :email="formLogin.email" @changeTypeFun="changeTypeFun" />
      <change-paw v-else-if="type === 2" @changeTypeFun="changeTypeFun" :formLogin="formLogin" />
      <template v-else>
        <p class="public-dialog-illustrate">
          Your password has been reset, please log in again.
        </p>
        <el-button class="public-button" @click="goTo('login')">
          Login
        </el-button>
      </template>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, defineEmits } from "vue";
// import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getCaptcha } from "@/services/api/user";
import codePopup from "./code.vue";
import changePaw from "./changePaw.vue";
// const router = useRouter();
const visible = ref(true);
const emit = defineEmits(["closeDialogFun", "changeTypeFun"]);
const type = ref(0);
const ruleFormRef = ref();
const title = ref("Forgot password?");
let formLogin = reactive({
  email: "",
  passWord: "",
  captcha: "",
});
const rules = reactive({
  email: [
    {
      required: true,
      message: "Email is a required field",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Email must be a valid email",
      trigger: ["blur", "change"],
    },
  ],
});
const changeTypeFun = (_type, data) => {
  if (_type === 0) {
    title.value = "Forgot password?";
  } else if (_type === 1) {
    title.value = "Verification code";
  } else {
    title.value = "Reset password";
  }
  if (data) {
    formLogin = { ...formLogin, ...data };
  }
  type.value = _type;
};
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const goTo = (page) => {
  //   router.push({ path: `${page}` });
  emit("changeTypeFun", page);
};
const resetFun = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      changeTypeFun(1);
      const res = await getCaptcha({
        type: "update_password",
        email: formLogin.email,
      });
      if (res && res.code === 200) {
        ElMessage({
          message: "The verification code has been sent successfully, please check your email",
          type: "success",
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style lang="scss" scoped>
.form-content {
  font-size: 16px;
  color: #a9a4b4;
}

.form-buttons {
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: space-between;
}

.public-dialog-illustrate {
  margin-top: 30px;
}
</style>
