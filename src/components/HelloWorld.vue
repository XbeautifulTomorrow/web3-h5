<template>
  <div class="bitzing">
    <div class="bitzing-main">
      <div id="logo" ref="logo" class="logo"></div>
      <div class="bitzing-text">
        <img src="./img/slogen.png" alt="" />
      </div>
      <iframe class="bitzing-iframe" :src="iframeSrc" frameborder="0"></iframe>
      <div class="bitzing-link">
        <span class="bitzing-link-svg link-twitter"></span>
        <span class="bitzing-link-svg link-discord"></span>
        <!-- <button class="cybr-btn bitzing-link-twitter">
          <img src="./img/twitter.svg" alt="" />
          <span aria-hidden class="cybr-btn__glitch">
            <img src="./img/twitter.svg" alt="" />
          </span>
        </button>
        <button class="cybr-btn bitzing-link-twitter">
          <img src="./img/discord.svg" alt="" />
          <span aria-hidden class="cybr-btn__glitch">
            <img src="./img/discord.svg" alt="" />
          </span>
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { logoFun } from './logo';
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
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
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bitzing {
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 10;
}
.bitzing-text {
  height: 34px;
  /* background-image: linear-gradient(
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
  -webkit-text-fill-color: transparent; */
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
  height: 620px;
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
  margin: 20px auto;
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
