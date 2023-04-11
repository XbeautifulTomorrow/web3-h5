<template>
  <div class="bitzing" ref="bitzing" :style="bitzingStyle">
    <audio
      id="music"
      ref="music"
      preload="auto"
      webkit-playsinline="true"
      playsinline="true"
      autoplay="true"
      loop="loop"
    ></audio>
    <div v-if="isShow" class="audio-play" @click="audioAutoPlay('music')"></div>
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
import { logoFun } from './logo';
import musicSrc from './music/music.mp3';
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      bitzingStyle: {},
      isShow: true,
      iframeSrc: `http://221.236.31.34:16085/`,
      counter: 0,
      updateRate: 10,
      tilt: 2,
      container: undefined,
      imgElement: undefined,
      style: '',
      src: `${window.location.origin}/main.png`,
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
    logoFun('logo');
    const { offsetHeight } = this.$refs.bitzing;
    const { clientHeight } = document.body;
    if (clientHeight > offsetHeight) {
      const _style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
      Object.assign(this.bitzingStyle, _style);
    } else {
      Object.assign(this.bitzingStyle, { padding: '20px 0' });
    }
  },
  methods: {
    audioAutoPlay(id) {
      let music = this.$refs[id];
      music.src = musicSrc;
      this.isShow = false;
      music.play();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bitzing {
  width: 100%;
  position: relative;
  z-index: 10;
}
.bitzing-text {
  height: 34px;
}
.container {
  perspective: 30px;
}
.bitzing-link {
  height: 64px;
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
  height: 700px;
  margin: 0 auto;
  overflow: hidden;
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
  width: 94px;
  height: 94px;
  background-repeat: no-repeat;
  background-size: 500% auto;
  display: inline-block;
  outline: none;
}
.link-twitter {
  background-image: url('./img/button-twitter-sprite.png');
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
}
</style>
<style scoped>
@import url('./button.css');
</style>
<style>
.bitzing-iframe * {
  overflow: hidden;
  background: none;
}
</style>
