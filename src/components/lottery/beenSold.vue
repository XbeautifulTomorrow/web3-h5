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
        <img class="public-dialog-header-icon" src="@/assets/svg/close.svg" alt="" v-on="{ click: [close, closeDialogFun] }" />
      </div>
    </template>
    <div class="public-dialog-content">
      <h2 class="public-dialog-title margin-b">{{ $t("lottery.notice") }}</h2>
      <p
        class="public-dialog-text"
        v-html="
          $t('lottery.success_receive', {
            name: `${soldList[0]?.seriesName} #${soldList[0]?.orderId}`,
          })
        "
      ></p>
      <div class="public-dialog-total">
        <img class="public-dialog-icon" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
        <span class="public-dialog-total-number marg-r">{{ total }}</span>
        <template v-if="soldList[0].point > 0">
          <img class="public-dialog-icon" src="@/assets/svg/user/icon_point.svg" alt="" />
          <span class="public-dialog-total-number">
            {{ soldList[0].point }}
          </span>
        </template>
      </div>
      <el-button class="public-button" @click="unboxAgainFunc">
        {{ $t("lottery.unBox_again") }}
        <p class="public-dialog-price-box">
          <img class="public-dialog-icon" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
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
import { ref, defineEmits, defineProps, onBeforeMount } from "vue";
import { BigNumber } from "bignumber.js";

const props = defineProps({
  soldList: {
    type: Array,
    requird: true,
  },
  blindPrice: {
    type: String,
    requird: true,
  },
});
const emit = defineEmits(["closeDialogFun", "unboxAgain"]);
const visible = ref(true);
const total = ref(0);
onBeforeMount(() => {
  props.soldList.forEach((item) => {
    total.value = BigNumber(total.value).plus(Number(item.price));
  });
});
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const unboxAgainFunc = () => {
  emit("unboxAgain");
};
</script>
<style lang="scss" scoped>
.public-dialog-icon {
  width: 1.5rem;
  height: 1.5rem;
}
.public-dialog-total {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  margin-top: 1.875rem;
  margin-bottom: 3.75rem;
}
.public-dialog-total-number {
  font-size: 1.875rem;
  color: #11cde9;
}
.public-dialog-list-img {
  margin-left: 1.875rem;
}
.margin-b {
  margin-bottom: 1.875rem;
}
.marg-r {
  margin-right: 1.875rem;
}
</style>
