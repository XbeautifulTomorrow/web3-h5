<template>
  <el-dialog
    v-model="visible"
    :modal="false"
    destroy-on-close
    :show-close="false"
    :append-to-body="true"
    class="roll-dialog"
    :width="1920"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <zoom-wrap>
      <div class="result-dialog-content">
        <h2 class="result-title">Top Blue-chips Box</h2>
        <p class="result-illustrate" v-if="result.length < 2">
          An offcial box by Bitzing
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
            :class="[
              'result-list',
              { flop: result.length > 0 },
              { 'result-more-list': result.length > 1 },
            ]"
            v-for="(item, index) in result"
            :key="`result-${index}`"
            :style="{
              height: result.length == 1 ? `${cardRefHeight}px` : 'auto',
            }"
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
            >
              <div class="result-portrait">
                <img class="result-portrait-img" :src="item.nftImg" alt="" />
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
                  <el-icon color="#11cde9" size="12">
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
                <p class="result-coin">
                  <span class="result-coin-number text-ellipsis">
                    {{ `${item.initPrice}` }}
                  </span>
                  {{ `${item.coin}` }}
                </p>
              </el-tooltip>
              <div class="result-one-footer" v-if="result.length < 2">
                <el-button
                  :class="['result-one-button take', { 'not-click': isSell }]"
                  type="warning"
                  round
                  @click="chooseLotteryHold('hold')"
                >
                  Take the NFT
                </el-button>
                <el-button
                  class="result-one-button sell"
                  round
                  @click="chooseLotteryHold"
                >
                  <span>Sell for</span>
                  <span class="result-total">{{ item.price }}ETH</span>
                  <span v-if="second > 0">({{ second }}s)</span>
                </el-button>
              </div>
              <template v-else>
                <div
                  class="result-sell pointer"
                  v-if="nfts.includes(item.id)"
                  @click="nftsFun(item)"
                >
                  <span class="result-sell-text">Sell for</span>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="`${item.price}${item.coin}`"
                  >
                    <span class="result-sell-number text-ellipsis">
                      {{ item.price }}
                    </span>
                  </el-tooltip>
                  <span class="result-sell-coin">
                    {{ item.coin }}
                  </span>
                </div>
                <p v-else class="result-sell-get">
                  You get {{ item.price }} ETH
                </p>
              </template>
            </div>
          </li>
        </ul>
        <div class="result-footer" v-if="result.length > 1">
          <div class="resule-footer-buttons">
            <el-button
              :class="[
                'result-footer-button take',
                { 'not-click sell': isSell },
              ]"
              type="warning"
              round
              @click="chooseLotteryHold('hold')"
            >
              Take the {{ nfts.length || "" }} NFT{{
                nfts.length > 1 ? "s" : ""
              }}
            </el-button>
            <el-button
              class="result-footer-button sell"
              round
              @click="chooseLotteryHold()"
            >
              <span>Sell for</span>
              <span class="result-total">{{ total }}ETH</span>
              <span v-if="second > 0">({{ second }}s)</span>
            </el-button>
          </div>
          <p class="result-end">
            At the end of the countdown you will automatically sell all NFT
          </p>
        </div>
        <p class="result-end" v-if="result.length < 2">
          At the end of the countdown you will automatically sell all NFT
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
            THIS TRANSACTION IS<br />
            PROVABLY FAIR
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
            <p class="result-link-go-users">[Advanced Users]</p>
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
import { BigNumber } from "bignumber.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import zoomWrap from "../zoomWrap.vue";

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
});
const emit = defineEmits(["chooseLotteryHold", "closeDialogFun"]);
const link = [
  { src: "", text: "View Faimess" },
  { src: "", text: "View Snapshot" },
];
let timer = null;
const visible = ref(true);
const isSell = ref(false);
let total = ref(0);
let second = ref(60);
let nfts = ref([]);
const cardRef = ref(null);
const cardRefHeight = ref(0);
onMounted(async () => {
  timerFun();
  nftsInitializationFun();
  // secondFun();
  totalFun();
  await nextTick();
  cardRefHeight.value = cardRef?.value[0].offsetHeight;
});
onUnmounted(() => {
  clearTimerFun();
});
// const secondFun = () => {
//   const { localDateTime } = props;
//   const _time = dayjs().utc().diff(localDateTime, "s") - 480 * 60;
//   if (_time < 60) {
//     second.value = _time;
//   }
// };
const nftsInitializationFun = () => {
  props.result.forEach((item) => {
    nfts.value.push(item.id);
  });
};
const nftsFun = (_data) => {
  if (props.result.length < 2) return;
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
  timer = setInterval(() => {
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
  clearInterval(timer);
  timer = null;
};
const chooseLotteryHold = (data) => {
  if (isSell.value && data === "hold") return;
  if (!data) {
    nfts.value = [];
  }
  emit("chooseLotteryHold", data, nfts);
};
</script>
<style lang="scss" scoped>
@import "./css/result.scss";
</style>
<style lang="scss">
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

.result-one-footer {
  .sell {
    margin-top: 10px;
    margin-left: 0 !important;
  }
}
</style>
