<template>
  <router-view class="font-family" name="Header"></router-view>
  <router-view class="font-family"></router-view>
  <router-view class="font-family" name="Footer"></router-view>
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
  min-height: 100vh;
}
body {
  background-color: #000;
}
</style>
<style lang="scss">
@import url('@/assets/css/index.scss');
</style>
