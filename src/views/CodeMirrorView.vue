<template>
  <div class="carbon-wrapper">
    <div class="slogan-container">
      <div class="slogan-text">
        <span class="slogan-quote">"</span>
        <span class="slogan-main">Talk is cheap.</span>
        <span class="slogan-highlight">Show me the code.</span>
        <span class="slogan-quote">"</span>
        <div class="slogan-author">— Linus Torvalds</div>
      </div>
    </div>
    <div class="carbon-container">
      <Toolbar
        v-model:theme="selectedTheme"
        v-model:language="selectedLanguage"
        v-model:fileName="editorTitle"
        :backgroundColor="editorBackgroundColor"
        :fontSize="editorFontSize"
        :fontFamily="editorFontFamily"
        :padding="editorPadding"
        :is-formatting="isFormatting"
        @update:backgroundColor="editorBackgroundColor = $event"
        @update:fontSize="editorFontSize = $event"
        @update:fontFamily="editorFontFamily = $event"
        @update:padding="updatePadding"
        @format="formatCode"
        @copy:start="handleCopyStart"
        @copy:success="handleCopySuccess"
        @copy:error="handleCopyError"
      />
      <EditorWindow
        :title="editorTitle"
        :theme="selectedTheme"
        :backgroundColor="editorBackgroundColor"
        :fontSize="editorFontSize"
        :fontFamily="editorFontFamily"
        :editorPadding="editorPadding"
        :themeBackground="themeConfigs[selectedTheme].background"
        @editor-mounted="initializeEditor"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import {
  bracketMatching,
  defaultHighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language'
import { EditorState, StateEffect } from '@codemirror/state'
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightSpecialChars,
  keymap,
  rectangularSelection,
  ViewUpdate,
} from '@codemirror/view'

import Toolbar from '../components/CodeMirror/Toolbar.vue'
import EditorWindow from '../components/CodeMirror/EditorWindow.vue'
import { themeConfigs, type ThemeType } from '../components/CodeMirror/ThemeConfig'
import {
  detectLanguage,
  detectLanguageType,
  languages,
  type LanguageType,
} from '../components/CodeMirror/LanguageConfig'
import { CodeFormatter } from '../components/CodeMirror/CodeFormatter'
import { helloWorldExamples } from '../components/CodeMirror/HelloWorldExamples'

export default defineComponent({
  name: 'CodeMirrorView',
  components: {
    Toolbar,
    EditorWindow,
  },
  data() {
    return {
      editor: null as EditorView | null,
      selectedTheme: 'github' as ThemeType,
      selectedLanguage: 'java' as LanguageType,
      detectedLanguage: 'java' as LanguageType,
      lastContent: helloWorldExamples.java as string,
      isFormatting: false,
      editorTitle: 'HelloWorld.java',
      editorBackgroundColor: '#d5e1d5',
      editorFontSize: 14,
      editorFontFamily: "'Cascadia Code', monospace",
      editorPadding: { x: 32, y: 30 },
      themeConfigs,
    }
  },
  watch: {
    selectedTheme() {
      if (this.editor) {
        this.editor.dispatch({
          effects: StateEffect.reconfigure.of(this.getEditorExtensions()),
        })
      }
    },
    selectedLanguage() {
      if (this.editor) {
        const content = this.editor.state.doc.toString()
        // 更新检测到的语言
        this.detectedLanguage =
          this.selectedLanguage === 'auto'
            ? detectLanguageType(content)
            : (this.selectedLanguage as Exclude<LanguageType, 'auto'>)

        // 更新编辑器配置
        this.editor.dispatch({
          effects: StateEffect.reconfigure.of(this.getEditorExtensions()),
        })

        // 更新示例代码
        if (this.selectedLanguage !== 'auto') {
          const newContent =
            helloWorldExamples[this.selectedLanguage as Exclude<LanguageType, 'auto'>]
          this.editor.dispatch({
            changes: {
              from: 0,
              to: this.editor.state.doc.length,
              insert: newContent,
            },
          })
          // 更新文件名
          this.updateFileNameForLanguage(this.selectedLanguage as Exclude<LanguageType, 'auto'>)
        }
      }
    },
    editorBackgroundColor(newColor) {
      console.log('背景色变更:', newColor)
      // 这里不需要重新配置编辑器，因为背景色是通过内联样式应用的
    },
    editorFontSize(newSize) {
      console.log('编辑器字体大小变更:', newSize)
      if (this.editor) {
        this.editor.dispatch({
          effects: StateEffect.reconfigure.of(this.getEditorExtensions()),
        })
      }
    },
    editorFontFamily(newFamily) {
      console.log('编辑器字体变更:', newFamily)
      if (this.editor) {
        this.editor.dispatch({
          effects: StateEffect.reconfigure.of(this.getEditorExtensions()),
        })
      }
    },
  },
  methods: {
    async formatCode() {
      if (this.isFormatting || !this.editor) return

      this.isFormatting = true
      // 保存当前的滚动位置和选择状态
      const scrollPos = this.editor.scrollDOM.scrollTop
      const selection = this.editor.state.selection

      try {
        // 获取当前文档内容
        const doc = this.editor.state.doc
        const code = doc.toString()

        // 格式化代码
        const formattedCode = await CodeFormatter.formatCode(code, this.detectedLanguage)

        if (formattedCode !== code && this.editor) {
          // 更新语言检测
          this.detectedLanguage = detectLanguageType(formattedCode)

          console.log('Detected language:', this.detectedLanguage)

          // 使用 dispatch 方法更新文档内容和配置
          this.editor.dispatch({
            changes: {
              from: 0,
              to: doc.length,
              insert: formattedCode,
            },
            selection: {
              anchor: Math.min(selection.main.anchor, formattedCode.length),
              head: Math.min(selection.main.head, formattedCode.length),
            },
            effects: StateEffect.reconfigure.of(this.getEditorExtensions()),
          })

          // 恢复滚动位置
          requestAnimationFrame(() => {
            if (this.editor) {
              this.editor.scrollDOM.scrollTop = scrollPos
            }
          })

          this.showNotification('代码格式化完成', 'success')
        }
      } catch (error) {
        console.error('Format error:', error)
        this.showNotification('格式化失败: ' + (error as Error).message, 'error')

        // 发生错误时，尝试恢复原始状态
        if (this.editor) {
          this.editor.scrollDOM.scrollTop = scrollPos
        }
      } finally {
        this.isFormatting = false
      }
    },

    handleCopyStart() {},

    handleCopySuccess() {
      this.showNotification('图片已复制到剪贴板✓', 'success')
    },

    handleCopyError(message: string) {
      this.showNotification(message || '复制图片失败', 'error')
    },

    showNotification(message: string, type = 'default') {
      const notification = document.createElement('div')
      notification.className = `code-notification ${type}`
      notification.textContent = message
      document.body.appendChild(notification)
      setTimeout(() => {
        notification.classList.add('fade-out')
        setTimeout(() => notification.remove(), 500)
      }, 2000)
    },

    handleEditorUpdate(update: ViewUpdate) {
      if (update.docChanged) {
        const newContent = update.state.doc.toString()
        if (
          this.selectedLanguage === 'auto' &&
          Math.abs(newContent.length - this.lastContent.length) > 10
        ) {
          this.updateLanguageForContent(newContent)
        }
        this.lastContent = newContent
      }
    },

    updateLanguageForContent(content: string) {
      const scrollInfo = this.editor?.scrollDOM.scrollTop || 0
      detectLanguage(content)

      if (this.editor) {
        this.editor.dispatch({
          effects: StateEffect.reconfigure.of(this.getEditorExtensions()),
        })
        this.editor.scrollDOM.scrollTop = scrollInfo
      }
    },

    getEditorExtensions() {
      const theme = themeConfigs[this.selectedTheme]
      const content = this.editor ? this.editor.state.doc.toString() : helloWorldExamples.javascript
      const lang =
        this.selectedLanguage === 'auto'
          ? detectLanguage(content)
          : languages[this.selectedLanguage as Exclude<LanguageType, 'auto'>]()

      return [
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        rectangularSelection(),
        crosshairCursor(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        theme.extension,
        lang,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => this.handleEditorUpdate(update)),
        EditorView.theme({
          '&': {
            backgroundColor: theme.background,
            height: '100%',
          },
          '.cm-content': {
            fontFamily: this.editorFontFamily,
            fontSize: `${this.editorFontSize}px`,
            color: theme.foreground,
            padding: '12px 0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            overflowWrap: 'break-word',
          },
          '.cm-line': {
            padding: '0 8px',
            lineHeight: '1.6',
          },
          '.cm-gutters': {
            backgroundColor: theme.background,
            border: 'none',
            color: '#666',
          },
          '.cm-cursor': {
            borderLeftColor: theme.foreground,
          },
          '.cm-selectionBackground': {
            backgroundColor: theme.name === 'light' ? '#b3d4fc' : '#264f78',
          },
          '.cm-activeLineGutter': {
            backgroundColor: theme.name === 'light' ? '#e5e5e5' : '#2a2d2e',
          },
          '.cm-activeLine': {
            backgroundColor: theme.name === 'light' ? '#f8f8f8' : '#2a2d2e',
          },
        }),
      ]
    },

    initializeEditor(container: HTMLElement) {
      this.editor = new EditorView({
        state: EditorState.create({
          doc: this.lastContent,
          extensions: this.getEditorExtensions(),
        }),
        parent: container,
      })
    },

    updatePadding(newPadding: { x: number; y: number }) {
      this.editorPadding = newPadding
      if (this.editor) {
        this.editor.dispatch({
          effects: StateEffect.reconfigure.of(this.getEditorExtensions()),
        })
      }
    },

    updateFileNameForLanguage(language: Exclude<LanguageType, 'auto'>) {
      const extensions: Record<Exclude<LanguageType, 'auto'>, string> = {
        javascript: 'js',
        typescript: 'ts',
        html: 'html',
        css: 'css',
        json: 'json',
        markdown: 'md',
        python: 'py',
        java: 'java',
        cpp: 'cpp',
        rust: 'rs',
        sql: 'sql',
        xml: 'xml',
        yaml: 'yml',
        properties: 'properties',
        php: 'php',
      }
      this.editorTitle = `HelloWorld.${extensions[language]}`
    },
  },
})
</script>

<style>
.carbon-container {
  max-width: 1000px;
  width: 100%;
  margin: 20px auto;
  background-color: #857878;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

:deep(.cm-editor) {
  background-color: transparent !important;
  border-radius: 4px;
  max-width: 100%;
}

:deep(.cm-scroller) {
  padding: 8px 0;
  overflow-x: hidden !important;
  scrollbar-width: none; /* Firefox 初始状态隐藏 */
  scroll-behavior: smooth;
}

:deep(.cm-editor:hover .cm-scroller) {
  scrollbar-width: thin; /* Firefox 悬停时显示 */
}

:deep(.cm-scroller::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.cm-scroller::-webkit-scrollbar-track) {
  background: transparent;
  border-radius: 3px;
}

:deep(.cm-scroller::-webkit-scrollbar-thumb) {
  background-color: rgba(127, 127, 127, 0); /* 初始状态透明 */
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

:deep(.cm-editor:hover .cm-scroller::-webkit-scrollbar-thumb) {
  background-color: rgba(127, 127, 127, 0.3); /* 悬停时显示 */
}

:deep(.cm-editor:hover .cm-scroller::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(127, 127, 127, 0.5); /* 滚动条悬停效果增强 */
}

:deep(.cm-gutters) {
  background-color: #1a1a1a !important;
  border-right: 1px solid #2d2d2d !important;
  padding-right: 5px;
}

:deep(.cm-content) {
  padding: 0 8px !important;
  white-space: pre-wrap !important;
  word-break: break-all !important;
  overflow-wrap: break-word !important;
}

:deep(.cm-line) {
  padding: 0 8px;
  line-height: 1.6 !important;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.slogan-container {
  text-align: center;
  margin: 40px auto 20px;
  max-width: 800px;
  padding: 0 20px;
}

:root {
  --slogan-main-color: #333;
  --slogan-quote-color: #666;
  --slogan-highlight-color: #2c3e50;
  --slogan-author-color: #666;
}

.slogan-text {
  font-family: 'Georgia', serif;
  font-size: 2.2rem;
  line-height: 1.4;
  color: var(--slogan-main-color, #333);
  position: relative;
  display: inline-block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.08);
  transition: color 0.3s;
}

.slogan-quote {
  font-size: 3rem;
  color: var(--slogan-quote-color, #666);
  font-family: 'Times New Roman', serif;
  vertical-align: -0.2em;
  margin: 0 5px;
  transition: color 0.3s;
}

.slogan-main {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.slogan-highlight {
  font-weight: 700;
  color: var(--slogan-highlight-color, #2c3e50);
  position: relative;
  display: inline-block;
  margin-left: 5px;
  transition: color 0.3s;
}

.slogan-highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: var(linear-gradient(90deg, rgba(44, 62, 80, 0.1), rgba(44, 62, 80, 0.18)));
  z-index: -1;
  border-radius: 4px;
  transition: background 0.3s;
}

.slogan-author {
  font-size: 1.2rem;
  color: var(--slogan-author-color, #666);
  margin-top: 10px;
  font-style: italic;
  letter-spacing: 1px;
  transition: color 0.3s;
}

@media (prefers-color-scheme: dark) {
  .slogan-text {
    color: #f3f3f3;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.25);
  }

  .slogan-quote {
    color: #aaa;
  }

  .slogan-highlight {
    color: #7ecfff;
  }

  .slogan-highlight::after {
    background: linear-gradient(90deg, rgba(126, 207, 255, 0.13), rgba(126, 207, 255, 0.22));
  }

  .slogan-author {
    color: #bbb;
  }
}

.code-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.code-notification.fade-out {
  animation: fadeOut 0.5s ease-out forwards;
}

.code-notification.success {
  background-color: #28a745;
}

.code-notification.error {
  background-color: #dc3545;
}

.code-notification.info {
  background-color: #17a2b8;
}
</style>
