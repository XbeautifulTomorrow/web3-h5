<template>
  <div class="virtual-currency">
    <div class="title-box">
      <div class="virtual-currency-title">{{ $t("virtualCurrency.recentBox") }}</div>
      <div class="interval">
        <div class="top"></div>
        <div class="bottom"></div>
      </div>
    </div>
    <div :class="['virtual-currency-content publick-scrollbar']">
      <ul class="virtual-currency-main" ref="currencyAll">
        <li v-for="(item, index) in currencyList" ref="currencyItem" :key="`currency-${index}`" :class="[
          'virtual-currency-item',
          `box_frame_${typrFormat(item)}`,
          { isHide: activeIndex == index },
          item.animation && 'animation'
        ]" @mouseenter="(e) => mouseenterFun(item, index, e)" @mouseleave="mouseLeave()">
          <div class="virtual-currency-item-l">
            <Image fit="cover" class="virtual-currency-item-img" :src="item.nftImg" />
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
      <ul v-if="showPopup && currentData" :class="[
        'virtual-currency-item-popup',
        `box_frame_${typrFormat(currencyList[activeIndex])}`,
      ]" :style="style" @mouseenter="mouseOver()" @mouseleave="mouseLeave()">
        <li :class="['virtual-currency-item', 'isEnter']">
          <div class="virtual-currency-item-l">
            <Image fit="cover" class="virtual-currency-item-img" :src="currencyList[activeIndex] && currencyList[activeIndex].nftImg
              " />
            <div class="virtual-currency-item-text" v-if="currencyList[activeIndex]">
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
          <span class="popup-list-title text-ellipsis">{{ $t("virtualCurrency.contract") }}</span>
          <span class="popup-list-text text-ellipsis">
            {{
              currencyList[activeIndex] &&
              currencyList[activeIndex].contractAddress
            }}
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">{{ $t("virtualCurrency.chain") }}</span>
          <span class="popup-list-text text-ellipsis">
            {{
              formatNetwork(currencyList[activeIndex])
            }}
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">{{ $t("virtualCurrency.winner") }}</span>
          <span class="popup-list-text text-ellipsis">
            {{
              currencyList[activeIndex] &&
              formatAddr(currencyList[activeIndex].winner)
            }}
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">{{ $t("virtualCurrency.price") }}</span>
          <span class="popup-list-text text-ellipsis" style="color: #fff">
            {{
              currencyList[activeIndex] &&
              `${currencyList[activeIndex].price}${currencyList[activeIndex].coin}`
            }}
          </span>
        </li>
        <li class="popup-list-button">
          <div class="mystery-box-button" @click="handleMysteryBox(currencyList[activeIndex])">
            {{ $t("virtualCurrency.goBox") }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Image from "@/components/imageView";
import { getTicketList } from "@/services/api/index";
export default {
  name: "VirtualCurrency",
  components: { Image },
  data() {
    return {
      activeIndex: null,
      currentIndex: null,
      showPopup: null,
      currentData: undefined,
      style: {},
      currencyList: [],
      nftId: [], // 当前已有nft
      translateNum: 0,
      timer: null,
      networkList: [{ label: "Goerli", value: 5 }, { label: "Ethereum", value: 1 }]
    };
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async fetchTicketList() {
      const res = await getTicketList();
      if (res && res.code == 200) {
        this.currencyList = res.data;
        const nftList = res.data;

        if (this.nftId.length > 0) {
          for (let i = 0; i < this.currencyList.length; i++) {
            if (!this.findNftId(this.currencyList[i].id)) {
              this.currencyList[i].animation = true;
            }
          }

          this.nftId = nftList;
        } else {
          this.nftId = nftList;
        }

        setTimeout(() => {
          for (let i = 0; i < this.currencyList.length; i++) {
            this.currencyList[i].animation = false;
          }
        }, 2000);

        this.$forceUpdate();
      }
    },
    timeoutTickets() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.fetchTicketList();
        this.timer = null;
        this.timeoutTickets();
      }, 5000);
    },
    typrFormat(event) {
      const { qualityType } = event;
      if (qualityType == "NORMAL") {
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
      const { left } = e.target.getBoundingClientRect();
      this.style = {
        left: `${left + window.scrollX}px`,
        top: "1.5625rem",
      };
    },
    handleMysteryBox(event) {
      this.mouseLeave();
      // eslint-disable-next-line no-unreachable
      this.$router.push({ path: "/reffleBox", query: { boxId: event.boxId } });
    },
    /**
     * 鼠标悬停销毁定时器
     */
    mouseOver() {
      this.showPopup = true;
      this.activeIndex = this.currentIndex;
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
    /**
     * @description: 格式化网络
     */
    formatNetwork(event) {
      const { chainId } = event;
      if (!chainId) return "-";
      const { networkList } = this;
      const network = networkList.find(e => e.value == chainId);
      return network.label;
    },
    /**
     * 判断id是否已存在
     */
    findNftId(event) {
      const { nftId } = this;
      return nftId.findIndex(e => e.id == event) > -1;
    },
  },
  created() {
    this.fetchTicketList();
    this.timeoutTickets();
  },
};
</script>

<style lang="scss" scoped>
@import "./components/index.scss";
</style>
