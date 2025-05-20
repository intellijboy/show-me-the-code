import type { Extension } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'

export interface EditorTheme {
  name: string
  label: string
  extension: Extension
  background: string
  isDark: boolean
}

export interface Language {
  name: string
  label: string
  extension: Extension
}

export interface EditorConfig {
  theme: EditorTheme
  language: Language
  code: string
  readOnly?: boolean
  lineNumbers?: boolean
  lineWrapping?: boolean
}

// 扩展 Extension 类型
declare global {
  interface EditorExtension extends Extension {
    of: <T>(value: T) => Extension
  }
}
