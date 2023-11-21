/**
 *
 * 打乱数组顺序 抽奖类常用方式
 * @param {Array} arr
 * @returns {Array}
 */
export const shuffle = (arr) => {
  const _type = Object.prototype.toString.call(arr);
  if (_type === "[object Array]" && arr.length) {
    let m = arr.length;
    while (m > 1) {
      let index = Math.floor(Math.random() * m--);
      [arr[m], arr[index]] = [arr[index], arr[m]];
    }
  } else {
    console.log("shuffle need a array");
  }
  return arr;
};
