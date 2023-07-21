<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
    class="public-dialog mystery-dialog"
    width="700"
    :before-close="closeDialogFun"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <img
          class="public-dialog-header-icon"
          src="@/assets/svg/close.svg"
          alt=""
          v-on="{ click: [close, closeDialogFun] }"
        />
      </div>
    </template>
    <div class="public-dialog-content">
      <h2 class="public-dialog-title">WARNING</h2>
      <p class="public-dialog-text magin-text">
        Congratulations ! We regret that your
        <span class="public-dialog-special">
          Mutant Ape Yacht Club # {{ sold?.orderId }}
        </span>
        may not be available due to congestion on the chain. To cover your
        losses, we will convert it to ETH at the current price into your
        balance, which you will earn:
      </p>
      <div class="public-dialog-pointer-box" v-if="sold?.point">
        <img
          class="public-dialog-pointer-icon"
          src="@/assets/svg/user/icon_point.svg"
          alt=""
        />
        <span class="public-dialog-total-number">
          {{ sold?.point }}
        </span>
      </div>
      <el-button class="public-button public-default" @click="balanceFun">
        CHECK BALANCE
      </el-button>
      <el-button class="public-button margin-l0" @click="closeDialogFun">
        CONTINUE
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
const emit = defineEmits(["balanceFun", "closeDialogFun"]);

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
.magin-text {
  margin-top: 1.875rem;
  margin-bottom: 2rem;
  color: #a9a4b4;
}
</style>
