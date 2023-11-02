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
            <span>战前必读...</span>
          </p>
          <div class="must_read_text">
            在你参战之前，我们希望您对游戏的规则有着全面的了解。
            这是一个赢者通吃的游戏，如果您获得了胜利，将收获整个奖池。
            反之，如果您失败了，您将失去所有投入奖池的金额。 It’s TOKEN WAR,
            winner TAKING ALL!
          </div>
          <div class="form-rember">
            <span class="form-rember-rectangle" @click="showRememberFun">
              <span
                v-show="rememberMe"
                class="form-rember-rectangle-fill"
              ></span>
            </span>
            <span class="form-rember-text">{{ $t("login.rememberMe") }}</span>
          </div>
          <div class="must_read_btns">
            <div class="btn_confirm" @click="joinWar()">
              I Understand - Let's Do It
            </div>
            <div class="btn_cancel" @click="handleClose()">算了，我胆小</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setSessionStore } from "@/utils";

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
        setSessionStore("must_read", "1");
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
