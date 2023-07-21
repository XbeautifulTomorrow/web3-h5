<template>
  <el-dialog v-model="visible" destroy-on-close :close-on-click-modal="true" :show-close="false" :align-center="true"
    class="public-dialog" width="43.75rem" :before-close="closeDialogFun">
    <template #header="{ close }">
      <div class="close_btn" v-on="{ click: [close, closeDialogFun] }">
        <el-icon>
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content form-content">
      <p class="public-dialog-title">CHANGE PASSWORD</p>
      <el-form ref="ruleFormRef" label-position="top" label-width="max-content" :model="formForgot" :rules="rules"
        :hide-required-asterisk="true" :status-icon="true" class="public-form">
        <el-form-item prop="oldPassword">
          <el-input v-model="formForgot.oldPassword" placeholder="Old Password" class="public-input" type="password"
            show-password />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formForgot.password" placeholder="New Password" class="public-input" type="password"
            show-password />
        </el-form-item>
        <el-form-item prop="confirm">
          <el-input v-model="formForgot.confirm" placeholder="Confirm password" class="public-input" type="password"
            show-password />
        </el-form-item>
        <el-button :class="['public-button form-button', { 'cancel-button': !isSure }]" @click="forgotFun(ruleFormRef)">
          Reset password
        </el-button>
      </el-form>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, defineEmits, defineProps } from "vue";
import { getForgetPasswordtcha } from "@/services/api/user";

const emit = defineEmits(["closeDialogFun"]);
const props = defineProps({
  formLogin: {
    type: Object,
    requird: true,
  },
});

const visible = ref(true)
const ruleFormRef = ref();
const isSure = ref(false);
const formForgot = reactive({
  oldPassword: "",
  password: "",
  confirm: "",
});

const validatePass = (rule, value, callback) => {
  const upperStr = /^(?=.*[A-Z]).{8,}$/
  const lowerStr = /^(?=.*[a-z]).{8,}$/
  const numStr = /^(?=.*[0-9]).{8,}$/

  if (value === "") {
    callback(new Error("Please input the password"));
  } else if (value && value.length < 8) {
    callback(new Error("Password must be longer than 8 characters"));
  } else if (!upperStr.test(value)) {
    callback(new Error("Password must contain at least 1 upper case character"));
  } else if (!lowerStr.test(value)) {
    callback(new Error("Password must contain at least 1 lower case character"));
  } else if (!numStr.test(value)) {
    callback(new Error("Password must contain at least 1 number"));
  } else {
    if (formForgot.confirm !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("confirm", () => null);
    }
    callback();
  }
};

const closeDialogFun = () => {
  emit("closeDialogFun");
};

const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== formForgot.password) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
    isSure.value = true;
  }
};

const rules = reactive({
  oldPassword: [{ validator: validatePass, trigger: ["blur", "change"] }],
  password: [{ validator: validatePass, trigger: ["blur", "change"] }],
  confirm: [{ validator: validatePass2, trigger: ["blur", "change"] }],
});

const forgotFun = async (formEl) => {
  if (!formEl || !isSure.value) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { password } = formForgot;
      const formLogin = {
        email: props.formLogin.email,
        passWord: password,
        captcha: props.formLogin.captcha,
      };
      const res = await getForgetPasswordtcha(formLogin);
      if (res && res.code === 200) {
        emit("closeDialogFun");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style lang="scss" scoped>
.public-form {
  margin-top: 1.875rem;
}

.form-button {
  margin: 0.625rem auto 0;
}
</style>
