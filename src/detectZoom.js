export const detectZoom = () => {
  let ratio = 0,
    screen = window.screen,
    ua = navigator.userAgent.toLowerCase();
  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio;
  } else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI;
    }
  } else if (
    window.outerWidth !== undefined &&
    window.innerWidth !== undefined
  ) {
    ratio = window.outerWidth / window.innerWidth;
  }
  if (ratio) {
    ratio = Math.round(ratio * 100);
  }
  return ratio;
};

export const scaleFun = () => {
  let percent = document.documentElement.clientWidth / 1920;
  const scale = percent > 1 ? percent : 1; //大于1k屏就对应比例放大，小于1k屏就用1k屏
  return scale;
};
