<template>
  <div class="editor-wrapper" :class="theme" :style="containerStyle">
    <div class="window-parent-wrapper" ref="windowParentWrapperRef" :style="wrapperStyle">
      <div class="window-header">
        <div class="window-buttons">
          <span class="button close"></span>
          <span class="button minimize"></span>
          <span class="button maximize"></span>
        </div>
        <div class="window-title">{{ title }}</div>
      </div>
      <div ref="editorContainerRef" class="editor-container" :style="editorStyles"></div>
      <div class="resizer-handle top" @mousedown="startResize($event, 'top')"></div>
      <div class="resizer-handle right" @mousedown="startResize($event, 'right')"></div>
      <div class="resizer-handle bottom" @mousedown="startResize($event, 'bottom')"></div>
      <div class="resizer-handle left" @mousedown="startResize($event, 'left')"></div>
      <div class="resizer-handle top-left" @mousedown="startResize($event, 'top-left')"></div>
      <div class="resizer-handle top-right" @mousedown="startResize($event, 'top-right')"></div>
      <div
        class="resizer-handle bottom-right"
        @mousedown="startResize($event, 'bottom-right')"
      ></div>
      <div class="resizer-handle bottom-left" @mousedown="startResize($event, 'bottom-left')"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CodeMirrorEditorWindow',

  props: {
    title: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'oneDark',
      validator: (value: string) => {
        return ['oneDark', 'dark', 'light', 'github', 'monokai'].includes(value)
      },
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
    editorPadding: {
      type: Object,
      default: () => ({ x: 32, y: 32 }),
    },
    themeBackground: {
      type: String,
      default: '#fff',
    },
  },

  emits: ['editor-mounted'],

  data() {
    return {
      // 窗口容器尺寸
      wrapperSize: {
        width: '100%',
        height: 400,
      },
      // 缩放相关状态
      isResizing: false,
      resizeDirection: '',
      startPosition: { x: 0, y: 0 },
      startSize: { width: 0, height: 0 },
    }
  },

  computed: {
    // 容器样式
    containerStyle() {
      return {
        backgroundColor: this.backgroundColor,
        padding: `${this.editorPadding.y}px ${this.editorPadding.x}px`,
      }
    },

    // 编辑器样式
    editorStyles() {
      return {
        '--editor-font-size': `${this.fontSize}px`,
        '--editor-font-family': this.fontFamily,
      }
    },

    // 窗口包装器样式
    wrapperStyle() {
      return {
        width: `${this.wrapperSize.width}px`,
        height: `${this.wrapperSize.height}px`,
        backgroundColor: this.themeBackground,
      }
    },
  },

  mounted() {
    // 发出编辑器已挂载事件
    this.$emit('editor-mounted', this.$refs.editorContainerRef)
  },

  beforeUnmount() {
    // 清理事件监听
    document.removeEventListener('mousemove', this.handleResize)
    document.removeEventListener('mouseup', this.stopResize)
  },

  methods: {
    // 开始缩放窗口
    startResize(event: MouseEvent, direction: string) {
      this.isResizing = true
      this.resizeDirection = direction
      this.startPosition = { x: event.clientX, y: event.clientY }

      if (this.$refs.windowParentWrapperRef) {
        const el = this.$refs.windowParentWrapperRef as HTMLElement
        this.startSize = {
          width: el.offsetWidth,
          height: el.offsetHeight,
        }
        // 添加调整中的类
        el.classList.add('resizing')
      }

      // 添加全局事件监听
      document.addEventListener('mousemove', this.handleResize)
      document.addEventListener('mouseup', this.stopResize)

      // 阻止默认行为和冒泡
      event.preventDefault()
      event.stopPropagation()
    },

    // 处理缩放过程
    handleResize(event: MouseEvent) {
      if (!this.isResizing) return

      const deltaX = event.clientX - this.startPosition.x
      const deltaY = event.clientY - this.startPosition.y
      const direction = this.resizeDirection

      let newWidth = this.startSize.width
      let newHeight = this.startSize.height

      // 根据不同方向处理尺寸变化
      if (direction.includes('right')) {
        newWidth = Math.max(300, this.startSize.width + deltaX)
      } else if (direction.includes('left')) {
        newWidth = Math.max(300, this.startSize.width - deltaX)
      }

      if (direction.includes('bottom')) {
        newHeight = Math.max(200, this.startSize.height + deltaY)
      } else if (direction.includes('top')) {
        newHeight = Math.max(200, this.startSize.height - deltaY)
      }

      // 更新尺寸
      this.wrapperSize = {
        width: newWidth,
        height: newHeight,
      }
    },

    // 停止缩放
    stopResize() {
      this.isResizing = false
      // 移除全局事件监听
      document.removeEventListener('mousemove', this.handleResize)
      document.removeEventListener('mouseup', this.stopResize)

      // 移除调整中的类
      if (this.$refs.windowParentWrapperRef) {
        const el = this.$refs.windowParentWrapperRef as HTMLElement
        el.classList.remove('resizing')
      }
    },
  },
}
</script>

<style scoped>
.editor-wrapper {
  background-color: var(--color-background-mute);
  display: flex;
  justify-content: center;
  align-items: center;

  /* 滚动条颜色 */
  --scrollbar-color: rgba(127, 127, 127, 0.4);
  --scrollbar-hover-color: rgba(127, 127, 127, 0.6);
}

/* 系统主题自适应 - 仅限滚动条 */
@media (prefers-color-scheme: light) {
  .editor-wrapper {
    --scrollbar-color: rgba(100, 116, 139, 0.4);
    --scrollbar-hover-color: rgba(100, 116, 139, 0.6);
  }
}

@media (prefers-color-scheme: dark) {
  .editor-wrapper {
    --scrollbar-color: rgba(160, 160, 160, 0.3);
    --scrollbar-hover-color: rgba(160, 160, 160, 0.5);
  }
}

/* 主题特定的窗口头部样式 */
.editor-wrapper.oneDark .window-header,
.editor-wrapper.dark .window-header,
.editor-wrapper.monokai .window-header {
  background-color: #2d2d2d;
  border-bottom: 1px solid #3a3a3a;
}

.editor-wrapper.oneDark .window-title,
.editor-wrapper.dark .window-title,
.editor-wrapper.monokai .window-title {
  color: #ffffff;
}

.editor-wrapper.light .window-header {
  background-color: #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
}

.editor-wrapper.light .window-title {
  color: #334155;
}

.editor-wrapper.github .window-header {
  background-color: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
}

.editor-wrapper.github .window-title {
  color: #24292e;
  font-weight: 500;
}

/* 主题特定的容器边框样式 */
.editor-wrapper.oneDark .editor-container,
.editor-wrapper.dark .editor-container,
.editor-wrapper.monokai .editor-container {
  border: 1px solid #2d2d2d;
  border-top: none;
}

.editor-wrapper.light .editor-container {
  border: 1px solid #cbd5e1;
  border-top: none;
}

.editor-wrapper.github .editor-container {
  border: 1px solid #d0d7de;
  border-top: none;
}

/* 固定尺寸的父容器 */
.window-parent-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.05s ease;
}

.window-header {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background-color: #f6f8fa;
}

.window-title {
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin-left: 4px;
}

.editor-container {
  border-radius: 0 0 6px 6px;
  overflow-x: hidden;
  transition: background-color 0.3s ease;
  height: calc(100% - 44px); /* 减去窗口头部的高度 */
  background-color: white;
}

/* 应用字体样式到 CodeMirror 编辑器 */
:deep(.cm-content) {
  font-family: var(--editor-font-family, "'Cascadia Code', monospace") !important;
  font-size: var(--editor-font-size, 14px) !important;
  padding: 12px 0 !important;
}

:deep(.cm-line) {
  font-family: var(--editor-font-family, "'Menlo', Monaco, Consolas, monospace") !important;
  font-size: var(--editor-font-size, 14px) !important;
}

/* 滚动条统一样式 - 基于系统主题自适应 */
:deep(.cm-scroller) {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: transparent transparent; /* Firefox: thumb track */
  scroll-behavior: smooth;
}

.editor-container:hover :deep(.cm-scroller) {
  scrollbar-color: var(--scrollbar-color) transparent; /* Firefox: thumb track */
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
  background-color: transparent;
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.editor-container:hover :deep(.cm-scroller::-webkit-scrollbar-thumb) {
  background-color: var(--scrollbar-color);
}

:deep(.cm-scroller::-webkit-scrollbar-thumb:hover) {
  background-color: var(--scrollbar-hover-color);
}

.window-buttons {
  display: flex;
  gap: 6px;
  margin-right: 16px;
}

.button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  transition: opacity 0.2s;
}

.button:hover {
  opacity: 0.8;
}

.close {
  background-color: #ff5f56;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.minimize {
  background-color: #ffbd2e;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.maximize {
  background-color: #27c93f;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* 调整手柄 */
.resizer-handle {
  position: absolute;
  background: transparent;
  z-index: 20;
  transition: all 0.2s ease;
}

/* 四条边的调整手柄 */
.resizer-handle.top {
  top: 0;
  left: 8px;
  right: 8px;
  height: 8px;
  cursor: n-resize;
}

.resizer-handle.right {
  top: 8px;
  right: 0;
  bottom: 8px;
  width: 8px;
  cursor: e-resize;
}

.resizer-handle.bottom {
  bottom: 0;
  left: 8px;
  right: 8px;
  height: 8px;
  cursor: s-resize;
}

.resizer-handle.left {
  top: 8px;
  left: 0;
  bottom: 8px;
  width: 8px;
  cursor: w-resize;
}

/* 四个角落的调整手柄 */
.resizer-handle.top-left {
  top: 0;
  left: 0;
  width: 14px;
  height: 14px;
  cursor: nw-resize;
  border-top-left-radius: 6px;
}

.resizer-handle.top-right {
  top: 0;
  right: 0;
  width: 14px;
  height: 14px;
  cursor: ne-resize;
  border-top-right-radius: 6px;
}

.resizer-handle.bottom-right {
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  cursor: se-resize;
  border-bottom-right-radius: 6px;
}

.resizer-handle.bottom-left {
  bottom: 0;
  left: 0;
  width: 14px;
  height: 14px;
  cursor: sw-resize;
  border-bottom-left-radius: 6px;
}

/* 调整手柄悬停效果 */
.resizer-handle:hover {
  background-color: rgba(59, 130, 246, 0.5);
}

/* 调整中的样式 */
.resizer-handle:active {
  background-color: rgba(59, 130, 246, 0.7);
}

/* 使用更现代的角落调整手柄，用L形替代黑点 */
.resizer-handle.top-left::before,
.resizer-handle.top-right::before,
.resizer-handle.bottom-right::before,
.resizer-handle.bottom-left::before {
  content: '';
  position: absolute;
  width: 0; /* 初始宽度为0 */
  height: 0; /* 初始高度为0 */
  border-style: solid;
  border-width: 0;
  border-color: transparent; /* 初始状态完全透明 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
  opacity: 0; /* 初始状态透明 */
}

/* 当鼠标悬停在窗口上时显示角落手柄 */
.window-parent-wrapper:hover .resizer-handle.top-left::before,
.window-parent-wrapper:hover .resizer-handle.top-right::before,
.window-parent-wrapper:hover .resizer-handle.bottom-right::before,
.window-parent-wrapper:hover .resizer-handle.bottom-left::before {
  width: 8px; /* 悬停时显示正常宽度 */
  height: 8px; /* 悬停时显示正常高度 */
  border-color: rgba(255, 255, 255, 0.5); /* 悬停时显示颜色 */
  opacity: 1; /* 悬停时完全显示 */
}

/* 为每个角落定制L形状 */
.resizer-handle.top-left::before {
  top: 2px;
  left: 2px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-top-left-radius: 2px;
}

.resizer-handle.top-right::before {
  top: 2px;
  right: 2px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-top-right-radius: 2px;
}

.resizer-handle.bottom-right::before {
  bottom: 2px;
  right: 2px;
  border-bottom-width: 2px;
  border-right-width: 2px;
  border-bottom-right-radius: 2px;
}

.resizer-handle.bottom-left::before {
  bottom: 2px;
  left: 2px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-bottom-left-radius: 2px;
}

/* 当鼠标靠近窗口边缘时显示手柄提示 */
.window-parent-wrapper:hover .resizer-handle.top,
.window-parent-wrapper:hover .resizer-handle.right,
.window-parent-wrapper:hover .resizer-handle.bottom,
.window-parent-wrapper:hover .resizer-handle.left {
  background-color: rgba(59, 130, 246, 0.15);
}

/* 暗色主题适配 */
.editor-wrapper.oneDark .resizer-handle::before,
.editor-wrapper.dark .resizer-handle::before,
.editor-wrapper.monokai .resizer-handle::before {
  border-color: transparent; /* 初始状态透明 */
}

.editor-wrapper.oneDark .window-parent-wrapper:hover .resizer-handle::before,
.editor-wrapper.dark .window-parent-wrapper:hover .resizer-handle::before,
.editor-wrapper.monokai .window-parent-wrapper:hover .resizer-handle::before {
  border-color: rgba(200, 200, 200, 0.4);
}

/* 亮色主题适配 */
.editor-wrapper.light .resizer-handle::before,
.editor-wrapper.github .resizer-handle::before {
  border-color: transparent; /* 初始状态透明 */
}

.editor-wrapper.light .window-parent-wrapper:hover .resizer-handle::before,
.editor-wrapper.github .window-parent-wrapper:hover .resizer-handle::before {
  border-color: rgba(100, 100, 100, 0.3);
}

/* 悬停效果增强 */
.window-parent-wrapper:hover .resizer-handle::before {
  border-color: rgba(59, 130, 246, 0.6);
  width: 10px;
  height: 10px;
}

/* 调整中的样式 - 使手柄更明显 */
.window-parent-wrapper.resizing .resizer-handle::before {
  border-color: rgba(59, 130, 246, 0.8) !important;
  width: 12px !important;
  height: 12px !important;
  opacity: 1 !important;
}

/* 去掉 has 选择器，兼容性更好 */
.window-parent-wrapper.resizing {
  transition: none;
}

.editor-wrapper.oneDark .window-parent-wrapper,
.editor-wrapper.dark .window-parent-wrapper,
.editor-wrapper.monokai .window-parent-wrapper {
  background: #23272e;
}

.editor-wrapper.light .window-parent-wrapper,
.editor-wrapper.github .window-parent-wrapper {
  background: #f6f8fa;
}
</style>
