<template>
  <div
    :class="[
      'public-input-com',
      { showBorder: isShowBorder },
      { showIcon: modelValue },
    ]"
  >
    <el-input
      class="public-input"
      v-model="newValue"
      :placeholder="placeholder"
      @focus="focusFun"
      @blur="blurFun"
    >
      <template #suffix>
        <el-icon class="check-icon input-icon" color="#9497C3">
          <CircleCheckFilled />
        </el-icon>
        <el-icon
          class="clear-icon input-icon"
          @click="clearFun"
          color="#9497C3"
        >
          <CircleCloseFilled />
        </el-icon>
      </template>
    </el-input>
  </div>
</template>
<script>
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue';
export default {
  name: 'InputCom',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  computed: {
    newValue: {
      get: function () {
        return this.modelValue;
      },
      set: function (value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  data() {
    return {
      CircleCheckFilled,
      CircleCloseFilled,
      isShowBorder: false,
    };
  },
  methods: {
    clearFun() {
      this.$emit('update:modelValue', '');
    },
    focusFun() {
      this.isShowBorder = true;
    },
    blurFun() {
      if (!this.modelValue) {
        this.isShowBorder = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.public-input-com {
  width: 362px;
  height: 52px;
  padding: 1px;
  border-radius: 12px;
  background-color: #1b082b;
  border-style: solid;
  border-width: 2px;
  border-color: transparent;
  border-image-slice: 1;
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
}
.showBorder {
  border-image-source: linear-gradient(
    to bottom,
    #dd82af,
    #d12398 61%,
    #fab597
  );
  background-image: linear-gradient(to bottom, #1b082b, #1b082b),
    linear-gradient(to bottom, #dd82af, #d12398 61%, #fab597);
  .input-icon {
    opacity: 0.3;
  }
}
.showIcon {
  .clear-icon {
    opacity: 1;
  }
}
.public-input {
  height: 100%;
  width: 100%;
  color: #fff;
}
.check-icon {
  margin-right: 16px;
}
.input-icon {
  opacity: 0;
}
</style>
<style lang="scss">
.public-input {
  .el-input__wrapper {
    background: #1B082B;
    border: none;
    box-shadow: none;
  }
  .el-input__inner {
    color: #fff;
  }
  ::placeholder {
    color: #403748;
    font-size: 18px;
    font-family: Light;
  }
}
</style>
