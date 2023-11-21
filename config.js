const path = require("path");
const { defineConfig } = require("@vue/cli-service");
const TerserPlugin = require("terser-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// 开启gzip压缩
const CompressionWebpackPlugin = require("compression-webpack-plugin");

// 判断开发环境
const isProduction = import.meta.env.NODE_ENV === "production";

const resolve = (dir) => {
  return path.join(__dirname, dir);
};

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = import.meta.env.NODE_ENV === "production" ? "/" : "/";

module.exports = defineConfig({
  configureWebpack: (config) => {
    config.plugins.push(new NodePolyfillPlugin());
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    };

    // 开启gzip压缩
    if (isProduction) {
      const productionGzipExtensions = ["html", "js", "css"];
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path][base].gz",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false, // 删除原文件
        }),
      );

      // 取消webpack警告的性能提示
      config.performance = {
        hints: "warning",
        //入口起点的最大体积
        maxEntrypointSize: 50000000,
        //生成文件的最大体积
        maxAssetSize: 30000000,
        //只给出 js 文件的性能提示
        assetFilter: function (assetFilename) {
          return assetFilename.endsWith(".js");
        },
      };
    }
  },
  publicPath: BASE_URL,
  transpileDependencies: true,
  devServer: {
    open: true,
    host: "localhost",
    port: 8082,
    https: false,
    proxy: {
      "/mystery-web-user": {
        target: "http://221.236.31.34:6599",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps
  },
  lintOnSave: false,
  // 打包时不生成.map文件
  chainWebpack: (config) => {
    config
      .plugin("webpack-bundle-analyzer")
      .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);

    config.resolve.alias
      .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set("@c", resolve("src/components"));
  },
  productionSourceMap: false,
});
