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
      <div
        :class="[
          'result-dialog-content',
          { 'result-dialog-content-five': result.length == 5 },
          { 'result-dialog-content-ten': result.length > 5 },
        ]"
      >
        <h2 class="result-title">CONGRATULATIONS</h2>
        <p class="result-illustrate" v-if="result.length < 2">
          An offcial box by Bitzing
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
                  @click="chooseLotteryHold('hold')"
                >
                  <span>Sell for</span>
                  <span class="result-total">{{ item.price }}ETH</span>
                  <span v-if="second > 0">({{ second }}s)</span>
                </el-button>
              </div>
              <template v-else>
                <div class="result-sell pointer">
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
                <!-- <p v-if="!nfts.includes(item.id)"" class="result-sell-get">
                  You Get {{ item.price }} ETH
                </p> -->
              </template>
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
                <span>Sell for</span>
                <span class="result-total">{{ total }}ETH</span>
                <span class="font3" v-if="second > 0">({{ second }}s)</span>
              </p>
              <p v-else-if="nfts.length > 0 && nfts.length != result.length">
                Take {{ nfts.length }} NFTs and sell the rest for<span
                  class="result-total font1"
                  >{{ total }}ETH</span
                >
                <span class="font2" v-if="second > 0">({{ second }}s)</span>
              </p>
              <p v-else>
                Take all
                <span class="font1" v-if="second > 0">({{ second }}s)</span>
              </p>
            </el-button>
            <!-- <el-button
              class="result-footer-button sell"
              round
              @click="chooseLotteryHold()"
            >
            </el-button> -->
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
onMounted(async () => {
  timerFun();
  nftsInitializationFun();
  // secondFun();
  totalFun();
  await nextTick();
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
.font1 {
  color: #2761f5;
}
.font2 {
  color: #fff;
}
.font3 {
  color: #a9a4b4;
}
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
.sell-more {
  color: #fff;
  border: solid 1px rgba(228, 231, 245, 0.5);
  background-color: transparent;
  &:hover,
  &:active {
    color: #fff;
    border: solid 1px rgba(228, 231, 245, 0.5);
    background-color: transparent;
  }
}

.result-one-footer {
  .sell {
    margin-top: 10px;
    margin-left: 0 !important;
  }
}
</style>
