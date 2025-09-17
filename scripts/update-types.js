#!/usr/bin/env node

/**
 * PptxGenJS 类型定义文件更新脚本
 * 用于从自动生成的声明文件更新 types/index.d.ts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');
const OUT_DEFS_DIR = path.join(PROJECT_ROOT, 'out', 'defs');
const TYPES_FILE = path.join(PROJECT_ROOT, 'types', 'index.d.ts');

console.log('🚀 开始更新 PptxGenJS 类型定义文件...\n');

// 1. 生成类型定义文件
console.log('📝 正在生成类型定义文件...');
try {
    execSync('npx tsc --emitDeclarationOnly', { 
        cwd: PROJECT_ROOT,
        stdio: 'inherit'
    });
    console.log('✅ 类型定义文件生成完成\n');
} catch (error) {
    console.error('❌ 类型定义文件生成失败:', error.message);
    process.exit(1);
}

// 2. 检查生成的文件是否存在
if (!fs.existsSync(OUT_DEFS_DIR)) {
    console.error('❌ 错误：找不到生成的类型定义文件目录');
    process.exit(1);
}

// 3. 读取需要合并的文件
const filesToMerge = [
    'core-enums.d.ts',
    'core-interfaces.d.ts', 
    'gen-charts.d.ts',
    'gen-media.d.ts',
    'gen-objects.d.ts',
    'gen-tables.d.ts',
    'gen-utils.d.ts',
    'gen-xml.d.ts',
    'slide.d.ts',
    'pptxgen.d.ts'
];

console.log('🔄 正在合并类型定义文件...');

// 4. 创建文件头
let content = `// Type definitions for pptxgenjs 4.0.1
// Project: https://gitbrent.github.io/PptxGenJS/
// Definitions by: Brent Ely <https://github.com/gitbrent/>
//                 Michael Beaumont <https://github.com/michaelbeaumont>
//                 Nicholas Tietz-Sokolsky <https://github.com/ntietz>
//                 David Adams <https://github.com/iota-pi>
//                 Stephen Cronin <https://github.com/cronin4392>
// TypeScript Version: 3.x

export as namespace PptxGenJS

export default PptxGenJS

`;

// 5. 处理每个文件
for (const fileName of filesToMerge) {
    const filePath = path.join(OUT_DEFS_DIR, fileName);
    
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  警告：文件 ${fileName} 不存在，跳过`);
        continue;
    }
    
    console.log(`   📄 处理文件: ${fileName}`);
    
    let fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 移除 import 语句
    fileContent = fileContent.replace(/^import\s+.*?;\s*$/gm, '');
    
    // 处理 export default class 语句
    if (fileName === 'pptxgen.d.ts') {
        fileContent = fileContent.replace(/^export default class PptxGenJS/gm, 'declare class PptxGenJS');
    }
    
    if (fileName === 'slide.d.ts') {
        fileContent = fileContent.replace(/^export default class Slide/gm, 'declare class Slide');
    }
    
    // 移除多余的空行
    fileContent = fileContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // 添加注释分隔
    content += `\n// ===== ${fileName.replace('.d.ts', '').toUpperCase()} =====\n`;
    content += fileContent;
    content += '\n';
}

// 6. 备份原文件
if (fs.existsSync(TYPES_FILE)) {
    const backupFile = TYPES_FILE + '.backup';
    fs.copyFileSync(TYPES_FILE, backupFile);
    console.log(`💾 原文件已备份为: ${path.basename(backupFile)}`);
}

// 7. 写入新文件
fs.writeFileSync(TYPES_FILE, content, 'utf8');

console.log('✅ types/index.d.ts 已成功更新！');
console.log('📝 请检查更新后的文件并确保所有类型定义正确');

// 8. 显示文件大小信息
const stats = fs.statSync(TYPES_FILE);
console.log(`📊 文件大小: ${Math.round(stats.size / 1024)} KB`);

console.log('\n🎉 类型定义文件更新完成！');



