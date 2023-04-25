<template>
  <div class="roll">
    <!--盒子 boom执行打开爆炸的效果-->
    <div class="box" :class="{ boom: boxOpen }"></div>

    <div class="con">
      <div class="roll_con" :style="moveCss">
        <div class="lottery-list" v-for="(item, index) in items" :key="index">
          <div>
            <div class="lottery-list-con">
              {{ item.heroname }}
            </div>
            <div class="lottery-list-bor" ref="light">
              <img class="lottery-list-img" :src="item.pz" />
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
        <div class="lottery-list-con">
          {{ awardItem.heroname }}
        </div>
        <div class="lottery-list-bor">
          <img class="lottery-list-img" :src="awardItem.pz" />
        </div>
      </div>
    </div>
    <!--滚动组件开始滑动并且奖励没有弹出时显示 跳过动画的按钮-->
    <div class="btns" v-show="awardRollOpen && !awardShow">
      <a class="stop_btn" @click="stopScroll()" href="javascript:;"></a>
    </div>
    <button-com @click="openBox()" text="开始" />
    <button-com @click="resetBox()" text="重置" />
  </div>
</template>

<script>
import buttonCom from './button.vue';
import bor0 from './img/bor0.png';
import bor5 from './img/bor5.png';
// import box1 from './img/box1.png'
// import box2 from './img/box2.png'
// import box3 from './img/box3.png'
// import box4 from './img/box4.png'
// import box5 from './img/box5.png'
// import box6 from './img/box6.png'
// import box7 from './img/box7.png'
// import box8 from './img/box8.png'
// import box9 from './img/box9.png'
// import box10 from './img/box10.png'
// import box11 from './img/box11.png'
// import box12 from './img/box12.png'
// import box13 from './img/box13.png'
// import box14 from './img/box14.png'
// import box15 from './img/box15.png'
export default {
  name: 'LotteryPage',
  components: { buttonCom },
  data() {
    return {
      awardId: 5001238, //当前中奖的道具编号
      rollTimer: null, //动画定时器句柄
      leftM: 50, //指针停止位置的偏移量  用来计算弹出框的初始位置

      awardShow: false, //滑动结束后显示奖励放大效果
      awardRollOpen: false, //奖励滚动组件的显示开关
      moveCss: '', //奖励滚动组件的滑动的动画效果css
      scaleCss: '', //奖励弹出放大效果的css
      itemWidth: 113, //每张卡牌的宽度

      luckyNums: 0, //中奖位置
      lnStart: 60, //中奖位置区间开始
      lnEnd: 65, //中奖位置区间结束
      items: [], //滚动的卡片列表
      awardItem: { itemid: 0, pz: 0, heroid: 0, heroname: '' }, //中奖道具
      itemList: [
        {
          itemid: 5001238,
          pz: bor0,
          heroname: '小赵',
          gl: 8,
        },
        {
          itemid: 5001537,
          pz: bor0,
          heroname: '小钱',
          gl: 8,
        },
        {
          itemid: 5001447,
          pz: bor0,
          heroname: '小孙',
          gl: 8,
        },
        {
          itemid: 5004400,
          pz: bor0,
          heroname: '小李',
          gl: 8,
        },
        {
          itemid: 5001167,
          pz: bor0,
          heroname: '小周',
          gl: 8,
        },
        {
          itemid: 5000451,
          pz: bor0,
          heroname: '小吴',
          gl: 8,
        },
        {
          itemid: 5004205,
          pz: bor0,
          heroname: '小郑',
          gl: 6,
        },
        {
          itemid: 5004183,
          pz: bor0,
          heroname: '小王',
          gl: 6,
        },
        {
          itemid: 5003722,
          pz: bor0,
          heroname: '小冯',
          gl: 6,
        },
        {
          itemid: 5003387,
          pz: bor0,
          heroname: '小陈',
          gl: 6,
        },
        {
          itemid: 5001876,
          pz: bor0,
          heroname: '小褚',
          gl: 6,
        },
        {
          itemid: 5004601,
          pz: bor0,
          heroname: '小卫',
          gl: 3,
        },
        {
          itemid: 5004602,
          pz: bor0,
          heroname: '小蒋',
          gl: 3,
        },
        {
          itemid: 5004603,
          pz: bor0,
          heroname: '小沈',
          gl: 3,
        },
        {
          itemid: 5004604,
          pz: bor0,
          heroname: '小韩',
          gl: 3,
        },
        {
          itemid: 5004598,
          pz: bor0,
          heroname: '小杨',
          gl: 2,
        },
        {
          itemid: 5004599,
          pz: bor0,
          heroname: '小朱',
          gl: 2,
        },
        {
          itemid: 5004600,
          pz: bor0,
          heroname: '小秦',
          gl: 2,
        },
        {
          itemid: 5004596,
          pz: bor5,
          heroname: '小尤',
          gl: 1,
        },
        {
          itemid: 5004597,
          pz: bor5,
          heroname: '小许',
          gl: 1,
        },
        {
          itemid: 5004605,
          pz: bor0,
          heroname: '小何',
          gl: 1,
        },
        {
          itemid: 5004606,
          pz: bor0,
          heroname: '老张',
          gl: 1,
        },
      ],
    };
  },
  methods: {
    InitPageModel() {
      //随机一个总数
      this.items = [];
      //中奖卡片的位置
      this.luckyNums = this.getRand(this.lnStart, this.lnEnd);
      let loopNum =
        this.lnEnd - this.luckyNums < 4 ? this.luckyNums + 4 : this.lnEnd;
      for (let i = 0; i < loopNum; i++) {
        let item = {};
        if (i + 1 == this.luckyNums) {
          item = this.itemList.filter((item) => item.itemid == this.awardId)[0]; //把奖励加到列表里
          this.awardItem = item; //拿到奖励的各个参数
        } else item = this.getItem();
        this.items.push(item);
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
      this.awardId = 5003387; //value;
      //初始化数据
      this.InitPageModel();
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
  mounted() {},
  beforeCreate() {},
  created() {
    this.InitPageModel();
  },
};
</script>

<style scoped>
@import url('./index.css');
</style>
