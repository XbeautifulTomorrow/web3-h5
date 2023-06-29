<template>
  <div class="wrapper_bg">
    <div class="FAQ_wrapper">
      <div class="FAQ_title">
        <span>{{ $t("faq.faqTitle1") }}&nbsp;</span>
        <span>{{ $t("faq.faqTitle2") }}&nbsp;</span>
        <span>{{ $t("faq.faqTitle3") }}</span>
      </div>
      <div class="FAQ_description">
        <p>{{ $t("faq.faqTips") }}</p>
      </div>
      <div class="FAQ_list">
        <div :class="['FAQ_item', item.isExpand && 'active']" v-for="(item, index) in FAQList"
          @click="getQueryRect(index)" :style="{ height: item.isExpand ? item.height : item.minHeight }" :key="index">
          <div class="FAQ_item_l">{{ index + 1 }}</div>
          <div class="FAQ_item_r">
            <div class="FAQ_content">
              <div class="FAQ_content_title">
                <div class="text" :id="`text-${index}`">
                  <span v-for="(sp, i) in formatText(item.title)" :key="i">{{ sp }}&nbsp;</span>
                </div>
                <div class="close">
                  <el-icon class="close_icon">
                    <Plus />
                  </el-icon>
                </div>
              </div>
              <div class="FAQ_content_description" :id="`FAQ-${index}`" v-html="item.description"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/locales';
const { t } = i18n.global;
import { handleWindowResize } from "@/utils"
import bigNumber from "bignumber.js";
export default {
  name: 'FAQ',
  components: {},
  data() {
    return {
      screenWidth: null,
      screenSize: null,
      FAQList: []
    }
  },
  methods: {
    getHeight(index) {
      let paddingV = new bigNumber(this.screenSize).multipliedBy(1.25);

      const textHeight = document.getElementById(`text-${index}`);
      if (this.screenWidth <= 950) {
        paddingV = 8;
      }

      const heightV = new bigNumber(textHeight && textHeight.clientHeight).plus(paddingV).plus(paddingV).div(this.screenSize);
      this.FAQList[index].minHeight = `${heightV}rem`;
    },
    getQueryRect(index) {
      let paddingV = new bigNumber(this.screenSize).multipliedBy(1.25);
      window.screenWidth = document.body.clientWidth;
      this.screenWidth = window.screenWidth;
      const textHeight = document.getElementById(`text-${index}`).clientHeight;
      if (this.screenWidth <= 950) {
        paddingV = 8;
      }

      const heightV = new bigNumber(textHeight).plus(paddingV).plus(paddingV);

      const height = document.getElementById(`FAQ-${index}`).clientHeight;
      let totalHeight = new bigNumber(heightV).plus(height).div(this.screenSize).toString();
      this.FAQList[index].height = `${totalHeight}rem`;
      this.FAQList[index].isExpand = !this.FAQList[index].isExpand;
    },
    formatText(event) {
      return event.split(" ");
    },
    getSize(event) {
      const widths = +event;
      if (widths <= 950) {
        this.screenSize = 16;
      } else if (widths > 950 && widths < 1366) {
        this.screenSize = 10;
      } else if (widths > 1366 && widths < 1440) {
        this.screenSize = 12;
      } else if (widths > 1440 && widths < 1520) {
        this.screenSize = 14;
      } else if (widths > 1520) {
        this.screenSize = 16;
      }
    }
  },
  created() {
    this.FAQList = [
      {
        title: t("faq.faqQuestion1"),
        description: t("faq.faqAnswer1"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion2"),
        description: t("faq.faqAnswer2"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion3"),
        description: t("faq.faqAnswer3"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion4"),
        description: t("faq.faqAnswer4"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion5"),
        description: t("faq.faqAnswer5"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion6"),
        description: t("faq.faqAnswer6"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion7"),
        description: t("faq.faqAnswer7"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion8"),
        description: t("faq.faqAnswer8"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion9"),
        description: t("faq.faqAnswer9"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion10"),
        description: t("faq.faqAnswer10"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion11"),
        description: t("faq.faqAnswer11"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion12"),
        description: t("faq.faqAnswer12"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion13"),
        description: t("faq.faqAnswer13"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion14"),
        description: t("faq.faqAnswer14"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion15"),
        description: t("faq.faqAnswer15"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion16"),
        description: t("faq.faqAnswer16"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion17"),
        description: t("faq.faqAnswer17"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion18"),
        description: t("faq.faqAnswer18"),
        isExpand: false,
        height: null,
        minHeight: null
      },
      {
        title: t("faq.faqQuestion19"),
        description: t("faq.faqAnswer19"),
        isExpand: false,
        height: null,
        minHeight: null
      },
    ]
  },
  mounted() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;
    this.getSize(that.screenWidth);

    // 加载完成后调整高度
    for (let i = 0; i < this.FAQList.length; i++) {
      this.getHeight(i)
    }

    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
      this.getSize(that.screenWidth);

      for (let i = 0; i < this.FAQList.length; i++) {
        this.getHeight(i)
      }
    })
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
