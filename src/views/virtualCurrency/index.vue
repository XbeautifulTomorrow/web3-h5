<template>
  <div class="virtual-currency">
    <div class="title-box">
      <div class="virtual-currency-title">
        {{ $t("virtualCurrency.recentBox") }}
      </div>
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
          :class="[
            'virtual-currency-item',
            `box_frame_${typrFormat(item)}`,
            { isHide: activeIndex == index },
            item.animation && 'animation',
          ]"
          @mouseenter="(e) => mouseenterFun(item, index, e)"
          @click="openBoxs(item)"
          @mouseleave="mouseLeave()"
        >
          <div class="virtual-currency-item-l">
            <Image
              fit="cover"
              class="virtual-currency-item-img"
              :src="item.nftImg"
            />
            <div class="virtual-currency-item-text">
              <p class="list-nam text-ellipsis">{{ item.seriesName }}</p>
              <p class="list-currency">
                {{ accurateDecimal(item.price || 0, 4) }}&nbsp;{{ item.coin }}
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
            <Image
              fit="cover"
              class="virtual-currency-item-img"
              :src="
                currencyList[activeIndex] && currencyList[activeIndex].nftImg
              "
            />
            <div
              class="virtual-currency-item-text"
              v-if="currencyList[activeIndex]"
            >
              <p class="list-nam text-ellipsis">
                {{ currencyList[activeIndex].seriesName }}
              </p>
              <p class="list-currency">
                {{
                  currencyList[activeIndex].price
                    ? accurateDecimal(currencyList[activeIndex].price, 4)
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
          <span class="popup-list-title text-ellipsis">TOKEN ID</span>
          <span class="popup-list-text text-ellipsis">
            <span v-if="currencyList[activeIndex].tokenId">
              {{
                currencyList[activeIndex] && currencyList[activeIndex].tokenId
              }}
            </span>
            <span v-else>--</span>
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">{{
            $t("virtualCurrency.contract")
          }}</span>
          <span class="popup-list-text text-ellipsis">
            <span v-if="currencyList[activeIndex].tokenId">
              {{
                currencyList[activeIndex] &&
                currencyList[activeIndex].contractAddress
              }}
            </span>
            <span v-else>--</span>
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">{{
            $t("virtualCurrency.chain")
          }}</span>
          <span class="popup-list-text text-ellipsis">
            {{ formatNetwork(currencyList[activeIndex]) }}
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">{{
            $t("virtualCurrency.winner")
          }}</span>
          <span class="popup-list-text text-ellipsis">
            {{
              currencyList[activeIndex] &&
              formatAddr(currencyList[activeIndex].winner)
            }}
          </span>
        </li>
        <li class="popup-list">
          <span class="popup-list-title text-ellipsis">{{
            $t("virtualCurrency.price")
          }}</span>
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
import { accurateDecimal, handleWindowResize } from "@/utils";
export default {
  name: "VirtualCurrency",
  components: { Image },
  inject: ["reload"],
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
      nftTimer: null,
      screenWidth: null,
      networkList: [
        { label: "Goerli", value: 5 },
        { label: "Ethereum", value: 1 },
      ],
    };
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    accurateDecimal: accurateDecimal,
    async fetchTicketList() {
      const res = await getTicketList({ limit: 20 });
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

        this.nftTimer = setTimeout(() => {
          for (let i = 0; i < this.currencyList.length; i++) {
            this.currencyList[i].animation = false;
            clearTimeout(this.nftTimer);
          }
        }, 2000);

        this.$forceUpdate();
      } else {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    timeoutTickets() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.fetchTicketList();
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
      if (this.screenWidth <= 950) return;

      this.showPopup = true;
      this.activeIndex = index;
      this.currentIndex = index;
      this.currentData = data;
      const { left } = e.target.getBoundingClientRect();

      if (this.screenWidth <= 950) {
        this.style = {
          left: `${left + window.scrollX}px`,
          top: "0.75rem",
        };
      } else {
        this.style = {
          left: `${left + window.scrollX}px`,
          top: "1.125rem",
        };
      }
    },
    handleMysteryBox(event) {
      this.mouseLeave();
      // eslint-disable-next-line no-unreachable
      this.$router.push({ path: "/raffleBox", query: { boxId: event.boxId } });
      setTimeout(() => {
        this.reload();
      }, 300);
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
      if (!chainId) return "--";
      const { networkList } = this;
      const network = networkList.find((e) => e.value == chainId);
      return network.label;
    },
    /**
     * 判断id是否已存在
     */
    findNftId(event) {
      const { nftId } = this;
      return nftId.findIndex((e) => e.id == event) > -1;
    },
    openBoxs(event) {
      if (this.screenWidth <= 950) {
        // eslint-disable-next-line no-unreachable
        this.$router.push({
          path: "/raffleBox",
          query: { boxId: event.boxId },
        });
        setTimeout(() => {
          this.reload();
        }, 300);
      }
    },
  },
  created() {
    this.fetchTicketList();
    this.timeoutTickets();
  },
  mounted() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;

    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "./components/index.scss";
</style>
