# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Univer Sheets application built with Vite and TypeScript. Univer is a spreadsheet library that provides Excel-like functionality in the browser. The project uses Univer v0.10.10 packages.

## Development Commands

```bash
# Start development server
pnpm run dev

# Build for production (runs TypeScript compiler and Vite build)
pnpm run build
```

## Architecture

### Entry Point (src/main.ts)

The application initializes through a clean, modular architecture:

1. **Core Initialization** - Univer instance and plugin registration from `core/init.ts`
2. **Component Registration** - Vue3 components registered directly in `main.ts`
3. **Features Initialization** - User-facing features via `features/index.ts`

### Project Structure

```
src/
├── main.ts                       # Entry point (~42 lines)
├── core/
│   └── init.ts                  # Univer initialization and plugin registration
├── plugins/
│   └── export-json.ts           # Custom Univer plugin (adds toolbar button)
├── features/
│   ├── index.ts                 # Feature orchestration
│   ├── panel.ts                 # Panel popup feature
│   ├── button.ts                # Button popup feature
│   ├── batch.ts                 # Batch popup feature
│   └── float-dom.ts             # Floating DOM feature
├── components/
│   ├── CustomVuePanel.vue       # Vue3 panel component
│   ├── SimpleVueButton.vue      # Vue3 button component
│   └── FloatDomCard.vue         # Vue3 floating DOM card component
├── config/
│   └── univer-config.ts         # Univer configuration
├── data.ts                       # Workbook data
├── locales.ts                    # Locale configuration
└── style.css                     # Global styles
```

### Key Files

- **src/main.ts** - Entry point, orchestrates initialization and registers Vue3 components
- **src/core/init.ts** - Creates Univer instance and registers plugins
- **src/plugins/export-json.ts** - Custom plugin example (deep system integration)
- **src/features/*.ts** - Feature modules (high cohesion, Facade API based)
- **src/components/*.vue** - Vue3 components
- **src/features/float-dom.ts** - Floating DOM feature (independent Vue3 components)
- **src/config/univer-config.ts** - Centralized configuration
- **src/data.ts** - Demo workbook data
- **src/locales.ts** - Locale configuration

### Architecture Principles

#### Plugins vs Features

**src/plugins/** - Custom Plugin Classes
- Use when: Deep system integration needed (commands, menus, shortcuts)
- Pattern: Extend `Plugin` class, use dependency injection
- Example: `export-json.ts` adds a toolbar button to export JSON

**src/features/** - Feature Modules (Recommended)
- Use when: Building user-facing functionality (90% of cases)
- Pattern: Simple functions using Facade API (`univerAPI`)
- Example: `panel.ts`, `button.ts`, `batch.ts` for cell interactions

**Rule of thumb**: Prefer `features/` for most use cases. Only use `plugins/` when you need deep Univer core integration.

### CSS Import Order

CSS must be imported in this specific order (src/main.ts:1-9):
```typescript
import "./style.css";
import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-drawing-ui/lib/index.css";
import "@univerjs/sheets-formula-ui/lib/index.css";
import "@univerjs/sheets-numfmt-ui/lib/index.css";
```

## TypeScript Configuration

- **Target**: ES2020
- **Module**: ESNext with bundler resolution
- **Strict mode enabled** with additional linting:
  - `noUnusedLocals`
  - `noUnusedParameters`
  - `noFallthroughCasesInSwitch`

## Important Notes

### When Adding New Features

1. **Plugin Dependencies**: Univer plugins have dependencies. Always check official Univer docs for required plugin combinations.
2. **Initialization Order**: Plugin registration order matters. Core plugins (Docs, RenderEngine, UI) must load before feature plugins (Formula, Numfmt).
3. **Locale Configuration**: When adding new Univer packages, remember to merge their locale exports in src/locales.ts.
4. **Data Structure**: The workbook data structure is complex. Reference src/data.ts for IWorkbookData and IDocumentData examples.

### Common Pitfalls

- Don't change plugin registration order without understanding dependencies
- UI container must be registered before Sheets UI
- CSS import order affects styling precedence
- The #app div ID in index.html must match UniverUIPlugin container config

## Dependencies

All Univer packages use version `0.10.10` (except `@univerjs/engine-numfmt` at `0.9.2`). When updating Univer, update all packages together to maintain compatibility.

## Adding New Features

### Adding a Feature Module (Recommended)

1. Create file in `src/features/my-feature.ts`:
```typescript
import type { FUniver } from "@univerjs/core/facade";

/**
 * 我的功能模块
 * 功能描述
 */
export function createMyFeature(univerAPI: FUniver) {
  let disposable: any = null;
  let button: HTMLButtonElement | null = null;

  // 创建控制按钮
  function createButton(): HTMLButtonElement {
    button = document.createElement('button');
    button.textContent = '我的功能';
    button.className = 'univer-btn univer-btn-primary';
    button.onclick = toggle;
    return button;
  }

  // 切换显示/隐藏
  function toggle() {
    disposable ? hide() : show();
  }

  // 显示功能
  function show() {
    try {
      const workbook = univerAPI.getActiveWorkbook();
      if (!workbook) return;
      
      const worksheet = workbook.getActiveSheet();
      if (!worksheet) return;

      const range = worksheet.getRange('A1');
      disposable = range.attachPopup({
        componentKey: 'SimpleVueButton',
        isVue3: true,
        extraProps: {
          label: '我的按钮',
          onClick: (count: number) => {
            range.setValue(`点击 ${count} 次`);
          },
        },
      });

      if (button) button.textContent = '关闭功能';
    } catch (error) {
      console.error('Failed to show feature:', error);
    }
  }

  // 隐藏功能
  function hide() {
    if (disposable) {
      disposable.dispose();
      disposable = null;
    }
    if (button) button.textContent = '我的功能';
  }

  // 清理资源
  function dispose() {
    hide();
  }

  return { createButton, dispose };
}
```

2. Register in `src/features/index.ts`:
```typescript
import { createMyFeature } from "./my-feature";

export function initFeatures(univerAPI: FUniver) {
  // ... existing code ...
  
  // 添加新功能
  const myFeature = createMyFeature(univerAPI);
  container.appendChild(myFeature.createButton());
  
  return () => {
    // ... existing cleanup ...
    myFeature.dispose();
  };
}
```

### Adding a Floating DOM Feature (Advanced)

For creating independent Vue3 components that exist outside Univer's popup system:

1. Create file in `src/features/my-float-feature.ts`:
```typescript
import type { FUniver } from "@univerjs/core/facade";
import { createApp } from 'vue';
import MyFloatComponent from '../components/MyFloatComponent.vue';

export function createMyFloatFeature(univerAPI: FUniver) {
  let floatContainer: HTMLDivElement | null = null;
  let vueApp: any = null;
  let button: HTMLButtonElement | null = null;

  function createButton(): HTMLButtonElement {
    button = document.createElement('button');
    button.textContent = '我的浮动功能';
    button.className = 'univer-btn univer-btn-primary';
    button.onclick = toggle;
    return button;
  }

  function toggle() {
    floatContainer ? hide() : show();
  }

  function show() {
    try {
      const workbook = univerAPI.getActiveWorkbook();
      if (!workbook) return;

      // 获取 Univer 容器
      const univerContainer = document.querySelector('#app');
      if (!univerContainer) return;

      // 创建浮动容器
      floatContainer = document.createElement('div');
      floatContainer.style.position = 'absolute';
      floatContainer.style.left = '300px';
      floatContainer.style.top = '150px';
      floatContainer.style.width = '320px';
      floatContainer.style.height = '450px';
      floatContainer.style.zIndex = '1000';
      
      // 挂载 Vue 组件
      vueApp = createApp(MyFloatComponent, {
        title: '我的浮动组件',
        onClose: () => hide(),
      });
      
      univerContainer.appendChild(floatContainer);
      vueApp.mount(floatContainer);

      if (button) button.textContent = '关闭浮动功能';
    } catch (error) {
      console.error('Failed to show float feature:', error);
    }
  }

  function hide() {
    if (vueApp) {
      vueApp.unmount();
      vueApp = null;
    }
    if (floatContainer) {
      floatContainer.remove();
      floatContainer = null;
    }
    if (button) button.textContent = '我的浮动功能';
  }

  function dispose() {
    hide();
  }

  return { createButton, dispose };
}
```

2. Register in `src/features/index.ts`:
```typescript
import { createMyFloatFeature } from "./my-float-feature";

export function initFeatures(univerAPI: FUniver) {
  // ... existing code ...
  
  // 添加浮动功能
  const myFloatFeature = createMyFloatFeature(univerAPI);
  container.appendChild(myFloatFeature.createButton());
  
  return () => {
    // ... existing cleanup ...
    myFloatFeature.dispose();
  };
}
```

### Adding a Plugin (Advanced)

1. Create file in `src/plugins/my-plugin.ts`:
```typescript
import type { Workbook } from "@univerjs/core";
import {
  CommandType,
  ICommand,
  ICommandService,
  Inject,
  Injector,
  IUniverInstanceService,
  Plugin,
  UniverInstanceType,
} from "@univerjs/core";
import { IMenuManagerService, MenuItemType, RibbonStartGroup } from "@univerjs/ui";

/**
 * 我的自定义插件
 * 添加工具栏按钮和命令
 */
export class MyPlugin extends Plugin {
  static override type = UniverInstanceType.UNIVER_SHEET;
  static override pluginName = "MY_PLUGIN";

  constructor(
    _config: unknown,
    @Inject(Injector) protected readonly _injector: Injector,
    @Inject(ICommandService) private readonly _commandService: ICommandService,
    @Inject(IMenuManagerService) private readonly _menuManagerService: IMenuManagerService
  ) {
    super();
  }

  override onStarting(): void {
    const commandId = "my-plugin.operation.my-command";

    // 1. 定义命令
    const command: ICommand = {
      type: CommandType.OPERATION,
      id: commandId,
      handler: (accessor) => {
        const univerInstanceService = accessor.get(IUniverInstanceService);
        const workbook = univerInstanceService.getCurrentUnitForType<Workbook>(
          UniverInstanceType.UNIVER_SHEET
        );

        if (!workbook) {
          console.error("无法获取当前工作簿");
          return false;
        }

        // 执行你的命令逻辑
        console.log("我的命令被执行了！");

        return true;
      },
    };

    // 2. 注册命令
    this.disposeWithMe(this._commandService.registerCommand(command));

    // 3. 定义菜单项
    const menuItemFactory = () => ({
      id: commandId,
      title: "我的按钮",
      tooltip: "我的功能说明",
      type: MenuItemType.BUTTON,
    });

    // 4. 注册菜单项到工具栏
    this._menuManagerService.mergeMenu({
      [RibbonStartGroup.OTHERS]: {
        [commandId]: {
          order: 10,
          menuItemFactory,
        },
      },
    });
  }
}
```

2. Register in `src/core/init.ts`:
```typescript
import { MyPlugin } from "../plugins/my-plugin";

// ... in initUniver function ...
univer.registerPlugin(MyPlugin);
```

### Adding a Vue3 Component

1. Create Vue component in `src/components/MyComponent.vue`:
```vue
<template>
  <div class="my-component">
    <h3>{{ title }}</h3>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title: string;
  onAction?: (data: any) => void;
}

const props = defineProps<Props>();
const count = ref(0);

function handleClick() {
  count.value++;
  props.onAction?.(count.value);
}
</script>

<style scoped>
.my-component {
  padding: 16px;
}
</style>
```

2. Register in `src/main.ts`:
```typescript
import MyComponent from "./components/MyComponent.vue";

// Register component (add after existing registrations)
univerAPI.registerComponent('MyComponent', MyComponent, { framework: 'vue3' });
```

3. Use in feature module:
```typescript
const range = worksheet.getRange('A1');
const disposable = range.attachPopup({
  componentKey: 'MyComponent',
  isVue3: true,
  extraProps: {
    title: '我的组件',
    onAction: (data) => {
      console.log('Action triggered:', data);
    },
  },
});
```

### Lifecycle-Based Initialization

The application now uses lifecycle-based initialization instead of setTimeout:

```typescript
// src/main.ts
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

This ensures features are initialized only after Univer has fully rendered, preventing timing issues.

## Common API Usage

### Working with Workbooks

```typescript
// Get active workbook
const workbook = univerAPI.getActiveWorkbook();

// Get workbook by ID
const workbook = univerAPI.getUniverSheet(workbookId);

// Save workbook data
const workbookData = workbook.save();

// Get workbook name
const name = workbook.getName();
```

### Working with Worksheets

```typescript
// Get active worksheet
const worksheet = workbook.getActiveSheet();

// Get worksheet by name
const worksheet = workbook.getSheetByName('Sheet1');

// Get worksheet by ID
const worksheet = workbook.getSheetBySheetId(sheetId);

// Get all worksheets
const sheets = workbook.getSheets();
```

### Working with Ranges

```typescript
// Get single cell
const range = worksheet.getRange('A1');

// Get range
const range = worksheet.getRange('A1:B10');

// Get value
const value = range.getValue();

// Set value
range.setValue('Hello World');

// Get values (2D array)
const values = range.getValues();

// Set values
range.setValues([
  ['A1', 'B1'],
  ['A2', 'B2']
]);
```

### Attaching Popups

```typescript
// Simple popup
const disposable = range.attachPopup({
  componentKey: 'SimpleVueButton',
  isVue3: true,
  extraProps: { label: 'Click me' },
});

// Panel popup with direction
const disposable = range.attachRangePopup({
  componentKey: 'CustomVuePanel',
  isVue3: true,
  direction: 'bottom', // 'top' | 'bottom' | 'left' | 'right'
  extraProps: { title: 'Panel' },
});

// Clean up
disposable.dispose();
```

## Best Practices

### Feature Module Pattern

✅ **DO**: Use high cohesion - keep everything together
```typescript
export function createMyFeature(univerAPI: FUniver) {
  // State
  let disposable = null;
  let button = null;
  
  // UI
  function createButton() { /* ... */ }
  
  // Logic
  function show() { /* ... */ }
  function hide() { /* ... */ }
  
  // Cleanup
  function dispose() { hide(); }
  
  return { createButton, dispose };
}
```

❌ **DON'T**: Scatter logic across multiple files
```typescript
// Don't create separate service classes, factories, etc.
// for simple features - keep it simple!
```

### Error Handling

✅ **DO**: Always wrap API calls in try-catch
```typescript
function show() {
  try {
    const workbook = univerAPI.getActiveWorkbook();
    if (!workbook) return;
    // ... rest of logic
  } catch (error) {
    console.error('Failed to show:', error);
  }
}
```

### Resource Cleanup

✅ **DO**: Always provide a dispose function
```typescript
function dispose() {
  if (disposable) {
    disposable.dispose();
    disposable = null;
  }
  // Clean up any other resources
}
```

✅ **DO**: Call dispose in feature index cleanup
```typescript
return () => {
  panelFeature.dispose();
  buttonFeature.dispose();
  batchFeature.dispose();
  container.remove();
};
```

### Type Safety

✅ **DO**: Use proper TypeScript types
```typescript
let disposable: any = null;  // or IDisposable if available
let button: HTMLButtonElement | null = null;

function createButton(): HTMLButtonElement {
  button = document.createElement('button');
  return button;
}
```

## Troubleshooting

### Plugin not loading
- Check plugin registration order in `src/core/init.ts`
- Ensure all dependencies are injected correctly
- Check console for error messages

### Component not found
- Verify component is registered in `main.ts` using `univerAPI.registerComponent()`
- Check componentKey matches exactly (case-sensitive)
- Ensure `isVue3: true` is set
- Ensure component registration happens before feature initialization

### Popup not showing
- Check if workbook/worksheet exists
- Verify cell address is valid
- Look for errors in browser console
- Ensure components are registered in `main.ts` before calling `initFeatures()`

### CSS not applied correctly
- Check CSS import order in `src/main.ts`
- Univer CSS must be imported after your custom styles
- Clear browser cache if styles seem stuck

### Floating DOM not showing
- Ensure Vue3 component is properly registered in `main.ts`
- Check if Univer container (#app) exists
- Verify z-index is high enough (1000+)
- Look for JavaScript errors in console
- Ensure component is mounted after DOM is ready
