module.exports = {
  plugins: {
    // ...
    "postcss-px-to-viewport": {
      viewportWidth: 1920,
      unitPrecision: 3,
      propList: ["*"],
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
      viewportUnit: "rem", // 视口单位转换单位 默认vw
      fontViewportUnit: "rem", // 字体转换单位 默认vw
    },
  },
};
