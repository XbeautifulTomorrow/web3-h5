import { defineConfig } from 'vite'
import { resolve } from 'path' //引入node的path模块 这里报错
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {//路径别名
    alias: {
      '@': resolve(__dirname, './src')
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
})