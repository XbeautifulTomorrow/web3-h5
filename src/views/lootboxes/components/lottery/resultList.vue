<template>
  <el-dialog
    v-model="visible"
    :modal="true"
    destroy-on-close
    :show-close="false"
    :append-to-body="true"
    class="roll-dialog"
    :width="1920"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <zoom-wrap>
      <div :class="['result-dialog-content']">
        <h2 class="result-title">{{ $t("lottery.congratulations") }}</h2>
        <p class="result-illustrate" v-if="result.length < 2">
          {{ $t("lottery.tips_txt") }}
        </p>

        <ul
          :class="[
            'result-main',
            {
              onlyOne: result.length < 2,
            },
          ]"
        >
          <li
            :class="['result-list', { flop: result.length > 0 }]"
            :style="{ height: result.length > 1 ? cardRefH : '' }"
            v-for="(item, index) in result"
            :key="`result-${index}`"
          >
            <div class="back-card-box" v-if="result.length > 0">
              <img src="@/assets/img/lottery/backCard.webp" alt="" />
            </div>
            <div ref="cardRef" :class="['result-sub-list', { 'result-sub-flip': result.length > 0 }, item.qualityType]">
              <div>
                <div class="result-portrait">
                  <image-view class="result-portrait-img" :src="item.nftImg" />
                </div>
                <div class="result-club text-ellipsis">
                  <div class="result-club-title text-ellipsis">
                    <el-tooltip class="box-item" effect="dark" :content="item.seriesName">
                      <span class="result-club-title-text text-ellipsis">
                        {{ item.seriesName }}
                      </span>
                    </el-tooltip>
                  </div>
                  <span class="result-club-serial text-ellipsis" v-if="item.tokenId || item.tokenId === 0">
                    <el-tooltip class="box-item" effect="dark" :content="`# ${item.tokenId}`"> #&nbsp;{{ item.tokenId }} </el-tooltip>
                  </span>
                </div>
                <el-tooltip class="box-item" effect="dark" :content="`${item.initPrice} ${item.coin}`">
                  <div class="result-sell-text-box">
                    <!-- 图类型 -->
                    <template v-if="item.tokenId !== null">
                      <span class="amount" v-if="second < 1">{{ $t("virtualCurrency.price") }}</span>
                      <span class="amount" v-else>{{ $t("lottery.sell_for") }}</span>
                    </template>
                    <!-- 币类型 -->
                    <span class="amount" v-else>{{ $t("lottery.sell_for") }}</span>
                    <p class="result-sell-coin">
                      <img class="public-dialog-icon" src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                      <span v-priceFormat="item.nftType == 'EXTERNAL' && second < 1 ? item.initPrice : item.price"></span>
                    </p>
                  </div>
                </el-tooltip>
                <div class="result-one-footer" v-if="result.length < 2">
                  <el-button class="result-one-button sell" round @click="changeTypeFun">
                    <p class="public-dialog-button-p">
                      <span>{{ $t("user.claim") }}</span>
                      <img class="public-dialog-icon" src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                      <span class="result-total" v-priceFormat="item.price"> </span>
                    </p>
                  </el-button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="result-link">
        <img class="result-link-img" src="@/assets/img/lottery/fair.png" alt="" />
        <img class="result-link-line" src="@/assets/img/lottery/Line15.png" alt="" />
        <p class="result-link-text">THIS TRANSACTION IS PROVABLY FAIR</p>
      </div>
    </zoom-wrap>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, nextTick } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import zoomWrap from "@/components/zoomWrap.vue";
import ImageView from "@/components/imageView";
import { Howl } from "howler";
import { flop, flopAfter, EPIC1, LEGEND, NORMAL1, moreUsually } from "@/utils/audioResource";
import emitter from "@/utils/event-bus.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const props = defineProps({
  result: {
    type: Array,
    requird: true,
  },
  idLotteryIn: {
    type: Boolean,
    requird: false,
  },
});
const emit = defineEmits(["closeDialogFun"]);
const visible = ref(true);
const cardRef = ref(null);
const cardRefH = ref(200);
onMounted(async () => {
  audioPlay();
  await nextTick();
  getListHeight();
  window.addEventListener("resize", getListHeight);
});
const changeTypeFun = () => {
  emitter.emit("pageTypeChange", "register");
};
const getListHeight = () => {
  const { innerWidth } = window;
  nextTick(() => {
    setTimeout(() => {
      if (cardRef.value && cardRef.value[0]) {
        let ratio = 1;
        if (innerWidth < 950) {
          ratio = 0.6;
        }
        const height = cardRef?.value[0].offsetHeight * ratio;
        cardRefH.value = height + "px";
      }
    }, 200);
  });
};
const audioPlay = () => {
  let flopAfterAudio = flopAfter;
  const flopAfterAudioObj = {
    EPIC: EPIC1,
    LEGEND: LEGEND,
    RARE: NORMAL1,
    NORMAL: moreUsually,
  };
  if (props.result?.length == 1) {
    flopAfterAudio = flopAfterAudioObj[props.result[0].qualityType];
  }

  if (props.idLotteryIn) {
    _audioPlay(flop);
    setTimeout(() => {
      _audioPlay(flopAfterAudio);
    }, 1000);
  }
};
const _audioPlay = (_music) => {
  const audioObj = new Howl({ src: [_music] });
  audioObj.pause();
  audioObj.play();
};
</script>
<style lang="scss" scoped>
@import "./css/result.scss";
.font1 {
  color: #2761f5;
}
.font2 {
  color: #fff;
}
.font3 {
  color: #a9a4b4;
}

.font5 {
  color: #11cde9 !important;
}
.amount {
  font-size: 0.875rem;
  color: #a9a4b4;
  font-weight: normal;
}
.hold-btn {
  font-family: Medium;
  font-size: 0.875rem;
  color: #11cde9;
}
.result-sell-text-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  .result-sell-text {
    font-size: 0.625rem;
    color: #a9a4b4;
  }
  .result-sell-coin {
    display: flex;
    align-items: center;
    font-size: 1rem;
    img {
      width: 1.125rem;
      height: 1.125rem;
      margin-right: 0.375rem;
    }
  }
}
.result-coin-number {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
.public-dialog-button-p {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
.public-dialog-icon {
  width: 1.375rem;
  height: 1.375rem;
}
.public-dialog-icon-two {
  width: 1rem;
  height: 1rem;
  vertical-align: sub;
  opacity: 0.7;
}
.result-total {
  position: relative;
  top: 0.0625rem;
  margin: 0;
  color: #fad54d;
}
.verity-icon {
  width: 1rem;
  margin-left: 0.375rem;
}
</style>
<style lang="scss">
.result-dialog-content-ten {
  // background: url("@/assets/img/lottery/bg.webp") no-repeat center top;
  // background-size: cover;
}
.result-dialog-content {
  // background: url("@/assets/img/lottery/bg.webp") no-repeat center top;
  // background-size: cover;
  .font4 {
    font-family: LeagueSpartan;
    font-weight: bold;
    color: #2761f5;
  }
  .result-total-other {
    position: relative;
    top: 0.0625rem;
    font-family: LeagueSpartan;
    font-weight: bold;
    font-size: 1.5rem;
    color: #2761f5;
  }
}
.take {
  font-weight: 500;
  color: #13151f;
  background-image: linear-gradient(to top, #e3a406, #fbd851);

  &:hover {
    color: #13151f;
    background-image: linear-gradient(to top, #e3a406, #fbd851);
  }
}

.sell {
  color: #e4e7f5;
  border: solid 1px rgba(228, 231, 245, 0.15);
  background-color: rgba(239, 150, 46, 0.1);

  &:hover {
    border: solid 1px rgba(228, 231, 245, 0.15);
    background-color: rgba(239, 150, 46, 0.1);
    color: #e4e7f5;
  }
}
.sell-more {
  color: #fff;
  border: solid 1px rgba(228, 231, 245, 0.5);
  background-color: transparent;
  &:focus,
  &:hover,
  &:active {
    color: #fff;
    border: solid 1px rgba(228, 231, 245, 0.5);
    background-color: transparent;
  }
}
.result-footer-button img {
  width: 1.375rem;
  height: 1.375rem;
}
.result-footer-button > span {
  display: block;
  height: 2.375rem;
  line-height: 2.5rem;
}
.result-one-footer {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 6.25rem;
  .sell {
    margin-bottom: 10px;
    margin-left: 0 !important;
  }
  .take {
    margin-left: 0 !important;
  }
}
@media (max-width: 950px) {
  .result-dialog-content {
    .font4 {
      position: relative;
      top: 1px;
    }
  }
  .result-footer {
    .result-total-other {
      font-size: 1rem;
      top: 0.1rem;
    }
    .public-dialog-icon {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>
