<template>
  <el-config-provider :locale="locale">
    <div class="bg-panl" v-if="isRouterAlive">
      <div class="gradual-bg"></div>
      <div class="gradual-bg"></div>
      <div class="gradual-bg"></div>
      <div class="gradual-bg"></div>
      <router-view class="font-family" name="Header"></router-view>
      <router-view class="font-family" name="Currency"></router-view>
      <router-view class="wrapper_panel font-family"></router-view>
      <router-view class="font-family" name="Footer"></router-view>
    </div>
  </el-config-provider>
</template>

<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
export default {
  name: "App",
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true, //控制视图是否显示的变量
    };
  },
  computed: {
    ...mapStores(useUserStore),
    locale() {
      const { locale } = this.userStore;
      return locale;
    },
  },
  methods: {
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true; //再打开
      });
    },
    getCoinList() {
      const headerStore = useUserStore();
      return headerStore.getCoinList();
    },
  },
  created() {
    this.getCoinList();
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
  /* min-width: 120rem; */
  min-height: 100vh;
}

body {
  background-color: #110429;
}

@media screen and (max-width: 950px) {
  #app {
    width: 100%;
    min-width: auto;
  }
}
</style>
<style lang="scss">
@import "@/assets/css/index.scss";
@import "@/assets/css/dialog.scss";

.bg-panl {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  min-height: 100vh;

  & > div:nth-child(1) {
    top: 98.875rem;
    left: -9.6875rem;
    position: absolute;
    width: 25.1875rem;
    height: 28.5rem;
    pointer-events: none;
    background-color: #a21ae2;
    filter: blur(16.5625rem);
  }

  & > div:nth-child(2) {
    top: 122.625rem;
    right: -10.0625rem;
    position: absolute;
    width: 29.875rem;
    height: 33.8125rem;
    pointer-events: none;
    filter: blur(18.75rem);
    background-color: #ed21b4;
  }

  & > div:nth-child(3) {
    top: 206.4375rem;
    left: -18.9375rem;
    position: absolute;
    width: 29.875rem;
    height: 33.8125rem;
    pointer-events: none;
    filter: blur(18.75rem);
    border-radius: 50%;
    background-color: #ed21b4;
  }

  & > div:nth-child(4) {
    top: 242.25rem;
    right: -24.125rem;
    position: absolute;
    width: 29.875rem;
    height: 33.8125rem;
    pointer-events: none;
    filter: blur(18.75rem);
    border-radius: 50%;
    background-color: #a21ae2;
  }
}

@media screen and (max-width: 950px) {
  .bg-panl {
    display: flex;
    flex-direction: column;

    & > .gradual-bg {
      display: none;
    }

    .wrapper_panel {
      flex: 1;
    }
  }
}
</style>
