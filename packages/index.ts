import type { App } from 'vue'
import { EditorPlugin } from './Editor'
//继承各子导出
export default {
    install(app: App) {
        EditorPlugin.install?.(app)
    }
}

export * from './Editor'
