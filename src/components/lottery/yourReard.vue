<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    class="public-dialog"
    width="700"
    :before-close="closeDialogFun"
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
      <h3 class="public-dialog-title-other">Your reward</h3>
      <div class="public-dialog-img">
        <img class="public-dialog-portrait" :src="sold.nftImg" alt="" />
      </div>
      <p class="public-dialog-club">Bored Ape Yacht Club</p>
      <el-button class="public-button" @click="inventoryFun">
        Check my inventory
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps } from "vue";

defineProps({
  sold: {
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
<style scoped lang="scss">
.public-dialog-club {
  font-size: 16px;
  color: #4473eb;
}
.public-dialog-img {
  width: 20%;
  margin: 10px auto;
}
</style>
