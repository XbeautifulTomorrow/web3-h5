<template>
  <div class="bitzing">
    <div class="bitzing-main">
      <div id="logo" ref="logo" class="logo"></div>
      <div class="bitzing-text">
        <img src="./img/slogen.png" alt="" />
      </div>
      <iframe
        v-if="showIfram"
        class="bitzing-iframe"
        :src="iframeSrc"
        frameborder="0"
      ></iframe>
      <img v-else class="bitzing-main-img" src="./img/main.png" alt="" />
      <div class="bitzing-link">
        <button class="cybr-btn bitzing-link-twitter">
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
        </button>
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
      showIfram: false,
      iframeSrc: `http://221.236.31.34:16085/`,
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
    const { search } = window.location;
    if (search) {
      const searchArr = search.split('=');
      if (searchArr[1]) {
        this.showIfram = true;
        this.iframeSrc += `?imgUrl=${searchArr[1]}`;
      }
    }
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
