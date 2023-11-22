<template>
  <el-form
    ref="ruleFormRef"
    label-position="top"
    label-width="max-content"
    :model="formForgot"
    :rules="rules"
    :hide-required-asterisk="true"
    :status-icon="true"
    class="public-form"
  >
    <el-form-item prop="password">
      <el-input
        v-model="formForgot.password"
        placeholder="New Password"
        class="public-input"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item prop="confirm">
      <el-input
        v-model="formForgot.confirm"
        placeholder="Confirm password"
        class="public-input"
        type="password"
        show-password
      />
    </el-form-item>
    <div class="form-link">
      <div class="form-rember">
        <span class="form-rember-rectangle" @click="showRememberFun">
          <span v-show="rememberMe" class="form-rember-rectangle-fill"></span>
        </span>
        <span class="form-rember-text">{{ $t("login.resetAuth") }}</span>
      </div>
    </div>
    <el-button
      :class="['public-button form-button', { 'cancel-button': !isSure }]"
      @click="forgotFun(ruleFormRef)"
    >
      Reset password
    </el-button>
  </el-form>
</template>
<script setup>
import { ref, reactive, defineEmits, defineProps } from "vue";
import { getForgetPasswordtcha } from "@/services/api/user";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["changeTypeFun"]);
const props = defineProps({
  formLogin: {
    type: Object,
    requird: true,
  },
});
const rememberMe = ref(false);
const ruleFormRef = ref();
const isSure = ref(false);
const formForgot = reactive({
  password: "",
  confirm: "",
});

const showRememberFun = () => {
  rememberMe.value = !rememberMe.value;
};

const validatePass = (rule, value, callback) => {
  const upperStr = /^(?=.*[A-Z]).{8,}$/;
  const lowerStr = /^(?=.*[a-z]).{8,}$/;
  const numStr = /^(?=.*[0-9]).{8,}$/;
  const { t } = useI18n();

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
  const { t } = useI18n();
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
        resetGoogleCheck: rememberMe.value ? "TRUE" : "FALSE",
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

.form-rember {
  display: flex;
  align-items: center;
}

.form-rember-rectangle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  margin-right: 0.75rem;
  border-radius: 0.1875rem;
  border: solid 1px #a9a4b4;
  cursor: pointer;
}

.form-rember-rectangle-fill {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.125rem;
  background-color: #fad54d;
}

.form-rember-text {
  font-size: 1rem;
  line-height: 1.6;
  text-align: left;
  color: #a9a4b4;
}

.form-button {
  margin: 0.625rem auto 0;
}
</style>
