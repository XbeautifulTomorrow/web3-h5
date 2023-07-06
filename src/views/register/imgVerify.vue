<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-dialog v-model="showVerify" destroy-on-close :close-on-click-modal="false" :show-close="false" :align-center="true"
    class="public-dialog" width="34.375rem" :before-close="closeDialogFun">
    <template #header="{ close }">
      <div class="close_btn" v-on="{ click: [close, closeDialogFun] }">
        <el-icon>
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content form-content">
      <div class="verify_text">
        <div>{{ $t("common.verifyHint") }}</div>
        <div class="email">&nbsp;{{ email }}</div>
      </div>
      <div class="auth_code">
        <el-input v-model="codeVerify" class="public-input" :placeholder="$t('common.verifyEnter')" />
        <img class="verify_img" :src="codeImg" alt="" v-show="codeImg" @click="refreshAuthimage()" />
        <div class="refresh_btn" @click="refreshAuthimage()">{{ $t("common.refresh") }}</div>
      </div>
      <el-button class="public-button form-button" @click="changeTypeFun()">
        {{ $t("common.confirm") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { getSessionStore } from "@/utils";
import { getAuthimage } from "@/services/api";
import { ref, defineEmits, defineExpose, onMounted } from "vue";
const emit = defineEmits(["closeDialogFun", "changeTypeFun"]);
const showVerify = ref(true);
const codeImg = ref("");
const codeVerify = ref("");
const email = ref(getSessionStore("email"));

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

const closeDialogFun = () => {
  emit("closeFun");
};

const changeTypeFun = () => {
  emit("changeTypeFun", codeVerify.value);
}

onMounted(() => {
  refreshAuthimage();
});

defineExpose({
  refreshAuthimage
})

</script>
<style lang="scss" scoped>
.verify_text {
  padding: 0 0 1.25rem;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: left;
  color: #cac7d1;

  .email {
    color: white;
  }
}

.auth_code {
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

.form-button {
  margin-top: 1.875rem;
}

@media screen and (max-width: 950px) {
  .verify_text {
    padding: 0 0 1.5rem;
    font-size: 1rem;
    text-align: left;
    color: #cac7d1;

    .email {
      color: white;
    }
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
