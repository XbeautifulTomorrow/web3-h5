<template>
  <div class="blind-detail">
    <div class="blind-lottory-box" v-if="blindDetailInfo && blindDetailInfo.series && blindDetailInfo.series.length > 0">
      <Lottory
        v-if="showRoll"
        ref="roll"
        :rollNumber="rollNumber"
        :showRoll="showRoll"
        :lottoList="blindDetailInfo.series"
        :blindDetailInfo="blindDetailInfo"
        :lottResult="lottResult"
        :apiIsError="apiIsError"
        :errorText="errorText"
        @apiIsErrorFun="apiIsErrorFun"
        @closeRollFun="closeRollFun"
      />
    </div>
    <boxDetails :blindDetailInfo="blindDetailInfo" @rollNumberFun="rollNumberFun"></boxDetails>
    <Loading :loading="loading" />
    <div class="preloadingimg"></div>
    <!-- 预加载图片 -->
    <div :style="{ display: 'none' }">
      <img v-for="(item, index) in preloadingImg" :src="item" :key="`img-${index}`" />
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { mapStores } from "pinia";

import { blindBoxDetail } from "@/services/api/blindBox";
import { getBoxReward, getBoxOpen } from "@/services/api";
import Lottory from "./components/lottery/index";
import Loading from "@/components/loading/index";
import boxDetails from "./details.vue";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { useWalletStore } from "@/store/wallet.js";

import { Howl } from "howler";
import * as audioResource from "@/utils/audioResource";

dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: "BlindDetail",
  components: {
    Lottory,
    boxDetails,
    Loading,
  },
  data() {
    return {
      loading: false,
      preloadingImg: [],
      rollNumber: "",
      showRoll: false,
      boxList: [],
      ticketList: [],
      NFTList: [],
      generateKey: "",
      boxId: null,
      walletOrderDetail: "",
      usdtAddress: "0x6712957c6b71d6dc7432ca7ebb16a4dbca76e535",
      lottContractAddress: "0x7729c592e087d88afea4b55c367c8570e0025ee0", //抽奖合约，
      transferAddress: "0x927e481e98e01bef13d1486be2fcc23a00761524",
      blindDetailInfo: {},
      lottStatus: true,
      lottResult: [],
      apiIsError: false,
      resultTimer: null,
      errorText: undefined,

      showTips: true,
    };
  },
  computed: {
    ...mapStores(useHeaderStore, useUserStore, useWalletStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
    setting() {
      const headerStore = useHeaderStore();
      return headerStore.setting;
    },
  },
  mounted() {
    this.boxId = this.$route.query.boxId;
    this.getBoxRewardFunc();
    this.audioPreloadFunc();
  },
  watch: {
    showRoll(val) {
      if (val) {
        window.scrollTo(0, 0);
      }
    },
    setting(){
      if(!this.showRoll){
        window.location.href = this.setting?.jumpAddress||"/home";
      }
    }
  },
  methods: {
    audioPreloadFunc() {
      const audioSrc = audioResource;
      Object.values(audioSrc).forEach((x) => new Howl({ src: x }));
    },
    async rollNumberFun() {
      if(this.blindDetailInfo&&this.blindDetailInfo?.series?.length>0){
        const res = await getBoxOpen();
        this.loading = false;
        if (res && res.code == 200) {
          this.showRoll = true;
          this.rollNumber = "ONE";
          setTimeout(() => {
            let result = {};
            let filterData = this.blindDetailInfo.series.filter((x) => x.seriesName === res.data.name);
            if (filterData?.length > 0) {
              result = { ...res.data, ...filterData[0] };
              result.nftImg = filterData[0].seriesImg;
              result.price = filterData[0].boxNftInfos[0].price;
              result.initPrice = filterData[0].boxNftInfos[0].price;
              this.lottResult = [];
              this.lottResult.push(result);
              localStorage.setItem("boxBounsKey", res.data?.boxBounsKey);
              sessionStorage.setItem("result", JSON.stringify(this.lottResult));
            } else {
              result = { ...res.data, ...this.blindDetailInfo.series[0] };
              result.seriesName = res.data.name;
              result.nftImg = this.blindDetailInfo.series[0].seriesImg;
              result.price = this.blindDetailInfo.series[0].boxNftInfos[0].minPrice;
              result.initPrice = this.blindDetailInfo.series[0].boxNftInfos[0].minPrice;
              this.lottResult = [];
              this.lottResult.push(result);
              localStorage.setItem("boxBounsKey", res.data?.boxBounsKey);
              sessionStorage.setItem("result", JSON.stringify(this.lottResult));
            }
          }, 5000);
        }
      }
      
    },
    closeRollFun() {
      this.showRoll = false;
      this.rollNumber = "";
    },
    async getBoxRewardFunc() {
      const res = await getBoxReward();
      this.loading = false;
      if (res && res.code == 200) {
        const blindBox = res.data;
        if (blindBox?.length > 0) {
          this.boxId = blindBox[0].id;
          this.getBlindBoxDetail();
        }
      }
    },

    async getBlindBoxDetail() {
      const res = await blindBoxDetail({ boxId: this.boxId });
      this.loading = false;
      if (res && res.code == 200) {
        this.blindDetailInfo = res.data;
        res?.data?.series.forEach((item) => {
          const { boxNftInfos } = item;
          this.preloadingImg.push(item.seriesImg);
          boxNftInfos.forEach((item1) => {
            this.preloadingImg.push(item1.nftImg);
          });
        });
      }
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      useHeaderStore().fetchSetting();
    }
  },
};
</script>
<style lang="scss" scoped>
.public-dialog-title {
  padding-top: 1.875rem;
  font-size: 2.75rem;
  text-align: left;
}

.tips-box {
  padding: 1rem 0 3.75rem;
}

.tips-text {
  font-family: Inter;
  font-size: 1.125rem;
  line-height: 1.6;
  text-align: left;
  color: #a9a4b4;
}
@media (max-width: 950px) {
  .public-dialog-title {
    font-size: 1.125rem !important;
  }
  .tips-text {
    font-size: 0.75rem !important;
  }
  .preloadingimg {
    background: url("@/assets/img/h5/lottery/05.gif") no-repeat;
  }
}
</style>
<style lang="scss">
.blind-detail {
  min-height: 800px;
}

.one-btn {
  color: #fff;
}

body {
  background-size: 100% auto;
}

.home-public-title {
  text-align: left;
  margin: 48px auto 24px;
}

.boxes-content {
  display: flex;
}

.boxes-list {
  width: 220px;
  margin-right: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  background-image: linear-gradient(228deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0) 62%);

  &:last-child {
    margin-right: 0;
  }
}

.boxes-title {
  width: 200px;
  height: max-content;
  margin: 0 auto;
  font-size: 24px;
  background-image: linear-gradient(to bottom, #768098, #eceacf 61%, #edbed2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.boxes-button {
  $width: 200px;
  $height: 40px;
  $border: 3px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
  width: $width;
  height: $height;
  font-size: 24px;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 12px;
  padding: 2px;
  border-image-source: linear-gradient(to bottom, #5fe3ef 12%, #00689d 53%, #b063f5 70%);
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #1b082b, #1b082b), linear-gradient(to bottom, #5fe3ef 12%, #00689d 53%, #b063f5 70%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: pointer;
}

.boxes-button-text {
  background-image: linear-gradient(to bottom, #5fe3ef 12%, #00689d 53%, #b063f5 70%);
  font-size: 18px;
  font-weight: bold;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
