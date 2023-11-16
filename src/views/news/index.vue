<template>
  <div class="news_wrap">
    <div class="news_box">
      <p class="title">Bitzing News</p>
      <div class="news_content">
        <div class="news_item">
          <img src="@/assets/img/lottery/default_nft.webp" alt="" />
          <div class="news_text_box">
            <p class="news_title">
              文章标题，最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最
            </p>
            <p class="news_info">
              文章标题，最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多文章标题，最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多四行最多
            </p>
            <div class="news_time">
              <p>by Bitzing</p>
              <p>123 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewsPage",
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.news_wrap {
  width: 100%;
  min-height: 62.5rem;
  background-image: url("@/assets/img/box/lottery_bg.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
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
  }
  .news_content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.875rem;
    .news_item {
      width: 380px;
      background: rgb(29, 15, 54);
      border-radius: 8px;
      img {
        width: 100%;
        height: 11.875rem;
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
        }
        .news_time {
          font-family: Inter;
          font-size: 0.75rem;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.33;
          letter-spacing: normal;
          text-align: left;
          color: #68647d;
        }
      }
    }
  }
}
</style>
