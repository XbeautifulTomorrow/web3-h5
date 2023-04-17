<template>
  <CardHome />
  <div class="bg" id="bg"></div>
</template>

<script>
import CardHome from './components/cardHome.vue';
import "./components/bg"

export default {
  name: 'App',
  components: {
    CardHome,
  },
};
</script>

<style>
/* @import url("./index.scss"); */
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
.bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
