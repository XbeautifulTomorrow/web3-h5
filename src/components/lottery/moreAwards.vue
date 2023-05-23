<template>
  <div class="lottery-moreLuck">
    <p class="lottery-moreLuck-line"></p>
    <awards-list
      v-for="(item, index) in prizeList"
      :key="`moreLuck-${item}`"
      :height="height"
      :prizePoolList="item"
      :autoplay="autoplay[index]"
      :interval="interval"
      :winData="winData[index]"
    />
    <audio
      id="music"
      ref="music"
      preload="auto"
      webkit-playsinline="true"
      playsinline="true"
      :loop="musicLoop"
      class="bitzing-audio"
    ></audio>
  </div>
</template>
<script>
import slipe from "@/assets/music/slipe.mp3";
import advanced from "@/assets/music/advanced.mp3";
import usually from "@/assets/music/usually.mp3";

import AwardsList from "./awardList.vue";
export default {
  name: "MoreAwards",
  components: { AwardsList },
  props: {
    showMoreDialog: {
      type: Boolean,
      default: false,
    },
    prizeList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    awardItem: {
      type: Array,
      default: () => {
        return [];
      },
    },
    interval: {
      type: Number,
      default: 300,
    },
    apiIsError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      autoplay: [],
      height: Math.floor((window.innerHeight - 20) / 5),
      winData: [],
      timer: null,
      numberTest: 0,
    };
  },
  computed: {
    newValue: {
      get: function () {
        return this.showMoreDialog;
      },
      set: function (value) {
        this.$emit("update:showMoreDialog", value);
      },
    },
  },
  beforeMount() {
    const _data = this.prizeList.length > 5 ? "TEN" : "FIVE";
    if (!localStorage.getItem(_data)) {
      this.autoplayFun(true);
      this.playMusicFun(slipe);
    }
  },
  methods: {
    playMusicFun(_music, musicLoop = true, _ref = "music") {
      this.musicLoop = musicLoop;
      const music = this.$refs[_ref];
      music.src = _music;
      music.play();
    },
    getRand(start, end) {
      return Math.floor(Math.random() * (end - start + 1) + start);
    },
    clearTimerFun() {
      clearInterval(this.timer);
      this.timer = null;
    },
    stopScroll(data) {
      this.clearTimerFun();
      this.timer = setInterval(() => {
        const { numberTest } = this;
        this.winData.push(data[numberTest]);
        this.autoplay[numberTest] = false;
        this.numberTest += 1;
        if (data[numberTest].qualityType === "NORMAL") {
          this.palyMusic(usually, false);
        } else {
          this.palyMusic(advanced, false);
        }
        if (this.winData.length >= this.prizeList.length) {
          this.autoplayFun();
          this.clearTimerFun();
          this.numberTest = 0;
          this.$emit("showResultFun");
        }
      }, 1000);
    },
    autoplayFun(data = false) {
      const number = this.prizeList.length;
      for (let i = 0; i < number; i++) {
        this.autoplay[i] = data;
      }
    },
  },
  beforeUnmount() {
    this.clearTimerFun();
  },
  watch: {
    awardItem: {
      deep: true,
      handler: function (newData) {
        if (newData.length > 0) {
          this.stopScroll(newData);
        }
      },
    },
    apiIsError: function (newData) {
      if (newData) {
        this.autoplayFun();
        this.clearTimerFun();
        const music = this.$refs.music;
        music.pause();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("./css/more.scss");
</style>
<style lang="scss">
.lottery-moreLuck {
  .el-carousel__container {
    height: 100%;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
