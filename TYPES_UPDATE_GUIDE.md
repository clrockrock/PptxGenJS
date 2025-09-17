# PptxGenJS 类型定义文件更新指南

本项目使用 TypeScript 编写，需要维护类型定义文件 `types/index.d.ts` 以支持 TypeScript 用户。

## 🏗️ 项目结构

- **源代码**: `src/*.ts` - TypeScript 源文件
- **自动生成的类型定义**: `out/defs/*.d.ts` - 由 TypeScript 编译器自动生成
- **发布用类型定义**: `types/index.d.ts` - 合并后的最终类型定义文件

## 📋 更新方法

### 方法1: 使用 npm 脚本 (推荐)

```bash
# 生成并更新类型定义文件
npm run update-types

# 仅生成类型定义文件到 out/defs/
npm run generate-types
```

### 方法2: 手动运行脚本

```bash
# 运行更新脚本
node scripts/update-types.js

# 或使用 shell 脚本
./update-types.sh
```

### 方法3: 分步执行

```bash
# 1. 生成类型定义文件
npx tsc --emitDeclarationOnly

# 2. 手动合并文件到 types/index.d.ts
# (需要手动处理 import 语句和类声明)
```

## 🔄 更新流程

1. **生成声明文件**: TypeScript 编译器从 `src/*.ts` 生成 `out/defs/*.d.ts`
2. **合并文件**: 脚本将多个声明文件合并成单个 `types/index.d.ts`
3. **处理导入**: 移除内部 import 语句，因为最终文件是独立的
4. **调整导出**: 将 `export default class` 改为 `declare class`
5. **备份原文件**: 自动备份原有的类型定义文件

## 📝 文件处理规则

### 处理的文件列表
- `core-enums.d.ts` - 核心枚举定义
- `core-interfaces.d.ts` - 核心接口定义  
- `gen-charts.d.ts` - 图表相关类型
- `gen-media.d.ts` - 媒体相关类型
- `gen-objects.d.ts` - 对象相关类型
- `gen-tables.d.ts` - 表格相关类型
- `gen-utils.d.ts` - 工具函数类型
- `gen-xml.d.ts` - XML 相关类型
- `slide.d.ts` - Slide 类定义
- `pptxgen.d.ts` - 主类定义

### 转换规则
- 移除所有 `import` 语句
- `export default class PptxGenJS` → `declare class PptxGenJS`
- `export default class Slide` → `declare class Slide`
- 保持其他 export 语句不变

## ⚠️ 注意事项

1. **修改源码后必须更新**: 当你修改 `src/*.ts` 文件后，必须运行更新脚本
2. **检查生成结果**: 更新后请检查 `types/index.d.ts` 确保类型定义正确
3. **备份机制**: 脚本会自动备份原文件为 `types/index.d.ts.backup`
4. **版本号更新**: 需要手动更新文件头部的版本号

## 🚀 集成到构建流程

可以将类型更新集成到构建流程中：

```bash
# 在 package.json 中添加
"scripts": {
  "build": "rollup -c --bundleConfigAsCjs && npm run update-types",
  "ship": "gulp ship && npm run update-types"
}
```

## 🐛 故障排除

### 常见问题

1. **权限错误**: 确保脚本有执行权限 `chmod +x scripts/update-types.js`
2. **文件不存在**: 确保先运行 TypeScript 编译器生成声明文件
3. **导入错误**: 检查生成的文件中是否有未处理的 import 语句

### 检查生成质量

```bash
# 检查文件大小 (应该在 100-200KB 左右)
ls -lh types/index.d.ts

# 检查语法
npx tsc --noEmit types/index.d.ts

# 在测试项目中验证
cd demos/vite-demo && npm run build
```

## 📚 相关文档

- [TypeScript 声明文件](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [项目构建指南](./RELEASING.md)
- [贡献指南](./.github/PULL_REQUEST_TEMPLATE/pull_request_template.md)

---

**重要提醒**: 在提交代码前，请确保运行了类型更新脚本并验证了生成的类型定义文件！



