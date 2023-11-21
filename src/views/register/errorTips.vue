<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <el-dialog
      v-model="showError"
      destroy-on-close
      :close-on-click-modal="false"
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="43.75rem"
      :before-close="closeFun"
    >
      <template #header="{ close }">
        <div class="close_btn" v-on="{ click: [close, closeFun] }">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="public-dialog-content form-content">
        <img class="error_img" src="@/assets/svg/home/email_logo.svg" alt="" />
        <div class="tips_text">{{ $t("login.notReceived") }}</div>
        <ul class="tips_ul">
          <li>{{ $t("login.notReceivedText1", { email: email }) }}</li>
          <li>{{ $t("login.notReceivedText2") }}</li>
          <li>{{ $t("login.notReceivedText3") }}</li>
          <li>{{ $t("login.notReceivedText4") }}</li>
          <li>
            <span>
              {{ $t("login.notReceivedText5") }}
            </span>
            <span
              class="return_btn"
              v-if="props.isReturn"
              @click="changeTypeFun()"
              >{{ $t("common.returnText") }}</span
            >
          </li>
        </ul>
        <el-button class="public-button form-button" @click="closeFun()">
          {{ $t("login.ok") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { getSessionStore } from "@/utils";
import { ref, defineEmits, defineProps } from "vue";
const emit = defineEmits(["closeFun", "changeTypeFun"]);
const props = defineProps({
  isReturn: {
    type: Boolean,
    default: true,
  },
});
const showError = ref(true);
const email = ref(getSessionStore("email"));
const closeFun = () => {
  emit("closeFun");
};
const changeTypeFun = () => {
  emit("changeTypeFun");
  emit("closeFun");
};
</script>
<style lang="scss" scoped>
.error_img {
  width: 6.75rem;
  height: auto;
}

.tips_text {
  padding: 3.75rem 0 1.25rem;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  color: white;
}

.tips_ul {
  padding-left: 1.875rem;
  padding-bottom: 1.875rem;

  li {
    list-style-type: disc;
    font-size: 1rem;
    line-height: 1.6;
    text-align: left;
    color: #a9a4b4;

    .return_btn {
      color: #fad54d;
      text-decoration: underline;
    }
  }
}

@media screen and (max-width: 950px) {
  .error_img {
    width: 3rem;
  }

  .tips_text {
    padding: 1.5rem 0 1rem;
    font-size: 0.75rem;
  }

  .tips_ul {
    padding-left: 1.5rem;
    padding-bottom: 1rem;

    li {
      font-size: 0.75rem;
      text-align: left;
      color: #a9a4b4;

      .return_btn {
        color: #fad54d;
        text-decoration: underline;
      }
    }
  }
}
</style>
