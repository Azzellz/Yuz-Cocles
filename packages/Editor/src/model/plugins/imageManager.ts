//!声明功能接口
import { EditorPlugin } from '.'
import { YuzuEditor } from '..'

//插入图片的接口
interface I_ImageInsert {
    appendImageToEditor(src: string): void
}
//图片回显
interface I_ImageBackShow {
    //本地回显
    backShowLocal(files: FileList): void
}
//图像上传
class ImageUploader {
    //应为input标签
    public uploader: HTMLInputElement
    constructor() {
        const imageUploader: HTMLInputElement = document.createElement('input')
        imageUploader.style.display = 'none' //隐藏
        imageUploader.accept = '.jpg, .png, .gif'
        imageUploader.type = 'file'
        this.uploader = imageUploader
    }
}
//图像上传触发器
class ImageUploaderTrigger {
    //触发上传的按钮标签
    public trigger: HTMLButtonElement
    constructor() {
        const imageUploaderTrigger: HTMLButtonElement = document.createElement('button')
        imageUploaderTrigger.type = 'button'
        //svg图标
        const imageUploaderSvg =
            '<svg t="1694590863173" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1748" width="32" height="32"><path d="M784.97794147 611.26470568V288.65441138H239.02205853v228.30882358L363.10294147 387.91911789l243.19852926 253.125L710.52941138 536.81617642l74.44853009 74.44852926zM189.38970568 239.02205853h645.22058864v545.95588294H189.38970568V239.02205853z m446.69117643 198.5294122c-29.77941138 0-49.63235285-19.85294147-49.63235284-49.63235284s19.85294147-49.63235285 49.63235284-49.63235285 49.63235285 19.85294147 49.63235285 49.63235285-19.85294147 49.63235285-49.63235285 49.63235284z" p-id="1749"></path></svg>'
        //按钮内的内容
        imageUploaderTrigger.innerHTML = imageUploaderSvg
        imageUploaderTrigger.setAttribute(
            'style',
            `display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;`
        )
        this.trigger = imageUploaderTrigger
    }
}
//记录已经上传的图片的信息
class ImageList {
    public list
    constructor() {
        this.list = new Array<HTMLImageElement>()
    }
}
//图像管理器
export class ImageManager extends EditorPlugin implements I_ImageInsert, I_ImageBackShow {
    public imageUploader: ImageUploader = new ImageUploader()
    public imageUploaderTrigger: ImageUploaderTrigger = new ImageUploaderTrigger()
    public imageList: ImageList = new ImageList()
    //传递编辑器实例,让各功能件都共享一个编辑器实例
    constructor(yuzuEditor: YuzuEditor) {
        super(yuzuEditor)

        //初始化uploader事件
        this.imageUploader.uploader.addEventListener('change', () => {
            this.backShowLocal(this.imageUploader.uploader.files!)
        })
        //初始化trigger事件
        this.imageUploaderTrigger.trigger.addEventListener('click', () => {
            this.imageUploader.uploader.click()
        })

        this.yuzuEditor.toolBar.appendChild(this.imageUploader.uploader)
        this.yuzuEditor.toolBar.appendChild(this.imageUploaderTrigger.trigger)
    }
    //向编辑器内容体添加img标签
    //添加图片
    appendImageToEditor(src: string): void {
        const img = this.yuzuEditor.appendChildToEditor<HTMLImageElement>(
            'img',
            {
                key: 'src',
                value: src
            },
            {
                key: 'style',
                value: 'margin:10px 0;'
            }
        )
        this.imageList.list.push(img)
    }
    //本地回显
    backShowLocal(files: FileList) {
        const img = files[0]
        //最大值判断
        const maxSizeInBytes = 10 * 1024 * 1024 // 10MB
        if (img.size > maxSizeInBytes) {
            // ElMessage.error({
            //     message: '上传的图片超过10MB!',
            //     offset: 80
            // })
            alert('上传的图片超过10MB!')
            return
        }
        //新建reader
        const reader = new FileReader()
        // 监听FileReader对象的load事件
        reader.addEventListener('load', () => {
            // 获取base64数据
            const base64Data = reader.result as string
            //将base64作为src
            this.appendImageToEditor(base64Data)
        })
        // 读取文件内容，以base64格式输出
        reader.readAsDataURL(img)
    }
}
