<template>
  <div>
    <el-dialog
      v-model="show"
      destroy-on-close
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="31.875rem"
      :before-close="handleClose"
    >
      <template #header>
        <div class="close_btn" @click="handleClose()">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="public-dialog-content form-content">
        <div class="must_read_box">
          <p class="must_read_title">
            <span>{{ $t("tokenWar.warMustRead") }}</span>
          </p>
          <div class="must_read_text">
            {{ $t("tokenWar.warMustReadText") }}
          </div>
          <div class="form-rember">
            <span class="form-rember-rectangle" @click="showRememberFun">
              <span
                v-show="rememberMe"
                class="form-rember-rectangle-fill"
              ></span>
            </span>
            <span class="form-rember-text">{{ $t("tokenWar.notPrompt") }}</span>
          </div>
          <div class="must_read_btns">
            <div class="btn_confirm" @click="joinWar()">
              {{ $t("tokenWar.continueText") }}
            </div>
            <div class="btn_cancel" @click="handleClose()">
              {{ $t("tokenWar.cancelText") }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setLocalStore } from "@/utils";

export default {
  name: "WarMustRead",
  data() {
    return {
      show: true,
      rememberMe: false,
    };
  },
  methods: {
    showRememberFun() {
      this.rememberMe = !this.rememberMe;
    },
    joinWar() {
      if (this.rememberMe) {
        setLocalStore("must_read", "1");
      }

      this.$emit("changeTypeFun", "must_read");
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("closeDialogFun", "must_read");
    },
  },
  created() {},
  watch: {},
};
</script>
<style lang="scss" scoped>
@import "./components/warMustRead.scss";
</style>
