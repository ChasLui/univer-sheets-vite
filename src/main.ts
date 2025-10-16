// CSS 导入（必须按此顺序）
import "./style.css";
import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-drawing-ui/lib/index.css";
import "@univerjs/sheets-formula-ui/lib/index.css";
import "@univerjs/sheets-numfmt-ui/lib/index.css";

// Facade 导入
import "@univerjs/ui/facade";
import "@univerjs/sheets/facade";
import "@univerjs/sheets-ui/facade";

// 应用导入
import { initUniver } from "./core/init";
import { initFeatures } from "./features";
import CustomVuePanel from "./components/CustomVuePanel.vue";
import SimpleVueButton from "./components/SimpleVueButton.vue";
import FloatDomCard from "./components/FloatDomCard.vue";
import { DEFAULT_WORKBOOK_DATA_DEMO } from "./data";

// 初始化 Univer
const univerAPI = initUniver(DEFAULT_WORKBOOK_DATA_DEMO);

// 注册 Vue3 组件
univerAPI.registerComponent('CustomVuePanel', CustomVuePanel, { framework: 'vue3' });
univerAPI.registerComponent('SimpleVueButton', SimpleVueButton, { framework: 'vue3' });
univerAPI.registerComponent('FloatDomCard', FloatDomCard, { framework: 'vue3' });

// 初始化功能（基于生命周期）
univerAPI.addEvent(
  univerAPI.Event.LifeCycleChanged,
  ({ stage }) => {
    if (stage === univerAPI.Enum.LifecycleStages.Rendered) {
      // 界面已渲染完成，可以安全初始化功能
      initFeatures(univerAPI);
    }
  }
);
