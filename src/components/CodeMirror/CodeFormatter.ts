import * as prettier from 'prettier/standalone'
import type { Options as PrettierOptions, Plugin } from 'prettier'
import * as parserBabel from 'prettier/parser-babel'
import * as parserTypeScript from 'prettier/parser-typescript'
import * as parserHtml from 'prettier/parser-html'
import * as parserCss from 'prettier/parser-postcss'
import * as parserMarkdown from 'prettier/parser-markdown'
import * as parserEstree from 'prettier/plugins/estree'

interface FormatterConfig {
  // 基础配置
  tabWidth: number
  useTabs: boolean
  printWidth: number

  // 引号配置
  singleQuote: boolean
  jsxSingleQuote: boolean
  quoteProps: 'as-needed' | 'consistent' | 'preserve'

  // 括号和逗号配置
  arrowParens: 'always' | 'avoid'
  bracketSameLine: boolean
  bracketSpacing: boolean
  semi: boolean
  trailingComma: 'none' | 'es5' | 'all'

  // HTML 和 Vue 配置
  htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore'
  vueIndentScriptAndStyle: boolean
  singleAttributePerLine: boolean

  // 其他功能配置
  experimentalTernaries: boolean
  proseWrap: 'always' | 'never' | 'preserve'
  insertPragma: boolean
  requirePragma: boolean
  embeddedLanguageFormatting: 'auto' | 'off'
}

interface ParserConfig {
  name: string
  parser: string
  plugin: Plugin
  aliases?: string[]
  supported: boolean
}

const DEFAULT_CONFIG: FormatterConfig = {
  // 基础配置
  tabWidth: 4,
  useTabs: false,
  printWidth: 80,

  // 引号配置
  singleQuote: true,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',

  // 括号和逗号配置
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: true,
  semi: false,
  trailingComma: 'all',

  // HTML 和 Vue 配置
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  singleAttributePerLine: true,

  // 其他功能配置
  experimentalTernaries: false,
  proseWrap: 'preserve',
  insertPragma: false,
  requirePragma: false,
  embeddedLanguageFormatting: 'auto',
}

export class CodeFormatter {
  private static config: FormatterConfig = { ...DEFAULT_CONFIG }

  // 定义解析器映射关系
  private static readonly parserPluginMap: Record<string, Plugin[]> = {
    babel: [parserEstree as unknown as Plugin, parserBabel as unknown as Plugin],
    typescript: [
      parserEstree as unknown as Plugin,
      parserBabel as unknown as Plugin,
      parserTypeScript as unknown as Plugin,
    ],
    html: [
      parserEstree as unknown as Plugin,
      parserBabel as unknown as Plugin,
      parserHtml as unknown as Plugin,
    ],
    css: [parserCss as unknown as Plugin],
    markdown: [
      parserEstree as unknown as Plugin,
      parserBabel as unknown as Plugin,
      parserMarkdown as unknown as Plugin,
    ],
    javascript: [parserEstree as unknown as Plugin, parserBabel as unknown as Plugin],
    json: [parserEstree as unknown as Plugin, parserBabel as unknown as Plugin],
    'json-stringify': [parserEstree as unknown as Plugin, parserBabel as unknown as Plugin],
    vue: [
      parserEstree as unknown as Plugin,
      parserBabel as unknown as Plugin,
      parserHtml as unknown as Plugin,
    ],
  }

  private static readonly parsers: Record<string, ParserConfig> = {
    javascript: {
      name: 'javascript',
      parser: 'babel',
      plugin: parserBabel as unknown as Plugin,
      aliases: ['js', 'jsx', 'javascript', 'mjs', 'cjs'],
      supported: true,
    },
    typescript: {
      name: 'typescript',
      parser: 'babel-ts',
      plugin: parserTypeScript as unknown as Plugin,
      aliases: ['ts', 'tsx', 'typescript', 'mts', 'cts'],
      supported: true,
    },
    html: {
      name: 'html',
      parser: 'html',
      plugin: parserHtml as unknown as Plugin,
      aliases: ['html', 'htm', 'xhtml'],
      supported: true,
    },
    vue: {
      name: 'vue',
      parser: 'babel',
      plugin: parserHtml as unknown as Plugin,
      aliases: ['vue'],
      supported: true,
    },
    css: {
      name: 'css',
      parser: 'css',
      plugin: parserCss as unknown as Plugin,
      aliases: ['css', 'scss', 'less', 'pcss', 'postcss'],
      supported: true,
    },
    json: {
      name: 'json',
      parser: 'babel',
      plugin: parserBabel as unknown as Plugin,
      aliases: ['json', 'jsonc', 'json5'],
      supported: true,
    },
    markdown: {
      name: 'markdown',
      parser: 'markdown',
      plugin: parserMarkdown as unknown as Plugin,
      aliases: ['md', 'markdown', 'mkd'],
      supported: true,
    },
    // 不支持的语言配置
    python: {
      name: 'python',
      parser: 'python',
      plugin: parserBabel as unknown as Plugin,
      aliases: ['py', 'python'],
      supported: false,
    },
    cpp: {
      name: 'cpp',
      parser: 'cpp',
      plugin: parserBabel as unknown as Plugin,
      aliases: ['c', 'cpp', 'h', 'hpp'],
      supported: false,
    },
    java: {
      name: 'java',
      parser: 'java',
      plugin: parserBabel as unknown as Plugin,
      aliases: ['java'],
      supported: false,
    },
  }

  private static getParserConfig(language: string): ParserConfig {
    // 规范化语言名称
    const normalizedLang = language.toLowerCase().trim()

    // 直接匹配
    const directMatch = Object.values(this.parsers).find(
      (config) => config.name === normalizedLang || config.aliases?.includes(normalizedLang),
    )

    if (directMatch) {
      return directMatch
    }

    // 扩展名匹配
    const extensionMatch = Object.values(this.parsers).find((config) =>
      config.aliases?.some((alias) => normalizedLang.endsWith(`.${alias}`)),
    )

    if (extensionMatch) {
      return extensionMatch
    }

    // 默认返回 JavaScript 解析器
    console.log(`未找到语言 ${language} 的解析器配置，使用 JavaScript 解析器`)
    return this.parsers.javascript
  }

  private static getIndentString(): string {
    return this.config.useTabs ? '\t' : ' '.repeat(this.config.tabWidth)
  }

  private static getPrettierOptions(parserConfig: ParserConfig): PrettierOptions {
    // 获取对应的解析器插件
    const plugins = this.parserPluginMap[parserConfig.parser] || []
    if (plugins.length === 0) {
      console.warn(`找不到解析器 ${parserConfig.parser} 对应的插件，将使用基本格式化`)
    }

    // 创建基础配置
    const options: PrettierOptions = {
      parser: parserConfig.parser,
      plugins: plugins as Plugin[],
      ...this.config,
    }

    // 根据文件类型调整配置
    if (parserConfig.name === 'html' || parserConfig.name === 'vue') {
      options.htmlWhitespaceSensitivity = 'css'
      options.vueIndentScriptAndStyle = true
    }

    if (parserConfig.name === 'markdown') {
      options.proseWrap = 'preserve'
    }

    // 特殊处理 TypeScript
    if (parserConfig.name === 'typescript') {
      options.parser = 'babel-ts'
    }

    // 特殊处理 JSON
    if (parserConfig.name === 'json') {
      options.parser = 'json-stringify'
    }

    // 打印详细的配置信息
    console.log('Prettier 配置详情:', {
      parser: options.parser,
      plugins: `已加载 ${plugins.length} 个插件`,
      semi: options.semi,
      singleQuote: options.singleQuote,
      trailingComma: options.trailingComma,
      tabWidth: options.tabWidth,
    })

    return options
  }

  static async formatCode(code: string, language: string): Promise<string> {
    try {
      console.log('开始格式化代码，语言:', language)
      const parserConfig = this.getParserConfig(language)

      // 检查语言是否支持
      if (!parserConfig.supported) {
        console.log('不支持的语言类型:', language)
        return this.formatIndentation(code) // 直接返回基本缩进格式化结果
      }

      const prettierOptions = this.getPrettierOptions(parserConfig)

      // 对于 JSON 格式，使用特殊处理
      if (parserConfig.name === 'json') {
        try {
          console.log('尝试使用 JSON.stringify 格式化')
          const parsedJson = JSON.parse(code)
          return JSON.stringify(parsedJson, null, this.config.tabWidth)
        } catch (error) {
          const err = error as Error
          console.log('JSON.stringify 失败，使用 Prettier 格式化', err.message)
          // 确保使用正确的 JSON 解析器
          return await prettier.format(code, {
            ...prettierOptions,
            parser: 'json-stringify',
            plugins: [parserBabel as Plugin],
          })
        }
      }

      // 使用 Prettier 格式化代码
      const formattedCode = await prettier.format(code, prettierOptions)
      console.log('格式化完成')
      return formattedCode
    } catch (error) {
      const err = error as Error
      console.warn('格式化警告:', err.message)
      // 如果格式化失败，返回基本缩进格式化结果
      return this.formatIndentation(code)
    }
  }

  private static formatIndentation(code: string): string {
    const lines = code.split('\n')
    let indent = 0
    const indentStr = this.getIndentString()
    const openBrackets = ['{', '[', '(']
    const closeBrackets = ['}', ']', ')']

    return lines
      .map((line) => {
        const trimmedLine = line.trim()

        if (!trimmedLine) {
          return ''
        }

        if (closeBrackets.includes(trimmedLine[0])) {
          indent = Math.max(0, indent - 1)
        }

        const currentIndent = indent

        if (openBrackets.includes(trimmedLine[trimmedLine.length - 1])) {
          indent++
        }

        if (trimmedLine.length > 1) {
          const lastChar = trimmedLine[trimmedLine.length - 1]
          const firstChar = trimmedLine[0]
          if (closeBrackets.includes(firstChar) && openBrackets.includes(lastChar)) {
            return indentStr.repeat(Math.max(0, currentIndent - 1)) + trimmedLine
          }
        }

        return indentStr.repeat(currentIndent) + trimmedLine
      })
      .join('\n')
  }
}
