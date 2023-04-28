<template>
  <el-dialog
    v-model="newValue"
    title="Tips"
    width="100%"
    top="0"
    class="lottery-moreLuck"
    :close-on-click-modal="false"
  >
    <div class="lottery-moreLuck-content" :style="style">
      <awards-list
        v-for="(item, index) in number"
        :key="`moreLuck-${item}`"
        :height="height"
        :prizePoolList="prizePoolList"
        :autoplay="autoplay[index]"
        :interval="interval"
        :winData="winData[index]"
      />
    </div>
  </el-dialog>
</template>
<script>
import AwardsList from './awardList.vue';
export default {
  name: 'MoreAwards',
  components: { AwardsList },
  props: {
    number: {
      type: Number,
      default: 5,
    },
    showMoreDialog: {
      type: Boolean,
      default: false,
    },
    prizeList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    moreLength: {
      type: Number,
      default: 1,
    },
    moreLuck: {
      type: Array,
      default: () => {
        return [];
      },
    },
    interval: {
      type: Number,
      default: 300,
    },
    apiIsError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      autoplay: [],
      height: Math.floor((window.innerHeight - 20) / 5),
      prizePoolList: this.prizeList,
      winData: [],
      timer: null,
      numberTest: 0,
      style: {
        width: `calc(13vh * ${this.number / 5} + 20px)`,
      },
    };
  },
  computed: {
    newValue: {
      get: function () {
        return this.showMoreDialog;
      },
      set: function (value) {
        this.$emit('update:showMoreDialog', value);
      },
    },
  },
  beforeMount() {
    this.autoplayFun(true);
  },
  methods: {
    getRand(start, end) {
      return Math.floor(Math.random() * (end - start + 1) + start);
    },
    clearTimerFun() {
      clearInterval(this.timer);
      this.timer = null;
    },
    stopScroll(data) {
      this.timer = setInterval(() => {
        this.winData.push(data[this.numberTest]);
        this.autoplay[this.numberTest] = false;
        this.numberTest += 1;
        if (this.winData.length >= this.number) {
          this.autoplayFun();
          this.clearTimerFun();
          this.numberTest = 0;
        }
      }, 1000);
    },
    startLott(e) {
      if (e) return; // 阻止原生事件
      this.autoplayFun(true);
    },
    autoplayFun(data = false) {
      const { number } = this;
      for (let i = 0; i < number; i++) {
        this.autoplay[i] = data;
      }
    },
  },
  beforeUnmount() {
    this.clearTimerFun();
  },
  watch: {
    moreLuck: {
      deep: true,
      handler: function (newData) {
        if (newData.length > 0) {
          this.stopScroll(newData);
        }
      },
    },
    apiIsError: function (newData) {
      if (newData) {
        this.autoplayFun();
        this.clearTimerFun();
        this.$emit('closeFun');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.lottery-moreLuck-content {
  --luckBorHeight: 13vh;
  position: absolute;
  top: 0;
  right: 0;
  height: calc(100vh - 20px);
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px 20px;
}
</style>
<style lang="scss">
.lottery-moreLuck {
  .el-carousel__container {
    height: 100%;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
