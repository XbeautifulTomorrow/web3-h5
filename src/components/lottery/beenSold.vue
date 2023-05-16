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
      <p class="public-dialog-text">
        Your reward,
        <span class="public-dialog-special">Mutant Ape Yacht Club # 5154</span>
        <!-- <span class="public-dialog-special">
          {{sold.}}
        </span> -->
        , has been sold and you will receive:
      </p>
      <div class="public-dialog-total">
        <img class="public-dialog-icon" src="@/assets/img/eth.png" alt="" />
        <span class="public-dialog-total-number">{{ sold.price }}</span>
      </div>
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
