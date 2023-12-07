<template>
  <div class="war_game_index_wrapper">
    <div class="banner_box panel_bg" v-if="screenWidth > 950">
      <img src="@/assets/svg/home/warGame/banner/war_banner.webp" alt="" />
    </div>
    <warGame
      :warHistory="warData"
      :isHistory="isHistory"
      v-if="pageType == 'warGame'"
      @toWar="handleWer"
      @toHistory="pageType = 'history'"
    ></warGame>
    <history
      v-if="pageType == 'history'"
      @toWar="handleWar"
      @toHistory="handleHistory"
    ></history>
  </div>
</template>
<script>
import warGame from "./warGame.vue";
import history from "./history.vue";
import { handleWindowResize } from "@/utils";
export default {
  name: "TokenWar",
  components: {
    warGame,
    history,
  },
  data() {
    return {
      pageType: "warGame", // warGame / history
      isHistory: false,
      warData: null,
      screenWidth: null,
    };
  },
  computed: {},
  methods: {
    // war事件
    handleWer() {
      this.warData = null;
      this.isHistory = false;
    },
    // war
    handleWar() {
      this.pageType = "warGame";
      this.warData = null;
      this.isHistory = false;
    },
    // history事件
    handleHistory(event) {
      this.pageType = "warGame";
      this.warData = event;
      this.isHistory = true;
    },
    dataLayerFunc(event){
      try {
        // eslint-disable-next-line no-undef
        dataLayer.push({
          event: event,
          ecommerce: "ok",
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  beforeUnmount() {},
  created() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;
    this.dataLayerFunc("game_token_war_loading");
  },
  mounted() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;

    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
    });
  },
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
    