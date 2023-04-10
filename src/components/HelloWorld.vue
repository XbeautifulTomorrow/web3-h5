<template>
  <div class="bitzing">
    <img class="bg-line" src="./img/bg-line.png" alt="" />
    <div class="bitzing-main">
      <div>
        <img src="./img/logo.svg" alt="" />
      </div>
      <div class="bitzing-text">
        <img src="./img/slogen.png" alt="" />
      </div>
      <iframe class="bitzing-iframe" :src="iframeSrc" frameborder="0"></iframe>
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
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      iframeSrc: `http://221.236.31.34:16085/?imgUrl=http://221.236.31.34:16082/img/main.png`,
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
  created() {},
  mounted() {},
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
  height: 400px;
  margin: 0 auto;
  overflow: hidden;
}
.bg-line {
  position: fixed;
  top: 150px;
  left: 0;
  width: 100%;
  height: 300px;
  z-index: 0;
}
.bitzing-main {
  position: relative;
  z-index: 10;
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
