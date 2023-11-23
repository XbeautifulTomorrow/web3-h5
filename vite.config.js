import { defineConfig } from "vite";
import { resolve } from "path"; //引入node的path模块 这里报错
import vue from "@vitejs/plugin-vue";
import { terser } from "rollup-plugin-terser";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  ssr: {
    noExternal: ["swiper", "c-scrollbar", "d3"]
  },
  resolve: {
    //路径别名
    alias: {
      "@": resolve(__dirname, "./src")
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  server: {
    host: "localhost",
    port: 8082,
    https: false,
    open: true,
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      // 引入 terser 插件
      plugins: [
        terser({
          format: {
            comments: false, // 去除注释
          },
        }),
      ],
    },
  }
});
