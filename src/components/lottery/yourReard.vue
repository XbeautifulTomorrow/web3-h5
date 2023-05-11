<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    class="lottery-dialog"
    width="700"
  >
    <template #header="{ close }">
      <div class="lottery-dialog-header">
        <el-icon
          v-on="{ click: [close, closeDialogFun] }"
          color="#2d313f"
          size="16"
          class="lottery-dialog-header-icon"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
    </template>
    <div class="lottery-dialog-content">
      <h2 class="lottery-dialog-title">Notice</h2>
      <p class="lottery-dialog-illustrate">
        The prize is in your backpack. Please go to your backpack and check it
        out
      </p>
      <h3 class="lottery-dialog-title-other">Your reward</h3>
      <div class="lottery-dialog-img">
        <img class="lottery-dialog-portrait" :src="sold.nftImg" alt="" />
      </div>
      <p class="lottery-dialog-club">Bored Ape Yacht Club</p>
      <el-button class="lottery-dialog-button" @click="inventoryFun">
        Check my inventory
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps } from 'vue';

defineProps({
  sold: {
    type: Object,
    requird: true,
  },
});
const emit = defineEmits(['closeDialogFun', 'inventoryFun']);

const visible = ref(true);
const closeDialogFun = () => {
  emit('closeDialogFun');
};
const inventoryFun = () => {
  emit('inventoryFun');
};
</script>
<style scoped lang="scss">
.lottery-dialog-club {
  font-size: 16px;
  color: #4473eb;
}
.lottery-dialog-img {
  width: 20%;
  margin: 10px auto;
}
</style>
