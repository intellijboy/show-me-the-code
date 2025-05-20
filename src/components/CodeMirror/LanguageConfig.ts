import type { Extension } from '@codemirror/state'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { php } from '@codemirror/lang-php'
import { rust } from '@codemirror/lang-rust'
import { sql } from '@codemirror/lang-sql'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { xml } from '@codemirror/lang-xml'
import { markdown } from '@codemirror/lang-markdown'
import { json } from '@codemirror/lang-json'
import { yaml } from '@codemirror/lang-yaml'

export type LanguageType =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'cpp'
  | 'java'
  | 'php'
  | 'rust'
  | 'sql'
  | 'html'
  | 'css'
  | 'xml'
  | 'markdown'
  | 'json'
  | 'yaml'
  | 'auto'

// 支持的语言映射
export const supportedLanguages: Record<string, Exclude<LanguageType, 'auto'>> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  php: 'php',
  rust: 'rust',
  sql: 'sql',
  html: 'html',
  css: 'css',
  xml: 'xml',
  markdown: 'markdown',
  json: 'json',
  yaml: 'yaml',
}

// 语言检测函数
export function detectLanguageType(code: string): Exclude<LanguageType, 'auto'> {
  try {
    // 使用 highlight.js 进行语言检测
    const result = hljs.highlightAuto(code, Object.keys(supportedLanguages))

    // 如果检测到语言且在支持列表中，返回对应的语言
    if (result.language && supportedLanguages[result.language]) {
      return supportedLanguages[result.language]
    }

    // 如果检测到语言但不在支持列表中，返回默认语言
    return 'java'
  } catch (error) {
    console.error('Language detection error:', error)
    return 'java'
  }
}

// 语言配置
export const languages = {
  javascript: () => javascript(),
  typescript: () => javascript({ typescript: true }),
  python: () => python(),
  cpp: () => cpp(),
  java: () => java(),
  php: () => php(),
  rust: () => rust(),
  sql: () => sql(),
  html: () => html(),
  css: () => css(),
  xml: () => xml(),
  markdown: () => markdown(),
  json: () => json(),
  yaml: () => yaml(),
} as const

export function detectLanguage(code: string): Extension {
  const langType = detectLanguageType(code)
  return languages[langType]()
}
