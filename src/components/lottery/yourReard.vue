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
      <h2 class="public-dialog-title">NOTICE</h2>
      <p class="public-dialog-illustrate">
        The reward has been transferred to your inventory, please go to the
        inventory to check it.
      </p>
      <h3 class="public-dialog-title-other">Your reward</h3>
      <div class="public-dialog-img">
        <image-view class="public-dialog-portrait" :src="sold.nftImg" />
      </div>
      <p class="public-dialog-club">Bored Ape Yacht Club</p>
      <el-button class="public-button public-default" @click="closeDialogFun">
        Check my inventory
      </el-button>
      <el-button class="public-button margin-l0" @click="closeDialogFun">
        Continue
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps } from "vue";
import ImageView from "../imageView";
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
// const inventoryFun = () => {
//   emit("inventoryFun");
// };
</script>
<style scoped lang="scss">
.public-dialog-club {
  font-size: 16px;
  color: #4473eb;
  margin-bottom: 3.75rem;
}
.public-dialog-img {
  width: 20%;
  margin: 10px auto;
}
</style>
