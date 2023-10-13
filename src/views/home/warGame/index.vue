<template>
  <div>
    <div>
      <el-input v-model.number="svgAngle" type="number" />
      <div class="btns">
        <el-button @click="rotateSvg()">开始</el-button>
        <el-button @click="stopRotate()">结束</el-button>
      </div>
    </div>
    <svg id="war_container"></svg>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import * as d3 from "d3";
export default {
  name: "BannerPage",
  data() {
    return {
      oriData: [
        { x: "A计划", y: 50 },
        { x: "B计划", y: 25 },
        { x: "C计划", y: 25 },
      ],
      svgGraphics: null,
      svgAngle: 0,
      countdown: 0,
      timer: null,
    };
  },
  computed: {
    ...mapStores(useUserStore),
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
  },
  methods: {
    initSvg() {
      const [width, height] = [500, 500];

      let svg = d3
        .select("#war_container")
        .attr("width", width)
        .attr("height", height);

      this.svgGraphics = svg
        .append("g")
        .attr("transform", "translate( 70, 70 )");
    },
    setSvg() {
      const { oriData } = this;
      const [width, height] = [600, 600];

      //设置饼图的半径
      let radius = (Math.min(width, height) * 0.6) / 2;

      let arc = d3.arc().innerRadius(120);

      const angles = this.svgAngle * ((Math.PI * 2) / 360);

      let drawData = d3
        .pie()
        .value(function (d) {
          return d.y;
        })
        .sort(null)
        .sortValues(null)
        .startAngle(this.svgAngle)
        .endAngle(Math.PI * 2 + angles)
        .padAngle(0)(oriData);

      let colorScale = d3
        .scaleOrdinal()
        .domain(d3.range(0, oriData.length))
        .range(d3.schemeSet1);

      this.svgGraphics
        .append("g")
        .attr("transform", "translate( " + radius + ", " + radius + " )")
        .attr("class", "war")
        .selectAll("path")
        .data(drawData)
        .enter()
        .append("path")
        .attr("fill", function (d) {
          return colorScale(d.index);
        })
        .attr("d", function (d) {
          d.outerRadius = radius;
          return arc(d);
        })
        .on("mouseover", arcTween(radius + 10, 0))
        .on("mouseout", arcTween(radius, 150));

      function arcTween(outerRadius, delay) {
        // 设置缓动函数,为鼠标事件使用
        return function () {
          d3.select(this)
            .transition()
            .delay(delay)
            .attrTween("d", function (d) {
              let i = d3.interpolate(d.outerRadius, outerRadius);
              return function (t) {
                d.outerRadius = i(t);
                return arc(d);
              };
            });
        };
      }
    },
    setSvgPath() {
      const { oriData } = this;
      const [width, height] = [600, 600];

      //设置饼图的半径
      let radius = (Math.min(width, height) * 0.6) / 2;

      let arc = d3.arc().innerRadius(120);

      let svg = d3.select("#war_container").select("g").select(".war");

      const angles = this.svgAngle * ((Math.PI * 2) / 360);

      let drawData = d3
        .pie()
        .value(function (d) {
          return d.y;
        })
        .sort(null)
        .sortValues(null)
        .startAngle(angles)
        .endAngle(Math.PI * 2 + angles)
        .padAngle(0)(oriData);

      svg
        .selectAll("path")
        .data(drawData)
        .join("path")
        .attr("d", function (d) {
          d.outerRadius = radius;
          return arc(d);
        });
    },
    // 旋转
    rotateSvg() {
      const Countdown = 1000;
      if (!this.timer) {
        this.countdown = Countdown;
        this.timer = setInterval(() => {
          if (this.countdown > 0 && this.countdown <= 1000) {
            this.countdown--;
            if (this.countdown !== 0) {
              const angle = Number(Countdown - this.countdown) *10;
              this.svgAngle = angle > 360 ? angle % 360 : angle;
              this.setSvgPath();
            } else {
              clearInterval(this.timer);
              this.timer = null;
            }
          }
        }, 10);
      }
    },
    stopRotate() {
      clearInterval(this.timer);
      this.timer = null;
    },
  },
  mounted() {
    this.initSvg();
    this.setSvg();
    // setTimeout(() => {
    //   this.oriData.push({ x: "H计划", y: 100 });
    // }, 5000);

    // this.rotateSvg();
  },
  watch: {
    svgAngle(newV, oldV) {
      this.setSvgPath();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
    