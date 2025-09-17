# PptxGenJS 字体嵌入功能指南

PptxGenJS 现在支持在生成的 PPTX 文件中嵌入自定义字体，确保您的演示文稿在任何设备上都能正确显示指定的字体。

## 功能特性

- ✅ 支持从文件路径导入字体
- ✅ 支持从 base64 数据导入字体
- ✅ 支持PowerPoint兼容的字体格式：TTF、OTF
- ✅ 支持不同字体样式：常规、粗体、斜体、粗斜体
- ✅ 自动处理字体关系和 XML 结构
- ✅ 兼容 Node.js 和浏览器环境
- ✅ TypeScript 类型支持

## 安装和使用

### 基本用法

```javascript
const PptxGenJS = require('pptxgenjs')

async function createPresentationWithCustomFonts() {
    const pptx = new PptxGenJS()
    
    // 方法1: 从文件路径嵌入字体
    await pptx.embedFont({
        name: 'My Custom Font',
        path: '/path/to/font.ttf',
        type: 'ttf',
        style: 'regular'
    })
    
    // 方法2: 从 base64 数据嵌入字体
    await pptx.embedFont({
        name: 'Another Font',
        data: 'base64-encoded-font-data-here',
        type: 'ttf',
        style: 'bold'
    })
    
    // 创建幻灯片并使用嵌入的字体
    const slide = pptx.addSlide()
    slide.addText('Hello World', {
        fontFace: 'My Custom Font',
        fontSize: 24,
        x: 1,
        y: 2,
        w: 8,
        h: 1
    })
    
    // 保存文件
    await pptx.writeFile('presentation-with-fonts.pptx')
}
```

### TypeScript 用法

```typescript
import PptxGenJS, { FontEmbedProps } from 'pptxgenjs'

const pptx = new PptxGenJS()

const fontConfig: FontEmbedProps = {
    name: 'Custom Font',
    path: '/path/to/font.ttf',
    type: 'ttf',
    style: 'regular'
}

await pptx.embedFont(fontConfig)
```

## API 参考

### embedFont(fontProps: FontEmbedProps): Promise<void>

嵌入一个字体到演示文稿中。

#### 参数

- `fontProps.name` (string, 必需): 字体名称
- `fontProps.path` (string, 可选): 字体文件路径
- `fontProps.data` (string, 可选): base64 编码的字体数据
- `fontProps.type` (string, 可选): 字体类型，默认为 'ttf'
  - 支持的类型: 'ttf', 'otf'
  - 注意：只有TTF和OTF格式被PowerPoint官方支持
- `fontProps.style` (string, 可选): 字体样式，默认为 'regular'
  - 支持的样式: 'regular', 'bold', 'italic', 'bold-italic'

#### 示例

```javascript
// 从文件嵌入
await pptx.embedFont({
    name: 'Roboto',
    path: './fonts/Roboto-Regular.ttf',
    type: 'ttf',
    style: 'regular'
})

// 从 base64 数据嵌入
await pptx.embedFont({
    name: 'Roboto',
    data: 'VGhpcyBpcyBhIGZha2UgZm9udCBkYXRhLi4u',
    type: 'ttf',
    style: 'bold'
})
```

### getEmbeddedFontNames(): string[]

获取所有已嵌入字体的名称列表。

#### 返回值

返回一个包含所有已嵌入字体名称的数组。

#### 示例

```javascript
const embeddedFonts = pptx.getEmbeddedFontNames()
console.log('已嵌入的字体:', embeddedFonts)
// 输出: ['Roboto', 'Open Sans', 'Custom Font']
```


## 使用场景

### 1. 确保字体一致性

当您的演示文稿需要在不同设备上保持一致的外观时：

```javascript
// 嵌入品牌字体
await pptx.embedFont({
    name: 'Brand Font',
    path: './assets/brand-font.ttf'
})

// 在所有文本中使用
slide.addText('Company Name', {
    fontFace: 'Brand Font',
    fontSize: 32
})
```

### 2. 支持特殊字符

当您需要显示特殊字符或非拉丁字符时：

```javascript
// 嵌入支持中文的字体
await pptx.embedFont({
    name: 'Noto Sans CJK',
    path: './fonts/NotoSansCJK-Regular.otf',
    type: 'otf'
})

slide.addText('你好世界', {
    fontFace: 'Noto Sans CJK',
    fontSize: 24
})
```

### 3. 创意设计

使用自定义字体创建独特的设计：

```javascript
// 嵌入装饰性字体
await pptx.embedFont({
    name: 'Decorative Font',
    path: './fonts/decorative.ttf'
})

slide.addText('Creative Title', {
    fontFace: 'Decorative Font',
    fontSize: 48,
    color: 'FF6B6B'
})
```

## 注意事项

### 字体格式限制

- **仅支持TTF和OTF格式**：PowerPoint只官方支持TrueType (.ttf) 和 OpenType (.otf) 字体
- **不支持Web字体**：WOFF和WOFF2格式专为Web浏览器设计，在PPTX中无法正确显示
- **格式转换**：如果您有WOFF/WOFF2字体，请使用在线工具或字体编辑软件转换为TTF或OTF格式

### 字体许可

- 确保您有权在您的项目中使用和分发字体
- 某些字体可能需要商业许可证
- 开源字体通常可以自由使用

### 文件大小

- 嵌入字体会增加 PPTX 文件的大小
- 考虑只嵌入必需的字体样式
- 使用字体子集可以减小文件大小

### 兼容性

- 嵌入的字体在所有支持 PPTX 格式的应用程序中都应该正常工作
- 包括 Microsoft PowerPoint、Google Slides、LibreOffice Impress 等

### 性能考虑

- 大量字体可能会影响文件加载时间
- 在浏览器环境中，字体加载是异步的
- 考虑使用字体子集来减小文件大小

## 故障排除

### 常见问题

1. **字体未显示**
   - 确保字体名称正确
   - 检查字体文件是否损坏
   - 验证字体格式是否受支持

2. **文件大小过大**
   - 考虑使用 WOFF2 格式
   - 只嵌入需要的字体样式
   - 使用字体子集工具

3. **加载错误**
   - 检查文件路径是否正确
   - 确保有读取文件的权限
   - 验证 base64 数据是否有效

### 调试技巧

```javascript
// 检查字体是否成功嵌入
const embeddedFonts = pptx.getEmbeddedFontNames()
console.log('已嵌入的字体:', embeddedFonts)

// 检查字体详细信息
console.log('字体详细信息:', pptx.embeddedFonts)
```

## 示例文件

在 `demos/` 文件夹中包含了以下示例：

- `font-embedding-demo.js` - 完整的功能演示
- `simple-font-example.js` - 简单的使用示例
- `font-typescript-example.ts` - TypeScript 示例

运行示例：

```bash
# 运行简单示例
node demos/simple-font-example.js

# 运行完整演示
node demos/font-embedding-demo.js
```

## 版本历史

- v4.1.0: 添加字体嵌入功能
- 支持 TTF、OTF、WOFF、WOFF2 格式
- 支持从文件路径和 base64 数据导入
- TypeScript 类型支持

## 贡献

欢迎提交 issue 和 pull request 来改进字体嵌入功能！

## 许可证

本功能遵循 PptxGenJS 的 MIT 许可证。
