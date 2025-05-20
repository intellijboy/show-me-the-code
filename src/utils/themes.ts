import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import type { EditorTheme } from '../types/editor'

// 亮色主题优化
const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: '#f8f9fa',
    color: '#24292e',
  },
  '.cm-content': {
    caretColor: '#24292e',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#24292e',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#d7d4f0',
  },
  '.cm-gutters': {
    backgroundColor: '#f0f0f0',
    color: '#6e7781',
    border: 'none',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '.cm-lineNumbers': {
    color: '#6e7781',
  },
})

// 深色主题
const darkTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
  },
  '.cm-content': {
    caretColor: '#d4d4d4',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#d4d4d4',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#264f78',
  },
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    color: '#858585',
    border: 'none',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  '.cm-lineNumbers': {
    color: '#858585',
  },
})

// GitHub主题
const githubTheme = EditorView.theme({
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
    backgroundColor: '#d7d4f0',
  },
  '.cm-gutters': {
    backgroundColor: '#f6f8fa',
    color: '#6e7781',
    border: 'none',
  },
  '.cm-activeLine': {
    backgroundColor: '#f6f8fa',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f6f8fa',
  },
  '.cm-lineNumbers': {
    color: '#6e7781',
  },
})

// Monokai主题
const monokaiTheme = EditorView.theme({
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  '.cm-gutters': {
    backgroundColor: '#272822',
    color: '#75715e',
    border: 'none',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  '.cm-lineNumbers': {
    color: '#75715e',
  },
})

export const themes: EditorTheme[] = [
  {
    name: 'oneDark',
    label: 'One Dark',
    extension: oneDark,
    background: '#282c34',
    isDark: true,
  },
  {
    name: 'dark',
    label: '深色',
    extension: darkTheme,
    background: '#1e1e1e',
    isDark: true,
  },
  {
    name: 'monokai',
    label: 'Monokai',
    extension: monokaiTheme,
    background: '#272822',
    isDark: true,
  },
  {
    name: 'github',
    label: 'GitHub',
    extension: githubTheme,
    background: '#ffffff',
    isDark: false,
  },
  {
    name: 'light',
    label: '亮色',
    extension: lightTheme,
    background: '#f8f9fa',
    isDark: false,
  },
]

export const getThemeByName = (name: string): EditorTheme => {
  const theme = themes.find((t) => t.name === name)
  if (!theme) {
    throw new Error(`Theme ${name} not found`)
  }
  return theme
}
