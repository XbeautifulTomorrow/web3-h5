<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    class="public-dialog"
    width="700"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <el-icon
          v-on="{ click: [close, closeDialogFun] }"
          color="#2d313f"
          size="16"
          class="public-dialog-header-icon"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content">
      <h2 class="public-dialog-title">Notice</h2>
      <p class="public-dialog-illustrate">
        The prize is in your backpack. Please go to your backpack and check it
        out
      </p>
      <h3 class="public-dialog-title-other">NFTs</h3>
      <ul class="public-dialog-lists">
        <li
          class="public-dialog-list"
          v-for="(item, index) in soldList"
          :key="`portrait-${index}`"
        >
          <img class="public-dialog-portrait" :src="item.nftImg" alt="" />
        </li>
      </ul>
      <el-button class="public-button" @click="inventoryFun">
        Check my inventory
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps } from "vue";

defineProps({
  soldList: {
    type: Object,
    requird: true,
  },
});
const emit = defineEmits(["closeDialogFun", "inventoryFun"]);

const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const inventoryFun = () => {
  emit("inventoryFun");
};
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
</style>
