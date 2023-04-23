<template>
  <div class="link">
    <div class="link-content">
      <img v-if="src" class="link-img" :src="src" alt="" />
      <p class="link-text" v-if="text">
        {{ text }}
      </p>
      <img
        v-if="link"
        class="link-img-go"
        src="@/assets/img/login/icon-chickdefault.png"
        alt=""
        @click="goToLink"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkCom',
  props: {
    text: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },
  methods: {
    goToLink() {
      const { link } = this;
      if (link.indexOf('http') > -1) {
        window.open(link);
      } else {
        this.$router.push(`/${link}`);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.link {
  width: 362px;
  height: 52px;
  padding: 1px;
  border-radius: 12px;
  background-color: #1b082b;
  box-sizing: border-box;
  border-style: solid;
  border-width: 1px;
  border-color: transparent;
  cursor: pointer;
  * {
    box-sizing: border-box;
  }
  &:hover {
    border-image-source: linear-gradient(
      to bottom,
      #dd82af,
      #d12398 61%,
      #fab597
    );
    border-image-slice: 1;
    background-image: linear-gradient(to bottom, #1b082b, #1b082b),
      linear-gradient(to bottom, #dd82af, #d12398 61%, #fab597);
    background-origin: border-box;
    background-clip: content-box, border-box;
    .link-img-go {
      opacity: 1;
    }
  }
}
.link-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  padding: 0 16px;
  position: relative;
  top: -2px;
}
.link-img {
  width: 30px;
  height: 30px;
  margin-right: 8px;
}
.link-text {
  height: 20px;
  font-size: 18px;
  background-image: linear-gradient(to bottom, #768098, #eceacf 61%, #edbed2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  text-align: left;
}
.link-img-go {
  width: 24px;
  height: 24px;
  opacity: 0.3;
  position: absolute;
  top: 14px;
  right: 16px;
}
</style>
