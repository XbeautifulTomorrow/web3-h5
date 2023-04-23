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
      class="login-margin-top code-list"
      label=""
      v-for="(item, index) in formData.code"
      :key="`code-${index}-${autofocus[index]}`"
      @keydown.delete="myKeydown"
    >
      <input-number
        class="login-margin-top"
        v-model.number="formData.code[index]"
        :autofocus="autofocus[index]"
        :maxlength="1"
        :ref="inputEle"
      />
    </el-form-item>
    <p class="explain-text login-margin-top">
      Please check your email for the verification code
    </p>
    <div
      :class="['form-button login-margin-top', { 'button-item': isAgree }]"
      @click="codeFun"
    >
      Complete registration
    </div>
  </el-form>
</template>
<script>
import { reactive, watch, toRefs, onMounted, ref } from 'vue';
import InputNumber from '../input/inputNumber.vue';
export default {
  name: 'CodePage',
  components: {
    InputNumber,
  },
  setup() {
    const state = reactive({
      isAgree: false,
      numberLength: 6,
      formData: {
        code: [],
      },
      autofocus: [],
    });
    const codeForm = ref(null);
    const inputref = ref([]);
    const inputEle = (el) => {
      inputref.value.push(el);
    };
    onMounted(() => {
      initializationFun();
    });
    const initializationFun = () => {
      const _code = new Array(state.numberLength).join(',').split(',');
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
      const inputElement = document.getElementsByClassName('el-input__inner');
      const Length = code.length;
      for (let i = Length - 1; i > -1; i--) {
        const value = code[i].toString();
        if (value) {
          inputElement[i].focus();
          state.formData.code[i] = '';
          return;
        }
      }
      // if (inputElement[i]) {
      //   inputElement[i].focus();
      // }
    };
    const closePopup = () => {
      state.test = false;
    };
    const clearFun = () => {
      this.autofocus;
    };
    const codeFun = () => {
      if (!state.isAgree) return;
      codeForm.value.validate(async (valid) => {
        if (valid && state.isAgree) {
          // const res = await ;
          // if (error) {
          //   this.initializationFun();
          // }
        }
      });
    };
    watch(
      () => state.formData.code,
      (newVal) => {
        const Length = newVal.length;
        const inputElement = document.getElementsByClassName('el-input__inner');
        for (let i = 0; i < Length; i++) {
          const value = newVal[i].toString();
          if (!value) {
            console.log('watch value');
            if (inputElement[i]) {
              inputElement[i].focus();
            }
            state.isAgree = false;
            return;
          } else {
            if (value.length > 0) {
              console.log('watch !value');
              state.formData.code[i] = Number(value.charAt(value.length - 1));
            }
          }
        }
        state.isAgree = true;
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
.form-button {
  width: 362px;
  height: 48px;
  border-radius: 24px;
  font-size: 24px;
  color: #fff;
  border: solid 2px #fffaff;
  background-image: linear-gradient(
    to bottom,
    #5fe3ef,
    #00689d 54%,
    #b063f5 75%
  );
  cursor: pointer;
  opacity: 0.3;
}
.button-item {
  opacity: 1;
}
.code-list {
  margin-right: 13px;
  margin-bottom: 0;
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
  }
}
</style>
