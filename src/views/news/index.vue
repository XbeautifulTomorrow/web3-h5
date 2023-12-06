<template>
  <div class="news_wrap">
    <div class="news_box">
      <p class="title">Bitzing News</p>
      <div class="news_content">
        <div class="news_item" v-for="item in dataList" :key="item.id" @click="goDetailPage(item.id)">
          <img :src="item.imgUrl" alt="" />
          <div class="news_text_box">
            <p class="news_title">
              {{ item.title }}
            </p>
            <p class="news_info">
              {{ item.content }}
            </p>
            <div class="news_time">
              <p>by Bitzing</p>
              <p>{{ timeFormat(item.webTime||item.createTime) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAnnouncementList } from "@/services/api/announce";
import { timeFormat } from "@/utils";
export default {
  name: "NewsPage",
  components: {},
  data() {
    return {
      dataList: [],
    };
  },
  created() {
    this.getAnnounceListFunc();
  },
  methods: {
    timeFormat: timeFormat,
    async getAnnounceListFunc() {
      const res = await getAnnouncementList({
        page: 1,
        size: 100,
      });
      if (res) {
        this.dataList = res?.data?.records;
      }
    },
    goDetailPage(id) {
      this.$router.push({ name: "NewsDeatails", params: { id } });
    },
  },
};
</script>
<style lang="scss" scoped>
.news_wrap {
  width: 100%;
  min-height: 62.5rem;
  background-image: url("@/assets/img/box/lottery_bg.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
  margin-bottom: 10rem;
  .news_box {
    width: 75rem;
    margin: 0 auto;
  }
  .title {
    background-image: linear-gradient(to bottom, rgba(234, 32, 141, 0.9) 15%, #e63a97 39%, #f1f1cb 70%);
    font-family: Tomorrow;
    font-size: 3.5rem;
    font-weight: bold;
    line-height: 1.3;
    text-align: center;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 3.75rem 0;
    word-break: break-all;
  }
  .news_content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.875rem;
    .news_item {
      position: relative;
      height: 31.375rem;
      background: rgb(29, 15, 54);
      border-radius: 0.5rem;
      cursor: pointer;
      img {
        width: 100%;
        height: 11.875rem;
        object-fit: cover;
        border-radius: 0.5rem 0.5rem 0 0;
      }
      .news_text_box {
        padding: 1.25rem;
        .news_title {
          font-family: Inter;
          font-size: 1.25rem;
          font-weight: bold;
          color: #fff;
          line-height: 1.5;
          margin-bottom: 1rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          text-align: left;
          word-break: break-all;
        }
        .news_info {
          font-family: Inter;
          font-size: 1rem;
          line-height: 1.88;
          letter-spacing: normal;
          text-align: left;
          color: #a9a4b4;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          margin-bottom: 2rem;
          text-align: left;
          word-break: break-all;
        }
        .news_time {
          position: absolute;
          left: 1.25rem;
          bottom: 1.25rem;
          font-family: Inter;
          font-size: 0.75rem;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.33;
          letter-spacing: normal;
          text-align: left;
          color: #68647d;
          p {
            margin-bottom: 0.25rem;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 950px) {
  .news_wrap {
    .news_box {
      width: auto;
      padding: 0 0.75rem;
    }
    .news_content {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
  }
}
@media screen and (max-width: 500px) {
  .news_wrap {
    background: url("@/assets/img/box/lottery_bg.png") no-repeat center top;
    background-size: 400%;
    padding-bottom: 2rem;
    margin-bottom: 0;
    .title {
      font-size: 1.25rem;
      margin: 1.875rem 0;
    }
    .news_content {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      img {
        height: 48vw;
      }
      .news_text_box {
        padding: 0.5rem !important;
      }
      .news_title {
        font-size: 1rem;
        margin-bottom: 0.5rem !important;
      }
      .news_info {
        font-size: 0.75rem;
        margin-bottom: 1rem !important;
      }
    }
  }
}
</style>
