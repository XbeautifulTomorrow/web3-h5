module.exports = {
  plugins: {
    // ...
    "postcss-px-to-viewport": {
      unitToConvert: "px", // 要转化的单位
      viewportWidth: 1920,
      unitPrecision: 4,
      propList: ["*"],
      viewportUnit: "rem", // 视口单位转换单位 默认vw
      fontViewportUnit: "rem", // 字体转换单位 默认vw
      selectorBlackList: [
        "bitzing-iframe",
        "con",
        "roll_con",
        "roll-one-list",
        "roll-one-list-con",
        "roll-one-list-bor",
        "list_mask",
        "award-carousel",
        "lottery-moreLuck-list-img",
      ],
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
      landscape: false // 是否处理横屏情况
    },
  },
};
