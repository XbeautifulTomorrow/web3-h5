<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
    class="public-dialog mystery-dialog"
    width="43.75rem"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <img class="public-dialog-header-icon" src="@/assets/svg/close.svg" alt="" v-on="{ click: [close, closeDialogFun] }" />
      </div>
    </template>
    <div class="public-dialog-content">
      <h2 class="public-dialog-title">NOTICE</h2>
      <p class="public-dialog-illustrate">The prize is in your backpack. Please go to your backpack and check it out</p>
      <h3 class="public-dialog-title-other">NFTs</h3>
      <ul class="public-dialog-lists">
        <el-tooltip
          class="item"
          effect="dark"
          :content="`${item.seriesName}  # ${item.tokenId}`"
          placement="bottom-end"
          v-for="(item, index) in soldList"
          :key="`portrait-${index}`"
        >
          <li :class="['public-dialog-list', item.qualityType]">
            <image-view :src="item.nftImg" />
          </li>
        </el-tooltip>
      </ul>
      <el-button class="public-button" @click="goInventory"> CHECK MY INVENTORY </el-button>
      <el-button class="public-button public-continue" @click="closeDialogFun"> CONTINUE </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps } from "vue";
import ImageView from "../imageView";
defineProps({
  soldList: {
    type: Object,
    requird: true,
  },
});
const emit = defineEmits(["closeDialogFun", "inventoryFun", "goInventory"]);
const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const goInventory = () => {
  emit("goInventory");
};
// const inventoryFun = () => {
//   emit("inventoryFun");
// };
</script>
<style lang="scss" scoped>
.public-dialog-icon {
  width: 30px;
  height: 30px;
  margin-right: 20px;
}
.public-dialog-total {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  margin-top: 30px;
}
.public-dialog-total-number {
  font-size: 30px;
  color: #11cde9;
}
.public-dialog-list {
  padding: 2px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
}
.LEGEND {
  background-image: url("@/assets/img/lottery/LEGEND_more_choose.png");
}
.EPIC {
  background-image: url("@/assets/img/lottery/EPIC_more_choose.png");
}
.RARE {
  background-image: url("@/assets/img/lottery/RARE_more_choose.png");
}
.NORMAL {
  background-image: url("@/assets/img/lottery/NORMAL_more_choose.png");
}
</style>
