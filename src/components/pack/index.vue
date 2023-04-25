<template>
  <div
    :class="['pack-com', 'pack-border', classNamePack]"
    @mouseenter="mouseenterFun"
    @mouseleave="mouseleaveFun"
  >
    <div>asdgjasdjhasd</div>
  </div>
</template>
<script>
export default {
  name: 'PackCom',
  props: {
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 30,
    },
    color: {
      type: String,
      default: '#fff',
    },
    radius: {
      type: Number,
      default: 30,
    },
    linearGradientBorder: {
      type: String,
      default: 'to bottom, #6ce1f9, #00669b 48%, #b770f4',
    },
    linearGradient: {
      type: String,
      default: '0, #b164f6 15%, #026aa1 58%, #42e2f0 79%',
    },
    backgronud: {
      type: String,
      default: 'to bottom, #141029, #141029',
    },
    hover: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: '',
    },
    borderWidth: {
      type: Number,
      default: 2,
    },
    borderColor: {
      type: String,
      default: '#fff',
    },
  },
  data() {
    return {
      packWidth: `${this.width}px`,
      packHeight: `${this.height}px`,
      borderRadius: `${this.radius}px`,
      packBorderWidth: `${this.borderWidth}px`,
      isHover: true,
      classNamePack: this.className,
    };
  },
  methods: {
    mouseenterFun() {
      if (this.isHover && this.hover) {
        this.classNamePack += ` pack-bg`;
      }
    },
    mouseleaveFun() {
      if (this.isHover && this.hover) {
        this.classNamePack = this.classNamePack.replace('pack-bg', '');
      }
    },
  },
  beforeMount() {
    if (this.className.indexOf('pack-bg') > -1) {
      this.isHover = false;
    }
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
  width: v-bind(packWidth);
  height: v-bind(packHeight);
  color: v-bind(color);
  border-radius: v-bind(borderRadius);
}
.pack-border {
  border-style: solid;
  border-width: v-bind(packBorderWidth);
  border-image-source: linear-gradient(v-bind(linearGradientBorder));
  border-image-slice: 1;
  background-image: linear-gradient(v-bind(backgronud)),
    linear-gradient(v-bind(linearGradientBorder));
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.pack-bg {
  border: solid v-bind(packBorderWidth) v-bind(borderColor);
  background-image: linear-gradient(v-bind(linearGradient));
}
</style>
