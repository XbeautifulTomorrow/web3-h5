import { createI18n } from "vue-i18n";
import { getDifferent } from "@/utils/index";
import zh_CN from "./zh-TW.json";
import en_US from "./en.json";
import ja_JP from "./jp.json";
import pt_PT from "./pt.json";

const LANG_MENU = {
  cn: "zh_CN",
  en: "en_US",
  ja: "ja_JP",
  pt: "pt_PT"
};

// 获取当前语言
function getLang() {
  // 优先 去localstore
  // if (localStorage.lang) {
  //   const lang = localStorage.lang;
  //   if (Object.keys(LANG_MENU).indexOf(lang) > -1)
  //     // eslint-disable-next-line
  //     return LANG_MENU[lang];
  // } else {
  //   let language = null;
  //   if (navigator.appName == 'Netscape') {
  //     language = navigator.language;
  //   }
  //   else {
  //     language = navigator.browserLanguage;
  //   }

  //   if (language.indexOf("zh") > -1) {
  //     localStorage.setItem("lang", "cn")
  //     return "zh_CN"
  //   } else {
  //     localStorage.setItem("lang", "en")
  // return "en_US"
  // }
  // }

  // 現在只要英文
  return "en_US";
}

const messages = {
  zh_CN: {
    ...zh_CN
  },
  en_US: {
    ...en_US
  },
  ja_JP: {
    ...ja_JP
  },
  pt_PT: {
    ...pt_PT
  }
};

//对比语言包json属性
// 英语>>中文
getDifferent(messages["en_US"], messages["zh_CN"]);
getDifferent(messages["zh_CN"], messages["en_US"]);

// // 英语>>日语
// getDifferent(messages["en_US"], messages["ja_JP"]);
// getDifferent(messages["ja_JP"], messages["en_US"]);

// // 英文>>葡萄牙语
// getDifferent(messages["en_US"], messages["pt_PT"]);
// getDifferent(messages["pt_PT"], messages["en_US"]);

const i18n = new createI18n({
  allowComposition: true,
  locale: getLang(),
  messages: messages,
  globalInjection: true,
  warnHtmlMessage: false,
  warnHtmlInMessage: "off",
  silentFallbackWarn: true,
  silentTranslationWarn: true //去除警告信息
});

// 设置当前语言
function setLang(lang) {
  Object.keys(LANG_MENU).forEach(key => {
    // i18n.locale = lang;
    i18n.locale = "en_US";
    if (LANG_MENU[key] === lang) localStorage.setItem("lang", key);
  });
}

export { getLang, setLang, i18n };
