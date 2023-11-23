<template>
  <div class="footer">
    <div class="footer-container">
      <div class="footer-logo">
        <div class="header-logo">
          <img src="@/assets/img/headerFooter/logo.png" alt="logo" />
        </div>
        <span>{{ $t("footer.copyright", { year: year }) }}</span>

        <div class="friendship-logo">
          <img src="@/assets/svg/featured_certik_logo.svg" alt="logo" />
        </div>
        <div class="in_progress">{{ $t("footer.inProgress") }}</div>
      </div>
      <div class="footer-nav-box">
        <img
          src="@/assets/svg/home/footer_interval.svg"
          class="footer_interval"
          alt=""
        />
        <div class="footer-nav-items">
          <div>
            <li class="footer-nav-text active">
              {{ $t("footer.menu") }}
            </li>
            <ul class="footer-nav">
              <li
                class="footer-nav-text"
                v-for="(item, index) in nav"
                :key="`footer-nav-${index}`"
                @click="goTo(item.page)"
              >
                {{ item.text }}
              </li>
            </ul>
          </div>
        </div>
        <img
          src="@/assets/svg/home/footer_interval.svg"
          class="footer_interval"
          alt=""
        />
        <div class="footer-nav-items">
          <div>
            <li class="footer-nav-text active">
              {{ $t("footer.about") }}
            </li>
            <ul class="footer-nav">
              <li
                class="footer-nav-text"
                v-for="(item, index) in aboutUs"
                :key="`footer-nav-${index}`"
                @click="goTo(item.page)"
              >
                {{ item.text }}
              </li>
            </ul>
          </div>
        </div>
        <img
          src="@/assets/svg/home/footer_interval.svg"
          class="footer_interval"
          alt=""
        />
      </div>
      <div class="link_box">
        <div>
          <p class="footer-social">{{ $t("footer.link") }}</p>
          <ul class="footer-link">
            <li class="footer-link-icon">
              <img
                src="@/assets/svg/footer_media_twitter.svg"
                @click="goLink(1)"
                alt=""
              />
            </li>
            <li class="footer-link-icon">
              <img
                src="@/assets/svg/footer_media_telegram.svg"
                @click="goLink(2)"
                alt=""
              />
            </li>
            <li class="footer-link-icon">
              <img
                src="@/assets/svg/footer_media_discord_btn.svg"
                @click="goLink(3)"
                alt=""
              />
            </li>
          </ul>
          <ul class="footer-link">
            <li class="footer-link-icon">
              <img
                src="@/assets/svg/footer_media_instagram.svg"
                @click="goLink(4)"
                alt=""
              />
            </li>
            <li class="footer-link-icon">
              <img
                src="@/assets/svg/footer_media_reddit.svg"
                @click="goLink(5)"
                alt=""
              />
            </li>
            <li class="footer-link-icon">
              <img
                src="@/assets/svg/footer_media_medium.svg"
                @click="goLink(6)"
                alt=""
              />
            </li>
          </ul>
        </div>
        <div class="footer-contact">
          <p class="footer-social footer-contact-label">
            {{ $t("footer.contactUs") }}
          </p>
          <p class="footer-contact-txt">
            <a href="mailto:support@Bitzing.io">support@Bitzing.io</a>
          </p>
        </div>
        <!-- <el-select class="language_select" v-model="language" @change="languageChange" size="large" effect="dark">
          <el-option v-for="(item, index) in langDrop" :key="index" :label="item.name" :value="item.key" />
        </el-select> -->
      </div>
    </div>
    <div class="footer-featured">
      <img
        src="@/assets/svg/home/footer_interval2.svg"
        class="footer_interval_module"
        alt=""
      />
      <div class="fetaure-tip">We Are Featured In</div>
      <div class="footer-featured-img">
        <div class="friendship-logo">
          <img src="@/assets/svg/featured_yahoo_logo.svg" alt="logo" />
        </div>
        <div class="friendship-logo">
          <img src="@/assets/svg/featured_coinMarkect_logo.svg" alt="logo" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "footerCom",
};
</script>
<script setup>
import { openUrl } from "@/utils";
import { getLang, setLang } from "@/locales";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { ref, reactive, computed, inject } from "vue";
import { ElMessage } from "element-plus";
const { t, locale } = useI18n();

const reload = inject("reload");
const language = ref(getLang());

const nav = computed(() => {
  return [
    {
      text: t("header.home"),
      page: "Home",
    },
    {
      text: t("header.airdrop"),
      page: "Airdrop",
    },
    {
      text: t("header.mysteryBox"),
      page: "RaffleBoxesList",
    },
    {
      text: t("header.competitions"),
      page: "TreasureDraw",
    },
    {
      text: t("header.tokenWar"),
      page: "TokenWar",
      page: "TokenWar",
    },
  ];
});

const aboutUs = computed(() => {
  return [
    {
      text: t("header.news"),
      page: "News",
    },
    {
      text: t("header.whitebook"),
      page: "Whitebook",
    },
    {
      text: t("login.privacyPolicy"),
      page: "Privacy-policy",
    },
    {
      text: t("login.userAgreement"),
      page: "Terms-and-conditions",
    },
    {
      text: t("header.faq"),
      page: "FAQ",
    },
  ];
});

const year = ref(new Date().getUTCFullYear());

// eslint-disable-next-line no-unused-vars
const langDrop = reactive([
  { name: "English", key: "en_US" },
  { name: "繁體中文", key: "zh_CN" },
]);

// eslint-disable-next-line no-unused-vars
const languageChange = (event) => {
  setLang(event);
  locale.value = event;
  language.value = event;

  //重新加载页面
  reload();
};

const goTo = (page = "home") => {
  if (page === "Whitebook") {
    openUrl("https://bitzing.gitbook.io/litepaper/");
    return;
  }

  if (page == "Stake" || page == "INO" || page == "MarketPlace") {
    ElMessage({
      message: t("common.tipsText"),
      type: "warning",
    });
    return;
  }
  router.push({ path: `/${page}` });
};
const goLink = (event) => {
  if (event === 1) {
    openUrl("https://twitter.com/Bitzing_io");
    return;
  } else if (event === 2) {
    openUrl("https://t.me/bitzing_io");
    return;
  } else if (event === 3) {
    openUrl("https://discord.gg/bitzing");
    return;
  } else if (event === 4) {
    openUrl(
      "https://www.instagram.com/bitzing.io/?igshid=MzRlODBiNWFlZA%3D%3D"
    );
    return;
  } else if (event === 5) {
    openUrl("https://www.reddit.com/r/Bitzing/");
    return;
  } else if (event === 6) {
    openUrl("https://medium.com/@bitzing_io");
    return;
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
<style lang="scss">
.el-select__popper {
  &.is-dark {
    background-color: #1d0f36;
    border: none;
  }

  .el-select-dropdown__list {
    margin: 0.5rem 0 !important;
  }

  .el-select-dropdown__item {
    height: 3.3125rem;
    line-height: 3.3125rem;
    font-size: 1.125rem;
    font-weight: 500;

    &.selected,
    &.hover {
      color: white;
      background-color: #281d31;
    }
  }

  .el-popper__arrow {
    display: none;
  }

  .el-select-dropdown__empty {
    font-size: 1rem;
    color: #a9a4b4;
  }
}

@media screen and (max-width: 950px) {
  .el-select__popper {
    .el-select-dropdown__item {
      height: 1.5rem;
      line-height: 1.5rem;
      font-size: 0.75rem !important;
    }

    .el-select-dropdown__empty {
      font-size: 0.75rem;
    }
  }

  .footer {
    margin-top: 2rem;
  }
}
</style>
