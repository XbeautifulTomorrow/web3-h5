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
        <h2 class="lottery-dialog-title">Warning</h2>
        <p class="lottery-dialog-text">
            Congratulations! We regret that your account at 
            <span class="lottery-dialog-special">Mutant Ape Yacht Club # 5154</span>
            is not available due to congestion in the chain. To compensate for your loss, we will transfer your balance to you at <span class="lottery-dialog-special">71.254 ETH</span>
             at current prices.
        </p>
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
  .lottery-dialog-club {
    font-size: 16px;
    color: #4473eb;
  }
  .lottery-dialog-portrait {
    margin: 10px auto;
  }
  </style>
  