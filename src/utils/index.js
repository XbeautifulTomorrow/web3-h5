import bigNumber from "bignumber.js";
import { ElMessage } from 'element-plus'

export function openUrl(url) {
  if (typeof window !== "object") return;
  const tempWin = window.open("_blank");
  if (tempWin) {
    tempWin.opener = null;
    tempWin.location.href = url;
  }
}

/**
 * @description: 深拷贝
 * @param {any} originObj
 * @return {*}
 */
// eslint-disable-next-line
export function deepClone(originObj) {
  // eslint-disable-next-line
  let returnObj;
  // 数组
  if (typeof originObj === "object") {
    returnObj = Array.isArray(originObj) ? [] : {};
    for (const i in originObj) {
      if (typeof originObj[i] === "object") {
        returnObj[i] = deepClone(originObj[i]);
      } else {
        returnObj[i] = originObj[i];
      }
    }
  }
  return returnObj;
}

/**
 * @description: 字符串加密
 * @param {*}
 * @return {*}
 */
export function encodeStr(str) {
  if (typeof window !== "object") return str;
  return window.btoa(window.encodeURIComponent(str));
}

/**
 * @description: 字符串解密
 * @param {*}
 * @return {*}
 */
export function decodeStr(str) {
  if (typeof window !== "object") return str;
  return window.decodeURIComponent(window.atob(str));
}

/**
 * @description:  local store set
 * @param {string} key
 * @param {string} value
 * @return {*}
 */
export function setLocalStore(key, value) {
  localStorage.setItem(key, value);
}

/**
 * @description:  local store get
 * @param {string} key
 * @param {string} value
 * @return {*}
 */
export function getLocalStore(key) {
  return localStorage.getItem(key) || "";
}

/**
 * @description:  local store set
 * @param {string} key
 * @param {string} value
 * @return {*}
 */
export function setSessionStore(key, value) {
  sessionStorage.setItem(key, value);
}

/**
 * @description:  local store get
 * @param {string} key
 * @param {string} value
 * @return {*}
 */
export function getSessionStore(key) {
  return sessionStorage.getItem(key) || "";
}

/**
 * @description: Copy
 */
export function onCopy(event) {
  if (!navigator.clipboard) {
    // use old commandExec() way
    const oInput = document.createElement("input");
    oInput.value = event;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    console.log(oInput.value);
    document.execCommand("Copy"); // 执行浏览器复制命令
    ElMessage.success("Copy successfully");
    oInput.remove();
  } else {
    navigator.clipboard.writeText(event).then(
      function () {
        ElMessage.success("Copy successfully");
      })
      .catch(
        function () {
          ElMessage.error("Copy failed, please try again later");
        });
  }
}

function debounce(fn, delay) {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, delay);
  };
}

/**
 * @description:  resize事件监听窗口变化
 * @param {object} callback
 * @return {*}
 */
export function handleWindowResize(callback) {
  const cancalDebounce = debounce(callback, 300);
  window.addEventListener("resize", cancalDebounce);
}

/**
 * @description:  时间格式化
 * @param {Date} time
 * @param {string} str
 * @return {*}
 * str : yyyy-MM-dd hh-mm-ss
 */
export function timeForStr(time, str) {
  // eslint-disable-next-line
  const date = new Date(time);
  if (!str) str = "YYYY/MM/DD hh:mm:ss";
  str = str.replace(/yyyy|YYYY/, date.getFullYear());
  str = str.replace(
    /yy|YY/,
    date.getYear() % 100 > 9
      ? (date.getYear() % 100).toString()
      : "0" + (date.getYear() % 100)
  );
  const month = date.getMonth() + 1;
  str = str.replace(/MM/, month > 9 ? month.toString() : "0" + month);
  str = str.replace(/M/g, month);

  str = str.replace(
    /dd|DD/,
    date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate()
  );
  str = str.replace(/d|D/g, date.getDate());

  str = str.replace(
    /hh|HH/,
    date.getHours() > 9 ? date.getHours().toString() : "0" + date.getHours()
  );
  str = str.replace(/h|H/g, date.getHours());
  str = str.replace(
    /mm/,
    date.getMinutes() > 9
      ? date.getMinutes().toString()
      : "0" + date.getMinutes()
  );
  str = str.replace(/m/g, date.getMinutes());

  str = str.replace(
    /ss|SS/,
    date.getSeconds() > 9
      ? date.getSeconds().toString()
      : "0" + date.getSeconds()
  );
  str = str.replace(/s|S/g, date.getSeconds());
  return str;
}

/** 
 * @description 友好的时间显示
 * @param string event 时间
 */
export function timeFormat(event) {
  if (!event) return "--"
  const timestamp = new Date(event).getTime() / 1000;

  function zeroize(num) {
    return (String(num).length == 1 ? '0' : '') + num;
  }

  let curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
  let timeAbsolute = +Math.abs(timestampDiff); // 如果比当前时间大

  let curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  let tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象

  let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
  let H = tmDate.getHours(), i = tmDate.getMinutes();
  // let s = tmDate.getSeconds();
  if (timeAbsolute < 60) { // 一分钟以内
    if (curTimestamp > timestamp) {
      return "A moment ago";
    } else {
      return "A while";
    }
  } else if (timeAbsolute < 3600) { // 一小时前之内
    if (curTimestamp > timestamp) {
      return Math.floor(timeAbsolute / 60) + " minutes ago";
    } else {
      return Math.floor(timeAbsolute / 60) + " minutes later";
    }
  } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
    return 'Today ' + zeroize(H) + ':' + zeroize(i);
  } else {
    let newDate = new Date((curTimestamp - 86400) * 1000); // 当前时间戳减一天转换成的日期对象(昨天)
    if (timestamp > curTimestamp) {
      newDate = new Date((curTimestamp + 86400) * 1000); // 当前时间戳加一天转换成的日期对象(明天)
    }

    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return 'Yesterday ' + zeroize(H) + ':' + zeroize(i);
    } else if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() + 1 == d) {
      return 'Tomorrow at ' + zeroize(H) + ':' + zeroize(i);
    } else if (curDate.getFullYear() == Y) {
      // return zeroize(m) + 'Month' + zeroize(d) + 'day ' + zeroize(H) + ':' + zeroize(i);
      return `${monthFormat(zeroize(m))} ${parseInt(zeroize(d))} ${zeroize(H)}:${zeroize(i)}`;
    } else {
      // return Y + 'Year' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
      return `${monthFormat(zeroize(m))} ${parseInt(zeroize(d))} ${zeroize(H)}:${zeroize(i)}，${Y}`;
    }
  }
}

/** 
 * @description 月份转化
 * @param string event 时间
 */
function monthFormat(event) {
  const monthData = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  }

  return monthData[parseInt(event)]
}

/**
 * 获取时间和当前相距多久
 *
 * @param startTime 开始时间
 * @param endTime   结束时间
 * @return
 */
export function dateDiff(event, end = new Date()) {
  if (!event) return "ENDED"
  const setTime = new Date(event).getTime();
  const nowTime = new Date(end).getTime();
  if (nowTime >= setTime) return "ENDED";

  // 按照传入的格式生成一个simpledateformate对象
  let nd = 1000 * 24 * 60 * 60; // 一天的毫秒数
  let nh = 1000 * 60 * 60;// 一小时的毫秒数
  let nm = 1000 * 60; // 一分钟的毫秒数
  let ns = 1000; // 一秒钟的毫秒数;

  // 获得两个时间的毫秒时间差异
  let diff;
  diff = Number(new bigNumber(setTime).minus(nowTime));

  let day = diff / nd;// 计算差多少天
  // eslint-disable-next-line no-unused-vars
  let hour = diff % nd / nh;// 计算差多少小时
  // eslint-disable-next-line no-unused-vars
  let min = diff % nd % nh / nm;// 计算差多少分钟
  // eslint-disable-next-line no-unused-vars
  let sec = diff % nd % nh % nm / ns;// 计算差多少秒//输出结果

  return day;
}

/**
 * 验证json属性是否一致
 * @param jsons json
 * @param contrast 对比json
 * @returns
 */
export function getDifferent(jsons, contrast) {
  let a = deepClone(jsons);
  let b = deepClone(contrast);

  //循环遍历其中一个json对象
  for (const key in a) {
    if (typeof a[key] != "object") {
      if (key != null) {
        if (b[key] != undefined) {
          delete a[key];
          delete b[key];
        }
      }
    } else {
      if (a[key].length >= 0) {
        for (let i = 0; i < a[key].length; i++) {
          getDifferent(a[key][i], b[key][i]);
        }
      } else {
        if (b[key] != undefined) {
          getDifferent(a[key], b[key]);
        }
      }
    }
  }

  for (const keys in a) {
    if (typeof a[keys] != "object" || b[keys] == undefined) {
      console.log("error! Inconsistent json attributes");
      console.log(a);
      console.log(b);
      return;
    }
  }
}

/**
 * @description: 精确小数点
 * @param {string} number：为你要转换的数字
 * @param {string} format：要保留几位小数；譬如要保留2位，则值为2
 * @param {string} zerFill:是否补零。不需要补零可以不填写此参数
 */
export const accurateDecimal = (number, format, zeroFill) => {
  //判断非空
  if (!isEmpty(number)) {
    //正则匹配:正整数，负整数，正浮点数，负浮点数
    if (!/^\d+(\.\d+)?$|^-\d+(\.\d+)?$/.test(number))
      return number;
    let n = 1;
    for (let i = 0; i < format; i++) {
      n = n * 10;
    }

    //四舍五入
    number = Math.round(number * n) / n;
    let str = number.toString();

    //是否补零
    if (zeroFill) {
      let index;
      if (str.indexOf(".") == -1) {
        index = format;
        str += '.';
      } else {
        index = format - ((str.length - 1) - str.indexOf("."));
      }

      for (let i = 0; i < index; i++) {
        str += '0';
      }
    }
    return str;
  }
  return number;
};

//非空验证
function isEmpty(ObjVal) {
  if ((ObjVal == null || typeof (ObjVal) == "undefined") || (typeof (ObjVal) == "string" && ObjVal == "" && ObjVal != "undefined")) {
    return true;
  } else {
    return false;
  }
}