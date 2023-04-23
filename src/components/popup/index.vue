<template>
  <div class="popup" v-if="modelValue">
    <div class="popup-content">
      <div class="popup-main">
        <span class="popup-close" @click="closePopup"></span>
        <div class="popup-title" v-if="title">{{ title }}</div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PopupCom',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  state() {
    return {
      modelValue: this.modelValue,
    };
  },
  computed: {},
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
  },
};
</script>
<style lang="scss" scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.6);
}
.popup-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 426px;
  min-height: 100px;
  color: #a896b5;
  font-size: 18px;
  border-radius: 12px;
  border-style: solid;
  border-width: 2px;
  border-image-source: linear-gradient(
    to bottom,
    #6ce1f9,
    #00669b 48%,
    #b770f4
  );
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #2d1942, #2d1942),
    linear-gradient(to bottom, #6ce1f9, #00669b 48%, #b770f4);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.popup-main {
  padding: 32px;
}
.popup-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  background: url('@/assets/img/popup/icon-closedefault.png') no-repeat 100%/100%;
  &:hover {
    background: url('@/assets/img/popup/icon-closeactive.png') no-repeat 100%/100%;
  }
}
.popup-title {
  background-image: linear-gradient(
    to bottom,
    #dd82af 20%,
    #dd81af 20%,
    #d12398 50%,
    #fab597 69%
  );
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
