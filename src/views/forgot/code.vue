<template>
  <el-form
    :label-width="0"
    :model="formData"
    style="max-width: 100%"
    ref="codeForm"
    class="code-form"
    :inline="true"
  >
    <el-form-item
      class="code-list"
      label=""
      v-for="(item, index) in formData.code"
      :key="`code-${index}-${autofocus[index]}`"
      @keydown.delete="myKeydown"
    >
      <input-number
        v-model.number="formData.code[index]"
        :autofocus="autofocus[index]"
        :maxlength="1"
        :ref="inputEle"
      />
    </el-form-item>
    <p class="explain-text">
      Please check your email for the verification code
    </p>
    <el-button class="public-button" @click="codeFun">
      {{ `Send again (${time})` }}
    </el-button>
  </el-form>
</template>
<script>
import { reactive, watch, toRefs, onMounted, ref, onBeforeUnmount } from "vue";
import InputNumber from "@/components/input/inputNumber.vue";
export default {
  name: "CodePage",
  components: {
    InputNumber,
  },
  setup(props, { emit }) {
    const state = reactive({
      numberLength: 6,
      formData: {
        code: [],
      },
      autofocus: [],
      timer: null,
      time: 60,
    });
    const codeForm = ref(null);
    const inputref = ref([]);
    const inputEle = (el) => {
      inputref.value.push(el);
    };
    onMounted(() => {
      initializationFun();
      timerFun();
    });
    onBeforeUnmount(() => {
      clearTimerFun();
    });
    const clearTimerFun = () => {
      clearInterval(state.timer);
      state.timer = null;
    };
    const timerFun = () => {
      state.timer = setInterval(() => {
        state.time--;
        if (state.time < 1) {
          clearTimerFun();
          state.time = 60;
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
        const value = code[i].toString();
        if (value) {
          inputElement[i].focus();
          state.formData.code[i] = "";
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
    const codeFun = () => {
      if (state.time < 60) return;
      //   code api
    };
    watch(
      () => state.formData.code,
      (newVal) => {
        const Length = newVal.length;
        const inputElement = document.getElementsByClassName("el-input__inner");
        for (let i = 0; i < Length; i++) {
          const value = newVal[i].toString();
          if (!value) {
            if (inputElement[i]) {
              inputElement[i].focus();
            }
            return;
          } else {
            if (value.length > 0) {
              state.formData.code[i] = Number(value.charAt(value.length - 1));
            }
          }
        }
        // do something api
        emit("changeTypeFun", 2);
      },
      { deep: true }
    );
    return {
      ...toRefs(state),
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
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
}
.explain-text {
  width: 100%;
}
.button-item {
  opacity: 1;
}
.code-list {
  margin-right: 13px;
  margin-top: 30px;
  margin-bottom: 20px;
  &:last-child {
    margin-right: 0;
  }
}
</style>
<style lang="scss">
.code-form {
  .el-input__inner {
    height: 56px;
    line-height: 56px;
    color: transparent;
    text-shadow: 0 0 0 #fff;
    font-size: 24px;
    text-align: center;
  }
  .el-input--large .el-input__wrapper {
    padding: 0;
    text-align: center;
    box-shadow: none;
  }
}
</style>
