<template>
  <div
    :class="[
      'public-input-com number-input',
      { showBorder: isShowBorder || newValue || newValue === 0 },
    ]"
  >
    <el-input
      class="public-input"
      type="number"
      v-model.number="newValue"
      :placeholder="placeholder"
      :autofocus="autofocus"
      :maxlength="maxlength"
      :minlength="minlength"
      @focus="focusFun"
      @blur="blurFun"
    >
    </el-input>
  </div>
</template>
<script>
export default {
  name: "InputCom",
  props: {
    modelValue: {
      type: Number,
    },
    placeholder: {
      type: String,
      default: "",
    },
    autofocus: {
      type: Boolean,
    },
    maxlength: {
      type: Number,
    },
    minlength: {
      type: Number,
    },
  },
  computed: {
    newValue: {
      get: function () {
        return this.modelValue;
      },
      set: function (value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  data() {
    return {
      isShowBorder: false,
    };
  },
  methods: {
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
  width: 44px;
  height: 100%;
  border-radius: 8px;
  border: solid 1px #363945;
  background-color: #13151f;
}
.showBorder {
  border: solid 1px #a9a4b4;
}
</style>
