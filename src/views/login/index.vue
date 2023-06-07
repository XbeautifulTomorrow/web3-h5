<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-dialog v-model="visible" destroy-on-close :show-close="false" :align-center="true" class="public-dialog" width="700"
    :before-close="closeDialogFun">
    <template #header="{ close }">
      <div class="public-dialog-header">
        <el-icon v-on="{ click: [close, closeDialogFun] }" color="#2d313f" size="16" class="public-dialog-header-icon">
          <CircleCloseFilled />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content form-content">
      <h2 class="public-dialog-title">Login</h2>
      <el-form ref="ruleFormRef" label-position="top" label-width="max-content" :model="formLogin" :rules="rules"
        :hide-required-asterisk="true" :status-icon="true" class="public-login">
        <el-form-item label="Email" prop="account">
          <!-- SuccessFilled -->
          <!-- CircleCloseFilled -->
          <el-input v-model="formLogin.account" placeholder="Enter your email" />
        </el-form-item>
        <el-form-item label="Password" prop="passWord">
          <el-input v-model="formLogin.passWord" placeholder="Enter your password" type="password" />
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
        if (res.data.userType === "NORMAL") {
          ElMessage({
            message: "账号正常",
            type: "success",
          });
        } else {
          ElMessage({
            message: "账号异常",
            type: "warning",
          });
        }
        userStore.setLogin(res.data);
        // goTo("home");
        closeDialogFun();
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

.form-rember-rectangle {
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-grow: 0;
  margin-right: 12px;
  border-radius: 3px;
  border: solid 1px #a9a4b4;
  cursor: pointer;
}

.form-rember-rectangle-fill {
  display: inline-block;
  width: 8px;
  height: 8px;
  flex-grow: 0;
  border-radius: 2px;
  background-color: #fad54d;
}

.form-link,
.form-rember {
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: space-between;
  font-size: 16px;
}

.form-forgot,
.form-register-link {
  color: #11cde9;
  cursor: pointer;
}

.form-register-link {
  margin-left: 20px;
}

.form-button {
  margin: 40px auto 20px;
}
</style>
