# Univer Sheets Vite - 简化版

> 基于 Univer v0.10.10 的简洁、直观、高内聚的表格应用架构

## 🎯 项目特点

- ✅ **简洁架构** - 核心代码不到 300 行，一目了然
- ✅ **高内聚设计** - 每个功能模块是独立完整的
- ✅ **易于维护** - 修改功能只需编辑一个文件
- ✅ **快速上手** - 10 分钟理解全部代码，立即开始开发
- ✅ **Vue3 集成** - 完整的 Vue3 组件支持和示例

## 📁 项目结构

```
src/
├── main.ts              # 入口文件（30 行）
│                        # ├─ CSS 导入（按顺序）
│                        # ├─ 初始化 Univer
│                        # ├─ 注册 Vue3 组件
│                        # └─ 初始化功能模块
│
├── core/                # 核心初始化
│   └── init.ts         # Univer 实例创建和插件注册（52 行）
│
├── plugins/             # 自定义插件（Plugin 类）
│   └── export-json.ts  # 导出 JSON 插件（在工具栏添加导出按钮）
│
├── features/            # 功能模块（高内聚，基于 Facade API）
│   ├── index.ts        # 功能编排和容器管理（44 行）
│   ├── panel.ts        # 面板弹窗功能（73 行）
│   ├── button.ts       # 按钮弹窗功能（73 行）
│   ├── batch.ts        # 批量弹窗功能（74 行）
│   └── float-dom.ts    # 浮动DOM功能（165 行）
│
├── components/          # Vue3 组件
│   ├── CustomVuePanel.vue      # 自定义面板组件
│   ├── SimpleVueButton.vue     # 简单按钮组件
│   └── FloatDomCard.vue        # 浮动DOM卡片组件（329 行）
│
├── config/              # 配置文件
│   └── univer-config.ts        # Univer 配置
│
├── data.ts              # 示例工作簿数据
├── locales.ts           # 国际化配置
└── style.css            # 全局样式
```

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm run dev
```

浏览器访问 `http://localhost:5173`，右下角会出现四个功能按钮：

- **显示面板 (C3)** - 在 C3 单元格显示 Vue3 面板组件
- **显示按钮 (F5)** - 在 F5 单元格显示交互按钮
- **批量显示 (H3/H5/H7)** - 同时在多个单元格显示组件
- **添加浮动DOM** - 在工作表中添加可拖动的浮动DOM组件

### 3. 构建生产版本

```bash
pnpm run build
```

## 💡 核心概念

### 功能模块（高内聚设计）

每个功能模块是一个独立完整的 TypeScript 文件，包含：

```typescript
// src/features/panel.ts
export function createPanelFeature(univerAPI: FUniver) {
  // 1. 状态管理
  let disposable = null;
  let button = null;

  // 2. UI 创建
  function createButton() {
    button = document.createElement('button');
    button.textContent = '显示面板 (C3)';
    button.className = 'univer-btn univer-btn-primary';
    button.onclick = toggle;
    return button;
  }

  // 3. 业务逻辑
  function toggle() { disposable ? hide() : show(); }
  
  function show() {
    const workbook = univerAPI.getActiveWorkbook();
    const worksheet = workbook?.getActiveSheet();
    if (!worksheet) return;

    const range = worksheet.getRange('C3');
    disposable = range.attachRangePopup({
      componentKey: 'CustomVuePanel',
      isVue3: true,
      direction: 'bottom',
      extraProps: {
        title: 'Vue3 面板',
        initialCount: 5,
        onClose: hide,
      },
    });
    if (button) button.textContent = '关闭面板';
  }

  function hide() {
    disposable?.dispose();
    disposable = null;
    if (button) button.textContent = '显示面板 (C3)';
  }

  // 4. 资源清理
  function dispose() { hide(); }

  return { createButton, dispose };
}
```

**优点**：

- ✅ 一个文件包含完整功能（状态、UI、逻辑、清理）
- ✅ 不依赖外部服务类或管理器
- ✅ 修改功能只需编辑这一个文件
- ✅ 代码逻辑清晰，易于理解

### 初始化流程

```typescript
// src/main.ts
import { initUniver } from "./core/init";
import { initFeatures } from "./features";
import CustomVuePanel from "./components/CustomVuePanel.vue";
import SimpleVueButton from "./components/SimpleVueButton.vue";
import FloatDomCard from "./components/FloatDomCard.vue";

// 1. 初始化 Univer（核心实例 + 插件）
const univerAPI = initUniver(DEFAULT_WORKBOOK_DATA_DEMO);

// 2. 注册 Vue3 组件
univerAPI.registerComponent('CustomVuePanel', CustomVuePanel, { framework: 'vue3' });
univerAPI.registerComponent('SimpleVueButton', SimpleVueButton, { framework: 'vue3' });
univerAPI.registerComponent('FloatDomCard', FloatDomCard, { framework: 'vue3' });

// 3. 初始化功能模块（基于生命周期）
univerAPI.addEvent(
  univerAPI.Event.LifeCycleChanged,
  ({ stage }) => {
    if (stage === univerAPI.Enum.LifecycleStages.Rendered) {
      // 界面已渲染完成，可以安全初始化功能
      initFeatures(univerAPI);
    }
  }
);
```

**清晰的职责分离**：

- `core/init.ts` - 负责 Univer 实例和插件
- `main.ts` - 负责应用初始化和 Vue3 组件注册
- `features/index.ts` - 负责功能模块编排

### Plugins vs Features 的区别

理解这两个目录的区别很重要：

#### `src/plugins/` - 自定义插件

**何时使用**：需要深度集成到 Univer 核心系统时

- 继承 `Plugin` 类
- 使用依赖注入（`@Inject`）
- 需要访问内部服务（如 `ICommandService`、`IMenuManagerService`）
- 在 Univer 初始化时注册（`univer.registerPlugin`）

**示例**：`export-json.ts` - 在工具栏添加导出按钮

```typescript
export class ExportJsonPlugin extends Plugin {
  constructor(
    @Inject(ICommandService) private _commandService: ICommandService,
    @Inject(IMenuManagerService) private _menuManagerService: IMenuManagerService
  ) { /* ... */ }
}
```

#### `src/features/` - 功能模块

**何时使用**：构建用户交互功能时（推荐方式）

- 简单的函数式设计
- 使用 Facade API（`univerAPI`）
- 独立的状态管理
- 运行时动态初始化

**示例**：`panel.ts` - 单元格弹窗功能

```typescript
export function createPanelFeature(univerAPI: FUniver) {
  let disposable = null;
  function show() {
    const range = univerAPI.getActiveWorkbook()
      .getActiveSheet()
      .getRange('C3');
    disposable = range.attachRangePopup({ /* ... */ });
  }
  return { createButton, dispose };
}
```

**建议**：

- ✅ 优先使用 `features/` 目录（更简单、更灵活）
- ✅ 只在需要深度系统集成时才使用 `plugins/`
- ✅ 一般的业务功能都应该放在 `features/` 中

## 🎨 四个功能示例

### 1. 面板弹窗 (`panel.ts`)

在 C3 单元格显示一个 Vue3 面板组件，包含计数器、颜色选择器等交互功能。

**核心 API**：

```typescript
range.attachRangePopup({
  componentKey: 'CustomVuePanel',
  isVue3: true,
  direction: 'bottom',
  extraProps: { /* 传递给 Vue 组件的 props */ }
})
```

### 2. 按钮弹窗 (`button.ts`)

在 F5 单元格显示一个简单的 Vue3 按钮，点击按钮会更新单元格内容。

**核心 API**：

```typescript
range.attachPopup({
  componentKey: 'SimpleVueButton',
  isVue3: true,
  extraProps: {
    label: '单元格按钮',
    onClick: (count) => range.setValue(`点击 ${count} 次`)
  }
})
```

### 3. 批量弹窗 (`batch.ts`)

同时在 H3、H5、H7 三个单元格显示 Vue3 组件，演示批量操作。

**核心实现**：

```typescript
cells.forEach((cellAddress, index) => {
  const range = worksheet.getRange(cellAddress);
  const disposable = range.attachPopup({
    componentKey: 'SimpleVueButton',
    isVue3: true,
    extraProps: { /* ... */ }
  });
  disposables.push(disposable);
});
```

### 4. 浮动DOM (`float-dom.ts`)

在工作表中添加可拖动的浮动DOM组件，演示如何在Univer外部创建独立的Vue3组件。

**核心实现**：

```typescript
// 创建浮动容器
floatContainer = document.createElement('div');
floatContainer.style.position = 'absolute';
floatContainer.style.left = '300px';
floatContainer.style.top = '150px';

// 挂载 Vue 组件
vueApp = createApp(FloatDomCard, {
  title: '演示浮动DOM',
  initialCount: 10,
  onUpdate: (data) => console.log('浮动DOM更新:', data),
  onClose: () => hide(),
});

univerContainer.appendChild(floatContainer);
vueApp.mount(floatContainer);

// 添加拖拽功能
cleanupDrag = makeDraggable(floatContainer);
```

**特点**：

- ✅ 完全独立的Vue3组件（不依赖Univer的弹窗系统）
- ✅ 支持拖拽移动
- ✅ 实时时间显示
- ✅ 计数器交互
- ✅ 文本输入和预览

## 📝 添加新功能（3 步完成）

### 第 1 步：创建功能文件

在 `src/features/` 目录下创建新文件，例如 `my-feature.ts`：

```typescript
import type { FUniver } from "@univerjs/core/facade";

export function createMyFeature(univerAPI: FUniver) {
  let disposable = null;
  let button = null;

  function createButton() {
    button = document.createElement('button');
    button.textContent = '我的功能';
    button.className = 'univer-btn univer-btn-primary';
    button.onclick = toggle;
    return button;
  }

  function toggle() {
    disposable ? hide() : show();
  }

  function show() {
    const workbook = univerAPI.getActiveWorkbook();
    const worksheet = workbook?.getActiveSheet();
    if (!worksheet) return;

    const range = worksheet.getRange('A1');
    disposable = range.attachPopup({
      componentKey: 'SimpleVueButton',
      isVue3: true,
      extraProps: {
        label: '我的按钮',
        onClick: (count) => {
          range.setValue(`点击 ${count} 次`);
        },
      },
    });

    if (button) button.textContent = '关闭功能';
  }

  function hide() {
    disposable?.dispose();
    disposable = null;
    if (button) button.textContent = '我的功能';
  }

  function dispose() {
    hide();
  }

  return { createButton, dispose };
}
```

### 第 2 步：注册功能

在 `src/features/index.ts` 中注册新功能：

```typescript
import { createMyFeature } from "./my-feature";

export function initFeatures(univerAPI: FUniver) {
  // ... 现有代码 ...
  
  // 添加新功能
  const myFeature = createMyFeature(univerAPI);
  container.appendChild(myFeature.createButton());
  
  return () => {
    // ... 现有清理代码 ...
    myFeature.dispose();
  };
}
```

### 第 3 步：完成

刷新页面，右下角会出现 "我的功能" 按钮。

## 🔧 Vue3 组件开发

### 创建和注册新组件

1. 在 `src/components/` 目录下创建组件文件 `MyComponent.vue`

2. 在 `src/main.ts` 中导入并注册：

```typescript
import MyComponent from "./components/MyComponent.vue";

// 注册组件
univerAPI.registerComponent('MyComponent', MyComponent, { framework: 'vue3' });
```

### 在功能中使用

```typescript
range.attachPopup({
  componentKey: 'MyComponent',  // 注册的组件名
  isVue3: true,
  extraProps: {
    // 传递给组件的 props
    message: 'Hello',
    onAction: (data) => console.log(data),
  },
});
```

## 📦 技术栈

- **核心框架**: [Univer](https://univer.ai) v0.10.10
- **构建工具**: [Vite](https://vitejs.dev) 4.x
- **开发语言**: [TypeScript](https://www.typescriptlang.org) 5.x
- **UI 框架**: [Vue 3](https://vuejs.org) 3.5.x
- **包管理器**: [pnpm](https://pnpm.io)

## ❓ 常见问题

### Q: 我应该在哪里添加代码？

**A**:

- **新功能（推荐）** → `src/features/` 下创建新文件（参考 `panel.ts`）
- **自定义插件** → `src/plugins/` 下创建插件类（参考 `export-json.ts`）
- **修改功能** → 直接编辑对应的功能文件
- **新 Vue 组件** → `src/components/` 目录
- **配置修改** → `src/config/univer-config.ts`

**如何选择 features 还是 plugins？**

- 90% 的情况使用 `features/`（单元格交互、UI 组件、数据处理等）
- 只有需要深度集成 Univer 核心（如自定义命令、菜单项、快捷键）时才用 `plugins/`

### Q: 如何学习这个项目？

**A**: 建议按以下顺序：

1. **看 `src/features/panel.ts`**
   - 理解功能模块的基本结构
   - 学习如何使用 `attachRangePopup` API

2. **看 `src/features/index.ts`**
   - 理解如何编排多个功能
   - 学习功能的初始化和清理

3. **看 `src/main.ts`**
   - 理解整体初始化流程
   - 了解 CSS 导入顺序的重要性

4. **动手实践**
   - 按照 "添加新功能" 部分创建自己的功能
   - 尝试修改现有功能的行为

### Q: CSS 导入顺序为什么重要？

**A**: Univer 的 CSS 样式有依赖关系，必须按以下顺序导入：

```typescript
import "./style.css";                              // 1. 自定义样式
import "@univerjs/design/lib/index.css";           // 2. 设计系统
import "@univerjs/ui/lib/index.css";               // 3. UI 组件
import "@univerjs/docs-ui/lib/index.css";          // 4. 文档 UI
import "@univerjs/sheets-ui/lib/index.css";        // 5. 表格 UI
import "@univerjs/sheets-drawing-ui/lib/index.css"; // 6. 绘图 UI
import "@univerjs/sheets-formula-ui/lib/index.css"; // 7. 公式 UI
import "@univerjs/sheets-numfmt-ui/lib/index.css";  // 8. 数字格式 UI
```

错误的顺序可能导致样式错乱。

### Q: 如何调试 Univer？

**A**: Univer 实例已暴露到全局：

```javascript
// 在浏览器控制台
window.univer      // Univer 实例
window.univerAPI   // Facade API

// 示例
const workbook = univerAPI.getActiveWorkbook();
const worksheet = workbook.getActiveSheet();
const range = worksheet.getRange('A1');
console.log(range.getValue());
```

## 📖 文档资源

- **[Univer 官方文档](https://univer.ai/zh-CN/guides/quickstart)** - 快速开始指南
- **[Univer API 文档](https://univer.ai/typedoc/@univerjs/core/)** - 完整的 API 参考
- **[CLAUDE.md](./CLAUDE.md)** - Claude AI 的项目指南

## 📊 代码统计

| 文件                          | 职责                 |
| ----------------------------- | -------------------- |
| `main.ts`                     | 入口文件             |
| `core/init.ts`                | 初始化 Univer        |
| `features/index.ts`           | 功能编排             |
| `features/panel.ts`           | 面板功能             |
| `features/button.ts`          | 按钮功能             |
| `features/batch.ts`           | 批量功能             |
| `features/float-dom.ts`       | 浮动DOM功能          |
| `components/FloatDomCard.vue` | 浮动DOM卡片组件      |
| `plugins/export-json.ts`      | 菜单栏导出 JSON 插件 |
