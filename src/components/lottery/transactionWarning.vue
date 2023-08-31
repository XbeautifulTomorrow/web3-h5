<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
    class="public-dialog mystery-dialog"
    width="43.75rem"
    :before-close="closeDialogFun"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <img class="public-dialog-header-icon" src="@/assets/svg/close.svg" alt="" v-on="{ click: [close, closeDialogFun] }" />
      </div>
    </template>
    <div class="public-dialog-content">
      <h2 class="public-dialog-title">{{ $t("lottery.warning") }}</h2>
      <p class="public-dialog-text margin-b">
        {{ text }}
      </p>
      <el-button class="public-button" @click="unboxAgainFunc">
        {{ $t("lottery.unBox_again") }}
        <p class="public-dialog-price-box">
          <img class="public-dialog-icon" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          {{ formatNumber(blindPrice) }}
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
import { formatNumber } from "@/utils";
defineProps({
  text: {
    tupe: String,
    default: "",
  },
  blindPrice: {
    type: String,
    requird: true,
  },
});
const emit = defineEmits(["closeDialogFun", "unboxAgain"]);

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
  font-size: 1rem;
  color: #4473eb;
}
.public-dialog-portrait {
  margin: 10px auto;
}
.margin-b {
  margin-top: 1.875rem;
  margin-bottom: 3.75rem;
}
</style>
