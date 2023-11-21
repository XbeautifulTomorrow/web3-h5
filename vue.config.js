import { defineConfig } from "@vue/cli-service";
import TerserPlugin from "terser-webpack-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

export default defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
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
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    optimization: {
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
    },
  },
});
