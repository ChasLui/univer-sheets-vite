import type { FUniver } from "@univerjs/core/facade";
import { createPanelFeature } from "./panel";
import { createButtonFeature } from "./button";
import { createBatchFeature } from "./batch";
import { createFloatDomFeature } from "./float-dom";

/**
 * 初始化所有功能
 */
export function initFeatures(univerAPI: FUniver) {
  // 创建容器
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;
  document.body.appendChild(container);

  // 初始化功能
  const panel = createPanelFeature(univerAPI);
  const button = createButtonFeature(univerAPI, 'F5');
  const batch = createBatchFeature(univerAPI, ['H3', 'H5', 'H7']);
  const floatDom = createFloatDomFeature(univerAPI);

  // 添加按钮
  container.appendChild(panel.createButton());
  container.appendChild(button.createButton());
  container.appendChild(batch.createButton());
  container.appendChild(floatDom.createButton());

  // 返回清理函数
  return () => {
    panel.dispose();
    button.dispose();
    batch.dispose();
    floatDom.dispose();
    container.remove();
  };
}

