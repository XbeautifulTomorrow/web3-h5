// 用户颜色
export const userColor = [
  "#6A9A23", "#E34935", "#F18D13", "#B38600", "#22A06B", "#1D9AAA", "#1D7AFC", "#8270DB", "#CD519D",
  "#82B536", "#EF5C48", "#F18D13", "#CF9F02", "#2ABB7F", "#37B4C3", "#388BFF", "#8F7EE7", "#DA62AC",
  "#94C748", "#F87462", "#FAA53D", "#E2B203", "#4BCE97", "#60C6D2", "#579DFF", "#9F8FEF", "#E774BB",
  "#B3DF72", "#FF9C8F", "#FEC57B", "#F5CD47", "#7EE2B8", "#8BDBE5", "#85B8FF", "#B8ACF6", "#F797D2",
  "#D3F1A7", "#FFD2CC", "#FFE2BD", "#F8E6A0", "#BAF3DB", "#C1F0F5", "#CCE0FF", "#DFD8FD", "#FDD0EC",
  "#EEFBDA", "#FFEDEB", "#FFF4E5", "#FFF7D6", "#DFFCF0", "#E3FAFC", "#E9F2FF", "#F3F0FF", "#FFECF8"
]

// 军衔等级
export const rankLevel = [
  require("@/assets/svg/home/warGame/rank/rank_1.svg"),
  require("@/assets/svg/home/warGame/rank/rank_2.svg"),
  require("@/assets/svg/home/warGame/rank/rank_3.svg"),
  require("@/assets/svg/home/warGame/rank/rank_4.svg"),
  require("@/assets/svg/home/warGame/rank/rank_5.svg"),
  require("@/assets/svg/home/warGame/rank/rank_6.svg"),
  require("@/assets/svg/home/warGame/rank/rank_7.svg"),
  require("@/assets/svg/home/warGame/rank/rank_8.svg"),
  require("@/assets/svg/home/warGame/rank/rank_9.svg"),
  require("@/assets/svg/home/warGame/rank/rank_10.svg"),
  require("@/assets/svg/home/warGame/rank/rank_11.svg"),
  require("@/assets/svg/home/warGame/rank/rank_12.svg"),
  require("@/assets/svg/home/warGame/rank/rank_13.svg"),
  require("@/assets/svg/home/warGame/rank/rank_14.svg"),
  require("@/assets/svg/home/warGame/rank/rank_15.svg"),
  require("@/assets/svg/home/warGame/rank/rank_16.svg"),
  require("@/assets/svg/home/warGame/rank/rank_17.svg"),
  require("@/assets/svg/home/warGame/rank/rank_18.svg"),
  require("@/assets/svg/home/warGame/rank/rank_19.svg"),
  require("@/assets/svg/home/warGame/rank/rank_20.svg"),
  require("@/assets/svg/home/warGame/rank/rank_21.svg"),
  require("@/assets/svg/home/warGame/rank/rank_22.svg"),
  require("@/assets/svg/home/warGame/rank/rank_23.svg")
]

// 获取军衔
export function getRank(evnet) {
  const amount = Number(evnet || 0);
  if (amount == 0) {
    return rankLevel[0];
  } else if (amount <= 2) {
    return rankLevel[1];
  } else if (amount <= 4) {
    return rankLevel[2];
  } else if (amount <= 6) {
    return rankLevel[3];
  } else if (amount <= 8) {
    return rankLevel[4];
  } else if (amount <= 10) {
    return rankLevel[5];
  } else if (amount <= 25) {
    return rankLevel[6];
  } else if (amount <= 50) {
    return rankLevel[7];
  } else if (amount <= 100) {
    return rankLevel[8];
  } else if (amount <= 250) {
    return rankLevel[9];
  } else if (amount <= 500) {
    return rankLevel[10];
  } else if (amount <= 1000) {
    return rankLevel[11];
  } else if (amount <= 2500) {
    return rankLevel[12];
  } else if (amount <= 5000) {
    return rankLevel[13];
  } else if (amount <= 7500) {
    return rankLevel[14];
  } else if (amount <= 10000) {
    return rankLevel[15];
  } else if (amount <= 25000) {
    return rankLevel[16];
  } else if (amount <= 50000) {
    return rankLevel[17];
  } else if (amount <= 100000) {
    return rankLevel[18];
  } else if (amount <= 250000) {
    return rankLevel[19];
  } else if (amount <= 500000) {
    return rankLevel[20];
  } else if (amount <= 750000) {
    return rankLevel[21];
  } else {
    return rankLevel[22];
  }
}

// 获取等级
export function getLevel(evnet, type = 1) {
  const amount = Number(evnet || 0);
  if (amount < 10) {
    if (type == 1) {
      return require("@/assets/svg/home/warGame/level/level_1.svg");
    } else {
      return require("@/assets/svg/home/warGame/tooltip/level_1.svg");
    }
  } else if (amount < 50) {
    if (type == 1) {
      return require("@/assets/svg/home/warGame/level/level_2.svg");
    } else {
      return require("@/assets/svg/home/warGame/tooltip/level_2.svg");
    }
  } else if (amount < 1000) {
    if (type == 1) {
      return require("@/assets/svg/home/warGame/level/level_3.svg");
    } else {
      return require("@/assets/svg/home/warGame/tooltip/level_3.svg");
    }
  } else if (amount < 10000) {
    if (type == 1) {
      return require("@/assets/svg/home/warGame/level/level_4.svg");
    } else {
      return require("@/assets/svg/home/warGame/tooltip/level_4.svg");
    }
  } else if (amount < 100000) {
    if (type == 1) {
      return require("@/assets/svg/home/warGame/level/level_5.svg");
    } else {
      return require("@/assets/svg/home/warGame/tooltip/level_5.svg");
    }
  } else if (amount < 1000000) {
    if (type == 1) {
      return require("@/assets/svg/home/warGame/level/level_6.svg");
    } else {
      return require("@/assets/svg/home/warGame/tooltip/level_6.svg");
    }
  } else {
    if (type == 1) {
      return require("@/assets/svg/home/warGame/level/level_7.svg");
    } else {
      return require("@/assets/svg/home/warGame/tooltip/level_7.svg");
    }
  }
}