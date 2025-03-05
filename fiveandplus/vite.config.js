import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base : '/fiveandplus',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 글로벌 SCSS 변수나 mixin 등을 추가할 수 있습니다.
        //additionalData: '@use "@/assets/landing.scss";' // 예시로 글로벌 변수 파일을 추가
      }
    }
  }
})
