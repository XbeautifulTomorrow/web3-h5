<template>
  <div class="virtual-currency">
    <div class="title-box">
      <div class="virtual-currency-title">RECENT UNBOXINGS</div>
      <div class="interval">
        <div class="top"></div>
        <div class="bottom"></div>
      </div>
    </div>
    <div :class="['virtual-currency-content publick-scrollbar']">
      <ul class="virtual-currency-main" ref="currencyAll">
        <li
          v-for="(item, index) in currencyList"
          ref="currencyItem"
          :key="`currency-${index}`"
          :style="'transform: translateX(' + item.translateNum + 'px);'"
          :class="[
            'virtual-currency-item',
            `box_frame_${typrFormat(item)}`,
            { isHide: activeIndex == index },
          ]"
          @mouseenter="(e) => mouseenterFun(item, index, e)"
          @mouseleave="mouseLeave()"
        >
          <div class="virtual-currency-item-l">
            <img class="virtual-currency-item-img" :src="item.nftImg" alt="" />
            <div class="virtual-currency-item-text">
              <p class="list-nam">{{ item.seriesName }}</p>
              <p class="list-currency">
                {{ item.price ? Number(item.price).toFixed(2) : 0 }}&nbsp;{{
                  item.coin
                }}
              </p>
            </div>
          </div>
          <div class="virtual-currency-item-r">
            <img src="@/assets/svg/virtualCurrency/arrow-up-right.svg" alt="" />
          </div>
        </li>
      </ul>
      <ul
        v-if="showPopup && currentData"
        :class="[
          'virtual-currency-item-popup',
          `box_frame_${typrFormat(currencyList[activeIndex])}`,
        ]"
        :style="style"
        @mouseenter="mouseOver()"
        @mouseleave="mouseLeave()"
      >
        <li :class="['virtual-currency-item', 'isEnter']">
          <div class="virtual-currency-item-l">
            <img
              class="virtual-currency-item-img"
              :src="
                currencyList[activeIndex] && currencyList[activeIndex].nftImg
              "
              alt=""
            />
            <div
              class="virtual-currency-item-text"
              v-if="currencyList[activeIndex]"
            >
              <p class="list-nam">{{ currencyList[activeIndex].seriesName }}</p>
              <p class="list-currency">
                {{
                  currencyList[activeIndex].price
                    ? Number(currencyList[activeIndex].price).toFixed(2)
                    : 0
                }}&nbsp;{{ currencyList[activeIndex].coin }}
              </p>
            </div>
          </div>
          <div class="virtual-currency-item-r">
            <img src="@/assets/svg/virtualCurrency/arrow-up-right.svg" alt="" />
          </div>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">NFT ID</span>
          <span class="popup-list-text text-ellipsis">
            {{ currencyList[activeIndex] && currencyList[activeIndex].nftId }}
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">Contract</span>
          <span class="popup-list-text text-ellipsis">
            {{
              currencyList[activeIndex] &&
              currencyList[activeIndex].contractAddress
            }}
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">Chain</span>
          <span class="popup-list-text text-ellipsis">
            {{
              (currencyList[activeIndex] &&
                currencyList[activeIndex].chainId) ||
              "-"
            }}
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">Winner</span>
          <span class="popup-list-text text-ellipsis">
            {{
              currencyList[activeIndex] &&
              formatAddr(currencyList[activeIndex].winner)
            }}
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">Price</span>
          <span class="popup-list-text text-ellipsis" style="color: #fff">
            {{
              currencyList[activeIndex] &&
              `${currencyList[activeIndex].price}${currencyList[activeIndex].coin}`
            }}
          </span>
        </li>
        <li class="popup-list-button">
          <div
            class="mystery-box-button"
            @click="handleMysteryBox(currencyList[activeIndex])"
          >
            Go to Mystery Box
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getTicketList } from "@/services/api/index";
import { useHeaderStore } from "@/store/header.js";
export default {
  name: "VirtualCurrency",
  components: {},
  data() {
    return {
      activeIndex: null,
      currentIndex: null,
      showPopup: null,
      currentData: undefined,
      style: {},
      currencyList: [],
      translateNum: 0,
      timer: null,
      updateTimer: null,
    };
  },
  mounted() {
    this.search();
  },
  beforeUnmount() {
    // 销毁定时器，否则可能导致重载此组件时会有多个定时器同时执行，使得滚动变快
    window.clearTimeout(this.timer);
  },
  methods: {
    async getTheUserBalanceInfo() {
      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
      // let res = await getTheUserBalance();
      // this.ethBalance = res.data[0].balance;
    },
    async fetchTicketList() {
      const res = await getTicketList();
      if (res && res.code == 200) {
        this.currencyList = res.data;
      }
    },
    typrFormat(event) {
      const { qualityType } = event;
      if (qualityType == "LEGEND") {
        return "1";
      }
      if (qualityType == "RARE") {
        return "2";
      }
      if (qualityType == "EPIC") {
        return "3";
      } else {
        return "4";
      }
    },
    mouseenterFun(data, index, e) {
      this.showPopup = true;
      this.activeIndex = index;
      this.currentIndex = index;
      this.currentData = data;
      window.clearTimeout(this.timer);
      const { left } = e.target.getBoundingClientRect();
      this.style = {
        left: `${left + window.scrollX}px`,
        top: `${25}px`,
      };
    },
    handleMysteryBox(event) {
      // eslint-disable-next-line no-unreachable
      this.$router.push({ path: "mysteryBox", query: { boxId: event.boxId } });
    },
    search() {
      // 循环给currencyList数组每一个对象添加translateNum属性为0，这也是为了方便记录每一个对象滚动的宽度
      for (var i = 0; i < this.currencyList.length; i++) {
        this.currencyList[i]["translateNum"] = 0;
      }

      // 在元素完全渲染后再循环给每一个对象添加indexLeft属性，记录此对象初始位置，方便滚动超出父元素边界后，重新设置元素位置
      this.$nextTick(() => {
        for (var j = 0; j < this.currencyList.length; j++) {
          this.currencyList[j]["indexLeft"] =
            this.$refs.currencyItem[j].offsetLeft;
        }

        // 调用滚动定时器
        // this.roll();
      });
    },
    roll() {
      this.timer = setInterval(() => {
        // 循环给每一个对象修改translateNum属性值，从而动态修改页面元素的transform样式，达到滚动的效果
        for (var i = 0; i < this.currencyList.length; i++) {
          /**
           * 判断此元素是否即将超出父级元素carousel-item的显示区域
           * 1948 = 父级元素carousel的宽度 + 一个子元素carousel-item的宽度（如果元素有间距也需要带上）即 1600 + 328 + 20(间距)
           * 修改父级元素与子元素样式时需要留意此处也应当一起修改
           */
          if (
            1948 -
              this.currencyList[i].translateNum -
              this.currencyList[i].indexLeft <
            0
          ) {
            /**
             * 如果超出，则将元素移动至父级元素显示区域的左方
             * 此处的328 对应着子元素carousel-item的样式宽度
             */
            this.currencyList[i]["translateNum"] =
              this.$refs.currencyAll.offsetLeft -
              this.currencyList[i].indexLeft -
              348;
          }

          // 设置每个元素每次滚动的像素大小，像素越小越平滑,这里每次只移动一个像素
          this.currencyList[i]["translateNum"] =
            this.currencyList[i].translateNum + 1;
        }
      }, 30); // 30毫秒滚动一次，时间间隔越短滚动越平滑
    },

    /**
     * 鼠标悬停销毁定时器
     */
    mouseOver() {
      this.showPopup = true;
      this.activeIndex = this.currentIndex;
      window.clearTimeout(this.timer);
    },

    /**
     * 鼠标离开再次执行定时器
     */
    mouseLeave() {
      this.showPopup = false;
      this.activeIndex = null;
      // this.roll();
    },
    /**
     * @description: 格式化地址
     */
    formatAddr(event) {
      if (!event) return "";
      var reg = /^(\S{2})\S+(\S{6})$/;
      return event.replace(reg, "$1...$2");
    },
  },
  created() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }else{
      setInterval(() => {
        this.getTheUserBalanceInfo();
        this.fetchTicketList();
      }, 5000);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./components/index.scss";
</style>
