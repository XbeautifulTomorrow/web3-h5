<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <el-dialog v-model="visible" destroy-on-close :show-close="false" :close-on-click-modal="false" :align-center="true"
      class="public-dialog" width="43.75rem" :before-close="closeDialogFun">
      <template #header="{ close }">
        <div class="close_btn" v-on="{ click: [close, closeDialogFun] }">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="public-dialog-content form-content">
        <p class="public-dialog-title">{{ $t("common.loginText") }}</p>
        <el-form ref="ruleFormRef" label-position="top" label-width="max-content" :model="formLogin" :rules="rules"
          :hide-required-asterisk="true" :status-icon="true" class="public-form">
          <el-form-item :label="$t('login.email')" prop="account">
            <el-input class="public-input" v-model="formLogin.account" @blur="fetchGoogleAuth"
              :placeholder="$t('login.emailHint')" />
          </el-form-item>
          <el-form-item :label="$t('login.password')" prop="passWord">
            <el-input class="public-input" v-model="formLogin.passWord" :placeholder="$t('login.passwordHint')"
              type="password" />
          </el-form-item>
          <el-form-item :label="$t('user.inputTitle')" prop="validatCode" v-if="isAuth">
            <el-input class="public-input" v-model="formLogin.validatCode" :placeholder="$t('login.captchaHint')"
              type="password" />
          </el-form-item>
        </el-form>
        <div class="form-link">
          <div class="form-rember">
            <span class="form-rember-rectangle" @click="showRememberFun">
              <span v-show="rememberMe" class="form-rember-rectangle-fill"></span>
            </span>
            <span class="form-rember-text">{{ $t("login.rememberMe") }}</span>
          </div>
          <div class="form-forgot" @click="goTo('forgot')">{{ $t("login.goForgot") }}</div>
        </div>
        <el-button class="public-button form-button" @click="loginFun(ruleFormRef)">
          {{ $t("common.login") }}
        </el-button>
        <p class="form-register">
          <!-- <a :href="googleUrl" style="color:#fff;text-decoration: auto;">
            <span>{{ $t("login.notRegisteredHint") }}</span>
          </a> -->
          <span @click="goGooleFunc">{{ $t("login.notRegisteredHint") }}</span>
          <span class="form-register-link" @click="goTo('register')">
            {{ $t("login.registerUpper") }}
          </span>
        </p>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onBeforeMount, onMounted, defineEmits } from "vue";
import { useUserStore } from "@/store/user";
import { useHeaderStore } from "@/store/header.js";
import { getLogin, getGoogleValidateStatus,googleRedictUrl } from "@/services/api/user";
import { encryptCBC } from "@/utils";
import { i18n } from '@/locales';
import config from "@/services/env";
const { t } = i18n.global;

const userStore = useUserStore();
// const router = useRouter();
const emit = defineEmits(["closeDialogFun", "changeTypeFun"]);
const visible = ref(true);
const rememberMe = ref(false);
const ruleFormRef = ref();
const isAuth = ref(false);
const googleUrl = config.api+'mystery-web-user/auth/google/redictUrl'
const iframeNode = ref(null)

let formLogin = reactive({
  account: "",
  passWord: "",
  validatCode: ""
});
const rules = reactive({
  account: [
    {
      type: "email",
      required: true,
      message: t("login.emailErr"),
      trigger: ["blur", "change"],
    },
  ],
  passWord: [
    {
      required: true,
      message: t("login.passwordErr"),
      trigger: ["blur", "change"],
    },
  ],
  validatCode: [
    {
      required: true,
      message: t("user.codeRequired"),
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
const goGooleFunc = async () => {
  let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=800,height=500,left=10%,top=20%`;
  //打开小窗口
  const newWindow = window.open(googleUrl, '_blank', params);
  newWindow.addEventListener('load', function(event) {
  // 处理iframe内容已加载完成的逻辑
  console.log(event,'load------------------------')
});
  newWindow.addEventListener("message", (event) => {
      // const res = event.data;
      console.log(event,'resevent------------------------')
      // newWindow.close();
      //小窗口的登录信息，包含token
      // if(res.code == '000000'){
      //     //拿到相应的登录token去登录，如果失败给出提示
      //     this.dispatch("user/getUserInfo", res.token).then(() => {
      //         this.$router.replace("/");
      //     });
      // } else {
      //   console.log('login fail')
      //     // this.$message.closeAll();
      //     // this.$message.error(res.message || "login fail~");
      // }
  });
}

const fetchGoogleAuth = async () => {
  const res = await getGoogleValidateStatus({
    email: formLogin.account
  });
  if (res && res.code == 200) {
    isAuth.value = res.data == "TRUE"
  }
}

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
          localStorage.setItem("certificate", encryptCBC(res.data.certificate));
        }
        // if (res.data.userType !== "NORMAL") {
        //   ElMessage({
        //     message: t("common.abnormal"),
        //     type: "warning",
        //   });
        // }
        userStore.setLogin(res.data);
        const headerStore = useHeaderStore();
        headerStore.getTheUserBalanceApi();
        headerStore.fetchTheUserPoint();
        closeDialogFun();
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

onMounted(() => {
  if (formLogin.account) {
    fetchGoogleAuth();
  }
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
