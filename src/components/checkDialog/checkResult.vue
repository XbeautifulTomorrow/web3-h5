<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
    class="public-dialog result-loading-dialog"
    width="522"
    :before-close="closeDialogFun"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <img class="public-dialog-header-icon" src="@/assets/svg/close.svg" alt="" v-on="{ click: [close, closeDialogFun] }" />
      </div>
    </template>
    <div class="public-dialog-content">
      <img src="@/assets/svg/user/success.svg" class="status_icon" />
      <p class="public-dialog-loading-text">
        {{ $t("Your deposit has been credited.") }}
      </p>
      <p class="public-dialog-illustrate">
        {{ $t("You have successfully deposited") }}
      </p>
      <div class="handle_btn" @click="closeDialogFun">
        {{ $t("common.confirm") }}
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["closeDialogFun"]);

const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
</script>
<style scoped lang="scss">
.status_icon {
  margin-top: -2rem;
}
.public-dialog-loading-text {
  font-family: BlenderPro;
  font-size: 1.5rem;
  color: #e4e7f5;
  margin-top: 1.875rem;
  margin-bottom: 0.5rem;
}
.public-dialog-illustrate {
  margin-bottom: 3.125rem;
  color: #a9a4b4;
}
.public-dialog-header-icon {
  margin-top: 1.875rem;
  margin-right: 1.875rem;
  cursor: pointer;
}
.handle_btn {
  width: 100%;
  height: 3.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-image: linear-gradient(to top, #e3a406, #fbd851);
  cursor: pointer;
  font-size: 1.125rem;
  line-height: 1.21;
  text-align: center;
  color: #13151f;
}
</style>
