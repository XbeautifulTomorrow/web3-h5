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
      <h3 class="lottery-dialog-title-other">NFTs</h3>
      <ul class="lottery-dialog-lists">
        <li
          class="lottery-dialog-list"
          v-for="(item, index) in 10"
          :key="`portrait-${index}`"
        >
          <img class="lottery-dialog-portrait" src="" alt="" />
        </li>
      </ul>
      <el-button class="lottery-dialog-button">Check my inventory</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits } from 'vue';

// const props = defineProps({

// })
const emit = defineEmits(['closeDialogFun']);

const visible = ref(true);
const closeDialogFun = () => {
  emit('closeDialogFun');
};
</script>
<style lang="scss" scoped>
.lottery-dialog-icon {
  width: 30px;
  height: 30px;
  margin-right: 20px;
}
.lottery-dialog-total {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  margin-top: 30px;
}
.lottery-dialog-total-number {
  font-size: 30px;
  color: #11cde9;
}
</style>
