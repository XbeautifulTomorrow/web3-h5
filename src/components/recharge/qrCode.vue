<template>
  <div class="recharge-address">
    <div class="recharge-address-qr">
      <!-- <img
            class="recharge-address-qr-img"
            src="@/assets/img/recharge/USDT.png"
            alt=""
          /> -->
      <div class="recharge-address-qr-img" ref="qrCodeDiv"></div>
      <div class="recharge-address-input">
        <p class="recharge-text">
          Send the amount of Ethereum of your choice to the following address to
          receive the equivalent in Coins.
        </p>
        <el-input v-model="address" placeholder="Paste your Ethereum wallet address here">
          <template #suffix>
            <div class="recharge-add">
              <el-button class="public-button" type="primary" @click.stop="copyFun">
                COPY
              </el-button>
            </div>
          </template>
        </el-input>
      </div>
    </div>
    <div class="recharge-warning">
      <div class="recharge-warning-first">
        <img class="recharge-warning-img" src="@/assets/img/recharge/warning.png" alt="" />
        <p class="recharge-text warning-text">
          Only deposit over the ETH network. Do not use BNB or BSC networks.
          Also do not use third-party smart contracts for transfers.
        </p>
      </div>
      <p v-show="tokenChoose == 1" class="recharge-text warning-text">
        Do NOT send NFT's to this ETH deposit address. In order to recover NFTs
        deposited to this address an administrative fee will be charged.
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import QRCode from "qrcodejs2";

defineProps({
  tokenChoose: {
    type: Number,
    default: 1,
  },
});

const qrCodeDiv = ref(null);
const address = ref("");
const qrText = ref("https://github.com/");
let qrcode = ref(null);
let timer = ref(null);

onMounted(() => {
  timer.value = setTimeout(() => {
    createQrcode();
  }, 10);
});
onUnmounted(() => {
  clearTimerFun();
});

const clearTimerFun = () => {
  clearTimeout(timer.value);
  timer.value = null;
  timer = null;
};
const createQrcode = () => {
  if (qrCodeDiv?.value) {
    qrcode.value = new QRCode(qrCodeDiv.value, {
      text: qrText.value,
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }
};
const copyFun = () => {
  //   navigator.clipboard
  //     .writeText(address.value)
  //     .then(() => {
  //       ElMessage({
  //         message: "内容复制成功",
  //         type: "success",
  //       });
  //     })
  //     .catch(() => {
  //       ElMessage({
  //         message: "内容复制失败",
  //         type: "warning",
  //       });
  //     });
  navigator.clipboard
    .readText()
    .then((clipText) => {
      address.value = clipText;
      ElMessage({
        message: "内容粘贴成功",
        type: "success",
      });
    })
    .catch(() => {
      ElMessage({
        message: "内容粘贴失败",
        type: "warning",
      });
    });
};
</script>
<style lang="scss" scoped>
.recharge-address {
  padding: 20px;
  border-radius: 10px;
  background-color: #191c28;
}

.recharge-address {
  margin-bottom: 30px;
}

.recharge-address-qr {
  $imgWidth: 150px;
  display: flex;
  align-items: center;
  align-content: center;
  margin-bottom: 30px;

  .recharge-address-qr-img {
    width: $imgWidth;
    height: $imgWidth;
    margin-right: 20px;
  }

  .recharge-address-input {
    height: $imgWidth;
  }
}

.recharge-address-input {
  flex: 1;
  display: flex;
  align-items: center;
  align-content: space-between;
  flex-wrap: wrap;
}

.recharge-warning {
  $imgWidth: 24px;
  $imgMargin: 12px;

  .warning-text {
    color: #fad54d;
    margin-left: $imgWidth + $imgMargin;
    margin-top: 16px;
  }

  .recharge-warning-img {
    width: $imgWidth;
    height: $imgWidth;
    margin-right: $imgMargin;
  }
}

.recharge-warning-first {
  display: flex;
  align-items: center;
  align-content: center;

  .warning-text {
    flex: 1;
    margin-left: 0;
    margin-top: 0;
  }
}

.recharge-text {
  text-align: left;
  color: #a9a4b4;
  font-size: 14px;
}
</style>
