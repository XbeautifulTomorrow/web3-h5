<template>
  <div class="news_wrap">
    <div class="news_box">
      <div class="back_btn" @click="goback"><img src="@/assets/svg/icon_left.svg" alt="" /> <span>Bitzing News</span></div>
      <p class="title">{{ dataInfo.title }}</p>
      <div class="news_time">
        <p>by Bitzing</p>
        <p class="timer">{{ timeFormat(dataInfo.createTime) }}</p>
      </div>
      <div class="news_content" v-html="dataInfo.contentHtml"></div>
    </div>
  </div>
</template>

<script>
import { getAnnouncementDetails } from "@/services/api/announce";
import { timeFormat } from "@/utils";
export default {
  name: "NewsPage",
  components: {},
  data() {
    return {
      dataInfo: {},
      id: null,
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getAnnounceFunc();
  },
  methods: {
    timeFormat: timeFormat,
    async getAnnounceFunc() {
      const res = await getAnnouncementDetails({
        annId: this.id,
      });
      if (res) {
        this.dataInfo = res?.data;
      }
    },
    goback() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.news_wrap {
  width: 100%;
  min-height: 40rem;
  background-image: url("@/assets/img/box/lottery_bg.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
  margin-bottom: 10rem;
  .news_box {
    width: 75rem;
    margin: 0 auto;
  }
  .back_btn {
    display: flex;
    align-items: center;
    text-align: left;
    margin-top: 3.75rem;
    font-family: Tomorrow;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.3;
    letter-spacing: normal;
    text-align: left;
    color: #e4e7f5;
    cursor: pointer;
    img {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.625rem;
      margin-top: 0.125rem;
    }
  }
  .title {
    font-family: Inter;
    font-size: 2rem;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: normal;
    color: #fff;
    margin-top: 1.875rem;
    margin-bottom: 1rem;
    text-align: left;
    word-break: break-all;
  }
  .news_time {
    font-family: Inter;
    font-size: 0.875rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #68647d;
    margin-bottom: 1.5rem;
    p {
      margin-bottom: 0.25rem;
    }
    .timer {
      color: #77758b;
      font-weight: bold;
    }
  }
  :deep(.news_content) {
    text-align: initial;
    word-break: break-all;
    img {
      width: 100%;
    }
  }
}
@media screen and (max-width: 950px) {
  .news_wrap {
    .news_box {
      width: auto;
      padding: 0 0.75rem;
    }
  }
}
@media screen and (max-width: 500px) {
  .news_wrap {
    background: url("@/assets/img/box/lottery_bg.png") no-repeat center top;
    background-size: 400%;
    padding-bottom: 2rem;
    margin-bottom: 0;
    .back_btn {
      font-size: 0.875rem;
    }
    .title {
      font-size: 1rem;
      margin: 1rem 0;
    }
  }
  :deep(.news_content) {
    P {
      font-size: 0.875rem;
    }
  }
}
</style>
