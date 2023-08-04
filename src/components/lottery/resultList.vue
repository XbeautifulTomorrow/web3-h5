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
      <div
        :class="[
          'result-dialog-content',
          { 'result-dialog-content-five': result.length == 5 },
          { 'result-dialog-content-ten': result.length > 5 },
        ]"
      >
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
            {
              onlyTen: result.length > 5,
            },
          ]"
        >
          <li
            :class="[
              'result-list',
              { flop: result.length > 0 },
              { 'result-more-list': result.length > 1 },
            ]"
            v-for="(item, index) in result"
            :key="`result-${index}`"
          >
            <div class="back-card-box" v-if="result.length > 0">
              <img src="@/assets/img/lottery/backCard.webp" alt="" />
            </div>
            <div
              ref="cardRef"
              :class="[
                'result-sub-list',
                { 'result-sub-flip': result.length > 0 },
                item.qualityType,
                { 'choose-list': nfts.includes(item.id) },
                { 'more-list': result.length > 1 },
              ]"
              @click="nftsFun(item)"
            >
              <div>
                <div class="result-portrait">
                  <image-view class="result-portrait-img" :src="item.nftImg" />
                </div>
                <div class="result-club text-ellipsis">
                  <div class="result-club-title text-ellipsis">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="item.seriesName"
                    >
                      <span class="result-club-title-text text-ellipsis">
                        {{ item.seriesName }}
                      </span>
                    </el-tooltip>
                    <el-icon color="#11cde9" size="19">
                      <CircleCheckFilled />
                    </el-icon>
                  </div>
                  <span
                    class="result-club-serial text-ellipsis"
                    v-if="item.tokenId || item.tokenId === 0"
                  >
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="`# ${item.tokenId}`"
                    >
                      #&nbsp;{{ item.tokenId }}
                    </el-tooltip>
                  </span>
                </div>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="`${item.initPrice} ${item.coin}`"
                >
                  <p class="result-coin" v-if="second < 1">
                    <span class="result-coin-number text-ellipsis">
                      {{ `${item.initPrice}` }}
                    </span>
                    {{ `${item.coin}` }}
                  </p>
                  <p class="result-sell-text-box" v-else>
                    <span class="result-sell-text">{{
                      $t("lottery.sell_for")
                    }}</span>
                    <span class="result-sell-coin">
                      <img
                        class="public-dialog-icon"
                        src="@/assets/svg/user/icon_ethereum.svg"
                        alt=""
                      />
                      {{ item.price }}
                    </span>
                  </p>
                </el-tooltip>
                <div class="result-one-footer" v-if="result.length < 2">
                  <el-button
                    :class="['result-one-button sell', { 'not-click': isSell }]"
                    type="warning"
                    round
                    @click="chooseLotteryHold('hold')"
                  >
                    {{ $t("lottery.take_nft") }}
                    <span v-if="second > 0">（{{ second }}s）</span>
                  </el-button>
                  <el-button
                    class="result-one-button take"
                    round
                    @click="chooseLotteryHold"
                  >
                    <span>{{ $t("lottery.sell_for") }}</span>
                    <span class="result-total">{{ item.price }}&nbsp;ETH</span>
                  </el-button>
                </div>
                <template v-else>
                  <div class="result-sell pointer" v-if="second > 0">
                    <!-- <span class="result-sell-text">Sell for </span>
                      <span class="result-sell-number text-ellipsis">
                        {{ item.price }}
                      </span>
                    <span class="result-sell-coin">
                      {{ item.coin }}
                    </span> -->
                    <p class="hold-btn">{{ $t("lottery.click_hold") }}</p>
                  </div>
                  <p v-else class="result-sell-get">
                    {{ $t("lottery.get_eth", { num: item.price }) }}
                  </p>
                </template>
              </div>

              <div
                class="hold-mask"
                v-if="result.length > 1 && nfts.includes(item.id)"
              ></div>
            </div>
          </li>
        </ul>
        <div class="result-footer" v-if="result.length > 1">
          <div class="resule-footer-buttons">
            <el-button
              :class="[
                'result-footer-button',
                nfts.length == 0 ? 'sell-more' : 'take',
              ]"
              round
              @click="chooseLotteryHold('hold')"
            >
              <p v-if="nfts.length == 0">
                <span>{{ $t("lottery.sell_for") }}</span>
                <span class="result-total font5">{{ total }}&nbsp;ETH</span>
                <span class="font3" v-if="second > 0">({{ second }}s)</span>
              </p>
              <p v-else-if="nfts.length > 0 && nfts.length != result.length">
                <span
                  v-html="
                    $t('lottery.get_eth_nft', { takeNum: nfts.length, total })
                  "
                ></span>
                <span class="font1" v-if="second > 0">({{ second }}s)</span>
              </p>
              <p v-else>
                {{ $t("lottery.take_all") }}
                <span class="font1" v-if="second > 0">({{ second }}s)</span>
              </p>
            </el-button>
          </div>
          <p class="result-end">
            {{ $t("lottery.tips7") }}
          </p>
        </div>
        <p class="result-end" v-if="result.length < 2">
          {{ $t("lottery.tips7") }}
        </p>
        <div class="result-link">
          <img
            class="result-link-img"
            src="@/assets/img/lottery/fair.png"
            alt=""
          />
          <img
            class="result-link-line"
            src="@/assets/img/lottery/Line15.png"
            alt=""
          />
          <p class="result-link-text">
            {{ $t("lottery.tips9") }}
          </p>
          <img
            class="result-link-line"
            src="@/assets/img/lottery/Line15.png"
            alt=""
          />
          <div class="result-link-go">
            <p class="result-link-go-text">
              <a
                class="result-link-go-view"
                :href="item.src"
                target="_blank"
                v-for="(item, index) in link"
                :key="`link-${index}`"
              >
                {{ item.text }}
              </a>
            </p>
            <p class="result-link-go-users">
              {{ $t("lottery.tips10") }}
            </p>
          </div>
        </div>
      </div>
    </zoom-wrap>
  </el-dialog>
</template>

<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import * as workerTimers from "worker-timers";
import { BigNumber } from "bignumber.js";
import { Howl } from "howler";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import zoomWrap from "../zoomWrap.vue";
import ImageView from "../imageView";
import { getTheUserBalance } from "@/services/api/user";
import { i18n } from "@/locales";
const flop = "https://www.bitzing.io/prd/music/flop.mp3";
const flopAfter = "https://www.bitzing.io/prd/music/flop-after.mp3";

const { t } = i18n.global;

dayjs.extend(utc);
dayjs.extend(timezone);

const props = defineProps({
  result: {
    type: Array,
    requird: true,
  },
  localDateTime: {
    type: String,
    default: new Date(),
  },
  idLotteryIn: {
    type: Boolean,
    requird: false,
  },
});
const emit = defineEmits(["chooseLotteryHold", "closeDialogFun"]);
const chainType = `VUE_APP_CHAIN_${props.result[0].lotteryChainType.toLocaleUpperCase()}_ADDR`;
const link = [
  {
    src: process.env[chainType] + props.result[0].hash,
    text: t("lottery.verify_faimess"),
  },
  {
    src: `/snapshot?id=${props.result[0].snapshotId}`,
    text: t("lottery.view_snapshot"),
  },
];
let timer = null;
const visible = ref(true);
const isSell = ref(false);
let total = ref(0);
let second = ref(60);
let nfts = ref([]);
const cardRef = ref(null);
onMounted(async () => {
  audioPlay();
  getTheUserBalanceApi();
  timerFun();
  nftsInitializationFun();
  totalFun();
  await nextTick();
});
onUnmounted(() => {
  clearTimerFun();
});
const audioPlay = () => {
  if (props.result.length > 1 && props.idLotteryIn) {
    _audioPlay(flop);
    setTimeout(() => {
      _audioPlay(flopAfter);
    }, 1000);
  }
};
const _audioPlay = (_music) => {
  const audioObj = new Howl({ src: [_music] });
  audioObj.pause();
  audioObj.play();
};
// const secondFun = () => {
//   const { localDateTime } = props;
//   const _time = dayjs().utc().diff(localDateTime, "s") - 480 * 60;
//   if (_time < 60) {
//     second.value = _time;
//   }
// };
const nftsInitializationFun = () => {
  if (props.result?.length < 2) {
    props.result.forEach((item) => {
      nfts.value.push(item.id);
    });
  }
};
const nftsFun = (_data) => {
  if (props.result.length < 2 || !second.value) return;
  const _index = nfts.value.findIndex((item) => item === _data.id);
  if (_index > -1) {
    nfts.value.splice(_index, 1);
    total.value = BigNumber(total.value)
      .plus(Number(_data.price))
      .decimalPlaces(4);
  } else {
    nfts.value.push(_data.id);
    total.value = BigNumber(total.value)
      .minus(Number(_data.price))
      .decimalPlaces(4);
  }
};
const totalFun = () => {
  const { result } = props;
  result.forEach((item) => {
    total.value = BigNumber(total.value)
      .plus(Number(item.price))
      .decimalPlaces(4);
  });
};
const timerFun = () => {
  timer = workerTimers.setInterval(() => {
    second.value--;
    if (second.value < 1) {
      localStorage.removeItem("result");
      //   emit("closeDialogFun");
      isSell.value = true;
      nfts.value = [];
      clearTimerFun();
    }
  }, 1000);
};
const clearTimerFun = () => {
  timer && workerTimers.clearInterval(timer);
  timer = null;
};
const chooseLotteryHold = (data) => {
  // if (isSell.value && data === "hold") return;
  if (!data) {
    nfts.value = [];
  }
  emit("chooseLotteryHold", data, nfts, isSell);
};
const getTheUserBalanceApi = async () => {
  const { result } = props;
  const res = await getTheUserBalance();
  if (res && res.localDateTime) {
    const timer = parseInt(
      60 -
        Math.ceil(
          new Date(res.localDateTime) - new Date(result[0].lotteryTime)
        ) /
          1000
    );
    const extraTime = result?.length == 1 ? 8 : result?.length == 5 ? 9 : 14;
    second.value = parseInt(timer + extraTime);
  }
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
      width: 1rem;
      height: 1rem;
      margin-right: 0.375rem;
    }
  }
}
.result-link-go-text {
  width: 13rem;
}
</style>
<style lang="scss">
.result-dialog-content {
  .font4 {
    font-family: LeagueSpartan;
    font-weight: bold;
    color: #2761f5;
  }
  .result-total-other {
    font-family: LeagueSpartan;
    font-weight: bold;
    font-size: 1.5rem;
    color: #2761f5;
    margin: 0 0.625rem;
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

.result-one-footer {
  .sell {
    margin-bottom: 10px;
    margin-left: 0 !important;
  }
  .take {
    margin-left: 0 !important;
  }
}
@media (min-height: 1200px) {
  .result-dialog-content {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
