<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <div class="toolbar-group">
        <div class="filename-input-wrapper">
          <input
            type="text"
            :value="fileName"
            class="filename-input"
            placeholder="文件名"
            @input="handleFileNameChange"
            title="设置文件名"
          />
        </div>
        <div class="select-wrapper">
          <select
            v-model="selectedTheme"
            class="theme-select toolbar-select"
            @change="$emit('update:theme', selectedTheme)"
            title="选择主题"
          >
            <option value="oneDark">One Dark</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="github">GitHub</option>
            <option value="monokai">Monokai</option>
          </select>
          <div class="select-arrow"></div>
        </div>

        <div class="select-wrapper">
          <select
            v-model="selectedLanguage"
            class="language-select toolbar-select"
            @change="$emit('update:language', selectedLanguage)"
            title="选择语言"
          >
            <option value="auto">自动检测</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="rust">Rust</option>
            <option value="sql">SQL</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
            <option value="properties">Properties</option>
          </select>
          <div class="select-arrow"></div>
        </div>
      </div>

      <div class="toolbar-group">
        <div class="select-wrapper">
          <select
            v-model="selectedFontSize"
            class="font-size-select toolbar-select"
            @change="handleFontSizeChange"
            title="字体大小"
          >
            <option value="12">12px</option>
            <option value="13">13px</option>
            <option value="14" selected>14px</option>
            <option value="15">15px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
          </select>
          <div class="select-arrow"></div>
        </div>

        <div class="select-wrapper">
          <select
            v-model="selectedFontFamily"
            class="font-family-select toolbar-select"
            @change="handleFontFamilyChange"
            title="字体样式"
          >
            <option value="'Menlo', Monaco, Consolas, monospace">Menlo</option>
            <option value="'Fira Code', monospace">Fira Code</option>
            <option value="'Source Code Pro', monospace">Source Code Pro</option>
            <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
            <option value="'Cascadia Code', monospace">Cascadia Code</option>
            <option value="'Ubuntu Mono', monospace">Ubuntu Mono</option>
            <option value="monospace">等宽字体</option>
          </select>
          <div class="select-arrow"></div>
        </div>

        <div class="color-picker-wrapper" title="背景颜色">
          <div class="color-preview" :style="{ backgroundColor: selectedColor }"></div>
          <input
            type="color"
            v-model="selectedColor"
            class="color-picker"
            @change="handleColorChange"
          />
        </div>
      </div>
    </div>

    <div class="toolbar-right">
      <div class="toolbar-group padding-controls">
        <div class="padding-stepper-container">
          <div class="padding-icon y-padding" title="上下内边距">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <rect x="5" y="6" width="14" height="12" rx="2"></rect>
            </svg>
          </div>
          <div class="stepper-input">
            <button
              class="stepper-button decrease"
              @click="decreasePaddingY"
              title="减少上下内边距"
            >
              -
            </button>
            <input
              type="number"
              :value="paddingY"
              min="20"
              max="200"
              step="2"
              @input="handlePaddingYInputChange"
              @blur="validatePaddingY"
              class="stepper-value"
            />
            <button
              class="stepper-button increase"
              @click="increasePaddingY"
              title="增加上下内边距"
            >
              +
            </button>
          </div>
          <span class="padding-unit">px</span>
        </div>
      </div>

      <div class="toolbar-group action-buttons">
        <button
          class="toolbar-button"
          @click="handleFormat"
          :disabled="isFormatting"
          title="格式化代码"
        >
          <span class="button-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="21" y1="10" x2="3" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
          </span>
          <span class="button-text">{{ isFormatting ? '格式化中...' : '格式化' }}</span>
        </button>
        <button class="toolbar-button" @click="handleCopy" title="复制代码到剪贴板">
          <span class="button-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </span>
          <span class="button-text">复制</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { ThemeType } from './ThemeConfig'
import type { LanguageType } from './LanguageConfig'
import html2canvas from 'html2canvas'

export default defineComponent({
  name: 'CodeMirrorToolbar',
  props: {
    theme: {
      type: String as PropType<ThemeType>,
      required: true,
    },
    language: {
      type: String as PropType<LanguageType>,
      required: true,
    },
    isFormatting: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: '#1a1a1a',
    },
    fontSize: {
      type: Number,
      default: 14,
    },
    fontFamily: {
      type: String,
      default: "'Menlo', Monaco, Consolas, monospace",
    },
    padding: {
      type: Object as PropType<{ x: number; y: number }>,
      default: () => ({ x: 32, y: 40 }),
    },
    fileName: {
      type: String,
      default: 'untitled.txt',
    },
  },
  emits: [
    'update:theme',
    'update:language',
    'update:backgroundColor',
    'update:fontSize',
    'update:fontFamily',
    'update:padding',
    'update:fileName',
    'format',
    'copy:start',
    'copy:success',
    'copy:error',
  ],
  data() {
    return {
      selectedTheme: this.theme,
      selectedLanguage: this.language,
      selectedColor: this.backgroundColor,
      selectedFontSize: this.fontSize.toString(),
      selectedFontFamily: this.fontFamily,
      paddingY: this.padding.y,
    }
  },
  computed: {},
  watch: {
    theme(newTheme: ThemeType) {
      this.selectedTheme = newTheme
    },
    language(newLanguage: LanguageType) {
      this.selectedLanguage = newLanguage
    },
    backgroundColor(newColor: string) {
      this.selectedColor = newColor
    },
    fontSize(newSize: number) {
      this.selectedFontSize = newSize.toString()
    },
    fontFamily(newFamily: string) {
      this.selectedFontFamily = newFamily
    },
    padding: {
      handler(newPadding: { x: number; y: number }) {
        this.paddingY = newPadding.y
      },
      deep: true,
    },
  },
  methods: {
    async handleFormat() {
      if (this.isFormatting) return
      this.$emit('format')
    },
    handleColorChange() {
      this.$emit('update:backgroundColor', this.selectedColor)
    },
    handleFontSizeChange() {
      this.$emit('update:fontSize', parseInt(this.selectedFontSize))
    },
    handleFontFamilyChange() {
      this.$emit('update:fontFamily', this.selectedFontFamily)
    },
    handlePaddingYInputChange(e: Event) {
      const value = parseInt((e.target as HTMLInputElement).value)
      this.paddingY = value
      this.$emit('update:padding', { x: this.padding.x, y: value })
    },
    decreasePaddingY() {
      this.paddingY = Math.max(20, this.paddingY - 2)
      this.$emit('update:padding', { x: this.padding.x, y: this.paddingY })
    },
    increasePaddingY() {
      this.paddingY = Math.min(200, this.paddingY + 2)
      this.$emit('update:padding', { x: this.padding.x, y: this.paddingY })
    },
    validatePaddingY() {
      if (this.paddingY < 20) {
        this.paddingY = 20
        this.$emit('update:padding', { x: this.padding.x, y: this.paddingY })
      }
    },
    async handleCopy() {
      try {
        // 获取编辑器窗口元素，使用editor-wrapper替代window-parent-wrapper
        const editorWrapper = document.querySelector('.editor-wrapper') as HTMLElement
        if (!editorWrapper) {
          console.error('找不到编辑器窗口元素')
          return
        }

        // 显示加载状态
        this.$emit('copy:start')

        // 使用html2canvas将元素转换为画布
        const canvas = await html2canvas(editorWrapper, {
          scale: 2, // 使用2倍缩放以获得更清晰的图像
          useCORS: true, // 允许加载跨域图像
          backgroundColor: null, // 保持背景透明
          logging: false, // 关闭日志
        })

        // 将画布转换为Blob
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              // 创建ClipboardItem并复制到剪贴板
              const data = [new ClipboardItem({ 'image/png': blob })]
              await navigator.clipboard.write(data)
              this.$emit('copy:success')
            } catch (error) {
              console.error('复制到剪贴板失败:', error)
              // 回退方案：提供下载功能
              this.fallbackCopyImage(canvas)
              this.$emit('copy:error', '无法直接复制到剪贴板，已提供图片下载')
            }
          }
        }, 'image/png')
      } catch (error) {
        console.error('生成图片失败:', error)
        this.$emit('copy:error', '生成图片失败')
      }
    },

    // 提供回退下载功能
    fallbackCopyImage(canvas: HTMLCanvasElement) {
      const link = document.createElement('a')
      link.download = 'code-snapshot.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    },
    handleFileNameChange(event: Event) {
      const target = event.target as HTMLInputElement
      this.$emit('update:fileName', target.value)
    },
  },
})
</script>

<style scoped>
/* 工具栏基本样式 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
  color: #334155;
  position: relative;
  z-index: 20;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  gap: 8px;
}

/* 暗色模式下的工具栏 */
.toolbar.dark-toolbar {
  background-color: #1e293b;
  border-bottom: 1px solid #2d3748;
  color: #f1f5f9;
}

.toolbar-left {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: nowrap;
}

/* 选择框容器 */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* 自定义下拉箭头 */
.select-arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #64748b;
  pointer-events: none;
}

.toolbar-select {
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
  height: 28px;
  box-sizing: border-box;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
  padding-right: 24px;
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  width: 28px;
  height: 28px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-left: 2px;
}

.color-preview {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
}

.color-picker {
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  opacity: 0;
  cursor: pointer;
}

.toolbar-select:hover {
  border-color: #cbd5e1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.toolbar-button {
  padding: 4px 10px;
  height: 28px;
  font-size: 13px;
  color: #334155;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-button:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.toolbar-button:active:not(:disabled) {
  background-color: #e2e8f0;
}

.toolbar-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.button-text {
  white-space: nowrap;
}

.theme-select {
  width: 105px;
}

.language-select {
  width: 110px;
}

.font-size-select {
  width: 65px;
}

.font-family-select {
  width: 120px;
}

/* 内边距控制样式 */
.padding-controls {
  display: flex;
  align-items: center;
}

.padding-stepper-container {
  display: flex;
  align-items: center;
  width: 140px;
}

.padding-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: #e2e8f0;
  color: #64748b;
  flex-shrink: 0;
}

.stepper-input {
  display: flex;
  align-items: center;
  width: 110px;
}

.stepper-button {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
}

.stepper-button:hover {
  color: #3b82f6;
  background-color: #f1f5f9;
  border-radius: 4px;
}

.stepper-button:active {
  background-color: #e2e8f0;
}

.stepper-value {
  width: 50px;
  text-align: center;
  border: none;
  outline: none;
  font-size: 14px;
}

.stepper-value:focus {
  border-bottom: 1px solid #3b82f6;
}

.padding-unit {
  font-size: 12px;
  color: #64748b;
  width: 20px;
  text-align: left;
  flex-shrink: 0;
  margin-left: 2px;
}

/* 暗色主题工具栏下的样式调整 */
.dark-toolbar .toolbar-select {
  background-color: #1e293b;
  border-color: #475569;
  color: #f1f5f9;
}

.dark-toolbar .toolbar-select:hover {
  border-color: #64748b;
}

.dark-toolbar .select-arrow {
  border-top-color: #94a3b8;
}

.dark-toolbar .toolbar-button {
  background-color: #1e293b;
  border-color: #475569;
  color: #f1f5f9;
}

.dark-toolbar .toolbar-button:hover:not(:disabled) {
  background-color: #334155;
  border-color: #64748b;
}

.dark-toolbar .button-icon {
  color: #94a3b8;
}

.dark-toolbar .padding-icon {
  background-color: #334155;
  color: #94a3b8;
}

.dark-toolbar .color-preview {
  border-color: #475569;
}

.dark-toolbar .stepper-button {
  color: #94a3b8;
}

.dark-toolbar .stepper-button:hover {
  color: #60a5fa;
  background-color: #334155;
}

.dark-toolbar .stepper-button:active {
  background-color: #475569;
}

.dark-toolbar .stepper-value {
  background-color: #1e293b;
  color: #f1f5f9;
}

.dark-toolbar .stepper-value:focus {
  border-bottom: 1px solid #60a5fa;
}

/* 改进的响应式布局优化 */
@media (max-width: 950px) {
  .toolbar {
    justify-content: space-around;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .toolbar-group {
    gap: 5px;
  }

  .theme-select,
  .language-select,
  .font-size-select,
  .font-family-select {
    width: auto;
  }

  .action-buttons {
    margin-left: auto;
  }

  .filename-input {
    width: 100px;
  }
}

@media (max-width: 600px) {
  .padding-stepper-container {
    width: 100%;
  }

  .stepper-input {
    width: 90px;
  }

  .toolbar-button .button-text {
    display: none;
  }

  .toolbar-button {
    padding: 4px;
    width: 28px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .toolbar {
    padding: 6px 8px;
  }

  .toolbar-left,
  .toolbar-right,
  .toolbar-group {
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 4px;
  }

  .select-wrapper {
    flex: 1;
    min-width: 80px;
  }

  .filename-input {
    width: 80px;
  }
}

.filename-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.filename-input {
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
  height: 28px;
  box-sizing: border-box;
  outline: none;
  transition: all 0.2s ease;
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  width: 120px;
}

.filename-input:hover {
  border-color: #cbd5e1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filename-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* 暗色主题下的文件名输入框样式 */
.dark-toolbar .filename-input {
  background-color: #1e293b;
  border-color: #475569;
  color: #f1f5f9;
}

.dark-toolbar .filename-input:hover {
  border-color: #64748b;
}

.dark-toolbar .filename-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}
</style>
