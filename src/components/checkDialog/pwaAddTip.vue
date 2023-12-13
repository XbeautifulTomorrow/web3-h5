<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :append-to-body="true"
    class="public-dialog result-loading-dialog"
    width="35.375rem"
    :before-close="closeDialogFun"
    modal-class="add_application_dialog"
  >
    <div class="public-dialog-content">
      <div class="tip_box">
        <img src="/logo.png" class="logo_icon" />
        <p class="text">
          {{ $t("We would like to add Bitzing.io to your home screen for the latest free box and bonus updates.") }}
        </p>
      </div>
      <div class="handle_btn_box">
        <div class="handle_btn dark_btn" @click="closeDialogFun">
          {{ $t("Not Now") }}
        </div>
        <div class="handle_btn" @click="addPwaConfirm">
          {{ $t("Continue") }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["closeDialogFun", "addPwaConfirm"]);

const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const addPwaConfirm = () => {
  emit("addPwaConfirm");
};
</script>
<style scoped lang="scss">
.handle_btn_box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}
.handle_btn {
  height: 2.75rem;
  line-height: 2.75rem;
  padding: 0 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-image: linear-gradient(to top, #e3a406, #fbd851);
  cursor: pointer;
  font-size: 1.125rem;
  text-align: center;
  color: #13151f;
  &.dark_btn {
    font-size:.875rem;
    border: solid 1px rgba(228, 231, 245, 0.15);
    background-color: #292c36;
    background-image: none;
    color: #e4e7f5;
  }
}
.tip_box {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.625rem;
  img {
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    margin-right: 1.25rem;
  }
  .text {
    font-size: 0.875rem;
    color: #fff;
    line-height: 1.43;
    text-align: left;
  }
}
</style>
<style lang="scss">
.add_application_dialog {
  .el-overlay-dialog {
    top: auto;
  }
  .el-dialog {
    background-image: none !important;
    background-color: #2b2451 !important;
  }
}
</style>
