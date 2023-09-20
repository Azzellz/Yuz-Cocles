import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import dts from 'vite-plugin-dts'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        cssCodeSplit: true,
        lib: {
            formats: ['cjs', 'es', 'umd'],
            entry: path.resolve(__dirname, './packages/index.ts'),
            name: 'Yuz',
            fileName: 'index'
        },
        rollupOptions: {
            //外部依赖,不参与打包,由引入项目提供
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    plugins: [
        vue(),
        vueJsx(),
        dts({
            include: path.resolve('./packages')
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
