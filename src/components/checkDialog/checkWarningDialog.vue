<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
    class="public-dialog result-loading-dialog"
    width="522"
    :before-close="closeDialogFun"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <img class="public-dialog-header-icon" src="@/assets/svg/close.svg" alt="" v-on="{ click: [close, closeDialogFun] }" />
      </div>
    </template>
    <div class="public-dialog-content">
      <p class="public-dialog-loading-title">
        WARNNING
      </p>
      <p class="public-dialog-loading-text">
        <slot></slot>
      </p>
      <div class="telegram-box">
        <a :href="setting?.customerLink"  target="_blank">
          <img src="@/assets/svg/telegram.svg" class="status_icon" />
          <p>{{setting?.customerName||'Bitzing Offical'}}</p>
        </a>
      </div>
      <!-- <div class="handle_btn" @click="closeDialogFun">
        {{ $t("common.confirm") }}
      </div> -->
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps } from "vue";
defineProps({
  setting: {
    type: Object,
    default: () => {
      return {}
    },
    requird: false,
  },
});
const emit = defineEmits(["closeDialogFun"]);

const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
</script>
<style scoped lang="scss">
.status_icon {
  margin-top: -2rem;
}
.public-dialog-content{
  font-size:.875rem;
  color: #e4e7f5;
  margin-top:-3.125rem;
  padding-bottom:3.125rem;
  .telegram-box{
    margin-top: 5rem;
    cursor:pointer;
    a{
      color: #e4e7f5;
      text-decoration:none;
    }
  }
}
.public-dialog-loading-title{
  font-family: BlenderPro;
  font-size: 2.875rem;
  color: #e4e7f5; 
}
.public-dialog-loading-text {
  font-family: BlenderPro;
  font-size: 1.125rem;
  color: #e4e7f5;
  margin-top: 1.875rem;
}
.public-dialog-illustrate {
  margin-bottom: 3.125rem;
  color: #a9a4b4;
}
.public-dialog-header-icon {
  margin-top: 1.875rem;
  margin-right: 1.875rem;
  cursor: pointer;
}
.handle_btn {
  width: 100%;
  height: 3.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-image: linear-gradient(to top, #e3a406, #fbd851);
  cursor: pointer;
  font-size: 1.125rem;
  line-height: 1.21;
  text-align: center;
  color: #13151f;
}
@media (max-width: 950px) {
  .public-dialog-header-icon {
    width: 1.5rem;
    margin-top: 1rem;
    margin-right: 1rem;
  }
  .public-dialog-content{
    margin-top:0;
  }
  .public-dialog-loading-title{
    font-size:1.5rem;
  }
  .telegram-box{
    margin-top:3rem;
    img{
      width:3.125rem;
    }
  }
}
</style>
