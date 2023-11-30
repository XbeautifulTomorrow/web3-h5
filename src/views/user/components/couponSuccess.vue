<template>
  <div>
    <el-dialog
      v-model="show"
      destroy-on-close
      :close-on-click-modal="false"
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="50rem"
      :before-close="handleClose"
    >
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="public-dialog-content form-content">
        <p class="public-dialog-title">REDEEM COUPON CODE</p>
        <img
          class="success_img"
          src="@/assets/svg/user/icon_success.svg"
          alt=""
        />
        <div class="exchange_data">
          <span class="exchange_val">{{ `1 USDT ` }}</span>
          <span>
            {{ $t("user.exchangeInstructions") }}
          </span>
        </div>
        <div class="form-buttons">
          <el-button class="public-button" @click="handleClose()">
            <span>{{ $t("login.ok") }}</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
    
<script>
export default {
  name: "couponSuccess",
  props: {
    coupon: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      show: true,
      setting: {},
    };
  },
  methods: {
    // 关闭弹窗
    handleClose(done) {
      this.$emit("closeDialogFun");

      if (done) {
        done();
        return;
      }
    },
  },
};
</script>
    
<style lang="scss" scoped>
:deep(.public-dialog) {
  .el-dialog__body {
    padding: 1.875rem !important;
  }
}

.public-dialog-title {
  padding-top: 1.875rem;
}
.success_img {
  width: 7.5rem;
  height: auto;
  margin: 1.875rem 0;
}

.exchange_data {
  margin-bottom: 1.875rem;
  font-family: Inter;
  font-size: 0.875rem;
  line-height: 1.57;
  text-align: center;
  color: white;

  .exchange_val {
    color: #fad54d;
  }
}

.form-buttons {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 1.875rem 1.875rem;
}

@media screen and (max-width: 950px) {
  :deep(.public-dialog) {
    .public-dialog-title {
      font-size: 1.5rem;
      padding-top: 1rem;
    }
  }
  .success_img {
    width: 5rem;
    height: auto;
    margin: 1rem 0;
  }

  .exchange_data {
    margin-bottom: 1.5rem;
    font-size: 0.75rem;
  }

  .form-buttons {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-bottom: 0;
  }
}
</style>