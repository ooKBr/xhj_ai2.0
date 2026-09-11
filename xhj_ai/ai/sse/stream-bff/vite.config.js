import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 利用vite 来解决跨域
  // 发送了一个请求，vite 就会介入
  server: {
    // 代理请求
    proxy: {
    // 前端想去后端请求 以 /api 开头的请求
    '/api': {
      // 跨域，是指在浏览器环境下，同源策略的安全性，在后端环境下，没有这个限制
      target: 'http://localhost:3000',
      secure: false,
      //  /api/stream  正则匹配，找到 /api 开头的请求，都替换为空  \ 表示转义
      //  /api/stream  -> stream
      rewrite: path => path.replace(/^\/api/, '')
    }
    }
  }
})
