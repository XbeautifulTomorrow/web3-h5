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
        <div class="roll_con" :style="moveCss">
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
                <span class="public-color-two lottery-list-minPrice">{{
                  item.minPrice
                }}</span>
                <span class="public-color-two lottery-list-conin">{{
                  item.coin
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="list_mask"></div>
      </div>
      <!--中奖皮肤的放大提示框-->
      <div
        class="awardAlert"
        :style="`margin-left:${-53 + leftM}px;${scaleCss}`"
        v-show="awardShow"
      >
        <div class="show_con">
          <div class="light_bor" ref="light_bor"></div>
          <!-- <div class="lottery-list-con">
            {{ awardItem.heroname }}
          </div> -->
          <div class="lottery-list-bor">
            <img class="lottery-list-img" :src="awardItem.pz" />
          </div>
        </div>
      </div>
      <!--滚动组件开始滑动并且奖励没有弹出时显示 跳过动画的按钮-->
      <!-- <div class="btns" v-show="awardRollOpen && !awardShow">
      <a class="stop_btn" @click="stopScroll()" href="javascript:;"></a>
    </div> -->
      <div class="btn-container">
        <button-com @click="openBox()" text="开始" />
        <button-com @click="resetBox()" text="重置" />
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
    };
  },
  methods: {
    InitPageModel() {
      //随机一个总数
      this.items = [];
      let items = [];
      //中奖卡片的位置
      this.luckyNums = this.getRand(this.lnStart, this.lnEnd);
      let loopNum =
        this.lnEnd - this.luckyNums < 4 ? this.luckyNums + 4 : this.lnEnd;
      for (let i = 0; i < loopNum; i++) {
        let item = {};
        if (i + 1 == this.luckyNums) {
          item = this.itemList.filter((item) => item.itemid == this.awardId)[0]; //把奖励加到列表里
          this.awardItem = item; //拿到奖励的各个参数
        } else {
          if (i > 0) {
            this.notRepeat(items, i);
            item = this.currentItem;
          } else {
            item = this.getItem();
          }
        }
        items.push(item);
      }
      this.items = items;
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
    startScroll() {
      let m = this.getRand(0, 100) - 50;
      this.leftM = m;
      this.moveCss = `left:${
        (this.luckyNums - 5) * -this.itemWidth + m
      }px;transition:all 8s cubic-bezier(.1,.59,.1,.9)`;
      //6s 动画结束后 开始弹出奖励图片，6500ms后执行
      this.rollTimer = setTimeout(() => {
        this.awardShow = true;
        //display和动画会有前后执行的冲突，所以加上10ms延时处理
        setTimeout(() => {
          this.scaleCss = `transform:scale(2,2);transition: all 0.5s;margin-left:-53px;`;
          //奖励背景闪光出现效果
          this.$refs.light_bor.style.transition = 'all .5s';
          this.$refs.light_bor.style.opacity = 1;
        }, 50);
      }, 8500);
    },
    stopScroll() {
      this.moveCss = `left:${
        (this.luckyNums - 5) * -this.itemWidth + this.leftM
      }px;`;
      clearTimeout(this.rollTimer);
      this.awardShow = true;
      setTimeout(() => {
        this.scaleCss = `transform:scale(2,2);transition: all 0.5s;margin-left:-53px;`;
        this.$refs.light_bor.style.transition = 'all .5s';
        this.$refs.light_bor.style.opacity = 1;
      }, 50);
    },
    resetBox() {
      this.moveCss = ''; //奖励滚动组件的滑动的动画效果css
      this.scaleCss = ''; //奖励弹出放大效果的css
      this.$refs.light_bor.style.transition = '';
      this.$refs.light_bor.style.opacity = 0;

      this.awardShow = false; //滑动结束后显示奖励放大效果
      this.awardRollOpen = false; //奖励滚动组件的显示开关

      //this.InitPageModel();
    },
    openBox() {
      //此处调用接口抽取奖励，获得奖励的皮肤itemid
      //执行一些页面上的交互动画
      // .... do ...
      //模拟500ms后得到结果
      // const p = new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve(5003387); //成功，给出itemid
      //   }, 500);
      // });
      // p.then((value) => {
      //console.log(value);
      // this.awardId = value; //value;
      //初始化数据
      // this.InitPageModel();
      //150ms后显示奖励皮肤滚动组件
      setTimeout(() => {
        //打开滚动组件，同时显示跳过动画的按钮
        this.awardRollOpen = true;
        //500ms 之后开始奖励列表滑动
        this.rollTimer = setTimeout(() => this.startScroll(), 100);
      }, 150);
      //});
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
