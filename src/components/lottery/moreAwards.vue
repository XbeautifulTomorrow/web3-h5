<template>
  <div class="lottery-moreLuck-box">
    <div class="lottery-moreLuck-sub">
      <div class="roll-text">
        <p class="public-color-one roll-title">TOP BLUE-CHIPS BOX</p>
        <p class="roll-text-offcial">An offcial box by Bitzing</p>
      </div>
      <div class="lottery-moreLuck-bg">
        <div
          :class="[
            'lottery-moreLuck',
            { 'lottery-moreLuck-Big': prizeList?.length > 5 },
          ]"
        >
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
        </div>
      </div>
      <div class="result-link-box">
        <result-link></result-link>
      </div>
    </div>
  </div>
</template>
<script>
import ResultLink from "../resultLink";
import slipe from "@/assets/music/slipe.mp3";
import advanced from "@/assets/music/advanced.mp3";
import usually from "@/assets/music/usually.mp3";

import AwardsList from "./awardList.vue";
export default {
  name: "MoreAwards",
  components: { AwardsList, ResultLink },
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
      musicLoop: true,
      audioLoopObj: null,
    };
  },
  mounted() {
    const result = localStorage.getItem("result");
    if (!result) {
      this.autoplayFun(true);
      this.audioLoopObj = this.playSound(slipe, true);
    }
  },
  methods: {
    playSound(_music, musicLoop = false) {
      const audioObj = new Audio(_music);
      audioObj.loop = musicLoop;
      audioObj.pause();
      audioObj.play();
      return audioObj;
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
        this.audioLoopObj.pause();
        if (data[numberTest].qualityType === "NORMAL") {
          this.playSound(usually);
        } else {
          this.playSound(advanced);
        }
        if (this.winData.length >= this.prizeList.length) {
          if (data[numberTest].qualityType === "NORMAL") {
            this.playSound(usually);
          } else {
            this.playSound(advanced);
          }
          this.autoplayFun();
          this.clearTimerFun();
          this.numberTest = 0;
          setTimeout(() => {
            this.$emit("showResultFun");
          }, 1000);
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
    this.audioLoopObj.pause();
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
@import "./css/more.scss";
.roll-text {
  margin-bottom: 4.5625rem;
}
@media screen and (max-width: 1600px) {
  .roll-text {
    margin-bottom: 1.5625rem;
  }
  .lottery-moreLuck-box {
    margin-top: 5.625rem;
  }
}

.result-link-box {
  margin-top: 7.875rem;
}
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
