<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
    class="public-dialog mystery-dialog"
    width="700"
    :before-close="closeDialogFun"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <img
          class="public-dialog-header-icon"
          src="@/assets/svg/close.svg"
          alt=""
          v-on="{ click: [close, closeDialogFun] }"
        />
      </div>
    </template>
    <div class="public-dialog-content">
      <h2 class="public-dialog-title">{{ $t("lottery.warning") }}</h2>
      <p
        class="public-dialog-text magin-text"
        v-html="
          $t('lottery.tips1', {
            name: `${soldList[0]?.seriesName} #${soldList[0]?.orderId}`,
          })
        "
      ></p>
      <div class="public-dialog-pointer-box" v-if="sold?.point">
        <img
          class="public-dialog-pointer-icon"
          src="@/assets/svg/user/icon_point.svg"
          alt=""
        />
        <span class="public-dialog-total-number">
          {{ sold?.point }}
        </span>
      </div>
      <el-button class="public-button" @click="unboxAgainFunc">
        {{ $t("lottery.unBox_again") }}
        <p class="public-dialog-price-box">
          <img
            class="public-dialog-icon"
            src="@/assets/svg/user/icon_ethereum.svg"
            alt=""
          />
          {{ blindPrice }}
        </p>
      </el-button>
      <el-button class="public-button public-continue" @click="closeDialogFun">
        {{ $t("lottery.return") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps } from "vue";

defineProps({
  sold: {
    type: Object,
    requird: true,
  },
  blindPrice: {
    type: String,
    requird: true,
  },
});
const emit = defineEmits(["unboxAgain", "closeDialogFun"]);

const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const unboxAgainFunc = () => {
  emit("unboxAgain");
};
</script>
<style lang="scss" scoped>
.public-dialog-club {
  font-size: 16px;
  color: #4473eb;
}
.public-dialog-portrait {
  margin: 10px auto;
}
.magin-text {
  margin-top: 1.875rem;
  margin-bottom: 2rem;
  color: #a9a4b4;
}
</style>
