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
            <span>{{ $t("tokenWar.warMustReadText1") }}</span>
            <span style="color: #fad54d">
              {{ $t("tokenWar.warMustReadText2") }}
            </span>
            <br />
            <br />
            <span style="font-weight: bold">{{
              $t("tokenWar.warMustReadText3")
            }}</span>
          </div>
          <div class="must_read_btns">
            <div class="btn_confirm" @click="joinWar()">
              {{ $t("tokenWar.continueText") }}
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
    };
  },
  methods: {
    joinWar() {
      setLocalStore("must_read", "1");
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
