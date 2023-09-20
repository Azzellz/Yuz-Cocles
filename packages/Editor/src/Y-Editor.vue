<!-- eslint-disable vue/no-mutating-props -->
<!-- 这里就是要修改Props的 -->
<template>
    <div class="editor-container">
        <QuillEditor
            ref="QuillEditorRef"
            content-type="html"
            :style="{ flex: 1, height: 0 }"
            :options="options"
            v-model:content="context.content"
        />
        <div v-if="isShowHTML" class="html-displayer">
            <h5 class="title">html展示</h5>
            <div class="html-content" v-text="context.content"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/monokai-sublime.css' //导入代码高亮样式
import { type I_QuillEditorAPI, YuzuEditor } from './model'
import { ref, onMounted, watch, watchEffect } from 'vue'

//编辑器上下文,通过这个来与父组件交换内容
interface I_EditorContext {
    content: string //html内容
    preText?: string //预览内容
    completeText?: string //全文
}
//定义Props
const props = withDefaults(
    defineProps<{
        //该值应该是一个reactive对象
        context: I_EditorContext
        isShowHTML?: boolean
    }>(),
    {
        isShowHTML: false
    }
)

//#endregion
//编辑器配置
//#region
//配置高亮语言
hljs.configure({
    //注册语言
    languages: ['javascript', 'typescript', 'ruby', 'python', 'c', 'cpp', 'java', 'html', 'css']
})
//highlight完成后会触发更新
const highlightReadyFlag = ref(0)
//编辑器配置
const options = {
    modules: {
        syntax: {
            //即时语法高亮
            highlight: (text: string) => {
                highlightReadyFlag.value++
                return hljs.highlightAuto(text).value
            }
        },
        toolbar: [
            { header: [1, 2, 3, 4, 5, 6, false] },
            { color: [] },
            { background: [] },
            { size: ['small', false, 'large', 'huge'] },
            { font: [] },
            { align: [] },
            'clean',
            'bold',
            'italic',
            'underline',
            'code-block',
            'strike',
            'blockquote'
        ]
    },
    placeholder: '...',
    theme: 'snow'
}
//#endregion
//升级Editor
//#region
//获取模板引用
const QuillEditorRef = ref<I_QuillEditorAPI | null>(null)
onMounted(() => {
    const quillEditor = QuillEditorRef.value
    if (quillEditor) {
        //升级
        const yuzuEditor = new YuzuEditor(quillEditor)
        //高亮完毕后触发content同步高亮html
        watch(highlightReadyFlag, () => {
            // eslint-disable-next-line vue/no-mutating-props
            props.context.content = yuzuEditor.editorAPI.getHTML()
        })
        //将content的变化和preContent同步
        watchEffect(() => {
            //追踪content的变化
            props.context.content
            setTimeout(() => {
                //getText要延时调用,不然会获取不到
                const text = yuzuEditor.editorAPI.getText()
                // eslint-disable-next-line vue/no-mutating-props
                props.context.preText = text.slice(0, 100)
                // eslint-disable-next-line vue/no-mutating-props
                props.context.completeText = text
            }, 100)
        })
    }
})
//#endregion
</script>

<style lang="less" scoped>
.editor-container {
    display: flex;
    flex-direction: column;
    .html-displayer {
        margin-top: 10px;
        .title {
            color: gray;
        }
        .html-content {
            color: gray;
        }
    }
}
</style>
