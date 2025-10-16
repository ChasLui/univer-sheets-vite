import type { FUniver } from "@univerjs/core/facade";
import { createApp } from 'vue';
import FloatDomCard from '../components/FloatDomCard.vue';

/**
 * 浮动 DOM 功能
 * 在工作表中添加可拖动的浮动 DOM 组件
 */
export function createFloatDomFeature(univerAPI: FUniver) {
  let floatContainer: HTMLDivElement | null = null;
  let vueApp: any = null;
  let button: HTMLButtonElement | null = null;

  // 创建控制按钮
  function createButton(): HTMLButtonElement {
    button = document.createElement('button');
    button.textContent = '添加浮动DOM';
    button.className = 'univer-btn univer-btn-primary';
    button.onclick = toggle;
    return button;
  }

  // 切换显示/隐藏
  function toggle() {
    if (floatContainer) {
      hide();
    } else {
      show();
    }
  }

  // 添加拖拽功能
  function makeDraggable(container: HTMLElement) {
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    const onMouseDown = (e: MouseEvent) => {
      // 只有点击标题栏才能拖拽
      const target = e.target as HTMLElement;
      const header = container.querySelector('.card-header');
      if (!header || !header.contains(target)) {
        return;
      }

      isDragging = true;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      
      container.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      container.style.left = currentX + 'px';
      container.style.top = currentY + 'px';
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'default';
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // 返回清理函数
    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }

  let cleanupDrag: (() => void) | null = null;

  // 显示浮动 DOM
  function show() {
    try {
      const workbook = univerAPI.getActiveWorkbook();
      if (!workbook) {
        console.error('无法获取当前工作簿');
        return;
      }

      // 获取 Univer 容器
      const univerContainer = document.querySelector('#app');
      if (!univerContainer) {
        console.error('无法找到 Univer 容器');
        return;
      }

      // 创建浮动容器
      floatContainer = document.createElement('div');
      floatContainer.style.position = 'absolute';
      floatContainer.style.left = '300px';
      floatContainer.style.top = '150px';
      floatContainer.style.width = '320px';
      floatContainer.style.height = '450px';
      floatContainer.style.zIndex = '1000';
      
      // 挂载 Vue 组件
      vueApp = createApp(FloatDomCard, {
        title: '演示浮动DOM',
        initialCount: 10,
        onUpdate: (data: { count: number; input: string }) => {
          console.log('浮动DOM更新:', data);
        },
        onClose: () => {
          hide();
        },
      });
      
      univerContainer.appendChild(floatContainer);
      vueApp.mount(floatContainer);

      // 等待组件挂载后添加拖拽功能
      setTimeout(() => {
        if (floatContainer) {
          cleanupDrag = makeDraggable(floatContainer);
        }
      }, 100);

      if (button) button.textContent = '移除浮动DOM';
    } catch (error) {
      console.error('Failed to show float DOM:', error);
    }
  }

  // 隐藏浮动 DOM
  function hide() {
    if (cleanupDrag) {
      cleanupDrag();
      cleanupDrag = null;
    }
    if (vueApp) {
      vueApp.unmount();
      vueApp = null;
    }
    if (floatContainer) {
      floatContainer.remove();
      floatContainer = null;
    }
    if (button) button.textContent = '添加浮动DOM';
  }

  // 清理
  function dispose() {
    hide();
  }

  return { createButton, dispose };
}

