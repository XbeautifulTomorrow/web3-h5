<template>
  <div class="lottery-moreLuck-box">
    <div class="lottery-moreLuck-sub">
      <div class="roll-text">
        <p class="public-color-one roll-title">{{ blindDetailInfo.boxName }}</p>
        <p class="roll-text-offcial">{{ $t("lottery.tips_txt") }}</p>
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
            @delayTime="delayTime"
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
import { Howl } from "howler";
const slipeStart = "https://www.bitzing.io/prd/music/more-slipe-start.mp3";
const slipe = "https://www.bitzing.io/prd/music/more-slipe.mp3";
const EPIC1 = "https://www.bitzing.io/prd/music/more-EPIC1.mp3";
const EPIC2 = "https://www.bitzing.io/prd/music/more-EPIC2.mp3";
const EPIC3 = "https://www.bitzing.io/prd/music/more-EPIC3.mp3";
const LEGEND = "https://www.bitzing.io/prd/music/more-LEGEND.wav";
const NORMAL1 = "https://www.bitzing.io/prd/music/more-NORMAL1.mp3";
const NORMAL2 = "https://www.bitzing.io/prd/music/more-NORMAL2.mp3";
const NORMAL3 = "https://www.bitzing.io/prd/music/more-NORMAL3.mp3";
const NORMAL4 = "https://www.bitzing.io/prd/music/more-NORMAL4.mp3";
const NORMAL5 = "https://www.bitzing.io/prd/music/more-NORMAL5.mp3";

import ResultLink from "../resultLink";
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
    blindDetailInfo: {
      type: Object,
      default: () => {
        return {};
      },
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
      delayTimer: 0,
      slipeMusic: null,
    };
  },
  mounted() {
    const result = localStorage.getItem("result");
    if (!result) {
      this.autoplayFun(true);
      this.playSound(slipeStart);
      this.slipeMusic = this.playSound(slipe, true);
    }
  },
  methods: {
    delayTime(param) {
      this.delayTimer = param;
    },
    playSound(_music, musicLoop = false) {
      const audioObj = new Howl({ src: [_music] ,loop:musicLoop});
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
    
    playAwardsFunc(index) {
      const audioFiles = {
        EPIC: [EPIC1, EPIC2, EPIC3],
        LEGEND: [LEGEND],
        RARE: [NORMAL2, NORMAL3, NORMAL4, NORMAL5]
      };
      let targetAwardType = this.winData[index].qualityType
      const sametype = this.winData.filter(x => x.qualityType == targetAwardType)
      if (targetAwardType == 'NORMAL') {
        this.playSound(NORMAL1)
      }else if (sametype?.length) {
        let file = null
        // let type = targetAwardType == 'RARE' ? 'NORMAL' : targetAwardType
        let type = targetAwardType
        let audioArr = audioFiles[type]
        if (sametype?.length >= audioArr.length ) {
          file = audioArr[audioArr.length - 1];
        } else {
          file = audioArr[sametype?.length-1]
        }
        this.playSound(file)
      }
    },
    stopScroll(data) {
      this.clearTimerFun();
      this.timer = setInterval(() => {
        const { numberTest } = this;
        this.winData.push(data[numberTest]);
        this.autoplay[numberTest] = false;
        this.numberTest += 1;
        setTimeout(() => {
          this.playAwardsFunc(Number(numberTest))
        }, this.delayTimer * 1000);
        if (this.winData.length >= this.prizeList.length) {
          setTimeout(() => {
            this.playAwardsFunc(Number(numberTest))
          }, this.delayTimer * 1000);
          this.autoplayFun();
          this.clearTimerFun();
          this.numberTest = 0;
          setTimeout(() => {
            this.slipeMusic && this.slipeMusic.pause();
          }, this.delayTimer * 1000);
          setTimeout(() => {
            this.$emit("showResultFun", true);
          }, Number(this.delayTimer * 1000 + 1000));
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
    this.slipeMusic && this.slipeMusic.pause();
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
        this.slipeMusic && this.slipeMusic.pause();
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
  margin-top: 4.5625rem;
}
@media (max-height: 900px) {
  .roll-text {
    margin-bottom: 1rem;
  }
  .result-link-box {
    margin-top: 1rem;
  }
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
