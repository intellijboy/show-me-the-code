import { LanguageType } from './LanguageConfig'

export const helloWorldExamples: Record<Exclude<LanguageType, 'auto'>, string> = {
  javascript: `// 冒泡排序示例
function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++)
        for (let j = 0; j < arr.length - 1 - i; j++)
            if (arr[j] > arr[j + 1])
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    return arr;
}

const nums = [64, 34, 25, 12, 22, 11, 90];
console.log("排序后:", bubbleSort(nums));`,

  typescript: `// 冒泡排序示例
function bubbleSort<T extends number>(arr: T[]): T[] {
    for (let i = 0; i < arr.length - 1; i++)
        for (let j = 0; j < arr.length - 1 - i; j++)
            if (arr[j] > arr[j + 1])
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    return arr;
}

const nums: number[] = [64, 34, 25, 12, 22, 11, 90];
console.log("排序后:", bubbleSort(nums));`,

  html: `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>响应式卡片</title>
    <style>
        .card { background: #f5f5f5; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>欢迎使用</h1>
        <p>这是一个简单的响应式卡片示例。</p>
    </div>
</body>
</html>`,

  css: `/* 响应式卡片布局 */
.card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}

.card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 20px;
    transition: transform 0.3s;
}`,

  json: `{
    "name": "示例项目",
    "version": "1.0.0",
    "dependencies": {
        "react": "^18.0.0",
        "vue": "^3.0.0"
    },
    "scripts": {
        "start": "node index.js",
        "build": "tsc"
    }
}`,

  markdown: `# 项目文档

## 功能特性
- 支持多种编程语言
- 响应式设计
- 主题切换

## 安装说明
\`\`\`bash
npm install
npm run dev
\`\`\`

## 使用示例
\`\`\`javascript
console.log("Hello, World!");
\`\`\``,

  python: `# 冒泡排序示例
def bubble_sort(arr):
    for i in range(len(arr) - 1):
        for j in range(len(arr) - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

nums = [64, 34, 25, 12, 22, 11, 90]
print("排序后:", bubble_sort(nums))`,

  java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++)
            for (int j = 0; j < arr.length - 1 - i; j++)
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
    }

    public static void main(String[] args) {
        int[] nums = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(nums);
        System.out.println("排序后: " + java.util.Arrays.toString(nums));
    }
}`,

  cpp: `#include <iostream>
#include <vector>

void bubbleSort(std::vector<int>& arr) {
    for (int i = 0; i < arr.size() - 1; i++)
        for (int j = 0; j < arr.size() - 1 - i; j++)
            if (arr[j] > arr[j + 1])
                std::swap(arr[j], arr[j + 1]);
}

int main() {
    std::vector<int> nums = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(nums);
    for (int num : nums) std::cout << num << " ";
    return 0;
}`,

  rust: `fn bubble_sort(arr: &mut [i32]) {
    for i in 0..arr.len()-1 {
        for j in 0..arr.len()-1-i {
            if arr[j] > arr[j+1] {
                arr.swap(j, j+1);
            }
        }
    }
}

fn main() {
    let mut nums = [64, 34, 25, 12, 22, 11, 90];
    bubble_sort(&mut nums);
    println!("排序后: {:?}", nums);
}`,

  sql: `-- 创建示例表
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10,2)
);

-- 插入数据
INSERT INTO employees VALUES
    (1, '张三', 15000.00),
    (2, '李四', 12000.00);

-- 查询示例
SELECT name, salary FROM employees ORDER BY salary DESC;`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<project>
    <name>示例项目</name>
    <version>1.0.0</version>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>5.3.0</version>
        </dependency>
    </dependencies>
</project>`,

  yaml: `# 项目配置示例
name: 示例项目
version: 1.0.0

# 开发环境配置
development:
  port: 3000
  database:
    host: localhost
    port: 5432

# 依赖配置
dependencies:
  - name: react
    version: ^18.0.0
  - name: vue
    version: ^3.0.0`,

  properties: `# 数据库配置
db.host=localhost
db.port=5432
db.name=example_db

# 应用配置
app.name=示例应用
app.version=1.0.0
app.port=8080

# 日志配置
logging.level=INFO
logging.file=app.log`,

  php: `<?php
// 冒泡排序示例
function bubbleSort(array &$arr) {
    for ($i = 0; $i < count($arr) - 1; $i++)
        for ($j = 0; $j < count($arr) - 1 - $i; $j++)
            if ($arr[$j] > $arr[$j + 1])
                list($arr[$j], $arr[$j + 1]) = array($arr[$j + 1], $arr[$j]);
}

$nums = [64, 34, 25, 12, 22, 11, 90];
bubbleSort($nums);
echo "排序后: " . implode(", ", $nums);
?>`,
}
