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
      <h2 class="public-dialog-title">Warning</h2>
      <p class="public-dialog-text">
        Congratulations! We regret that your account at
        <span class="public-dialog-special">Mutant Ape Yacht Club # 5154</span>
        <!-- <span class="public-dialog-special">
          {{sold.}}
        </span> -->
        is not available due to congestion in the chain. To compensate for your
        loss, we will transfer your balance to you at
        <span class="public-dialog-special">71.254 ETH</span>
        <!-- <span class="public-dialog-special">
          {{ sold. }}
        </span> -->
        at current prices.
      </p>
      <el-button class="public-button" @click="balanceFun">
        Check balance
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
const emit = defineEmits(["closeDialogFun"]);

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
