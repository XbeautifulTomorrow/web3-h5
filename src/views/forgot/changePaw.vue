<template>
  <el-form ref="ruleFormRef" label-position="top" label-width="max-content" :model="formForgot" :rules="rules"
    :hide-required-asterisk="true" :status-icon="true" class="public-form">
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
</template>
<script setup>
import { ref, reactive, defineEmits, defineProps } from "vue";
import { getForgetPasswordtcha } from "@/services/api/user";
import { i18n } from '@/locales';
const { t } = i18n.global;

const emit = defineEmits(["changeTypeFun"]);
const props = defineProps({
  formLogin: {
    type: Object,
    requird: true,
  },
});
const ruleFormRef = ref();
const isSure = ref(false);
const formForgot = reactive({
  password: "",
  confirm: "",
});

const validatePass = (rule, value, callback) => {
  const upperStr = /^(?=.*[A-Z]).{8,}$/
  const lowerStr = /^(?=.*[a-z]).{8,}$/
  const numStr = /^(?=.*[0-9]).{8,}$/

  if (value === "") {
    callback(new Error(t("login.passwordErrText1")));
  } else if (value && value.length < 8) {
    callback(new Error(t("login.passwordErrText2")));
  } else if (!upperStr.test(value)) {
    callback(new Error(t("login.passwordErrText3")));
  } else if (!lowerStr.test(value)) {
    callback(new Error(t("login.passwordErrText4")));
  } else if (!numStr.test(value)) {
    callback(new Error(t("login.passwordErrText5")));
  } else {
    if (formForgot.confirm !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("confirm", () => null);
    }
    callback();
  }
};

const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error(t("login.captchaErrText1")));
  } else if (value !== formForgot.password) {
    callback(new Error(t("login.captchaErrText2")));
  } else {
    callback();
    isSure.value = true;
  }
};

const rules = reactive({
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
        emit("changeTypeFun", 3);
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
