import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { php } from '@codemirror/lang-php'
import { rust } from '@codemirror/lang-rust'
import { sql } from '@codemirror/lang-sql'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { json } from '@codemirror/lang-json'
import type { Language } from '../types/editor'
import type { Extension } from '@codemirror/state'

// 语言检测函数
const detectLanguage = (code: string): string => {
  // 简单的语言特征检测
  const features = {
    javascript: [/^const\s|^let\s|^var\s|=>|function\s|console\.|import\s.*from/m],
    typescript: [/^interface\s|^type\s|:\s*(string|number|boolean)|<.*>/m],
    python: [/^def\s|^import\s.*|^from\s.*import|:\s*$/m],
    java: [/public\s+class|private\s+|protected\s+|System\.|void\s+main/m],
    cpp: [/#include\s*<|using\s+namespace|::|->|std::/m],
    php: [/<\?php|\$[a-zA-Z_]|echo\s|namespace\s/m],
    rust: [/fn\s+main|let\s+mut|::\s*|impl\s+|pub\s+/m],
    sql: [/SELECT\s|INSERT\s|UPDATE\s|DELETE\s|CREATE\s|DROP\s/i],
    html: [/<html|<div|<p|<body|<head|<script/i],
    css: [/\{[\s\S]*?\}|@media|#[a-zA-Z]|^\.[a-zA-Z]/m],
    json: [/^\s*\{[\s\S]*\}\s*$|^\s*\[[\s\S]*\]\s*$/m],
  }

  for (const [lang, patterns] of Object.entries(features)) {
    if (patterns.some((pattern) => pattern.test(code))) {
      return lang
    }
  }

  return 'javascript' // 默认返回 JavaScript
}

export const languages: Language[] = [
  {
    name: 'auto',
    label: '自动识别',
    extension: javascript(), // 默认使用 JavaScript，会在实际使用时根据内容更新
  },
  {
    name: 'javascript',
    label: 'JavaScript',
    extension: javascript(),
  },
  {
    name: 'typescript',
    label: 'TypeScript',
    extension: javascript({ typescript: true }),
  },
  {
    name: 'python',
    label: 'Python',
    extension: python(),
  },
  {
    name: 'java',
    label: 'Java',
    extension: java(),
  },
  {
    name: 'cpp',
    label: 'C++',
    extension: cpp(),
  },
  {
    name: 'php',
    label: 'PHP',
    extension: php(),
  },
  {
    name: 'rust',
    label: 'Rust',
    extension: rust(),
  },
  {
    name: 'sql',
    label: 'SQL',
    extension: sql(),
  },
  {
    name: 'html',
    label: 'HTML',
    extension: html(),
  },
  {
    name: 'css',
    label: 'CSS',
    extension: css(),
  },
  {
    name: 'json',
    label: 'JSON',
    extension: json(),
  },
]

export const getLanguageByName = (name: string, code?: string): Language => {
  if (name === 'auto' && code) {
    const detectedLang = detectLanguage(code)
    const language = languages.find((l) => l.name === detectedLang)
    if (language) {
      return {
        ...language,
        label: `自动识别 (${language.label})`,
      }
    }
  }

  const language = languages.find((l) => l.name === name)
  if (!language) {
    throw new Error(`Language ${name} not found`)
  }
  return language
}
