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
      <h2 class="public-dialog-title">Warning</h2>
      <p class="public-dialog-text">
        {{ text }}
      </p>
      <el-button class="public-button" @click="balanceFun">
        Check my balance
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps } from "vue";

defineProps({
  text: {
    tupe: String,
    default: "",
  },
});
const emit = defineEmits(["closeDialogFun", "balanceFun"]);

const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const balanceFun = () => {
  emit("balanceFun");
};
</script>
<style lang="scss" scoped>
.public-dialog-club {
  font-size: 16px;
  color: #4473eb;
}
.public-dialog-portrait {
  margin: 10px auto;
}
</style>
