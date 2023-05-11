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
      <p class="lottery-dialog-text">
        Your reward,
        <span class="lottery-dialog-special">Mutant Ape Yacht Club # 5154</span>
        , has been sold and you will receive:
      </p>
      <div class="lottery-dialog-total">
        <img class="lottery-dialog-icon" src="" alt="" />
        <span class="lottery-dialog-total-number">73.052</span>
      </div>
      <el-button class="lottery-dialog-button">Check balance</el-button>
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
