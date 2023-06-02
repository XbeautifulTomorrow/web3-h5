<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :close-on-click-modal="false"
    :show-close="false"
    :align-center="true"
    class="public-dialog"
    width="700"
    :before-close="closeDialogFun"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <el-icon
          v-on="{ click: [close, closeDialogFun] }"
          color="#2d313f"
          size="16"
          class="public-dialog-header-icon"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content form-content">
      <h2 class="public-dialog-title">Welcome</h2>
      <el-form
        ref="ruleFormRef"
        label-position="top"
        label-width="max-content"
        :model="formRegister"
        :rules="rules"
        :hide-required-asterisk="true"
        :status-icon="true"
        class="public-login"
      >
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="formRegister.email"
            placeholder="Enter your email"
          />
        </el-form-item>
        <el-form-item label="Password" prop="passWord">
          <el-input
            v-model="formRegister.passWord"
            placeholder="Enter your password"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="Confirm password" prop="confirm">
          <el-input
            v-model="formRegister.confirm"
            placeholder="Enter your password again"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item class="register-captcha" label="Captcha" prop="captcha">
          <el-input
            v-model="formRegister.captcha"
            placeholder="Enter your captcha"
          >
            <template #suffix>
              <el-button
                type="warning"
                @click.stop="getCaptchaApi(ruleFormRef)"
              >
                {{ time < 60 ? `${time}s` : "发送验证码" }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="InviteCode (Not Required)">
          <el-input
            v-model="formRegister.inviteCode"
            placeholder="Enter your inviteCode"
          />
        </el-form-item>
      </el-form>
      <div class="form-link">
        <div class="form-rember">
          <span class="form-rember-rectangle" @click="showRememberFun">
            <span
              v-show="showRemember"
              class="form-rember-rectangle-fill"
            ></span>
          </span>
          <span class="form-rember-text">
            By creating your account, you confirm that you are at least 18 years
            old and agree to our terms and Conditions
          </span>
        </div>
      </div>
      <el-button
        class="public-button form-button"
        @click="registerFun(ruleFormRef)"
      >
        Complete Registration
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onBeforeUnmount, defineEmits } from "vue";
// import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/user";
import { getCaptcha, getReg } from "@/services/api/user";

// const router = useRouter();
const userStore = useUserStore();
const emit = defineEmits(["closeDialogFun", "changeTypeFun"]);
let timer = null;
const visible = ref(true);
const showRemember = ref(false);
const ruleFormRef = ref();
const time = ref(60);
const formRegister = reactive({
  email: "",
  passWord: "",
  confirm: "",
  captcha: "",
  inviteCode: "",
});
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (formRegister.confirm !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("confirm", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== formRegister.passWord) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};
const rules = reactive({
  email: [
    {
      type: "email",
      required: true,
      message: "Email is incorrect, please check and try again.",
      trigger: ["blur", "change"],
    },
  ],
  captcha: [
    {
      required: true,
      message: "captcha is incorrect, please check and try again.",
      trigger: "blur",
    },
  ],
  passWord: [{ validator: validatePass, trigger: ["blur", "change"] }],
  confirm: [{ validator: validatePass2, trigger: ["blur", "change"] }],
});

onBeforeUnmount(() => {
  clearTimerFun();
});
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const showRememberFun = () => {
  showRemember.value = !showRemember.value;
};
const clearTimerFun = () => {
  clearInterval(timer);
  timer = null;
};
const getCaptchaApi = async (formEl) => {
  if (!formEl || time.value < 60) return;
  await formEl.validateField("email", async (valid, fields) => {
    if (valid) {
      timer = setInterval(() => {
        time.value--;
        if (time.value < 1) {
          time.value = 60;
          clearTimerFun();
        }
      }, 1000);
      const res = await getCaptcha({
        type: "register",
        email: formRegister.email,
      });
      if (res && res.code === 200) {
        ElMessage({
          message: "验证码发送成功,请前往邮箱查看",
          type: "success",
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const registerFun = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (!showRemember.value) {
        ElMessage({
          message: "请同意条款",
          type: "warning",
        });
        return;
      }
      const { confirm, ...data } = formRegister;
      const res = await getReg(data);
      if (res && res.code === 200) {
        userStore.setReg(res.data);
        // router.push({ path: `login` });
        if (res.data.certificate) {
          localStorage.setItem("certificate", res.data.certificate);
        }
        emit("changeTypeFun", "login");
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
.form-rember {
  display: flex;
  align-content: center;
  align-items: flex-start;
  font-size: 16px;
  text-align: left;
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
<style lang="scss">
.register-captcha {
  .el-input__wrapper {
    padding-right: 0 !important;
  }
  .el-input__validateIcon {
    display: none !important;
  }
}
</style>
