<template>
  <div>
    <el-dialog
      v-model="show"
      destroy-on-close
      :close-on-click-modal="false"
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      :width="dialogType == 1 ? '43.75rem' : '32.625rem'"
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
        <p class="public-dialog-title" v-if="dialogType == 1">
          {{ $t("recharge.confirmTitle") }}
        </p>
        <Image
          v-else-if="dialogType == 4"
          :src="nftInfo.nftImg"
          fit="cover"
          :class="['nft_img', 'depositImg']"
        />
        <Image
          v-else
          fit="cover"
          :src="require('@/assets/img/home/loading.png')"
          class="loading-img"
        />
        <div class="confirm-description" v-if="dialogType == 1">
          <span
            class="description-text"
            v-html="$t('recharge.confirmDescription1', { gas: gasContent() })"
          ></span>
          <span>{{ $t("recharge.confirmDescription2") }}</span>
        </div>
        <div v-else-if="dialogType == 2">
          <div class="wait-title">{{ $t("recharge.waitTitle") }}</div>
          <div class="wait-text">{{ $t("recharge.waitText") }}</div>
        </div>
        <div v-else-if="dialogType == 3">
          <div class="wait-title">{{ $t("recharge.depositWaitTitle") }}</div>
          <div class="wait-text">{{ $t("recharge.depositWaitText") }}</div>
        </div>
        <div v-else-if="dialogType == 4">
          <div class="wait-title">{{ $t("recharge.completeTitle1") }}</div>
          <div class="wait-text deposit_nft">
            <span>{{ $t("recharge.nftLabel") }}</span>
            <span>{{ nftInfo.name || "--" }}</span>
          </div>
        </div>
        <div class="deposit_tx_id" v-if="dialogType == 4">
          <span>{{ $t("recharge.transactionId") }}</span>
          <span @click="viewTxid()">{{ txId }}</span>
        </div>
        <Image
          v-if="dialogType == 1"
          fit="cover"
          class="nft_img"
          :src="nftInfo.img"
        />
        <div class="nft-info" v-if="dialogType == 1">
          <span>{{ nftInfo.name || "--" }}</span>
          <span>#{{ nftInfo.tokenId }}</span>
        </div>
        <div class="form-buttons" v-if="dialogType < 3">
          <el-button
            v-if="dialogType == 1"
            class="public-button cancel-button"
            @click="handleClose()"
          >
            {{ $t("common.cancelUpper") }}
          </el-button>
          <el-button class="public-button" @click="onConfirm()">
            <span v-if="dialogType == 1">{{
              $t("recharge.wthdrawBtnText")
            }}</span>
            <span v-if="dialogType == 2">{{ $t("recharge.continue") }}</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
    
<script>
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import Image from "@/components/imageView";
import { i18n } from "@/locales";
const { t } = i18n.global;
import { ElMessage } from "element-plus";
import { openUrl } from "@/utils";
import { getSetting } from "@/services/api/invite";

export default {
  name: "modifyName",
  components: {
    Image,
  },
  props: {
    nftInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    dialogType: {
      type: Number,
      default: 1, // 1:提取确认，2:提取等待，3:充值等待，4:充值完成
    },
    txId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: true,
      setting: {},
    };
  },
  computed: {
    ...mapStores(useHeaderStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
  },
  methods: {
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: "USDT",
      });

      if (res && res.code == 200) {
        this.setting = res.data;
        this.$forceUpdate();
      }
    },
    gasContent() {
      let strV = `<div style="display: inline-flex;align-items: center;">`;
      strV += `<img style='width: 1.5rem;height: auto;margin-right: 0.25rem' src='${require("@/assets/svg/user/icon_usdt_gold.svg")}'>`;
      strV += `<span style='font-size: 1.25rem;color: #fad54d;' >${this.setting.nftWithdrawalFees}</span></div>`;
      return strV;
    },
    onConfirm() {
      if (this.dialogType == 1) {
        if (this.ethBalance < Number(this.setting.nftWithdrawalFees)) {
          ElMessage({
            message: t("lottery.tips5"),
            type: "error",
          });

          return;
        }
        this.$emit("confirm");
      } else if (this.dialogType == 2) {
        this.$emit("cancelDialogFun");
      }
    },
    viewTxid() {
      const transactionUrl = process.env.VUE_APP_TRANSACTION_ADDR;
      openUrl(transactionUrl + this.txId);
    },
    /**
     * @description: 格式化地址
     */
    formatAddr(event) {
      if (!event) return "";
      var reg = /^(\S{6})\S+(\S{4})$/;
      return event.replace(reg, "$1...$2");
    },
    // 关闭弹窗
    handleClose(done) {
      this.$emit("cancelDialogFun");

      if (done) {
        done();
        return;
      }
    },
  },
  created() {
    this.fetchSetting();
  },
};
</script>
    
<style lang="scss" scoped>
.public-dialog-title {
  padding-top: 1.875rem;
}

.confirm-description {
  margin: 0 auto;
  max-width: 32.5rem;
  font-family: Inter;
  font-size: 1.125rem;
  line-height: 1.875rem;
  text-align: center;
  color: #a9a4b4;

  .description-text {
    display: flex;
    white-space: pre-wrap;
    align-items: center;
    justify-content: center;
  }
}

.nft_img {
  margin: 1.875rem 0 0.625rem;
  width: 22.375rem;
  height: 22.375rem;
  border-radius: 0.5rem;

  &.depositImg {
    margin: 1.875rem 0;
    width: 7.375rem;
    height: 7.375rem;
  }
}

.loading-img {
  margin: 1.875rem 0 1.25rem;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  transform: rotate(0);
  animation: rotation 0.5s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}

.wait-title {
  font-family: BlenderPro;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.4;
  text-align: center;
  color: white;
}

.wait-text {
  font-family: Inter;
  font-size: 0.75rem;
  line-height: 1.6;
  text-align: center;
  color: #a9a4b4;
  padding: 0.5rem 0 1.25rem;

  &.deposit_nft {
    display: flex;
    align-items: center;
    justify-content: center;

    span + span {
      padding-left: 0.25rem;
    }

    span:last-child {
      font-family: Inter;
      font-size: 0.75rem;
      line-height: 1.6;
      text-align: center;
      color: #11cde9;
    }
  }
}

.deposit_tx_id {
  padding: 1.25rem 0 1.875rem;

  span + span {
    padding-left: 0.25rem;
  }

  span {
    display: block;
  }

  span:nth-child(1) {
    font-family: Inter;
    font-size: 0.75rem;
    font-weight: bold;
    line-height: 1.4;
    text-align: center;
    color: white;
  }

  span:last-child {
    font-family: Inter;
    font-size: 0.75rem;
    line-height: 1.6;
    text-align: center;
    color: #11cde9;
    cursor: pointer;
  }
}

.nft-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1.25rem;

  font-family: BlenderPro;
  font-size: 2.875rem;
  font-weight: bold;
  line-height: 1;
  text-align: left;
  color: white;

  & > span {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & > span:last-child {
    max-width: 40%;
  }
}

.form-buttons {
  display: flex;
  align-items: center;
  padding-bottom: 1.875rem;
}
@media screen and (max-width: 950px) {
  .public-dialog {
    width: 90% !important;
  }
  .form-content {
    .confirm-description {
      font-size: 0.75rem;
    }
    .nft_img {
      width: 40%;
      height: auto;
    }
    .nft-info {
      font-size: 1rem;
    }
  }
}
</style>