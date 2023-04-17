<template>
  <div class="bitzing">
    <div class="bitzing-main" ref="bitzing" :style="bitzingStyle">
      <div class="logo">
        <div id="logo" ref="logo" :class="['logo-img']"></div>
      </div>
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
    <audio
      id="music"
      ref="music"
      preload="auto"
      webkit-playsinline="true"
      playsinline="true"
      autoplay="true"
      class="bitzing-audio"
    ></audio>
    <div v-show="isShow" class="audio-play" @click="audioAutoPlay('music')">
      <div class="audio-play-main">
        <div class="audio-play-close">
          <img
            src="./img/invalid-name.png"
            class="audio-play-close-img"
            alt=""
          />
        </div>
        <img src="./img/get-ready-badass-d.png" alt="" />
        <button class="audio-play-button">
          <img src="./img/icon-hand.png" alt="" />
          <img src="./img/start-rock.png" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { logoFun } from './logo';
import bitzingmusic from './music/bitzingmusic.mp3';
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      bitzingStyle: { transform: 'translate(-50%, -50%) scale(1)' },
      isShow: true,
      iframeSrc: `/card/`,
      src: `${window.location.origin}/main.png`,
      timer: null,
    };
  },
  created() {
    const { search } = window.location;
    if (search) {
      const searchArr = search.split('=');
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
    bitzingStyleFun(id = 'logo') {
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
      logoFun(id);
    },
    audioAutoPlay(id) {
      this.isShow = false;
      const music = this.$refs[id];
      music.src = bitzingmusic;
      music.play();
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
  height: 100vh;
  margin: auto;
  position: relative;
  z-index: 10;
  overflow: hidden;
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transform: translate(-50%, -50%) scale(1);
}
.bitzing-main-img {
  margin: 20px auto;
}
.logo {
  width: 387px;
  height: 188px;
  margin: 0 auto 20px;
  position: relative;
}
.logo-img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.notShow {
  z-index: -1;
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
  background-image: url('./img/button-twitter-sprite.png');
  margin-right: 20px;
}
.link-discord {
  background-image: url('./img/button-discord-sprite.png');
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
  cursor: pointer;
}
.audio-play-main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  width: 625.8px;
  height: 352px;
  margin: 0 auto;
  padding-top: 63px;
  text-align: center;
  border-radius: 16px;
  border: solid 2px rgba(0, 233, 236, 0.5);
  background-color: rgba(1, 8, 28, 0.95);
  overflow: hidden;
}
.audio-play-button {
  background: none;
  width: 149px;
  height: 44px;
  padding: 8px 23px 8px 22px;
  border-radius: 22px;
  box-shadow: 1px 1px 0 0 #df00ff;
  border: solid 2px #00e9ec;
  margin: 0 auto;
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: center;
  margin-top: 60px;
}
.audio-play-close {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  position: absolute;
  top: -42px;
  right: -42px;
  background-color: #00e9ec;
}
.audio-play-close-img {
  position: absolute;
  bottom: 18px;
  left: 18px;
}
</style>
<style>
.bitzing-iframe * {
  overflow: hidden;
  background: none;
}
</style>
