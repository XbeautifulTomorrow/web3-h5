<template>
  <el-form
    :label-width="0"
    :model="formData"
    style="max-width: 100%"
    ref="codeForm"
    class="register-form"
    :inline="true"
  >
    <el-form-item
      class="login-margin-top code-list"
      label=""
      v-for="(item, index) in formData.code"
      :key="`code-${index}-${autofocus[index]}`"
    >
      <input-number
        class="login-margin-top"
        v-model.number="formData.code[index]"
        :autofocus="autofocus[index]"
        :maxlength="1"
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
        for (let i = 0; i < Length; i++) {
          if (newVal[i]) {
            state.autofocus[i] = false;
            state.isAgree = false;
          } else {
            state.autofocus[i] = true;
            return;
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
    };
  },
};
</script>
<style lang="scss" scoped>
.register-form {
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
