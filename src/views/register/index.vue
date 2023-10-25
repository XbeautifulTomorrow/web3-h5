<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <el-dialog
      v-model="visible"
      destroy-on-close
      :close-on-click-modal="false"
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="43.75rem"
      :before-close="closeDialogFun"
    >
      <template #header="{ close }">
        <div class="close_btn" v-on="{ click: [close, closeDialogFun] }">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="public-dialog-content form-content" v-if="!isLogin">
        <h2 class="public-dialog-title">{{ $t("login.registerTitle") }}</h2>
        <el-form
          ref="ruleFormRef"
          label-position="top"
          label-width="max-content"
          :model="formRegister"
          :rules="rules"
          :hide-required-asterisk="true"
          :status-icon="true"
          class="public-form"
        >
          <el-form-item :label="$t('login.email')" prop="email">
            <el-input
              v-model="formRegister.email"
              class="public-input"
              :placeholder="$t('login.emailHint')"
            />
          </el-form-item>
          <el-form-item :label="$t('login.password')" prop="passWord">
            <el-input
              v-model="formRegister.passWord"
              class="public-input"
              :placeholder="$t('login.passwordHint')"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item :label="$t('login.confirmPwd')" prop="confirm">
            <el-input
              v-model="formRegister.confirm"
              class="public-input"
              :placeholder="$t('login.confirmPwdHint')"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item
            class="register-captcha"
            :label="$t('login.captcha')"
            prop="captcha"
          >
            <el-input
              v-model="formRegister.captcha"
              class="public-input"
              :placeholder="$t('login.captchaHint')"
            >
              <template #suffix>
                <!-- <el-button type="warning" @click.stop="getCaptchaApi(ruleFormRef)">
                {{ time < 60 ? `${time}s` : $t("login.send") }} </el-button> -->

                <el-button
                  type="warning"
                  v-loading="loading"
                  @click.stop="sendVerify(ruleFormRef)"
                >
                  {{ time < 60 ? `${time}s` : $t("login.send") }}
                </el-button>
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
        <div class="tips_btn" @click="showDialog()">
          {{ $t("login.notReceived") }}
        </div>
        <div class="form-link">
          <div class="form-rember">
            <span class="form-rember-rectangle" @click="showRememberFun">
              <span
                v-show="showRemember"
                class="form-rember-rectangle-fill"
              ></span>
            </span>
            <span class="form-rember-text">
              <span>{{ $t("login.termsText") }}</span>
              <span class="user_agreement" @click="onOpenUrl()">{{
                $t("login.userAgreement")
              }}</span>
            </span>
          </div>
        </div>
        <el-button
          v-if="!showRemember"
          class="public-button form-button disabled"
        >
          {{ $t("login.completeUpper") }}
        </el-button>
        <el-button
          v-else
          class="public-button form-button"
          @click="registerFun(ruleFormRef)"
        >
          {{ $t("login.completeUpper") }}
        </el-button>
      </div>
      <div class="public-dialog-content form-content" v-else>
        <p class="public-dialog-title auth">{{ $t("user.authTitle") }}</p>
        <p class="public-dialog-description">
          Using two-factor authentication is highly recommended because it
          protects your account with both your password and your phone.
        </p>
        <el-button
          class="public-button form-button"
          @click="emit('changeTypeFun', 'auth')"
        >
          {{ $t("user.confirmBtn") }}
        </el-button>
        <el-button
          class="public-button form-button cancel-button"
          @click="emit('changeTypeFun', 'modify')"
        >
          {{ $t("common.skip") }}
        </el-button>
      </div>
      <errorTips
        v-if="showErr"
        @changeTypeFun="changeTypePage"
        @closeFun="handleClose()"
      ></errorTips>
      <imgVerify
        ref="childComp"
        v-if="showVerify"
        @changeTypeFun="getCaptchaApi"
        @closeFun="handleClose()"
      ></imgVerify>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onBeforeUnmount, defineEmits } from "vue";
// import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/user";
import errorTips from "./errorTips.vue";
import imgVerify from "./imgVerify.vue";
import { getCaptcha, getReg } from "@/services/api/user";

import { getSessionStore, setSessionStore, openUrl, encryptCBC } from "@/utils";
import { i18n } from "@/locales";
const { t } = i18n.global;

// const router = useRouter();
const userStore = useUserStore();
const emit = defineEmits(["closeDialogFun", "changeTypeFun"]);
let timer = null;
const isLogin = ref(false);
const visible = ref(true);
const showErr = ref(false);
const showVerify = ref(false);
const showRemember = ref(false);
const loading = ref(false);
const ruleFormRef = ref();
const time = ref(60);
const formRegister = reactive({
  email: "",
  passWord: "",
  confirm: "",
  captcha: "",
  inviteCode: "",
  code: "",
});
const validatePass = (rule, value, callback) => {
  const upperStr = /^(?=.*[A-Z]).{8,}$/;
  const lowerStr = /^(?=.*[a-z]).{8,}$/;
  const numStr = /^(?=.*[0-9]).{8,}$/;

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
    if (formRegister.confirm !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("confirm", () => null);
    }
    callback();
  }
};

const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error(t("login.captchaErrText1")));
  } else if (value !== formRegister.passWord) {
    callback(new Error(t("login.captchaErrText2")));
  } else {
    callback();
  }
};

const rules = reactive({
  email: [
    {
      type: "email",
      required: true,
      message: t("login.emailErr"),
      trigger: ["blur", "change"],
    },
  ],
  captcha: [
    {
      required: true,
      message: t("login.captchaErrText3"),
      trigger: "blur",
    },
  ],
  passWord: [{ validator: validatePass, trigger: ["blur", "change"] }],
  confirm: [{ validator: validatePass2, trigger: ["blur", "change"] }],
});

const onOpenUrl = () => {
  openUrl("/privacy-policy");
};

onBeforeUnmount(() => {
  clearTimerFun();
});
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const showRememberFun = () => {
  showRemember.value = !showRemember.value;
};
const changeTypePage = () => {
  emit("changeTypeFun", "login");
};

const sendVerify = async (formEl) => {
  if (!ruleFormRef.value || time.value < 60) return;
  await formEl.validateField("email", async (valid, fields) => {
    if (valid) {
      setSessionStore("email", formRegister.email);
      showVerify.value = true;
    } else {
      console.log("error submit!", fields);
    }
  });
};

const showDialog = () => {
  if (!formRegister.email) {
    ElMessage({
      message: t("login.emailHint"),
      type: "error",
    });

    return;
  }

  setSessionStore("email", formRegister.email);
  showErr.value = true;
};

const handleClose = () => {
  showErr.value = false;
  showVerify.value = false;
};

const clearTimerFun = () => {
  clearInterval(timer);
  timer = null;
};
const getCaptchaApi = async (code) => {
  handleClose();
  await ruleFormRef.value.validateField("email", async (valid, fields) => {
    if (valid) {
      loading.value = true;
      const res = await getCaptcha({
        type: "register",
        email: formRegister.email,
        code: code,
      });
      if (res && res.code === 200) {
        timer = setInterval(() => {
          time.value--;
          if (time.value < 1) {
            time.value = 60;
            clearTimerFun();
          }
        }, 1000);
        ElMessage({
          message: t("login.sendHint"),
          type: "success",
        });
      }
      loading.value = false;
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
          message: t("login.termsHint"),
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
          localStorage.setItem("certificate", encryptCBC(res.data.certificate));
        }

        userStore.setLogin(res.data);
        userStore.setReg(res.data);
        
        try {
          // eslint-disable-next-line no-undef
          dataLayer.push({
            event: "registration",
            ecommerce: "ok",
          });
        } catch (err) {
          console.log(err);
        }

        isLogin.value = true;
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

.public-dialog-title {
  &.auth {
    padding-top: 1.875rem;
    font-size: 3rem;
  }
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
  border: solid 1px #a9a4b4;
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

.user_agreement {
  color: #fad54d;
  text-decoration: underline;
  cursor: pointer;
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

.form-button + .form-button {
  margin-top: 1.5rem !important;
  margin-left: 0 !important;
}

.tips_btn {
  padding-bottom: 1.875rem;
}

:deep(.el-loading-mask) {
  background-color: rgba(29, 15, 54, 0.6);
  border-radius: 0.5rem;
  cursor: not-allowed;

  .el-loading-spinner {
    text-align: center;
    box-sizing: border-box;

    .circular {
      width: 2rem;
    }
  }
}

@media (max-width: 950px) {
  .form-rember-rectangle {
    width: 0.75rem;
    height: 0.75rem;
    margin-right: 0.5rem;
  }

  .form-rember {
    font-size: 0.75rem;
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
    margin: 0.875rem 0 0;
  }

  .tips_btn {
    padding: 0.75rem;
  }
}
</style>
