import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false 
      }
    }
  },
  build: {
    // 이미지 최적화 설정
    assetsInlineLimit: 4096, // 4kb 이하의 이미지는 base64로 인라인화
    rollupOptions: {
      output: {
        // JS 엔트리 파일명에 해시 추가
        entryFileNames: 'assets/js/[name]-[hash].js',
        // JS 청크 파일명에 해시 추가
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // CSS, 이미지 등 에셋 파일명에 해시 추가
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    }
  }
})
