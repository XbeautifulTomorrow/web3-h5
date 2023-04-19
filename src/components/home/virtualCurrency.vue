<template>
  <div class="virtual-currency">
    <p class="virtual-currency-title">Recent Unboxings</p>
    <ul class="virtual-currency-main publick-scrollbar">
      <li
        v-for="(item, index) in currencyList"
        :key="`currency-${index}`"
        class="virtual-currency-list"
        :style="{ borderLeft: `4px solid ${item.color}` }"
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
</template>

<script>
export default {
  name: 'VirtualCurrency',
  components: {},
  data() {
    return {
      currencyList: [
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
.virtual-currency-main {
  display: flex;
  align-content: center;
  align-items: center;
  overflow-y: hidden;
  overflow-x: auto;
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
</style>
