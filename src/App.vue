<template>
  <div class="bg-panl">
    <div class="gradual-bg"></div>
    <div class="gradual-bg"></div>
    <div class="gradual-bg"></div>
    <div class="gradual-bg"></div>
    <router-view class="font-family" name="Header"></router-view>
    <router-view class="font-family" name="Currency"></router-view>
    <router-view class="font-family"></router-view>
    <router-view class="font-family" name="Footer"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  min-width: 120rem;
  min-height: 100vh;
}

body {
  background-color: #110429;
}
</style>
<style lang="scss">
@import url('@/assets/css/index.scss');


.bg-panl {
  max-width: 120rem;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;

  &>div:nth-child(1) {
    top: 98.875rem;
    left: -9.6875rem;
    position: absolute;
    width: 25.1875rem;
    height: 28.5rem;
    pointer-events: none;
    background-color: #a21ae2;
    border-radius: 50%;
    filter: blur(33.125rem);
  }

  &>div:nth-child(2) {
    top: 122.625rem;
    right: -10.0625rem;
    position: absolute;
    width: 29.875rem;
    height: 33.8125rem;
    filter: blur(18.75rem);
    background-color: #ed21b4;
  }

  &>div:nth-child(3) {
    top: 206.4375rem;
    left: -18.9375rem;
    position: absolute;
    width: 29.875rem;
    height: 33.8125rem;
    filter: blur(37.5rem);
    border-radius: 50%;
    background-color: #ed21b4;
  }

  &>div:nth-child(4) {
    top: 242.25rem;
    right: -24.125rem;
    position: absolute;
    width: 29.875rem;
    height: 33.8125rem;
    filter: blur(18.75rem);
    border-radius: 50%;
    background-color: #a21ae2;
  }
}
</style>
