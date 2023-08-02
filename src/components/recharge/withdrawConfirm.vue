<template>
  <el-dialog v-model="show" destroy-on-close :close-on-click-modal="false" :show-close="false" :align-center="true"
    class="public-dialog" :width="dialogType == 1 ? '43.75rem' : '32.625rem'" :before-close="handleClose">
    <template #header>
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content form-content">
      <p class="public-dialog-title" v-if="dialogType == 1">{{ $t("recharge.confirmTitle") }}</p>
      <Image v-else-if="dialogType == 4" fit="cover" class="nft_img" />
      <Image v-else fit="cover" class="loading-img" />
      <div class="confirm-description" v-if="dialogType == 1">
        <span class="description-text" v-html="$t('recharge.confirmDescription1', { gas: gasContent() })"></span>
        <span>{{ $t("recharge.confirmDescription2") }}</span>
      </div>
      <div v-else-if="dialogType == 2">
        <div class="wait-title">{{ $t("recharge.waitTitle") }}</div>
        <div class="wait-text">{{ $t("recharge.waitText") }}</div>
      </div>
      <Image v-if="dialogType == 1" fit="cover" class="nft_img" :src="nftInfo.img" />
      <div class="nft-info" v-if="dialogType == 1">
        <span>{{ nftInfo.name || "--" }}</span>
        <span>#{{ nftInfo.tokenId }}</span>
      </div>
      <div class="form-buttons">
        <el-button v-if="dialogType == 1" class="public-button cancel-button" @click="handleClose()">
          {{ $t("common.cancelUpper") }}
        </el-button>
        <el-button class="public-button" @click="onConfirm()">
          <span v-if="dialogType == 1">{{ $t("recharge.wthdrawBtnText") }}</span>
          <span v-if="dialogType == 2">{{ $t("recharge.continue") }}</span>
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
    
<script>
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import Image from "@/components/imageView";
import { i18n } from '@/locales';
const { t } = i18n.global;
import { ElMessage } from "element-plus";

export default {
  name: 'modifyName',
  components: {
    Image
  },
  props: {
    nftInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dialogType: {
      type: Number,
      default: 1 // 1:提取确认，2:提取等待，3:充值等待，4:充值完成
    },
  },
  data() {
    return {
      show: true
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
    gasContent() {
      let strV = `<div style="display: inline-flex;align-items: center;">`;
      strV += `<img style='width: 1.5rem;height: auto;margin-right: 0.25rem' src='${require('@/assets/svg/user/icon_ethereum.svg')}'>`;
      strV += `<span style='font-size: 1.25rem;color: #fad54d;' >0.02</span></div>`;
      return strV;
    },
    onConfirm() {
      if (this.dialogType == 1) {
        if (this.ethBalance < 0.02) {
          ElMessage({
            message: t("lottery.tips5"),
            type: "error",
          });

          return
        }
        this.$emit("confirm");
      } else if (this.dialogType == 2) {
        this.$emit("closeDialogFun");
      }
    },
    // 关闭弹窗
    handleClose(done) {
      if (this.dialogType == 1) {
        this.$emit("cancelDialogFun");
      }
      else if (this.dialogType == 2) {
        this.$emit("closeDialogFun");
      }

      if (done) {
        done();
        return
      }
    },
  }
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
}

.loading-img {
  margin: 1.875rem 0 1.25rem;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  transform: rotate(0);
  animation: rotation 3s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
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

  &>span {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &>span:last-child {
    max-width: 40%;
  }
}

.form-buttons {
  display: flex;
  align-items: center;
  padding-bottom: 1.875rem;
}
</style>