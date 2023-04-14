<template>
  <div class="bitzing" ref="bitzing" :style="bitzingStyle">
    <!-- <audio
      id="music"
      ref="music"
      preload="auto"
      webkit-playsinline="true"
      playsinline="true"
      autoplay="true"
      loop="loop"
    ></audio>
    <div v-if="isShow" class="audio-play" @click="audioAutoPlay('music')"></div> -->
    <div class="bitzing-main">
      <div id="logo" ref="logo" class="logo"></div>
      <div class="bitzing-text">
        <img src="./img/slogen.png" alt="" />
      </div>
      <iframe class="bitzing-iframe" :src="iframeSrc" frameborder="0"></iframe>
      <div class="bitzing-link">
        <a
          class="bitzing-link-svg link-twitter"
          href="https://twitter.com/Bitzing_io"
          target="_blank"
        ></a>
        <a
          class="bitzing-link-svg link-discord"
          href="https://discord.gg/J9KVVtWu"
          target="_blank"
        ></a>
      </div>
    </div>
  </div>
</template>

<script>
import { logoFun } from "./logo";
// import musicSrc from './music/music.mp3';
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      bitzingStyle: { transform: "translate(-50%, -50%) scale(1)" },
      isShow: true,
      iframeSrc: window.location.origin.indexOf("www.bitzing.io")>0
        ? "https://www.bitzing.io/card/"
        : `http://221.236.31.34:16085/`,
      counter: 0,
      updateRate: 10,
      tilt: 2,
      container: undefined,
      imgElement: undefined,
      src: `${window.location.origin.indexOf("www.bitzing.io")>0
        ? "https://www.bitzing.io/card/":window.location.origin}/main.png`,
      timer: null,
    };
  },
  created() {
    const { search } = window.location;
    if (search) {
      const searchArr = search.split("=");
      if (searchArr[1]) {
        this.iframeSrc += `?imgUrl=${searchArr[1]}`;
        return;
      }
    }
    this.iframeSrc += `?imgUrl=${this.src}`;
  },
  mounted() {
    window.onresize = () => {
      if (this.timer !== null) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.bitzingStyleFun();
      }, 300);
    };
    this.bitzingStyleFun();
  },
  methods: {
    bitzingStyleFun() {
      const { offsetHeight } = this.$refs.bitzing;
      const { clientHeight } = document.body;
      let _style = this.bitzingStyle;
      _style = {
        transform: ` translate(-50%, -50%) scale(${(
          (clientHeight * 0.85) /
          offsetHeight
        ).toFixed(2)})`,
      };
      Object.assign(this.bitzingStyle, _style);
      logoFun("logo");
    },
  },
  beforeUpdate() {
    clearTimeout(this.timer);
    this.timer = null;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bitzing {
  width: 100%;
  margin: auto;
  z-index: 10;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transform: translate(-50%, -50%) scale(1);
}
.container {
  perspective: 30px;
}
.bitzing-link-twitter {
  margin-right: 20px;
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
  width: 90%;
  height: 800px;
  margin: 0 auto;
  /* overflow: hidden; */
}
.bitzing-main {
  position: relative;
  z-index: 10;
}
.bitzing-main-img {
  margin: 20px auto;
}
.logo {
  width: 387px;
  height: 188px;
  margin: 0 auto 20px;
}
.bitzing-link-svg {
  width: 127px;
  height: 120px;
  background-repeat: no-repeat;
  background-size: auto 100%;
  display: inline-block;
  outline: none;
}
.link-twitter {
  background-image: url("./img/button-twitter-sprite.png");
  margin-right: 20px;
}
.link-discord {
  background-image: url("./img/button-discord-sprite.png");
}
.bitzing-link-svg:hover {
  animation-name: sprite;
  animation-duration: 0.2s;
  animation-timing-function: steps(4);
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  cursor: pointer;
  filter: drop-shadow(0 0 46rem #60dbff);
}
@keyframes sprite {
  0% {
    background-position: 0 0;
  }

  to {
    background-position: 100% 0;
  }
}
.audio-play {
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
}
</style>
<style>
.bitzing-iframe * {
  overflow: hidden;
  background: none;
}
</style>
