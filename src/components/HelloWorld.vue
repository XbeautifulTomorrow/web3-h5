<template>
  <div class="bitzing">
    <div>
      <img src="./img/logo.svg" alt="" />
    </div>
    <div class="bitzing-text">Where Surprises Meet Value!</div>
    <iframe class="bitzing-iframe" :src="iframeSrc" frameborder="0"></iframe>
    <div class="bitzing-link">
      <img class="bitzing-link-twitter" src="./img/twitter.svg" alt="" />
      <img src="./img/discord.svg" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      iframeSrc: `http://localhost:5173/?imgUrl=https://raw.githubusercontent.com/Ikaris-a/bitzingimg/main/main.png`,
      counter: 0,
      updateRate: 10,
      tilt: 2,
      container: undefined,
      imgElement: undefined,
      style: '',
      mouse: {
        _x: 0,
        _y: 0,
        x: 0,
        y: 0,
      },
    };
  },
  created() {
    // this.test();
  },
  mounted() {
    this.$nextTick(() => {
      const { container, imgElement } = this.$refs;
      this.container = container;
      this.imgElement = imgElement;
      this.setOrigin(container);
    });
  },
  methods: {
    mouseenterFun(event) {
      this.update(event);
    },
    mouseleaveFun() {
      this.style = '';
    },
    mousemoveFun(event) {
      this.counter = this.counter + 1;
      if (this.isTimeToUpdate()) {
        this.update(event);
      }
    },
    isTimeToUpdate() {
      const { counter, updateRate } = this;
      const isTimeToUpdate = counter % updateRate === 0;
      return isTimeToUpdate;
    },
    updatePosition(event) {
      const { mouse } = this;
      const { _x, _y } = mouse;
      const e = event || window.event;
      this.mouse.x = e.clientX - _x;
      this.mouse.y = (e.clientY - _y) * -1;
    },
    setOrigin(e) {
      this.mouse._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
      this.mouse._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
    },
    show() {
      const { x, y } = this.mouse;
      return '(' + x + ', ' + y + ')';
    },
    update(event) {
      const { mouse, imgElement, tilt } = this;
      this.updatePosition(event);
      this.updateTransformStyle(
        ((mouse.y / imgElement.offsetHeight) * tilt).toFixed(2),
        ((mouse.x / imgElement.offsetWidth) * tilt).toFixed(2)
      );
    },
    updateTransformStyle(x, y) {
      const style = 'rotateX(' + x + 'deg) rotateY(' + y + 'deg)';
      this.style = Object.assign({}, { transform: style });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* @import url('./index.scss'); */
.bitzing {
  /* background-image: url('./img/bg.jpg'); */
  /* background-repeat: no-repeat; */
  background-size: 100% 100%;
  width: 100vw;
  min-height: 100vh;
  position: relative;
  z-index: 10;
}
.bitzing-text {
  height: 34px;
  background-image: linear-gradient(
    to bottom,
    #02081d 100%,
    #009afe 71%,
    #68ddfa 60%,
    #ede8f7 46%,
    #2e00a3 46%,
    #ff2daf 25%,
    #ff75ca 11%
  );
  font-family: Teko;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.bitzing-link-twitter {
  margin-right: 80px;
}
.container {
  perspective: 30px;
}

.inner {
  transition: transform 0.5s;
}

.container:hover .demo-overlay {
  opacity: 1;
}

.container:hover {
  cursor: pointer;
}
.bitzing-iframe {
  width: 100%;
  height: 600px;
  margin: 20px auto;
  overflow: hidden;
}
</style>
<style>
.bitzing-iframe * {
  overflow: hidden;
  background: none;
}
</style>
