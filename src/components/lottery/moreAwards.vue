<template>
  <div class="lottery-moreLuck-box">
    <div class="lottery-moreLuck-sub">
      <div class="roll-text">
        <p class="public-color-one roll-title">{{ blindDetailInfo.boxName }}</p>
        <p class="roll-text-official">{{ $t("lottery.tips_txt") }}</p>
      </div>
      <div class="lottery-moreLuck-bg">
        <div :class="['lottery-moreLuck', { 'lottery-moreLuck-Big': prizeList?.length > 5 }]" v-if="innerWidth > 950">
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
      <div class="result-link-box" v-if="innerWidth > 950">
        <result-link></result-link>
      </div>
      <award-multi-h5
        v-if="innerWidth <= 950"
        :winData="awardItem"
        :blindDetailInfo="blindDetailInfo"
        @delayTime="delayTime"
      ></award-multi-h5>
    </div>
  </div>
</template>

<script>
import { Howl } from "howler";
import {
  slipeStart,
  slipe,
  EPIC1,
  EPIC2,
  EPIC3,
  LEGEND,
  NORMAL1,
  NORMAL2,
  NORMAL3,
  NORMAL4,
  NORMAL5,
  moreUsually,
} from "@/utils/audioResource";

import ResultLink from "../resultLink";
import AwardsList from "./awardList.vue";
import AwardMultiH5 from "./awardMultiH5";
export default {
  name: "MoreAwards",
  components: { AwardsList, ResultLink, AwardMultiH5 },
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
      innerWidth: null,
    };
  },
  mounted() {
    this.innerWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      this.innerWidth = window.innerWidth;
    });
    setTimeout(() => {
      const result = localStorage.getItem("result");
      if (!result) {
        this.autoplayFun(true);
        this.playSound(slipeStart);
        this.slipeMusic = this.playSound(slipe, true);
      }
    }, 300);
  },
  methods: {
    delayTime(param) {
      this.delayTimer = param;
    },
    playSound(_music, musicLoop = false) {
      const audioObj = new Howl({ src: [_music], loop: musicLoop });
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
        RARE: [NORMAL1, NORMAL2, NORMAL3, NORMAL4, NORMAL5],
        NORMAL: [moreUsually],
      };
      let targetAwardType = this.winData[index].qualityType;
      const sametype = this.winData.filter((x) => x.qualityType == targetAwardType);
      if (sametype?.length) {
        let file = null;
        let type = targetAwardType;
        let audioArr = audioFiles[type];
        if (sametype?.length >= audioArr.length) {
          file = audioArr[audioArr.length - 1];
        } else {
          file = audioArr[sametype?.length - 1];
        }
        this.playSound(file);
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
          this.playAwardsFunc(Number(numberTest));
        }, this.delayTimer * 1000);
        if (this.winData.length >= this.prizeList.length) {
          setTimeout(() => {
            this.playAwardsFunc(Number(numberTest));
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
@media (max-width: 950px) {
  .result-link-box {
    margin-top: 1.25rem;
  }
  .lottery-moreLuck-box {
    align-items: baseline;
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
