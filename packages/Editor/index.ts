import type { App, Plugin } from 'vue';
import YEditor from './src/Y-Editor.vue';

//注册编辑器插件
export const EditorPlugin: Plugin = {
  install(app: App) {
    app.component('y-editor', YEditor);
  },
};

export { YEditor };
