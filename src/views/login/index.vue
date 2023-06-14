<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-dialog v-model="visible" destroy-on-close :show-close="false" :align-center="true" class="public-dialog" width="700"
    :before-close="closeDialogFun">
    <template #header="{ close }">
      <div class="close_btn" v-on="{ click: [close, closeDialogFun] }">
        <el-icon>
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content form-content">
      <p class="public-dialog-title">Login</p>
      <el-form ref="ruleFormRef" label-position="top" label-width="max-content" :model="formLogin" :rules="rules"
        :hide-required-asterisk="true" :status-icon="true" class="public-form">
        <el-form-item label="Email" prop="account">
          <!-- SuccessFilled -->
          <!-- CircleCloseFilled -->
          <el-input class="public-input" v-model="formLogin.account" placeholder="Enter your email" />
        </el-form-item>
        <el-form-item label="Password" prop="passWord">
          <el-input class="public-input" v-model="formLogin.passWord" placeholder="Enter your password" type="password" />
        </el-form-item>
      </el-form>
      <div class="form-link">
        <div class="form-rember">
          <span class="form-rember-rectangle" @click="showRememberFun">
            <span v-show="rememberMe" class="form-rember-rectangle-fill"></span>
          </span>
          <span class="form-rember-text">Remember me</span>
        </div>
        <div class="form-forgot" @click="goTo('forgot')">Forgot password?</div>
      </div>
      <el-button class="public-button form-button" @click="loginFun(ruleFormRef)">
        Login
      </el-button>
      <p class="form-register">
        <span>Not registered yet?</span>
        <span class="form-register-link" @click="goTo('register')">
          REGISTER
        </span>
      </p>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onBeforeMount, defineEmits } from "vue";
import { ElMessage } from "element-plus";
// import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { getLogin } from "@/services/api/user";

const userStore = useUserStore();
// const router = useRouter();
const emit = defineEmits(["closeDialogFun", "changeTypeFun"]);
const visible = ref(true);
const rememberMe = ref(false);
const ruleFormRef = ref();
let formLogin = reactive({
  account: "",
  passWord: "",
});
const rules = reactive({
  account: [
    {
      type: "email",
      required: true,
      message: "Email is incorrect, please check and try again.",
      trigger: ["blur", "change"],
    },
  ],
  passWord: [
    {
      required: true,
      message: "Password is incorrect, please check and try again.",
      trigger: ["blur", "change"],
    },
  ],
});
onBeforeMount(() => {
  const _loginInfo = localStorage.getItem("loginInfo");
  if (_loginInfo) {
    const { account, passWord } = JSON.parse(_loginInfo);
    formLogin.account = account;
    formLogin.passWord = passWord;
    rememberMe.value = true;
  }
});

const closeDialogFun = () => {
  emit("closeDialogFun");
};
const showRememberFun = () => {
  rememberMe.value = !rememberMe.value;
};
const goTo = (page) => {
  //   router.push({ path: `${page}` });
  emit("changeTypeFun", page);
};
const loginFun = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await getLogin(formLogin);
      if (res && res.code === 200) {
        if (rememberMe.value) {
          localStorage.setItem("loginInfo", JSON.stringify(formLogin));
        } else {
          localStorage.removeItem("loginInfo");
        }
        if (res.data.certificate) {
          localStorage.setItem("certificate", res.data.certificate);
        }
        if (res.data.userType !== "NORMAL") {
          ElMessage({
            message: "Abnormal account",
            type: "warning",
          });
        }
        userStore.setLogin(res.data);
        closeDialogFun();
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
