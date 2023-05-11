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
        {{ text }}
      </p>
      <el-button class="lottery-dialog-button">Check my balance</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps } from 'vue';

defineProps({
  text: {
    tupe: String,
    default: '',
  },
});
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
