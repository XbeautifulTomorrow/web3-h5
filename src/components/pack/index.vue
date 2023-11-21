<template>
  <div
    :style="style"
    :class="['pack-com', classNamePack]"
    @mouseenter="mouseenterFun"
    @mouseleave="mouseleaveFun"
    @click="clickFun"
  >
    <div class="pack-com-conyent">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: "PackCom",
  props: {
    height: {
      type: Number,
      default: 30,
    },
    color: {
      type: String,
      default: "#fff",
    },
    borderRadius: {
      type: Number,
      default: 30,
    },
    hover: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: "pack-border",
    },
    hoverClssName: {
      type: String,
      default: "pack-bg",
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      style: {
        height: `${this.height}px`,
        color: this.color,
        borderRadius: `${this.borderRadius}px`,
      },
      classNamePack: this.className,
    };
  },
  methods: {
    mouseenterFun() {
      if (this.hover) {
        this.classNamePack += ` ${this.hoverClssName}`;
      }
    },
    mouseleaveFun() {
      if (this.hover) {
        this.classNamePack = this.classNamePack.replace(this.hoverClssName, "");
      }
    },
    clickFun(e) {
      if (e) return;
      this.$emit("click");
    },
  },
};
</script>
<style lang="scss" scoped>
.pack-com {
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
}
.pack-border {
  border-style: solid;
  border-width: 2px;
  border-image-source: linear-gradient(
    to bottom,
    #6ce1f9,
    #00669b 48%,
    #b770f4
  );
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #141029, #141029),
    linear-gradient(to bottom, #6ce1f9, #00669b 48%, #b770f4);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.pack-bg {
  border: solid 2px #fff;
  background-image: linear-gradient(0, #b164f6 15%, #026aa1 58%, #42e2f0 79%);
}
.pack-com-conyent {
  padding: 0 20px;
}
</style>
