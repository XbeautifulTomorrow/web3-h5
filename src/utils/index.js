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
 * @description:  时间转换字符串
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
            console.log("出错！json属性不一致");
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