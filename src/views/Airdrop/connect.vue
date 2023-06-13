<template>
  <div>
    <el-dialog v-model="show" width="43.75rem" lock-scroll :close-on-click-modal="false" :before-close="closePopup">
      <div class="close_btn" @click="closePopup()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="link_box">
        <div class="operating_title">
          <span>Connect Wallet</span>
        </div>
        <div class="operating_tips">Choose a wallet connection method</div>
        <div class="operating_item" @click="connectMetaMask()">
          <div class="item_l">
            <img src="@/assets/svg/user/meta_mask.svg" alt="" srcset="">
            <span>MetaMask</span>
          </div>
          <img src="@/assets/svg/user/icon_arrow.svg" alt="" srcset="">
        </div>
        <div class="operating_item">
          <div class="item_l">
            <img src="@/assets/svg/user/wallet_connect.svg" alt="" srcset="">
            <span>WalletConnect</span>
          </div>
          <img src="@/assets/svg/user/icon_arrow.svg" alt="" srcset="">
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "connectDialog",
  props: ["connect", "close"],
  data() {
    return {
      show: true,
    };
  },
  methods: {
    connectMetaMask() {
      this.$emit("connectMetaMask");
    },
    closePopup(done) {
      this.show = false;
      this.$emit("close");


      if (done) {
        done();
        return
      }
    },
  },
};
</script>
<style lang="scss" scoped>
:deep(.el-dialog) {
  border-radius: 1.25rem;
  box-shadow: inset 0 0.125rem 0 0 rgba(255, 255, 255, 0.05);
  background-color: #20222d;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
    position: relative;
    padding: 3.75rem 0;
  }
}

.close_btn {
  position: absolute;
  top: 1.6875rem;
  right: 1.875rem;
  width: 2.8125rem;
  height: 2.8125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #2d313f;
  background-color: #2a2d36;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  color: #a9a4b4;
}

.operating_title {
  font-family: BlenderPro;
  font-size: 4rem;
  font-weight: bold;
  line-height: 1.2;
  text-align: center;
  color: white;
}

.link_box {
  padding: 0 1.875rem;

  .operating_tips {
    font-size: 1.125rem;
    line-height: 1.6;
    text-align: center;
    color: #a9a4b4;
    padding-bottom: 1.875rem;
  }

  .operating_item+.operating_item {
    margin-top: 1.25rem;
  }

  .operating_item {
    height: 4.375rem;
    border-radius: 0.5rem;
    border: solid 1px #363945;
    background-color: #13151f;
    padding: 0 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    .item_l {
      display: flex;
      align-items: center;
      font-size: 1.125rem;
      line-height: 1.6;
      color: #a9a4b4;

      img {
        width: 1.875rem;
      }

      &>span {
        padding-left: 0.625rem;
      }
    }

    .item_r {
      width: 1.5rem;
    }
  }
}
</style>
