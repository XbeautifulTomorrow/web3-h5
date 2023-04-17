<template>
  <Bg />
  <CardHome />
</template>

<script>
import CardHome from './components/cardHome.vue';
import Bg from './components/bg/index.vue';

export default {
  name: 'App',
  components: {
    CardHome,
    Bg,
  },
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
.bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
