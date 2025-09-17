#!/bin/bash

# PptxGenJS 类型定义文件更新脚本
# 用于从自动生成的声明文件更新 types/index.d.ts

echo "正在生成类型定义文件..."

# 1. 使用 TypeScript 编译器生成声明文件
npx tsc --emitDeclarationOnly

# 2. 检查是否生成成功
if [ ! -d "out/defs" ]; then
    echo "错误：类型定义文件生成失败"
    exit 1
fi

echo "类型定义文件已生成到 out/defs/ 目录"

# 3. 合并所有声明文件到一个文件
echo "正在合并声明文件..."

# 创建临时文件
temp_file=$(mktemp)

# 添加文件头
cat > "$temp_file" << 'EOF'
// Type definitions for pptxgenjs 4.0.1
// Project: https://gitbrent.github.io/PptxGenJS/
// Definitions by: Brent Ely <https://github.com/gitbrent/>
//                 Michael Beaumont <https://github.com/michaelbeaumont>
//                 Nicholas Tietz-Sokolsky <https://github.com/ntietz>
//                 David Adams <https://github.com/iota-pi>
//                 Stephen Cronin <https://github.com/cronin4392>
// TypeScript Version: 3.x

export as namespace PptxGenJS

export default PptxGenJS

EOF

# 添加核心枚举和接口（去掉import语句）
echo "// Core Enums" >> "$temp_file"
sed '/^import /d' out/defs/core-enums.d.ts >> "$temp_file"
echo "" >> "$temp_file"

echo "// Core Interfaces" >> "$temp_file"
sed '/^import /d' out/defs/core-interfaces.d.ts >> "$temp_file"
echo "" >> "$temp_file"

# 添加主类定义（处理import语句）
echo "// Main Class" >> "$temp_file"
sed '/^import /d' out/defs/pptxgen.d.ts | sed 's/export default class PptxGenJS/declare class PptxGenJS/' >> "$temp_file"
echo "" >> "$temp_file"

# 添加Slide类定义
echo "// Slide Class" >> "$temp_file"
sed '/^import /d' out/defs/slide.d.ts | sed 's/export default class Slide/declare class Slide/' >> "$temp_file"

# 4. 备份原文件
if [ -f "types/index.d.ts" ]; then
    cp types/index.d.ts types/index.d.ts.backup
    echo "原文件已备份为 types/index.d.ts.backup"
fi

# 5. 替换目标文件
cp "$temp_file" types/index.d.ts

# 清理临时文件
rm "$temp_file"

echo "✅ types/index.d.ts 已成功更新！"
echo "📝 请检查更新后的文件并确保所有类型定义正确"



