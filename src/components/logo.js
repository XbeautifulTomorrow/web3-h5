/* eslint-disable */
import p5 from 'p5';
import img from './img/logo.svg';
import glich1 from './music/glich1.mp3';
import glich2 from './music/glich2.mp3';
import glich3 from './music/glich3.mp3';
import glich4 from './music/glich4.mp3';
import glich5 from './music/glich5.mp3';
export function logoFun(id = 'logo', musicId = 'music', isPlay = false) {
  const _test = (sketch) => {
    const musicArr = [glich1, glich2, glich3, glich4, glich5];
    const ele = document.getElementById(id);
    let windowW = ele.offsetWidth;
    let windowH = ele.offsetHeight;
    let isLoaded = false;
    let glitch;
    let imgSrc = img;
    let timer = null;
    sketch.setup = () => {
      document.getElementById(id).innerHTML = null;
      const logo = sketch.createCanvas(windowW, windowH);
      logo.parent(id);
      // sketch.frameRate(20); // 动画执行次数
      if (isPlay) {
        const dubbing = document.getElementById(musicId);
        clearTimeout(timer);
        timer = null;
        timer = setInterval(() => {
          const nuber = Math.floor(sketch.random(0, musicArr.length));
          dubbing.src = musicArr[nuber];
          dubbing.play();
        }, 50);
      }
      sketch.loadImage(imgSrc, function (img) {
        glitch = new Glitch(img, sketch);
        isLoaded = true;
      });
    };
    sketch.draw = () => {
      sketch.clear();
      if (isLoaded) {
        glitch.show();
      }
    };

    class Glitch {
      constructor(img, sketch) {
        this.channelLen = 4;
        this.imgOrigin = img;
        this.imgOrigin.loadPixels();
        this.copyData = [];
        this.flowLineImgs = [];
        this.shiftLineImgs = [];
        this.shiftRGBs = [];
        this.scatImgs = [];
        this.throughFlag = true;
        this.copyData = new Uint8ClampedArray(this.imgOrigin.pixels);

        // flow line
        for (let i = 0; i < 1; i++) {
          let o = {
            pixels: null,
            t1: sketch.floor(sketch.random(0, 1000)),
            speed: sketch.floor(sketch.random(4, 24)),
            randX: sketch.floor(sketch.random(24, 80)),
          };
          this.flowLineImgs.push(o);
        }

        // shift line
        for (let i = 0; i < 6; i++) {
          let o = null;
          this.shiftLineImgs.push(o);
        }

        // shift RGB
        for (let i = 0; i < 1; i++) {
          let o = null;
          this.shiftRGBs.push(o);
        }

        // scat imgs
        for (let i = 0; i < 3; i++) {
          let scatImg = {
            img: null,
            x: 0,
            y: 0,
          };
          this.scatImgs.push(scatImg);
        }
      }

      replaceData(destImg, srcPixels) {
        for (let y = 0; y < destImg.height; y++) {
          for (let x = 0; x < destImg.width; x++) {
            let r, g, b, a;
            let index;
            index = (y * destImg.width + x) * this.channelLen;
            r = index;
            g = index + 1;
            b = index + 2;
            a = index + 3;
            destImg.pixels[r] = srcPixels[r];
            destImg.pixels[g] = srcPixels[g];
            destImg.pixels[b] = srcPixels[b];
            destImg.pixels[a] = srcPixels[a];
          }
        }
        destImg.updatePixels();
      }

      flowLine(srcImg, obj) {
        let destPixels, tempY;
        destPixels = new Uint8ClampedArray(srcImg.pixels);
        obj.t1 %= srcImg.height;
        obj.t1 += obj.speed;
        //tempY = sketch.floor(noise(obj.t1) * srcImg.height);
        tempY = sketch.floor(obj.t1);
        for (let y = 0; y < srcImg.height; y++) {
          if (tempY === y) {
            for (let x = 0; x < srcImg.width; x++) {
              let r, g, b, a;
              let index;
              index = (y * srcImg.width + x) * this.channelLen;
              r = index;
              g = index + 1;
              b = index + 2;
              a = index + 3;
              destPixels[r] = srcImg.pixels[r] + obj.randX;
              destPixels[g] = srcImg.pixels[g] + obj.randX;
              destPixels[b] = srcImg.pixels[b] + obj.randX;
              destPixels[a] = srcImg.pixels[a];
            }
          }
        }
        return destPixels;
      }

      shiftLine(srcImg) {
        let offsetX;
        let rangeMin, rangeMax;
        let destPixels;
        let rangeH;

        destPixels = new Uint8ClampedArray(srcImg.pixels);
        rangeH = srcImg.height;
        rangeMin = sketch.floor(sketch.random(0, rangeH));
        rangeMax = rangeMin + sketch.floor(sketch.random(1, rangeH - rangeMin));
        offsetX = this.channelLen * sketch.floor(sketch.random(-40, 40));

        for (let y = 0; y < srcImg.height; y++) {
          if (y > rangeMin && y < rangeMax) {
            for (let x = 0; x < srcImg.width; x++) {
              let r, g, b, a;
              let r2, g2, b2, a2;
              let index;

              index = (y * srcImg.width + x) * this.channelLen;
              r = index;
              g = index + 1;
              b = index + 2;
              a = index + 3;
              r2 = r + offsetX;
              g2 = g + offsetX;
              b2 = b + offsetX;
              destPixels[r] = srcImg.pixels[r2];
              destPixels[g] = srcImg.pixels[g2];
              destPixels[b] = srcImg.pixels[b2];
              destPixels[a] = srcImg.pixels[a];
            }
          }
        }
        return destPixels;
      }

      shiftRGB(srcImg) {
        let randR, randG, randB;
        let destPixels;
        let range;

        range = 16;
        destPixels = new Uint8ClampedArray(srcImg.pixels);
        randR =
          (sketch.floor(sketch.random(-range, range)) * srcImg.width +
            sketch.floor(sketch.random(-range, range))) *
          this.channelLen;
        randG =
          (sketch.floor(sketch.random(-range, range)) * srcImg.width +
            sketch.floor(sketch.random(-range, range))) *
          this.channelLen;
        randB =
          (sketch.floor(sketch.random(-range, range)) * srcImg.width +
            sketch.floor(sketch.random(-range, range))) *
          this.channelLen;

        for (let y = 0; y < srcImg.height; y++) {
          for (let x = 0; x < srcImg.width; x++) {
            let r, g, b, a;
            let r2, g2, b2, a2;
            let index;

            index = (y * srcImg.width + x) * this.channelLen;
            r = index;
            g = index + 1;
            b = index + 2;
            a = index + 3;
            r2 = (r + randR) % srcImg.pixels.length;
            g2 = (g + randG) % srcImg.pixels.length;
            b2 = (b + randB) % srcImg.pixels.length;
            destPixels[r] = srcImg.pixels[r2];
            destPixels[g] = srcImg.pixels[g2];
            destPixels[b] = srcImg.pixels[b2];
            destPixels[a] = srcImg.pixels[a];
          }
        }

        return destPixels;
      }

      getRandomRectImg(srcImg) {
        let startX;
        let startY;
        let rectW;
        let rectH;
        let destImg;
        startX = sketch.floor(sketch.random(0, srcImg.width - 30));
        startY = sketch.floor(sketch.random(0, srcImg.height - 50));
        rectW = sketch.floor(sketch.random(30, srcImg.width - startX));
        rectH = sketch.floor(sketch.random(1, 50));
        destImg = srcImg.get(startX, startY, rectW, rectH);
        destImg.loadPixels();
        return destImg;
      }

      show() {
        // restore the original state
        this.replaceData(this.imgOrigin, this.copyData);

        // sometimes pass without effect processing
        let n = sketch.floor(sketch.random(100));
        if (n > 75 && this.throughFlag) {
          this.throughFlag = false;
          setTimeout(() => {
            this.throughFlag = true;
          }, sketch.floor(sketch.random(40, 400)));
        }
        if (!this.throughFlag) {
          sketch.push();
          sketch.translate(
            (sketch.width - this.imgOrigin.width) / 2,
            (sketch.height - this.imgOrigin.height) / 2
          );
          sketch.image(this.imgOrigin, 0, 0);
          sketch.pop();
          return;
        }

        // flow line
        this.flowLineImgs.forEach((v, i, arr) => {
          arr[i].pixels = this.flowLine(this.imgOrigin, v);
          if (arr[i].pixels) {
            this.replaceData(this.imgOrigin, arr[i].pixels);
          }
        });

        // shift line
        this.shiftLineImgs.forEach((v, i, arr) => {
          if (sketch.floor(sketch.random(100)) > 50) {
            arr[i] = this.shiftLine(this.imgOrigin);
            this.replaceData(this.imgOrigin, arr[i]);
          } else {
            if (arr[i]) {
              this.replaceData(this.imgOrigin, arr[i]);
            }
          }
        });

        // shift rgb
        this.shiftRGBs.forEach((v, i, arr) => {
          if (sketch.floor(sketch.random(100)) > 65) {
            arr[i] = this.shiftRGB(this.imgOrigin);
            this.replaceData(this.imgOrigin, arr[i]);
          }
        });

        sketch.push();
        sketch.translate(
          (sketch.width - this.imgOrigin.width) / 2,
          (sketch.height - this.imgOrigin.height) / 2
        );
        sketch.image(this.imgOrigin, 0, 0);
        sketch.pop();

        // scat sketch.image
        this.scatImgs.forEach((obj) => {
          sketch.push();
          sketch.translate(
            (sketch.width - this.imgOrigin.width) / 2,
            (sketch.height - this.imgOrigin.height) / 2
          );
          if (sketch.floor(sketch.random(100)) > 80) {
            obj.x = sketch.floor(
              sketch.random(
                -this.imgOrigin.width * 0.3,
                this.imgOrigin.width * 0.7
              )
            );
            obj.y = sketch.floor(
              sketch.random(-this.imgOrigin.height * 0.1, this.imgOrigin.height)
            );
            obj.img = this.getRandomRectImg(this.imgOrigin);
          }
          if (obj.img) {
            sketch.image(obj.img, obj.x, obj.y);
          }
          sketch.pop();
        });
      }
    }
  };
  new p5(_test);
}
