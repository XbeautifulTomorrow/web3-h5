<template>
  <div class="war_game_index_wrapper">
    <div class="banner_box"></div>
    <div class="tag_items">
      <div
        :class="['tag_item', pageType == 'warGame' ? 'active' : '']"
        @click="pageType = 'warGame'"
      >
        TOKEN WAR
      </div>
      <div
        :class="['tag_item', pageType == 'history' ? 'active' : '']"
        @click="pageType = 'history'"
      >
        HISTORY
      </div>
    </div>
    <warGame
      :warHistory="warData"
      :isHistory="isHistory"
      v-if="pageType == 'warGame'"
      @toWar="handleWer"
    ></warGame>
    <history v-if="pageType == 'history'" @toHistory="handleHistory"></history>
  </div>
</template>
<script>
import warGame from "./warGame.vue";
import history from "./history.vue";
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
    };
  },
  computed: {},
  methods: {
    // war事件
    handleWer() {
      this.warData = null;
      this.isHistory = false;
    },
    // history事件
    handleHistory(event) {
      this.pageType = "warGame";
      this.warData = event;
      this.isHistory = true;
    },
  },
  beforeUnmount() {},
  created() {},
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
    