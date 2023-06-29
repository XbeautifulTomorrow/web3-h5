<template>
  <el-form :label-width="0" :model="formData" style="max-width: 100%" ref="codeForm" class="code-form" :inline="true">
    <el-form-item class="code-list" label="" v-for="(item, index) in formData.code"
      :key="`code-${index}-${autofocus[index]}`" @keydown.delete="myKeydown">
      <input-number v-model.number="formData.code[index]" :autofocus="autofocus[index]" :maxlength="1" :ref="inputEle" />
    </el-form-item>
    <p class="explain-text">
      {{ $t("login.verificationHint") }}
    </p>
    <el-button :class="['public-button', { 'cancel-button': !isAgain }]" @click="codeFun">
      {{ $t("login.sendAgain") }}
      <template v-if="!isAgain"> ({{ time }}) </template>
    </el-button>
    <div class="tips_btn" @click="showDialog()">{{ $t("login.notReceived") }}</div>
    <error-tips v-if="showErr" :isReturn="false" @closeFun="handleClose()"></error-tips>
  </el-form>
</template>
<script>
import { i18n } from '@/locales';
const { t } = i18n.global;
import { reactive, watch, toRefs, onMounted, ref, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";

import { getCaptcha, getCheckCaptcha } from "@/services/api/user";
import InputNumber from "@/components/input/inputNumber.vue";
import errorTips from "../register/errorTips.vue";
export default {
  name: "CodePage",
  components: {
    InputNumber,
    errorTips
  },
  props: {
    email: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      numberLength: 6,
      formData: {
        code: [],
      },
      autofocus: [],
      timer: null,
      time: 59,
      isAgain: false,
    });
    const showErr = ref(false);
    const codeForm = ref(null);
    const inputref = ref([]);
    let timer = ref(null);
    const inputEle = (el) => {
      inputref.value.push(el);
    };

    const showDialog = () => {
      showErr.value = true;
    }
    const handleClose = () => {
      showErr.value = false
    }

    onMounted(() => {
      initializationFun();
      timerFun();
      window.addEventListener("paste", addEventListenerFun);
    });
    onBeforeUnmount(() => {
      clearTimerFun();
      window.removeEventListener("paste", addEventListenerFun);
    });
    const addEventListenerFun = (event) => {
      const text = event.clipboardData.getData("text");
      if (text) {
        const _text = [...text];
        let isNumber = true;
        _text.forEach((item) => {
          if (item !== "0" && !Number(item)) {
            isNumber = false;
          }
        });
        if (isNumber) {
          state.formData.code = _text;
        } else {
          initializationFun();
          timerFun();
        }
      }
    };
    const clearTimerFun = () => {
      clearInterval(state.timer);
      state.timer = null;
    };
    const timerFun = () => {
      state.isAgain = false;
      state.time = 59;
      state.timer = setInterval(() => {
        state.time--;
        if (state.time < 1) {
          state.isAgain = true;
          state.time = 59;
          clearTimerFun();
        }
      }, 1000);
    };
    const initializationFun = () => {
      const _code = new Array(state.numberLength).join(",").split(",");
      const _autofocus = [];
      for (let i = 0; i < state.numberLength; i++) {
        if (i < 1) {
          _autofocus.push(true);
        } else {
          _autofocus.push(false);
        }
      }
      state.formData.code = _code;
      state.autofocus = _autofocus;
    };
    const myKeydown = () => {
      const { code } = state.formData;
      const inputElement = document.getElementsByClassName("el-input__inner");
      const Length = code.length;
      for (let i = Length - 1; i > -1; i--) {
        let value;
        try {
          value = code[i].toString();
        } catch (error) {
          value = "";
        }
        if (value) {
          inputElement[i].focus();
          state.formData.code[i] = null;
          return;
        }
      }
    };
    const closePopup = () => {
      state.test = false;
    };
    const clearFun = () => {
      this.autofocus;
    };
    const codeFun = async () => {
      if (!state.isAgain || !props.email) return;
      timerFun();
      const res = await getCaptcha({
        type: "update_password",
        email: props.email,
      });
      if (res && res.code === 200) {
        ElMessage({
          message: t("login.sendHint"),
          type: "success",
        });
      } else {
        emit("changeTypeFun", 0);
      }
    };
    const checkCaptchaFun = async () => {
      if (timer.value) {
        clearTimeout(timer.value);
      }

      const codeV = state.formData.code.join("");

      timer.value = setTimeout(async () => {
        const data = {
          type: "update_password",
          email: props.email,
          code: codeV,
        };
        const res = await getCheckCaptcha(data);
        if (res && res.code === 200) {
          emit("changeTypeFun", 2, { captcha: codeV });
        } else {
          ElMessage({
            message: t("login.sendAgainErr"),
            type: "error",
          });
          initializationFun();
        }
      }, 300);
    };
    watch(
      () => state.formData.code,
      (newVal) => {
        const Length = newVal.length;
        const inputElement = document.getElementsByClassName("el-input__inner");
        for (let i = 0; i < Length; i++) {
          let value;
          try {
            value = newVal[i].toString();
          } catch (error) {
            value = "";
          }
          if (!value) {
            if (inputElement[i]) {
              inputElement[i].focus();
            }
            return;
          } else {
            if (value.length > 0) {
              if (value.length > 1) {
                state.formData.code[i] = Number(value.charAt(0));
                return
              }
              state.formData.code[i] = Number(value.charAt(value.length - 1));
            }
          }
        }
        checkCaptchaFun();
      },
      { deep: true }
    );
    return {
      ...toRefs(state),
      showErr,
      showDialog,
      handleClose,
      closePopup,
      clearFun,
      codeFun,
      codeForm,
      inputEle,
      myKeydown,
    };
  },
};
</script>
<style lang="scss" scoped>
.code-form {
  display: inline-block;
  box-sizing: border-box;
  padding-top: 1.875rem;

  * {
    box-sizing: border-box;
  }

  .code-list {
    margin-right: 0;

    :deep(.el-input__wrapper) {
      border-radius: 0.5rem;
      width: 3.375rem;
      padding: 0px;
      border: solid 1px #363945;
      background-color: #13151f;
      box-shadow: none;
      outline: none;

      input {
        font-family: LeagueSpartan;
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        color: white;
      }
    }

    .public-input-com {
      width: auto;
    }
  }

  .code-list+.code-list {
    margin-left: 1.25rem;
  }
}

.explain-text {

  font-size: 1rem;
  width: 100%;
  margin-bottom: 2.5rem;
}

.button-item {
  opacity: 1;
}

.tips_btn {
  padding-top: 1.875rem;
}

@media screen and (max-width: 950px) {
  .code-form {
    display: inline-block;
    box-sizing: border-box;
    padding-top: 0.875rem;

    .el-form-item {
      margin-bottom: 0.875rem;
    }

    .code-list {
      margin-right: 0;

      :deep(.el-input__wrapper) {
        width: 2rem;

        input {
          font-size: 0.75rem;
        }
      }

      .public-input-com {
        width: auto;
      }
    }

    .code-list+.code-list {
      margin-left: 0.5rem;
    }
  }

  .explain-text {
    width: 100%;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
  }

  .button-item {
    opacity: 1;
  }

  .tips_btn {
    padding-top: 0.75rem;
  }
}
</style>
