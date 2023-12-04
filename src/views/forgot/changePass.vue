<template>
  <div>
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
        <p class="public-dialog-title">{{ $t("user.changePass") }}</p>
        <el-form ref="ruleFormRef" label-position="top" label-width="max-content" :model="formForgot" :rules="rules"
          :hide-required-asterisk="true" :status-icon="true" class="public-form">
          <el-form-item prop="oldPassword" v-if="isPassword">
            <el-input v-model="formForgot.oldPassword" :placeholder="$t('user.oldPass')" class="public-input"
              type="password" show-password />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="formForgot.password" :placeholder="$t('user.newPass')" class="public-input" type="password"
              show-password />
          </el-form-item>
          <el-form-item prop="confirm">
            <el-input v-model="formForgot.confirm" :placeholder="$t('user.confirmPass')" class="public-input"
              type="password" show-password />
          </el-form-item>
          <el-button :class="['public-button form-button', { 'cancel-button': !isSure }]" @click="forgotFun(ruleFormRef)">
            {{ $t("user.resetPass") }}
          </el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, defineEmits,onMounted } from "vue";
import { i18n } from '@/locales';
const { t } = i18n.global;
import { resetPassword } from "@/services/api/user";
import { ElMessage } from "element-plus";
const emit = defineEmits(["closeDialogFun"]);

const visible = ref(true)
const ruleFormRef = ref();
const isSure = ref(false);
const isPassword = ref(true)
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

const closeDialogFun = () => {
  emit("closeDialogFun");
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
  oldPassword: [{ validator: validatePass, trigger: ["blur", "change"] }],
  password: [{ validator: validatePass, trigger: ["blur", "change"] }],
  confirm: [{ validator: validatePass2, trigger: ["blur", "change"] }],
});

const forgotFun = async (formEl) => {
  if (!formEl || !isSure.value) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { oldPassword, password } = formForgot;
      const formLogin = {
        oldPassword: oldPassword,
        newPassword: password,
      };
      const res = await resetPassword(formLogin);
      if (res && res.code === 200) {
        ElMessage({
          message: t("common.operationTips"),
          type: "success",
        });
        emit("closeDialogFun");
        localStorage.setItem('isPwd',true)
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
onMounted(() => {
  if(localStorage.getItem("userInfo")){
    let userInfo = JSON.parse(localStorage.getItem("userInfo"))?.userInfo
    if(userInfo?.id){
      if(localStorage.getItem('isPwd')==null){
        localStorage.setItem('isPwd',userInfo?.password)
      }
      isPassword.value = JSON.parse(localStorage.getItem('isPwd'))
    }
  }
});
</script>
<style lang="scss" scoped>
.public-form {
  margin-top: 1.875rem;
}

.form-button {
  margin: 0.625rem auto 0;
}
</style>
