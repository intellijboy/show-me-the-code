<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from '@codemirror/basic-setup'
import type { EditorConfig } from '../types/editor'
import { themes, getThemeByName } from '../utils/themes'
import { languages, getLanguageByName } from '../utils/languages'

const props = withDefaults(
  defineProps<{
    modelValue: string
    language?: string
    theme?: string
    readOnly?: boolean
    lineNumbers?: boolean
    lineWrapping?: boolean
    fontSize?: number
  }>(),
  {
    language: 'auto',
    theme: 'oneDark',
    readOnly: false,
    lineNumbers: true,
    lineWrapping: true,
    fontSize: 14,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:language', value: string): void
  (e: 'update:theme', value: string): void
  (e: 'update:fontSize', value: number): void
}>()

const editorRef = ref<HTMLDivElement>()
const editorContainerRef = ref<HTMLDivElement>()
let view: EditorView | undefined
const isFormatting = ref(false)

const selectedTheme = computed({
  get: () => props.theme,
  set: (value) => emit('update:theme', value),
})

const selectedLanguage = computed({
  get: () => props.language,
  set: (value) => emit('update:language', value),
})

const fontSizeOptions = [12, 14, 16, 18, 20, 24]
const selectedFontSize = computed({
  get: () => props.fontSize,
  set: (value) => emit('update:fontSize', value),
})

const createEditor = (config: EditorConfig) => {
  if (!editorRef.value) return

  const extensions = [basicSetup, config.theme.extension, config.language.extension]

  if (config.readOnly !== undefined) {
    extensions.push(EditorView.contentAttributes.of({ contenteditable: String(!config.readOnly) }))
  }

  if (config.lineWrapping !== undefined) {
    extensions.push(
      EditorView.contentAttributes.of({ 'white-space': config.lineWrapping ? 'pre-wrap' : 'pre' }),
    )
  }

  if (props.fontSize) {
    const fontSizeTheme = EditorView.theme({
      '.cm-content': {
        fontSize: `${props.fontSize}px`,
        lineHeight: '1.6',
      },
      '.cm-gutters': {
        fontSize: `${props.fontSize - 2}px`,
      },
    })
    extensions.push(fontSizeTheme)
  }

  const state = EditorState.create({
    doc: config.code,
    extensions,
  })

  view = new EditorView({
    parent: editorRef.value,
    state,
    dispatch: (tr) => {
      view?.update([tr])
      if (tr.docChanged) {
        emit('update:modelValue', tr.state.doc.toString())
      }
    },
  })
}

const updateEditor = () => {
  const config: EditorConfig = {
    code: props.modelValue,
    theme: getThemeByName(props.theme),
    language: getLanguageByName(props.language, props.modelValue),
    readOnly: props.readOnly,
    lineNumbers: props.lineNumbers,
    lineWrapping: props.lineWrapping,
  }

  if (view) {
    view.destroy()
  }
  createEditor(config)
}

// 复制代码到剪贴板
const copyCode = () => {
  if (props.modelValue) {
    navigator.clipboard
      .writeText(props.modelValue)
      .then(() => {
        showNotification('代码已复制到剪贴板')
      })
      .catch((err) => {
        console.error('复制失败:', err)
        showNotification('复制失败，请手动复制', 'error')
      })
  }
}

// 格式化代码
const formatCode = async () => {
  if (isFormatting.value || !props.modelValue) return

  isFormatting.value = true

  try {
    // 这里可以根据语言类型使用不同的格式化库
    const formattedCode = await prettifyCode(props.modelValue)
    emit('update:modelValue', formattedCode)
    showNotification('代码格式化成功')
  } catch (error) {
    console.error('格式化失败:', error)
    showNotification('格式化失败，请检查代码语法', 'error')
  } finally {
    isFormatting.value = false
  }
}

// 简单的代码格式化实现，实际项目中可能需要引入更专业的格式化库
const prettifyCode = async (code: string): Promise<string> => {
  // 这里应该根据语言类型使用相应的格式化工具
  // 这是一个示例实现，实际项目可能需要使用如prettier等专业格式化库
  return new Promise((resolve) => {
    // 模拟格式化延迟
    setTimeout(() => {
      // 简单的格式化逻辑，仅用于演示
      const formattedCode = code
        .replace(/\s*\{\s*/g, ' {\n  ')
        .replace(/\s*\}\s*/g, '\n}\n')
        .replace(/\;\s*/g, ';\n')
        .replace(/\,\s*/g, ', ')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/\n\s*\n/g, '\n') // 移除多余空行

      resolve(formattedCode)
    }, 500)
  })
}

// 显示通知消息
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  const notification = document.createElement('div')
  notification.className = `code-notification ${type}`
  notification.textContent = message
  document.body.appendChild(notification)

  // 2秒后自动移除
  setTimeout(() => {
    notification.classList.add('fade-out')
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300) // 等待淡出动画完成
  }, 2000)
}

onMounted(() => {
  updateEditor()

  // 添加全局样式表来控制下拉菜单
  const styleEl = document.createElement('style')
  styleEl.textContent = `
    .dark-theme option, option.dark-theme,
    .dark-header option, option.dark-header {
      background-color: #252526 !important;
      color: #f0f0f0 !important;
    }

    .dark-theme select, select.dark-theme,
    .dark-header select, select.dark-header {
      background-color: #252526 !important;
      color: #f0f0f0 !important;
    }

    select option {
      padding: 8px !important;
    }

    .code-notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #10b981;
      color: white;
      padding: 10px 15px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      transition: opacity 0.3s ease, transform 0.3s ease;
      animation: slide-in 0.3s ease;
    }

    .code-notification.error {
      background-color: #ef4444;
    }

    .code-notification.fade-out {
      opacity: 0;
      transform: translateY(10px);
    }

    @keyframes slide-in {
      from {
        transform: translateY(10px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `
  document.head.appendChild(styleEl)

  // 为所有下拉菜单添加事件监听
  const selects = document.querySelectorAll('select')
  selects.forEach((select) => {
    // 监听下拉菜单打开事件
    select.addEventListener('mousedown', () => {
      // 添加一个小延迟，等待下拉菜单打开
      setTimeout(() => {
        // 获取所有打开的下拉菜单选项
        const options = document.querySelectorAll('option')
        const isDark = document.documentElement.classList.contains('dark-theme')

        options.forEach((option) => {
          if (isDark) {
            option.style.backgroundColor = '#252526'
            option.style.color = '#f0f0f0'
          } else {
            option.style.backgroundColor = '#ffffff'
            option.style.color = '#333333'
          }
        })
      }, 10)
    })
  })
})

watch(
  () => [
    props.modelValue,
    props.theme,
    props.language,
    props.readOnly,
    props.lineNumbers,
    props.lineWrapping,
    props.fontSize,
  ],
  () => {
    updateEditor()
  },
)

// 添加语言图标映射
const languageIcons: Record<string, string> = {
  auto: '🔄',
  javascript: '📜',
  typescript: '💎',
  python: '🐍',
  java: '☕',
  cpp: '⚡',
  php: '🐘',
  rust: '⚙️',
  sql: '🗃️',
  html: '🌐',
  css: '🎨',
  json: '📋',
}

// 计算当前主题是否为深色
const isDarkTheme = computed(() => {
  const theme = getThemeByName(selectedTheme.value)
  return theme.isDark
})

// 为文档根元素添加主题类，用于控制全局元素
watch(
  isDarkTheme,
  (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark-theme')
      document.documentElement.classList.remove('light-theme')
    } else {
      document.documentElement.classList.add('light-theme')
      document.documentElement.classList.remove('dark-theme')
    }
  },
  { immediate: true },
)

// 编辑器内边距设置
const editorPadding = ref({ x: 32, y: 32 })
</script>

<template>
  <div ref="editorContainerRef" class="code-editor">
    <!-- 全局样式注入 -->
    <style>
      select option {
        background-color: #ffffff !important;
        color: #333333 !important;
      }
    </style>

    <div class="editor-header light-header">
      <div class="window-controls">
        <div class="control close"></div>
        <div class="control minimize"></div>
        <div class="control maximize"></div>
      </div>
      <div class="editor-toolbar">
        <div class="toolbar-group">
          <label class="toolbar-label">主题：</label>
          <div class="select-wrapper">
            <select v-model="selectedTheme" class="toolbar-select">
              <option v-for="theme in themes" :key="theme.name" :value="theme.name">
                {{ theme.label }}
              </option>
            </select>
            <div class="select-arrow"></div>
          </div>
        </div>

        <div class="toolbar-group">
          <label class="toolbar-label">语言：</label>
          <div class="select-wrapper">
            <select v-model="selectedLanguage" class="toolbar-select">
              <option v-for="lang in languages" :key="lang.name" :value="lang.name">
                {{ languageIcons[lang.name] }} {{ lang.label }}
              </option>
            </select>
            <div class="select-arrow"></div>
          </div>
        </div>

        <div class="toolbar-group">
          <label class="toolbar-label">字号：</label>
          <div class="select-wrapper">
            <select v-model="selectedFontSize" class="toolbar-select font-size-select">
              <option v-for="size in fontSizeOptions" :key="size" :value="size">
                {{ size }}px
              </option>
            </select>
            <div class="select-arrow"></div>
          </div>
        </div>

        <!-- 内边距控制组件 -->
        <div class="toolbar-group padding-controls">
          <div class="padding-slider-container">
            <label class="toolbar-label">上下边距:</label>
            <input
              type="range"
              min="0"
              max="64"
              step="8"
              v-model="editorPadding.y"
              class="padding-slider"
            />
            <span class="padding-value">{{ editorPadding.y }}px</span>
          </div>
          <div class="padding-slider-container">
            <label class="toolbar-label">左右边距:</label>
            <input
              type="range"
              min="0"
              max="64"
              step="8"
              v-model="editorPadding.x"
              class="padding-slider"
            />
            <span class="padding-value">{{ editorPadding.x }}px</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="toolbar-group action-buttons">
          <button
            class="toolbar-button"
            @click="formatCode"
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
          <button class="toolbar-button" @click="copyCode" title="复制代码">
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
    <div
      ref="editorRef"
      class="editor-content"
      :style="{
        padding: `${editorPadding.y}px ${editorPadding.x}px`,
      }"
    >
      <!-- 移除调整手柄 -->
    </div>
  </div>
</template>

<style>
/* 全局样式，不使用scoped */
option,
select option {
  background-color: #ffffff !important;
  color: #333333 !important;
}

select,
.toolbar-select {
  background-color: rgba(0, 0, 0, 0.05) !important;
  color: #333333 !important;
}
</style>

<style scoped>
:root {
  --option-background-light: #ffffff;
  --option-color-light: #333333;
  --select-bg-color: rgba(0, 0, 0, 0.05);
  --select-text-color: #333333;
}

.code-editor {
  width: 100%;
  height: 100%;
  background-color: v-bind('getThemeByName(selectedTheme).background');
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  min-width: 300px;
  min-height: 200px;
  max-height: 800px;
}

.editor-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.dark-header {
  background-color: #1a1a1a;
  color: #f0f0f0;
  border-bottom: 1px solid #333;
}

.light-header {
  background-color: #f0f0f0;
  color: #333;
  border-bottom: 1px solid #ddd;
}

.window-controls {
  display: flex;
  gap: 6px;
  margin-right: 12px;
  flex-shrink: 0;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.close {
  background-color: #ff5f56;
}

.minimize {
  background-color: #ffbd2e;
}

.maximize {
  background-color: #27c93f;
}

.editor-toolbar {
  display: flex;
  gap: 10px;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.toolbar-label {
  font-size: 12px;
  white-space: nowrap;
}

.select-wrapper {
  position: relative;
  display: inline-block;
}

.toolbar-select {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  padding: 4px 24px 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
  cursor: pointer;
  background-color: var(--select-bg-color);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--select-text-color);
}

.toolbar-select::-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 currentColor;
}

.toolbar-select::-ms-expand {
  display: none;
}

.toolbar-select:focus-visible {
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  outline: none;
}

.toolbar-select:focus option {
  background-color: var(--option-background-light);
  color: var(--option-color-light);
}

.light-header .toolbar-select:focus option {
  background-color: var(--option-background-light);
  color: var(--option-color-light);
}

.dark-header .toolbar-select {
  background-color: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
  color-scheme: light;
}

.light-header .toolbar-select {
  background-color: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
}

.select-arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid rgba(0, 0, 0, 0.6);
}

.dark-header .select-arrow {
  border-top: 4px solid rgba(255, 255, 255, 0.7);
}

.light-header .select-arrow {
  border-top: 4px solid rgba(0, 0, 0, 0.6);
}

.font-size-select {
  width: 60px;
}

.editor-content {
  flex: 1;
  overflow: auto;
  box-sizing: border-box;
  height: 350px; /* 固定高度，替代可调整高度 */
  transition: padding 0.2s ease;
}

:deep(.cm-editor) {
  height: 100%;
}

:deep(.cm-scroller) {
  font-family: 'Fira Code', 'Menlo', 'Monaco', 'Consolas', monospace;
}

/* 滚动条样式 */
:deep(.cm-scroller)::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

:deep(.cm-scroller)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.cm-scroller)::-webkit-scrollbar-thumb {
  border-radius: 4px;
}

.dark-header :deep(.cm-scroller)::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.dark-header :deep(.cm-scroller)::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.light-header :deep(.cm-scroller)::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}

.light-header :deep(.cm-scroller)::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

/* 内边距控制组件样式 */
.padding-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.padding-slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.padding-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  outline: none;
  width: 80px;
  cursor: pointer;
}

.padding-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  transition: transform 0.2s ease;
}

.padding-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  transition: transform 0.2s ease;
}

.padding-slider:hover::-webkit-slider-thumb {
  transform: scale(1.2);
}

.padding-slider:hover::-moz-range-thumb {
  transform: scale(1.2);
}

.padding-value {
  font-size: 12px;
  color: #64748b;
  min-width: 30px;
  text-align: center;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.toolbar-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-button:hover {
  background-color: #e2e8f0;
}

.toolbar-button:disabled {
  opacity: 0.5;
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

.dark-header .toolbar-button {
  background-color: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

.dark-header .toolbar-button:hover {
  background-color: #475569;
}

.dark-header .button-icon {
  color: #94a3b8;
}

.dark-header .padding-slider {
  background: #475569;
}

.dark-header .padding-slider::-webkit-slider-thumb {
  background: #60a5fa;
}

.dark-header .padding-slider::-moz-range-thumb {
  background: #60a5fa;
}

.dark-header .padding-value {
  color: #cbd5e1;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .editor-toolbar {
    flex-wrap: wrap;
  }

  .toolbar-group {
    margin-bottom: 6px;
  }

  .action-buttons {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .button-text {
    display: none;
  }

  .toolbar-button {
    width: 28px;
    height: 28px;
    padding: 0;
    justify-content: center;
  }
}
</style>
