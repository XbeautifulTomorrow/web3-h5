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
        <li v-for="(item, index) in currencyList" ref="currencyItem" :key="`currency-${index}`"
          :style="'transform: translateX(' + item.translateNum + 'px);'"
          :class="['virtual-currency-item', `box_frame_${index < 4 ? index + 1 : (index % 4) + 1}`, { isHide: activeIndex == index }]"
          @mouseenter="(e) => mouseenterFun(item, index, e)" @mouseleave="mouseLeave()">
          <div class="virtual-currency-item-l">
            <img class="virtual-currency-item-img" src="" alt="" />
            <div class="virtual-currency-item-text">
              <p class="list-nam" :style="{ color: item.color }">{{ item.name }}</p>
              <p class="list-currency">
                {{ item.number ? Number(item.number).toFixed(2) : 0 }}&nbsp;{{
                  item.currency
                }}
              </p>
            </div>
          </div>
          <div class="virtual-currency-item-r">
            <img src="@/assets/svg/virtualCurrency/arrow-up-right.svg" alt="">
          </div>
        </li>
      </ul>
    </div>
    <ul v-if="showPopup && currentData"
      :class="['virtual-currency-item-popup', `box_frame_${activeIndex < 4 ? activeIndex + 1 : (activeIndex % 4) + 1}`]"
      :style="style" @mouseenter="mouseOver()" @mouseleave="mouseLeave()">
      <li :class="['virtual-currency-item', 'isEnter']">
        <div class="virtual-currency-item-l">
          <img class="virtual-currency-item-img" src="" alt="" />
          <div class="virtual-currency-item-text" v-if="currencyList[activeIndex]">
            <p class="list-nam" :style="{ color: currencyList[activeIndex].color }">{{
              currencyList[activeIndex].name }}
            </p>
            <p class="list-currency">
              {{ currencyList[activeIndex].number ? Number(currencyList[activeIndex].number).toFixed(2) : 0 }}&nbsp;{{
                currencyList[activeIndex].currency }}
            </p>
          </div>
        </div>
        <div class="virtual-currency-item-r">
          <img src="@/assets/svg/virtualCurrency/arrow-up-right.svg" alt="">
        </div>
      </li>
      <li class="popup-list">
        <span class="popup-list-title text-ellipsis">NFT ID</span>
        <span class="popup-list-text text-ellipsis">3957</span>
      </li>
      <li class="popup-list">
        <span class="popup-list-title text-ellipsis">Metamask</span>
        <span class="popup-list-text text-ellipsis">0x.....81685</span>
      </li>
      <li class="popup-list">
        <span class="popup-list-title text-ellipsis">Wallet</span>
        <span class="popup-list-text text-ellipsis">Ethereum</span>
      </li>
      <li class="popup-list">
        <span class="popup-list-title text-ellipsis">Winner</span>
        <span class="popup-list-text text-ellipsis">0x.....81r445</span>
      </li>
      <li class="popup-list">
        <span class="popup-list-title text-ellipsis">Price</span>
        <span class="popup-list-text text-ellipsis" style="color:#fff;">5.099ETH</span>
      </li>
      <li class="popup-list-button">
        <div class="mystery-box-button">Go to Mystery Box</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'VirtualCurrency',
  components: {},
  data() {
    return {
      activeIndex: null,
      currentIndex: null,
      showPopup: null,
      currentData: undefined,
      style: {},
      currencyList: [
        {
          imgUrl: '',
          name: 'SchizoPost',
          color: '#e38d4c',
          number: '0.279',
          currency: 'ETHC',
        },
        {
          imgUrl: '',
          name: 'SchizoPost',
          color: '#e38d4c',
          number: '0.279',
          currency: 'ETH',
        },
        {
          imgUrl: '',
          name: 'SchizoPost',
          color: '#e38d4c',
          number: '0.279',
          currency: 'ETH',
        },
        {
          imgUrl: '',
          name: 'SchizoPost',
          color: '#e38d4c',
          number: '0.279',
          currency: 'ETH',
        },
        {
          imgUrl: '',
          name: 'SchizoPost',
          color: '#e38d4c',
          number: '0.279',
          currency: 'ETH',
        },
        {
          imgUrl: '',
          name: 'SchizoPost',
          color: '#e38d4c',
          number: '0.279',
          currency: 'ETHC',
        },
        {
          imgUrl: '',
          name: 'SchizoPost',
          color: '#e38d4c',
          number: '0.279',
          currency: 'ETH',
        },
        {
          imgUrl: '',
          name: 'SchizoPost',
          color: '#e38d4c',
          number: '0.279',
          currency: 'ETH',
        },
        {
          imgUrl: '',
          name: 'SchizoPost',
          color: '#e38d4c',
          number: '0.279',
          currency: 'ETH',
        },
        {
          imgUrl: '',
          name: 'SchizoPost',
          color: '#e38d4c',
          number: '0.279',
          currency: 'ETH',
        }
      ],
      translateNum: 0,
      timer: null
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
    mouseenterFun(data, index, e) {
      this.showPopup = true;
      this.activeIndex = index;
      this.currentIndex = index;
      this.currentData = data;
      window.clearTimeout(this.timer);
      const { left, bottom } = e.target.getBoundingClientRect();
      this.style = {
        left: `${left}px`,
        top: `${bottom - 92}px`
      };
    },
    search() {
      // 循环给currencyList数组每一个对象添加translateNum属性为0，这也是为了方便记录每一个对象滚动的宽度
      for (var i = 0; i < this.currencyList.length; i++) {
        this.currencyList[i]['translateNum'] = 0;
      }

      // 在元素完全渲染后再循环给每一个对象添加indexLeft属性，记录此对象初始位置，方便滚动超出父元素边界后，重新设置元素位置
      this.$nextTick(() => {
        for (var j = 0; j < this.currencyList.length; j++) {
          this.currencyList[j]['indexLeft'] = this.$refs.currencyItem[j].offsetLeft;
        }

        // 调用滚动定时器
        // this.roll();
      })
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
          if (1948 - this.currencyList[i].translateNum - this.currencyList[i].indexLeft < 0) {

            /**
             * 如果超出，则将元素移动至父级元素显示区域的左方
             * 此处的328 对应着子元素carousel-item的样式宽度
             */
            this.currencyList[i]['translateNum'] = this.$refs.currencyAll.offsetLeft - this.currencyList[i].indexLeft - 348;
          }

          // 设置每个元素每次滚动的像素大小，像素越小越平滑,这里每次只移动一个像素
          this.currencyList[i]['translateNum'] = this.currencyList[i].translateNum + 1;

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
    }
  },
};
</script>

<style lang="scss" scoped>
@import url("./components/index.scss");
</style>
