import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'

export type ThemeType = 'oneDark' | 'dark' | 'light' | 'github' | 'monokai'

export interface ThemeConfig {
  extension: Extension
  background: string
  foreground: string
  name: string
  description: string
  isDark: boolean
}

export const themeConfigs: Record<ThemeType, ThemeConfig> = {
  oneDark: {
    extension: oneDark,
    background: '#282c34',
    foreground: '#abb2bf',
    name: 'One Dark',
    description: '深色主题，基于 Atom One Dark',
    isDark: true,
  },
  dark: {
    extension: EditorView.theme({
      '&': {
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
      },
      '.cm-content': {
        caretColor: '#fff',
      },
      '&.cm-focused .cm-cursor': {
        borderLeftColor: '#fff',
      },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: '#264f78',
      },
      '.cm-gutters': {
        backgroundColor: '#1e1e1e',
        color: '#858585',
        border: 'none',
      },
      '.cm-activeLineGutter': {
        backgroundColor: '#2a2d2e',
      },
      '.cm-activeLine': {
        backgroundColor: '#2a2d2e',
      },
      '.cm-line': {
        color: '#d4d4d4',
      },
    }),
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    name: 'Dark',
    description: '经典深色主题',
    isDark: true,
  },
  light: {
    extension: EditorView.theme({
      '&': {
        backgroundColor: '#f8fafc',
        color: '#334155',
      },
      '.cm-content': {
        caretColor: '#334155',
      },
      '&.cm-focused .cm-cursor': {
        borderLeftColor: '#334155',
      },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: '#bfdbfe',
      },
      '.cm-gutters': {
        backgroundColor: '#f1f5f9',
        color: '#64748b',
        border: 'none',
        borderRight: '1px solid #e2e8f0',
      },
      '.cm-activeLineGutter': {
        backgroundColor: '#e2e8f0',
        color: '#334155',
      },
      '.cm-activeLine': {
        backgroundColor: '#f8f9fc',
      },
      '.cm-line': {
        color: '#334155',
        fontSize: '14px',
      },
      '.cm-matchingBracket': {
        backgroundColor: '#dbeafe',
        color: '#0f172a',
        fontWeight: 'bold',
      },
      '.cm-keyword': { color: '#2563eb' },
      '.cm-operator': { color: '#475569' },
      '.cm-variable-2': { color: '#0f766e' },
      '.cm-variable': { color: '#334155' },
      '.cm-property': { color: '#0369a1' },
      '.cm-string': { color: '#16a34a' },
      '.cm-number': { color: '#9333ea' },
      '.cm-comment': { color: '#64748b', fontStyle: 'italic' },
      '.cm-function': { color: '#0284c7' },
      '.cm-tag': { color: '#db2777' },
      '.cm-attribute': { color: '#0891b2' },
      '.cm-punctuation': { color: '#64748b' },
    }),
    background: '#f8fafc',
    foreground: '#334155',
    name: 'Light',
    description: '现代亮色主题',
    isDark: false,
  },
  github: {
    extension: EditorView.theme({
      '&': {
        backgroundColor: '#ffffff',
        color: '#24292e',
      },
      '.cm-content': {
        caretColor: '#24292e',
      },
      '&.cm-focused .cm-cursor': {
        borderLeftColor: '#24292e',
      },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: '#0366d625',
      },
      '.cm-gutters': {
        backgroundColor: '#ffffff',
        color: '#6e7781',
        border: 'none',
        borderRight: '1px solid #d0d7de',
      },
      '.cm-activeLineGutter': {
        backgroundColor: '#f6f8fa',
      },
      '.cm-activeLine': {
        backgroundColor: '#f6f8fa',
      },
      '.cm-line': {
        color: '#24292e',
        fontSize: '14px',
      },
      '.cm-matchingBracket': {
        backgroundColor: '#ddf4ff',
        color: '#24292e',
      },
      '.cm-keyword': { color: '#cf222e' },
      '.cm-operator': { color: '#24292e' },
      '.cm-variable-2': { color: '#116329' },
      '.cm-variable': { color: '#953800' },
      '.cm-property': { color: '#0550ae' },
      '.cm-string': { color: '#0a3069' },
      '.cm-number': { color: '#0550ae' },
      '.cm-comment': { color: '#6e7781', fontStyle: 'italic' },
      '.cm-function': { color: '#8250df' },
    }),
    background: '#ffffff',
    foreground: '#24292e',
    name: 'GitHub',
    description: 'GitHub 风格主题',
    isDark: false,
  },
  monokai: {
    extension: EditorView.theme({
      '&': {
        backgroundColor: '#272822',
        color: '#f8f8f2',
      },
      '.cm-content': {
        caretColor: '#f8f8f2',
      },
      '&.cm-focused .cm-cursor': {
        borderLeftColor: '#f8f8f2',
      },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: '#49483e',
      },
      '.cm-gutters': {
        backgroundColor: '#272822',
        color: '#75715e',
        border: 'none',
      },
      '.cm-activeLineGutter': {
        backgroundColor: '#3e3d32',
      },
      '.cm-activeLine': {
        backgroundColor: '#3e3d32',
      },
      '.cm-line': {
        color: '#f8f8f2',
      },
      '.cm-matchingBracket': {
        backgroundColor: '#3e3d32',
        color: '#f8f8f2',
      },
      '.cm-keyword': { color: '#f92672' },
      '.cm-operator': { color: '#f8f8f2' },
      '.cm-variable-2': { color: '#66d9ef' },
      '.cm-variable': { color: '#f8f8f2' },
      '.cm-property': { color: '#a6e22e' },
      '.cm-string': { color: '#e6db74' },
      '.cm-number': { color: '#ae81ff' },
      '.cm-comment': { color: '#75715e', fontStyle: 'italic' },
      '.cm-function': { color: '#a6e22e' },
    }),
    background: '#272822',
    foreground: '#f8f8f2',
    name: 'Monokai',
    description: '经典 Monokai 主题',
    isDark: true,
  },
}
