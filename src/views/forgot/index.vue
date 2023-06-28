<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-dialog v-model="visible" destroy-on-close :close-on-click-modal="true" :show-close="false" :align-center="true"
    class="public-dialog" width="700" :before-close="closeDialogFun">
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
        <div class="form-buttons">
          <el-button class="public-button cancel-button" v-on="{ click: [closeDialogFun] }">
            {{ $t("common.cancel") }}
          </el-button>
          <el-button class="public-button" @click="resetFun(ruleFormRef)">
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
</template>
<script setup>
import { ref, reactive, defineEmits } from "vue";
// import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getCaptcha } from "@/services/api/user";
import codePopup from "./code.vue";
import changePaw from "./changePaw.vue";
import { setSessionStore } from "@/utils";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
// const router = useRouter();
const visible = ref(true);
const emit = defineEmits(["closeDialogFun", "changeTypeFun"]);
const type = ref(0);
const ruleFormRef = ref();
const title = ref(t("login.forgotTitle1"));
let formLogin = reactive({
  email: "",
  passWord: "",
  captcha: "",
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
});
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
const resetFun = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      changeTypeFun(1);
      const res = await getCaptcha({
        type: "update_password",
        email: formLogin.email,
      });
      if (res && res.code === 200) {
        ElMessage({
          message: t("login.sendHint"),
          type: "success",
        });
      }
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

.public-dialog-illustrate {
  margin: 1.875rem 0;
}


@media screen and (max-width: 950px) {
  .form-buttons {
    margin-top: 1rem;
  }
}
</style>
