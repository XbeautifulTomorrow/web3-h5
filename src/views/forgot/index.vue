<!-- eslint-disable vue/multi-word-component-names -->
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
        <p class="public-dialog-title">{{ title }}</p>
        <el-form v-if="type === 0" ref="ruleFormRef" label-position="top" label-width="max-content" :model="formLogin"
          :rules="rules" :hide-required-asterisk="true" :status-icon="true" class="public-form">
          <el-form-item :label="$t('login.email')" prop="email">
            <el-input class="public-input" v-model="formLogin.email" :placeholder="$t('login.emailHint')" />
          </el-form-item>
          <el-form-item prop="code">
            <div class="auth_code">
              <el-input v-model="formLogin.code" class="public-input" :placeholder="$t('common.verifyEnter')" />
              <img class="verify_img" :src="codeImg" alt="" v-show="codeImg" @click="refreshAuthimage()" />
              <div class="refresh_btn" @click="refreshAuthimage()">{{ $t("common.refresh") }}</div>
            </div>
          </el-form-item>
          <div class="form-buttons">
            <el-button class="public-button cancel-button" v-on="{ click: [closeDialogFun] }">
              {{ $t("common.cancel") }}
            </el-button>
            <el-button class="public-button" @click="resetFun(ruleFormRef)" v-loading="loading">
              {{ $t("login.resetPwd") }}
            </el-button>
          </div>
        </el-form>
        <code-popup v-else-if="type === 1" :email="formLogin.email" @changeTypeFun="changeTypeFun" />
        <change-paw v-else-if="type === 2" @changeTypeFun="changeTypeFun" :formLogin="formLogin" />
        <template v-else>
          <p class="public-dialog-illustrate">
            {{ $t("login.resetSuccess") }}
          </p>
          <el-button class="public-button" @click="goTo('login')">
            {{ $t("common.login") }}
          </el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, defineEmits, onMounted } from "vue";
// import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getAuthimage } from "@/services/api";
import { getCaptcha } from "@/services/api/user";
import codePopup from "./code.vue";
import changePaw from "./changePaw.vue";
import { setSessionStore } from "@/utils";
import { i18n } from '@/locales';
const { t } = i18n.global;
// const router = useRouter();
const visible = ref(true);
const emit = defineEmits(["closeDialogFun", "changeTypeFun"]);
const type = ref(0);
const ruleFormRef = ref();
const title = ref(t("login.forgotTitle1"));
const loading = ref(false);

const codeImg = ref("");

let formLogin = reactive({
  email: "",
  passWord: "",
  captcha: "",
  code: ""
});
const rules = reactive({
  email: [
    {
      required: true,
      message: t("login.forgotEmailErr1"),
      trigger: "blur",
    },
    {
      type: "email",
      message: t("login.forgotEmailErr2"),
      trigger: ["blur", "change"],
    },
  ],
  code: [{
    required: true,
    message: t("common.verifyEnter"),
    trigger: "blur",
  },]
});

const refreshAuthimage = async () => {
  const res = await getAuthimage();
  if (res) {
    sessionStorage.setItem('verify', res.headers.verify);

    let blob = new Blob([res.data], {
      type: res.headers.contentType
    });

    codeImg.value = window.URL.createObjectURL(blob);
  }
}

const changeTypeFun = (_type, data) => {
  if (_type === 0) {
    title.value = t("login.forgotTitle1");
  } else if (_type === 1) {
    setSessionStore("email", formLogin.email);
    title.value = t("login.forgotTitle2");
  } else {
    title.value = t("login.forgotTitle3");
  }
  if (data) {
    formLogin = { ...formLogin, ...data };
  }
  type.value = _type;
};

const closeDialogFun = () => {
  emit("closeDialogFun");
};

const goTo = (page) => {
  //   router.push({ path: `${page}` });
  emit("changeTypeFun", page);
};

onMounted(() => {
  refreshAuthimage();
});

const resetFun = async (formEl) => {
  if (!formEl || loading.value) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      const res = await getCaptcha({
        type: "update_password",
        email: formLogin.email,
        code: formLogin.code
      });

      if (res && res.code === 200) {
        changeTypeFun(1);
        ElMessage({
          message: t("login.sendHint"),
          type: "success",
        });
      } else {
        refreshAuthimage();
      }

      loading.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style lang="scss" scoped>
.form-content {
  font-size: 1rem;
  color: #a9a4b4;
}

.form-buttons {
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: space-between;
}

.auth_code {
  width: 100%;
  display: flex;
  align-items: center;

  .public-input {
    flex: 1;
  }

  .verify_img {
    width: auto;
    height: 4.375rem;
    border: solid 1px #363945;
    border-radius: 0.5rem;
    box-sizing: border-box;
    margin-left: 1rem;
  }

  .refresh_btn {
    margin-left: 1rem;
    font-size: 1.25rem;
    color: #fad54d;
    text-decoration: underline;
  }
}

:deep(.el-loading-mask) {
  background-color: rgba(29, 15, 54, 0.4);
  border-radius: 0.5rem;
  cursor: not-allowed;
}

.public-dialog-illustrate {
  margin: 1.875rem 0;
}


@media screen and (max-width: 950px) {
  .form-buttons {
    margin-top: 1rem;
  }

  .auth_code {

    .public-input {
      flex: 1;
    }

    .verify_img {
      width: auto;
      height: 3rem;
      border: solid 1px #363945;
      border-radius: 0.25rem;
      box-sizing: border-box;
      margin-left: 0.5rem;
    }

    .refresh_btn {
      margin-left: 0.5rem;
      font-size: 0.75rem;
      color: #fad54d;
    }
  }
}
</style>
