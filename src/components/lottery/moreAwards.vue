<template>
  <div class="more-awards">
    <div class="more-awards-content">
      <awards-list
        v-for="(item, index) in prizePoolList"
        :key="`award-${index}`"
        :height="height"
        :prizePoolList="item"
        :autoplay="autoplay[index]"
        :interval="1000"
        :winData="winData[index]"
      />
    </div>
    <div class="btn-container">
      <button-com @click="stopScroll" text="结束" />
      <button-com @click="resetBox" text="重置" />
      <button-com @click="startLott" text="余额抽盲盒(单抽)" />
    </div>
  </div>
</template>
<script>
import ButtonCom from './button.vue';
import AwardsList from './awardList.vue';
export default {
  name: 'MoreAwards',
  components: { ButtonCom, AwardsList },
  props: {
    number: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      interval: 300,
      autoplay: [],
      height: Math.floor(document.body.clientHeight / this.number),
      prizePoolList: [],
      winData: [],
      timer: null,
      numberTest: 0,
    };
  },
  methods: {
    getRand(start, end) {
      return Math.floor(Math.random() * (end - start + 1) + start);
    },
    testFun() {
      const data = this.prizePoolList[0][this.getRand(0, 5)];
      return data;
    },
    stopScroll(e) {
      if (e) return; // 阻止原生事件
      this.timer = setInterval(() => {
        const data = this.testFun();
        this.winData.push(data);
        this.autoplay[this.numberTest] = false;
        this.numberTest += 1;
        if (this.winData.length >= this.props) {
          clearInterval(this.timer);
          this.autoplayFun();
          this.timer = null;
          this.numberTest = 0;
        }
      }, 1000);
    },
    resetBox(e) {
      if (e) return; // 阻止原生事件
      this.autoplayFun();
    },
    startLott(e) {
      if (e) return; // 阻止原生事件
      this.autoplayFun(true);
    },
    changeFun(index) {
      console.log(index);
    },
    bannerListFun() {
      const { number } = this;
      let _prizePoolList = [];
      for (let i = 0; i < number; i++) {
        let item = [0, 1, 2, 3, 4, 5];
        _prizePoolList[i] = item;
      }
      this.prizePoolList = _prizePoolList;
    },
    autoplayFun(data = false) {
      const { number } = this;
      for (let i = 0; i < number; i++) {
        this.autoplay[i] = data;
      }
    },
  },
  beforeMount() {
    console.log(`${this.height}`);
    this.bannerListFun();
    this.autoplayFun();
  },
};
</script>
<style lang="scss" scoped>
.more-awards {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
}
.more-awards-content {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
  background-color: #fff;
}
.test {
  background-color: #f00;
}
</style>
<style lang="scss">
.more-awards {
  .el-carousel__container {
    height: 100%;
  }
}
</style>
