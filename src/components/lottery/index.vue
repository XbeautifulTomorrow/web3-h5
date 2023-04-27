<template>
  <div class="roll roll-container">
    <div class="lottery-content">
      <div class="roll-text public-color-one">
        <p class="public-color-one">Top Blue-chips Box</p>
        <p class="roll-text-offcial">An offcial box by Bitzing</p>
      </div>
      <div class="con">
        <el-carousel
          height="280"
          :interval="interval"
          :autoplay="autoplay"
          :pause-on-hover="false"
          indicator-position="none"
          arrow="never"
          @change="changeFun"
          ref="carousel"
        >
          <el-carousel-item v-for="(item, index) in items" :key="index">
            <div class="lottery-carousel" :style="carouselStyle">
              <div
                v-for="(list, _listIndex) in item"
                :key="`list-${_listIndex}`"
                class="lottery-carousel-list"
              >
                <div class="lottery-list-bor" ref="light" :style="borStyle">
                  <img class="lottery-list-img" :src="list.nftImg" />
                </div>
                <div class="lottery-list-nftNumber">
                  #&nbsp;{{ list.tokenId }}
                </div>
                <p class="public-color-three lottery-list-seriesName">
                  {{ list.seriesName }}
                </p>
                <div class="lottery-list-text">
                  <!-- <img class="lottery-list-logo" :src="list.seriesImg" /> -->
                  <img src="@/assets/img/eth.png" alt="" />
                  <span class="public-color-two lottery-list-minPrice">
                    {{ list.price }}
                  </span>
                  <span class="public-color-two lottery-list-conin">
                    {{ list.coin }}
                  </span>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="list_mask"></div>
      </div>
      <div class="btn-container">
        <!-- <button-com @click="openBox" text="开始" /> -->
        <span @click="stopScroll">结束</span>
        <span @click="resetBox">重置</span>
        <span @click="startLott('ONE')">余额抽盲盒(单抽)</span>
        <span @click="startLott('FIVE')">余额抽盲盒(五连抽)</span>
        <span @click="startLott('TEN')">余额抽盲盒(十连抽)</span>
      </div>
    </div>
    <div
      :style="{
        display: 'none',
      }"
    >
      <img v-for="(item, index) in imteImg" :src="item" :key="`img-${index}`" />
    </div>
    <el-dialog
      v-model="showResult"
      title="Tips"
      width="30%"
      center
      :close-on-click-modal="false"
    >
      <div class="result-modal">
        <img class="lottery-list-img" :src="awardItem.seriesImg" />
        <p>
          你抽中了
          <b>{{ awardItem.seriesName }}#{{ awardItem.tokenId }}</b>
          ,请选择回收还是持有！
        </p>
        <p>
          你还有<b>{{ resultSecond }}</b
          >秒做出选择,倒计时结束将自动回收
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="chooseLotteryHold('hold')">持有</el-button>
          <el-button type="primary" @click="chooseLotteryHold()">
            回收获得{{ awardItemPrice }}ETH
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 多个中奖 -->
    <el-dialog
      v-model="showMoreDialog"
      title="Tips"
      width="100%"
      top="0"
      class="lottery-moreLuck"
    >
      <ul class="lottery-moreLuck-content">
        <li
          v-for="(item, index) in moreLuck"
          :key="`luck-${index}`"
          class="lottery-moreLuck-list"
        >
          <div class="lottery-moreLuck-bor">
            <img class="lottery-list-img" :src="item.nftImg" />
          </div>
          <div class="lottery-moreLuck-nftNumber">
            #&nbsp;{{ item.tokenId }}
          </div>
          <p class="public-color-three lottery-moreLuck-seriesName">
            {{ item.seriesName }}
          </p>
          <div class="lottery-moreLuck-text">
            <!-- <img class="lottery-list-logo" :src="list.seriesImg" /> -->
            <img
              class="lottery-moreLuck-img"
              src="@/assets/img/eth.png"
              alt=""
            />
            <span class="public-color-two lottery-moreLuck-minPrice">
              {{ item.price }}
            </span>
            <span class="public-color-two lottery-moreLuck-conin">
              {{ item.coin }}
            </span>
          </div>
        </li>
      </ul>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="showMoreDialog = false">Cancel</el-button>
          <el-button type="primary" @click="showMoreDialog = false">
            Confirm
          </el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>

<script>
import { lotteryHold } from '@/services/api/blindBox';
// import buttonCom from './button.vue';
const itemWidth = 220;
export default {
  name: 'LotteryPage',
  // components: { buttonCom },
  props: ['lottoList', 'setBalanceOrder', 'lottResult', 'test'],
  data() {
    return {
      slidesPerView: Math.floor(document.body.clientWidth / itemWidth),
      autoplay: false,
      itemWidth: itemWidth, //每张卡牌的宽度
      items: [], //滚动的卡片列表
      awardItem: { idx: 0, seriesImg: 0, heroid: 0, seriesName: '', price: '' }, //中奖道具
      awardItemPrice: 0,
      itemList: [],
      currentItem: undefined,
      borStyle: {
        width: `${itemWidth}px`,
        height: `${itemWidth}px`,
      },
      showNumber: 0,
      showIndex: 0,
      translateX: 0,
      imteImg: [],
      carouselStyle: { transform: `translateX(-${itemWidth / 2}px)` },
      showResult: false,
      showMoreDialog: false,
      lottoResult: '',
      resultSecond: 60,
      resultSecondTimer: null,
      interval: 280,
      moreLuck: [],
      moreLength: 1,
    };
  },
  watch: {
    lottResult: function (newVal) {
      if (newVal) {
        this.lottoResult = newVal;
        const second =
          this.$dayjs(newVal.localDateTime).diff(
            this.$dayjs(newVal.data[0].createTime)
          ) / 1000;
        if (second < this.resultSecond) {
          this.resultSecond = parseInt(second);
        }
        this.awardItemPrice = newVal.data[0].price;
        // this.awardFun(newVal.data[0].seriesName);
        this.luckyFun(newVal.data);
      }
    },
  },
  methods: {
    async chooseLotteryHold(type) {
      let data = this.lottoResult.data;
      let arg = { orderId: data[0].orderId };
      if (type == 'hold') {
        arg = {
          lotteryIds: data[0].id,
        };
      }
      let res = await lotteryHold(arg);
      console.log(res, 'res===');
      this.showResult = false;
      localStorage.removeItem('awardItem');
    },
    luckyFun(_luck) {
      // itemList
      const { showIndex, showNumber } = this;
      const _showNumber = Math.floor(showNumber / 2);
      // let _arr = [];
      if (_luck.length < 2) {
        // const { seriesName } = _luck[0];
        // _arr = itemList.filter((item) => item.seriesName == seriesName);
        this.items[showIndex].splice(_showNumber, 1, ..._luck);
      } else {
        // _luck.forEach((item) => {
        //   const { seriesName } = item;
        //   const isAward = itemList.filter(
        //     (item) => item.seriesName == seriesName
        //   );
        //   _arr = [..._arr, ...isAward];
        // });
        const _length = _luck.length;
        if (_length < showNumber) {
          this.items[showIndex].splice(
            Math.floor((showNumber - _length) / 2),
            _length,
            ..._luck
          );
        } else {
          this.items[showIndex] = _luck;
        }
      }
      this.awardFun(_luck);
    },
    awardFun(data) {
      if (data.length < 2) {
        this.awardItem = data[0];
        this.showResult = true;
        localStorage.setItem('awardItem', JSON.stringify(this.lottoResult));
        if (!this.resultSecondTimer) {
          this.resultSecondTimer = setInterval(() => {
            if (this.resultSecond <= 1) {
              clearInterval(this.resultSecondTimer);
              this.chooseLotteryHold();
              this.showResult = false;
            }
            this.resultSecond--;
          }, 1000);
        }
      } else {
        this.showMoreDialog = true;
        this.moreLength = data.length / 5;
        this.moreLuck = data;
      }
      this.stopScroll();
    },
    changeFun(index) {
      this.showIndex = index;
    },
    startLott(type) {
      this.openBox();
      this.$emit('setBalanceOrder', type);
    },
    getRand(start, end) {
      return Math.floor(Math.random() * (end - start + 1) + start);
    },
    stopScroll() {
      this.autoplay = false;
      const _x = this.getRand(10, itemWidth - 60);
      this.carouselStyle = { transform: `translateX(-${_x}px` };
    },
    resetBox() {
      this.autoplay = false;
      this.dataFun();
    },
    openBox() {
      this.autoplay = true;
    },
    itemsFun() {
      const { itemList, showNumber } = this;
      let _items = [];
      let _item = [];
      for (;;) {
        itemList.forEach((item) => {
          if (_item.length - 1 >= showNumber) {
            _items.push(_item);
            _item = [];
            _item.push(item);
          } else {
            _item.push(item);
          }
        });
        if (_items.length > 3) {
          this.items = _items;
          return;
        }
      }
    },
    dataFun() {
      const { lottoList } = this;
      let _itemImg = [];
      lottoList.forEach((item1) => {
        item1.boxNftInfos.forEach((item) => {
          let img = new Image();
          img.src = item1.seriesImg;
          _itemImg.push(item1.seriesImg);
          let _obj = {
            seriesImg: item1.seriesImg,
            seriesName: item1.seriesName,
            tokenId: item1.tokenId,
          };
          _obj = { ..._obj, ...item };
          this.itemList.push(_obj);
        });
      });
      this.imteImg = _itemImg;
      this.itemsFun();
    },
  },
  mounted() {
    const { clientWidth } = document.body;
    const number = Math.ceil(clientWidth / itemWidth);
    this.showNumber = number;
    this.interval = Math.ceil(clientWidth / 1920) * this.interval;
    if (this.interval >= 330) {
      this.interval = 330;
    }
    this.dataFun();
    if (localStorage.getItem('awardItem')) {
      this.lottoResult = JSON.parse(localStorage.getItem('awardItem'));
      this.awardItemPrice = this.lottoResult.data[0].price;
      this.awardFun(this.lottoResult.data[0].seriesName);
    }
  },
};
</script>
<style lang="scss" scoped>
@import url('./index.scss');
.lottery-moreLuck-content {
  width: calc(var(--luckBorHeight) * (v-bind(moreLength)) + 20px);
}
.lottery-moreLuck-list {
  width: calc(100% - (v-bind(moreLength)));
}
</style>
<style lang="scss">
.lottery-moreLuck {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__footer {
    display: none;
  }
}
</style>
