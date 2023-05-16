<template>
  <el-form
    ref="ruleFormRef"
    label-position="top"
    label-width="max-content"
    :model="formForgot"
    :rules="rules"
    :hide-required-asterisk="true"
    :status-icon="true"
    class="public-login"
  >
    <el-form-item prop="password">
      <el-input
        v-model="formForgot.password"
        placeholder="New Password"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item prop="confirm">
      <el-input
        v-model="formForgot.confirm"
        placeholder="Confirm password"
        type="password"
        show-password
      />
    </el-form-item>
    <el-button
      :class="['public-button form-button', { 'cancel-button': !isSure }]"
      @click="forgotFun(ruleFormRef)"
    >
      Reset password
    </el-button>
  </el-form>
</template>
<script setup>
import { ref, reactive, defineEmits } from "vue";
const emit = defineEmits(["changeTypeFun"]);
const ruleFormRef = ref();
const isSure = ref(false);
const formForgot = reactive({
  password: "",
  confirm: "",
});
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (formForgot.checkPass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
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
  password: [{ validator: validatePass, trigger: ["blur", "change"] }],
  confirm: [{ validator: validatePass2, trigger: ["blur", "change"] }],
});
const forgotFun = async (formEl) => {
  if (!formEl || !isSure.value) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit("changeTypeFun", 3);
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style lang="scss" scoped>
.form-button {
  margin: 40px auto 20px;
}
</style>
