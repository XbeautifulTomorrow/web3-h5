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
      <h2 class="public-dialog-title">{{ $t("lottery.notice") }}</h2>
      <p class="public-dialog-illustrate">{{ sold?.nftType == "EXTERNAL" ? $t("lottery.loading_tip2") : $t("lottery.tips3") }}</p>
      <h3 class="public-dialog-title-other">{{ $t("lottery.your_reward") }}</h3>
      <div class="public-dialog-img">
        <image-view class="public-dialog-portrait" :src="sold?.nftImg" />
        <span class="public-dialog-list-result waiting" v-if="sold?.nftType == 'EXTERNAL'">
          {{ $t("lottery.waiting") }}
        </span>
      </div>
      <p class="public-dialog-club">{{ sold?.seriesName }}</p>
      <div class="public-dialog-pointer-box" v-if="sold?.point > 0">
        <img class="public-dialog-pointer-icon" src="@/assets/svg/user/icon_point.svg" alt="" />
        <span class="public-dialog-total-number">
          {{ sold?.point }}
        </span>
      </div>
      <el-button class="public-button margin-t" @click="unboxAgainFunc">
        {{ $t("lottery.unBox_again") }}
        <p class="public-dialog-price-box">
          <img class="public-dialog-icon" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          <span v-priceFormat="blindPrice"></span>
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
import ImageView from "../imageView";

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
const emit = defineEmits(["closeDialogFun", "inventoryFun", "unboxAgain"]);

const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const unboxAgainFunc = () => {
  emit("unboxAgain");
};
// const inventoryFun = () => {
//   emit("inventoryFun");
// };
</script>
<style scoped lang="scss">
.public-dialog-club {
  font-size: 16px;
  color: #4473eb;
}
.public-dialog-img {
  position: relative;
  width: 20%;
  margin: 10px auto;
}
.margin-t {
  margin-top: 3.75rem;
}
@media (max-width: 950px) {
  .public-dialog-illustrate {
    font-size: 0.75rem;
    margin-bottom: 0.625rem;
  }
  .public-dialog-title-other {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
  .public-dialog-pointer-box {
    font-size: 0.75rem;
  }
  .public-dialog-pointer-icon {
    width: 1.25rem;
  }
  .margin-t {
    margin-top: 1rem;
  }
}
</style>
