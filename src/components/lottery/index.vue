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
        <div
          :class="['roll_con', { isAnimation: isAnimation }]"
          :style="moveCss"
        >
          <div
            v-for="(item, index) in items"
            class="lottery-list"
            :style="{ width: `${itemWidth}px` }"
            :key="index"
          >
            <div v-if="item">
              <div class="lottery-list-bor" ref="light" :style="borStyle">
                <img class="lottery-list-img" :src="item.pz" />
              </div>
              <div class="lottery-list-nftNumber">
                #&nbsp;{{ item.nftNumber }}
              </div>
              <p class="public-color-three lottery-list-seriesName">
                {{ item.seriesName }}
              </p>
              <div class="lottery-list-text">
                <img class="lottery-list-logo" :src="item.seriesImg" />
                <span class="public-color-two lottery-list-minPrice">
                  {{ item.minPrice }}
                </span>
                <span class="public-color-two lottery-list-conin">
                  {{ item.coin }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="list_mask"></div>
      </div>
      <!--中奖皮肤的放大提示框-->
      <div class="awardAlert" v-show="awardShow">
        <div class="lottery-show_con">
          <div class="light_bor" ref="light_bor"></div>
          <!-- <div class="lottery-list-con">
            {{ awardItem.heroname }}
          </div> -->
          <div class="lottery-award-bor">
            <img class="lottery-list-img" :src="awardItem.pz" />
          </div>
        </div>
      </div>
      <!--滚动组件开始滑动并且奖励没有弹出时显示 跳过动画的按钮-->
      <!-- <div class="btns" v-show="awardRollOpen && !awardShow">
      <a class="stop_btn" @click="stopScroll()" href="javascript:;"></a>
    </div> -->
      <div class="btn-container">
        <button-com @click="openBox" text="开始" />
        <button-com @click="stopScroll" text="结束" />
        <button-com @click="resetBox" text="重置" />
      </div>
    </div>
  </div>
</template>

<script>
import buttonCom from './button.vue';
// import box1 from './img/box1.png'
const itemWidth = 220;
export default {
  name: 'LotteryPage',
  components: { buttonCom },
  props: ['lottoList', 'test'],
  data() {
    return {
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
      awardItem: { itemid: 0, pz: 0, heroid: 0, heroname: '' }, //中奖道具
      itemList: [],
      currentItem: undefined,
      borStyle: {
        width: `${itemWidth}px`,
        height: `${itemWidth}px`,
      },
      showNumber: 0,
      isAnimation: false,
      timer: null,
      timerTran: null,
      translateX: 0,
    };
  },
  methods: {
    InitPageModel() {
      const { clientWidth } = document.body;
      const number = Math.ceil(clientWidth / itemWidth) * 4;
      this.showNumber = Math.ceil(clientWidth / itemWidth);
      const firster = [
        this.itemList[this.getRand(0, this.itemList.length - 1)],
      ];
      const _items = this.forFun(number, firster);
      this.items = _items;
    },
    forFun(number, items = this.items) {
      let _items = items;
      for (let i = 0; i < number; i++) {
        let item = {};
        if (i > 0) {
          this.notRepeat(items, i);
          item = this.currentItem;
        } else {
          item = this.getItem();
        }
        _items.push(item);
      }
      return _items;
    },
    animationFun() {
      const { items, showNumber } = this;
      let _items = JSON.parse(JSON.stringify(items));
      const _deleteNumber = Math.ceil(showNumber);
      // _items.splice(0, _deleteNumber);
      const _addItems = this.forFun(_deleteNumber, _items);
      _items = _addItems;
      this.items = _items;
    },
    notRepeat(items, i) {
      this.currentItem = this.getItem();
      if (!this.currentItem) {
        this.notRepeat(items, i);
      } else {
        if (items[i - 1].itemid === this.currentItem.itemid) {
          this.notRepeat(items, i);
        }
      }
    },
    getRand(start, end) {
      return Math.floor(Math.random() * (end - start + 1) + start);
    },
    //按概率随机获取一个皮肤
    getItem() {
      let r = this.getRand(1, 100);
      let g = 0;
      let item;
      for (let i = 0; i < this.itemList.length; i++) {
        g = g + this.itemList[i].gl;
        if (g >= r) {
          item = this.itemList[i];
          break;
        }
      }
      return item;
    },
    stopScroll(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      } else {
        return;
      }
      const _awardItem = this.itemList[0];
      this.moveCss = ` transform: translateX(${-this.translateX}px);`;
      const { clientWidth } = document.body;
      const Index =
        Math.floor(this.translateX / itemWidth) +
        Math.floor(clientWidth / itemWidth / 2) -
        1;
      this.items.splice(Index, 0, _awardItem);
      this.awardItem = _awardItem;
      this.awardShow = true;
      this.clearTimerFun();
    },
    resetBox() {
      this.moveCss = ''; //奖励滚动组件的滑动的动画效果css
      this.scaleCss = ''; //奖励弹出放大效果的css
      this.$refs.light_bor.style.transition = '';
      this.$refs.light_bor.style.opacity = 0;
      this.awardShow = false; //滑动结束后显示奖励放大效果
      this.awardRollOpen = false; //奖励滚动组件的显示开关
      this.clearTimerFun();
      this.InitPageModel();
    },
    openBox(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      } else {
        return;
      }
      this.clearTimerFun();
      this.isAnimation = true;
      this.moveCss = ` transform: translateX(${
        -itemWidth * this.showNumber
      }px);`;
      this.translateX = itemWidth * this.showNumber;
      this.timer = setInterval(() => {
        this.animationFun();
        this.translateX += itemWidth * this.showNumber;
        // this.translateX += document.body.clientWidth;
        this.moveCss = ` transform: translateX(${-this.translateX}px);`;
      }, 300);
    },
    clearTimerFun() {
      this.isAnimation = false;
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timerTran);
      this.timerTran = null;
    },
    // setImg(heroid, itemid) {
    //   if (heroid == 0) return `https://static.7fgame.com/itemimg/${itemid}.png`;
    //   else
    //     return `https://static.7fgame.com/itemimg/temp/pf_${heroid}_${itemid}.png`;
    // },
  },
  mounted() {
    let newArr = [];
    let gl = parseInt(100 / this.lottoList.length);
    let glCount = 0;
    let last = 0;
    this.lottoList.forEach((item, index) => {
      let _obj = {
        itemid: index,
        pz: item.seriesImg,
        heroname: item.seriesName,
        gl: gl,
      };
      _obj = { ..._obj, ...item };
      newArr.push(_obj);
      glCount = glCount + gl;
    });
    last = 100 - glCount;
    newArr[newArr.length - 1].gl = last;
    this.itemList = JSON.parse(JSON.stringify(newArr)); //将传过来的值赋值给抽奖
    this.InitPageModel();
  },
  beforeCreate() {},
  created() {},
  beforeUpdate() {},
  beforeUnmount() {
    this.clearTimerFun();
  },
};
</script>

<style scoped>
@import url('./index.css');
.roll-container {
}
.btn-container {
  position: absolute;
  bottom: 0;
}
</style>
