<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-dialog v-model="visible" destroy-on-close :close-on-click-modal="false" :show-close="false" :align-center="true"
    class="public-dialog" width="700" :before-close="closeDialogFun">
    <template #header="{ close }">
      <div class="close_btn">
        <el-icon v-on="{ click: [close, closeDialogFun] }">
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content form-content">
      <h2 class="public-dialog-title">Welcome</h2>
      <el-form ref="ruleFormRef" label-position="top" label-width="max-content" :model="formRegister" :rules="rules"
        :hide-required-asterisk="true" :status-icon="true" class="public-form">
        <el-form-item label="Email" prop="email">
          <el-input v-model="formRegister.email" class="public-input" placeholder="Enter your email" />
        </el-form-item>
        <el-form-item label="Password" prop="passWord">
          <el-input v-model="formRegister.passWord" class="public-input" placeholder="Enter your password" type="password"
            show-password />
        </el-form-item>
        <el-form-item label="Confirm password" prop="confirm">
          <el-input v-model="formRegister.confirm" class="public-input" placeholder="Enter your password again"
            type="password" show-password />
        </el-form-item>
        <el-form-item class="register-captcha" label="Captcha" prop="captcha">
          <el-input v-model="formRegister.captcha" class="public-input" placeholder="Enter your captcha">
            <template #suffix>
              <el-button type="warning" @click.stop="getCaptchaApi(ruleFormRef)">
                {{ time < 60 ? `${time}s` : "Send" }} </el-button>
            </template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="InviteCode (Not Required)">
          <el-input
            v-model="formRegister.inviteCode"
            placeholder="Enter your inviteCode"
          />
        </el-form-item> -->
      </el-form>
      <div class="form-link">
        <div class="form-rember">
          <span class="form-rember-rectangle" @click="showRememberFun">
            <span v-show="showRemember" class="form-rember-rectangle-fill"></span>
          </span>
          <span class="form-rember-text">
            By creating your account, you confirm that you are at least 18 years
            old and agree to our terms and Conditions
          </span>
        </div>
      </div>
      <el-button class="public-button form-button" @click="registerFun(ruleFormRef)">
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
import { getSessionStore } from "@/utils";

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
          message: "The verification code has been sent successfully, please check your email",
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
          message: "Please agree to the terms",
          type: "warning",
        });
        return;
      }
      // eslint-disable-next-line no-unused-vars
      const { confirm, ...data } = formRegister;

      // 如果有则填入邀请码
      const inviteCode = getSessionStore("invateCode") || null;
      if (inviteCode) {
        data.inviteCode = inviteCode;
      }

      const res = await getReg(data);
      if (res && res.code === 200) {
        if (res.data.certificate) {
          localStorage.setItem("certificate", res.data.certificate);
        }

        userStore.setLogin(res.data);
        userStore.setReg(res.data);
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
  width: 1rem;
  height: 1rem;
  flex-grow: 0;
  margin-right: 0.75rem;
  border-radius: 0.1875rem;
  border: solid 0.0625rem #a9a4b4;
  cursor: pointer;
}

.form-rember-rectangle-fill {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  flex-grow: 0;
  border-radius: 0.125rem;
  background-color: #fad54d;
}

.form-rember {
  display: flex;
  align-content: center;
  align-items: flex-start;
  font-size: 1rem;
  text-align: left;
}

.form-rember-text {
  flex: 1;
}

.form-forgot,
.form-register-link {
  color: #11cde9;
  cursor: pointer;
}

.form-register-link {
  margin-left: 1.25rem;
}

.form-button {
  margin: 2.5rem 0 0;
}
</style>
