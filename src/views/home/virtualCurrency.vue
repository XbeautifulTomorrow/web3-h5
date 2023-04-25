<template>
  <div class="virtual-currency">
    <p class="virtual-currency-title">Recent Unboxings</p>
    <div :class="['virtual-currency-content publick-scrollbar']">
      <ul class="virtual-currency-main">
        <li
          v-for="(item, index) in currencyList"
          :key="`currency-${index}`"
          :class="['virtual-currency-list', { isEnter: showPopup }]"
          :style="{ borderLeft: `4px solid ${item.color}` }"
          @mouseenter="(e) => mouseenterFun(item, e)"
          @mouseleave="showPopup = false"
        >
          <img class="virtual-currency-list-img" src="" alt="" />
          <div class="virtual-currency-list-text">
            <p class="list-nam">{{ item.name }}</p>
            <p class="list-currency" :style="{ color: item.color }">
              {{ item.number ? Number(item.number).toFixed(2) : 0 }}&nbsp;{{
                item.currency
              }}
            </p>
          </div>
        </li>
      </ul>
    </div>
    <ul
      v-if="showPopup && currentData"
      class="virtual-currency-list-popup"
      :style="style"
      @mouseenter="showPopup = true"
      @mouseleave="showPopup = false"
    >
      <li class="popup-list">
        <span class="popup-list-title text-ellipsis">Address</span>
        <span class="popup-list-text text-ellipsis">0xbc4c...f13d</span>
      </li>
      <li class="popup-list">
        <span class="popup-list-title text-ellipsis">Address</span>
        <span class="popup-list-text text-ellipsis">
          {{ currentData.currency }}
        </span>
      </li>
      <li class="popup-list price-list">
        <span class="popup-list-title text-ellipsis">Address</span>
        <span class="popup-list-text text-ellipsis">0xbc4c...f13d</span>
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
      showPopup: false,
      currentData: undefined,
      style: {
        borderLeft: '4px solid transparent',
      },
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
          currency: 'ETH',
        },
      ],
    };
  },
  methods: {
    mouseenterFun(data, e) {
      this.showPopup = true;
      this.currentData = data;
      const { left, bottom } = e.target.getBoundingClientRect();
      this.style = {
        left: `${left}px`,
        top: `${bottom}px`,
        borderLeft: `4px solid ${data.color}`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.virtual-currency {
  height: 80px;
  background-color: #320158;
  padding: 0 16px;
  display: flex;
  align-content: center;
  align-items: center;
}
.virtual-currency-content {
  height: 100%;
  flex: 1;
  overflow-y: hidden;
  overflow-x: auto;
}
.virtual-currency-main {
  display: flex;
  align-content: center;
  align-items: center;
  height: 100%;
  width: max-content;
  flex: 1;
}
.virtual-currency-title {
  height: 20px;
  margin-right: 16px;
  background-image: linear-gradient(to bottom, #768098, #eceacf 61%, #edbed2);
  font-size: 18px;
  font-weight: bold;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
.virtual-currency-list {
  width: 155px;
  height: 60px;
  margin: 0 16px;
  padding: 0 16px 0 12px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-content: center;
  align-items: center;
  position: relative;
  &:hover,
  &.isEnter {
    border-radius: 8px 8px 0 0;
    // .virtual-currency-list-popup {
    //   transform: scaleY(1);
    //   opacity: 1;
    // }
  }
}
.virtual-currency-list-img {
  width: 44px;
  height: 44px;
}
.virtual-currency-list-text {
  flex: 1;
  text-align: left;
  margin-left: 8px;
}
.list-nam {
  width: 100%;
  height: 20px;
  font-size: 18px;
  color: #5e5779;
}
.list-currency {
  font-size: 24px;
  font-weight: 500;
}
.virtual-currency-list-popup {
  // transform: scaleY(0);
  // transform-origin: top;
  // transition: transform 0.2s;
  // opacity: 0;
  border-radius: 0 0 8px 8px;
  // position: absolute;
  // left: -5px;
  // top: 100%;
  position: fixed;
  width: 155px;
  padding: 8px 16px 8px 12px;
  z-index: 50;
  background-color: #3c0d60;
}
.popup-list {
  font-size: 18px;
  color: #a896b5;
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.popup-list-title {
  max-width: 40px;
  height: 22px;
  margin-right: 5px;
}
.popup-list-text {
  text-align: right;
  flex: 1;
  height: 22px;
}
.popup-list-button {
  text-align: center;
}
.mystery-box-button {
  width: 135px;
  height: 36px;
  line-height: 36px;
  margin-top: 8px;
  border-radius: 8px;
  border: solid 2px #fffaff;
  background-image: linear-gradient(
    to bottom,
    #5fe3ef,
    #00689d 54%,
    #b063f5 75%
  );
  color: #fff;
  font-size: 18px;
  margin: 0 auto;
  cursor: pointer;
}
.price-list {
  .popup-list-title {
    text-shadow: 0 0 2px #9c42f5;
    background-image: linear-gradient(to bottom, #768098, #eceacf 61%, #edbed2);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    height: 30px;
    display: flex;
    align-items: flex-end;
  }
  .popup-list-text {
    height: 30px;
    background-image: linear-gradient(
      to bottom,
      #c7c3cc 8%,
      #e2e3cf 27%,
      #d94ba5 75%
    );
    font-family: Teko;
    font-size: 24px;
    font-weight: 600;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
}
</style>
