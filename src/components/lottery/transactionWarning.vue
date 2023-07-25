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
      <p class="public-dialog-text margin-b">
        {{ text }}
      </p>
      <el-button class="public-button" @click="unboxAgainFunc">
        UNBOX AGAIN
      </el-button>
      <el-button class="public-button public-continue" @click="closeDialogFun">
        CONTINUE
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
const emit = defineEmits(["closeDialogFun", "unboxAgain"]);

const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const unboxAgainFunc = () => {
  emit("unboxAgain");
};
</script>
<style lang="scss" scoped>
.public-dialog-club {
  font-size: 1rem;
  color: #4473eb;
}
.public-dialog-portrait {
  margin: 10px auto;
}
.margin-b {
  margin-top: 1.875rem;
  margin-bottom: 3.75rem;
}
</style>
