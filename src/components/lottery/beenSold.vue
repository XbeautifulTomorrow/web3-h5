<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
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
      <h2 class="public-dialog-title margin-b">NOTICE</h2>
      <p class="public-dialog-text">
        <span class="public-dialog-special">Mutant Ape Yacht Club # </span>
        <span class="public-dialog-special">
          {{ soldList[0]?.orderId }}
        </span>
        has been successfully sold and you will receive:
      </p>
      <div class="public-dialog-total">
        <img class="public-dialog-icon" src="@/assets/img/eth.png" alt="" />
        <span class="public-dialog-total-number">{{ total }}</span>
      </div>
      <el-button class="public-button public-default" @click="balanceFun">
        Check balance
      </el-button>
      <el-button class="public-button margin-l0" @click="closeDialogFun">
        Continue
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps, onBeforeMount } from "vue";
import { BigNumber } from "bignumber.js";

const props = defineProps({
  soldList: {
    type: Array,
    requird: true,
  },
});
const emit = defineEmits(["closeDialogFun", "balanceFun"]);
const visible = ref(true);
const total = ref(0);
onBeforeMount(() => {
  props.soldList.forEach((item) => {
    total.value = BigNumber(total.value).plus(Number(item.price));
  });
});
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
  margin-top: 1.875rem;
  margin-bottom: 3.75rem;
}
.public-dialog-total-number {
  font-size: 30px;
  color: #11cde9;
}
.margin-b {
  margin-bottom: 1.875rem;
}
</style>
