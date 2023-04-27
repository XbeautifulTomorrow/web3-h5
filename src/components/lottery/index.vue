<template>
  <div class="roll roll-container">
    <div class="lottery-content">
      <div class="roll-text public-color-one">
        <p class="public-color-one">Top Blue-chips Box</p>
        <p class="roll-text-offcial">An offcial box by Bitzing</p>
      </div>
      <!--盒子 boom执行打开爆炸的效果-->
      <div class="box" :class="{ boom: boxOpen }"></div>
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
                  <img class="lottery-list-img" :src="list.pz" />
                </div>
                <div class="lottery-list-nftNumber">
                  #&nbsp;{{ list.nftNumber }}
                </div>
                <p class="public-color-three lottery-list-seriesName">
                  {{ list.seriesName }}
                </p>
                <div class="lottery-list-text">
                  <img class="lottery-list-logo" :src="list.seriesImg" />
                  <span class="public-color-two lottery-list-minPrice">
                    {{ list.minPrice }}
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
      <!--中奖皮肤的放大提示框-->
      <!-- <div class="awardAlert" v-show="awardShow">
        <div class="lottery-show_con">
          <div class="light_bor" ref="light_bor"></div>
          <div class="lottery-award-bor">
            <img class="lottery-list-img" :src="awardItem.pz" />
          </div>
        </div>
      </div> -->
      <!--滚动组件开始滑动并且奖励没有弹出时显示 跳过动画的按钮-->
      <!-- <div class="btns" v-show="awardRollOpen && !awardShow">
      <a class="stop_btn" @click="stopScroll()" href="javascript:;"></a>
    </div> -->
      <div class="btn-container">
        <!-- <button-com @click="openBox" text="开始" /> -->
        <button-com @click="stopScroll" text="结束" />
        <button-com @click="resetBox" text="重置" />
        <button-com @click="startLott" text="余额抽盲盒(单抽)" />
      </div>
    </div>
    <div
      :style="{
        display: 'none',
      }"
    >
      <img v-for="(item, index) in imteImg" :src="item" :key="`img-${index}`" />
    </div>
    <el-dialog v-model="showResult" title="Tips" width="30%" center>
      <div class="result-modal">
        <img class="lottery-list-img" :src="awardItem.pz" />
        <p>
          你抽中了<b>{{ awardItem.seriesName }}</b
          >,请选择回收还是持有！
        </p>
        <p>
          你还有<b>{{ resultSecond }}</b
          >秒做出选择
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="chooseLotteryHold()">持有</el-button>
          <el-button type="primary" @click="chooseLotteryHold('hold')">
            回收获得{{ awardItemPrice }}ETH
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { lotteryHold } from '@/services/api/blindBox';
import buttonCom from './button.vue';
const itemWidth = 220;
export default {
  name: 'LotteryPage',
  components: { buttonCom },
  props: ['lottoList', 'setBalanceOrder', 'lottResult', 'test'],
  data() {
    return {
      slidesPerView: Math.floor(document.body.clientWidth / itemWidth),
      autoplay: false,
      awardId: 0, //当前中奖的道具编号
      rollTimer: null, //动画定时器句柄
      leftM: 50, //指针停止位置的偏移量  用来计算弹出框的初始位置

      awardShow: false, //滑动结束后显示奖励放大效果
      awardRollOpen: false, //奖励滚动组件的显示开关
      moveCss: '', //奖励滚动组件的滑动的动画效果css
      scaleCss: '', //奖励弹出放大效果的css
      itemWidth: itemWidth, //每张卡牌的宽度

      luckyNums: 0, //中奖位置
      lnStart: 60, //中奖位置区间开始
      lnEnd: 65, //中奖位置区间结束
      items: [], //滚动的卡片列表
      boxOpen: false,
      awardItem: { itemid: 0, pz: 0, heroid: 0, heroname: '', price: '' }, //中奖道具
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
      lottoResult: '',
      resultSecond: 60,
      resultSecondTimer: null,
      interval: 250,
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
        console.log(newVal,"newVal====")
        this.awardFun(newVal.data[0].seriesName);
      }
    },
  },
  methods: {
    async chooseLotteryHold(type) {
      if (type == 'hold') {
        let data = this.lottoResult.data;
        let res = await lotteryHold({
          lotteryIds: data[0].id,
          orderId: data[0].orderId,
        });
        console.log(res, 'res===');
        this.showResult = false;
        localStorage.removeItem('awardItem');
      }
    },
    awardFun(heroname) {
     
      const { itemList, showIndex, showNumber } = this;
      const _showNumber = Math.floor(showNumber / 2);
      const isAward = itemList.filter((item) => item.heroname == heroname);
      this.awardItem = isAward[0];
      console.log(this.awardItem,this.itemList,"heroname==")
      this.showResult =true;
      localStorage.setItem('awardItem', JSON.stringify(this.lottoResult));
      if (!this.resultSecondTimer) {
        this.resultSecondTimer = setInterval(() => {
          if (this.resultSecond < 0) {
            clearInterval(this.resultSecondTimer);
          }
          this.resultSecond--;
        }, 1000);
      }
      if (isAward.length > 0) {
        this.items[showIndex].splice(_showNumber, 1, isAward[0]);
        this.stopScroll();
      }
    },
    changeFun(index) {
      this.showIndex = index;
    },
    startLott() {
      this.openBox();
      this.$emit('setBalanceOrder', 'ONE');
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
      // this.carouselStyle = { transform: `translateX(-${_x}px` };
      this.moveCss = ''; //奖励滚动组件的滑动的动画效果css
      this.scaleCss = ''; //奖励弹出放大效果的css
      // this.$refs.light_bor.style.transition = '';
      // this.$refs.light_bor.style.opacity = 0;
      this.awardShow = false; //滑动结束后显示奖励放大效果
      this.awardRollOpen = false; //奖励滚动组件的显示开关
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
        console.log(this.itemList)
        if (_items.length > 3) {
          this.items = _items;
          return;
        }
      }
    },
    dataFun() {
      const { lottoList } = this;
      let _itemImg = [];
      lottoList.forEach((item, index) => {
        let img = new Image();
        img.src = item.seriesImg;
        _itemImg.push(item.seriesImg);
        let _obj = {
          itemid: index,
          pz: item.seriesImg,
          heroname: item.seriesName,
        };
        _obj = { ..._obj, ...item };
        this.itemList.push(_obj);
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
    if (this.interval >= 300) {
      this.interval = 300;
    }
    this.dataFun();
    if (localStorage.getItem('awardItem')) {
      this.lottoResult = JSON.parse(localStorage.getItem('awardItem'));
      this.awardItemPrice = this.lottoResult.data[0].price;
      console.log(this.lottoResult.data[0].price, 'this.lottoResult.data[0]==');
      this.awardFun(this.lottoResult.data[0].seriesName);
    }
  },
  beforeCreate() {},
  created() {},
  beforeUpdate() {},
  beforeUnmount() {},
};
</script>

<style scoped>
@import url('./index.css');
.result-modal {
  font-size: 30px;
  font-weight: bold;
}
.result-modal b {
  color: red;
}
.roll-container {
}
.btn-container {
  position: absolute;
  bottom: 0;
}
.el-carousel {
  width: 100%;
}
.el-carousel__indicators {
  display: none;
}
</style>
