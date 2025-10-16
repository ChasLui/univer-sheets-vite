import type { FUniver } from "@univerjs/core/facade";

/**
 * 批量弹窗功能
 * 在多个单元格同时显示组件
 */
export function createBatchFeature(univerAPI: FUniver, cells: string[] = ['H3', 'H5', 'H7']) {
  let disposables: any[] = [];
  let button: HTMLButtonElement | null = null;
  let sheetChangeDisposable: (() => void) | null = null;
  let currentSheetId: string | null = null;

  // 创建控制按钮
  function createButton(): HTMLButtonElement {
    button = document.createElement('button');
    button.textContent = `批量显示 (${cells.join('/')})`;
    button.className = 'univer-btn univer-btn-warning';
    button.onclick = toggle;
    return button;
  }

  // 切换显示/隐藏
  function toggle() {
    if (disposables.length > 0) {
      hide();
    } else {
      show();
    }
  }

  // 监听工作表切换
  function watchSheetChange() {
    // 清理旧的监听
    if (sheetChangeDisposable) {
      sheetChangeDisposable();
      sheetChangeDisposable = null;
    }

    // 使用定时器检查工作表是否切换
    const checkInterval = setInterval(() => {
      const workbook = univerAPI.getActiveWorkbook();
      if (!workbook) return;
      
      const worksheet = workbook.getActiveSheet();
      if (!worksheet) return;
      
      const activeSheetId = worksheet.getSheetId();
      
      // 如果工作表切换了，自动清理弹窗
      if (disposables.length > 0 && currentSheetId && activeSheetId !== currentSheetId) {
        hide();
      }
    }, 300);

    // 保存清理函数
    sheetChangeDisposable = () => clearInterval(checkInterval);
  }

  // 批量显示
  function show() {
    try {
      const workbook = univerAPI.getActiveWorkbook();
      if (!workbook) return;
      
      const worksheet = workbook.getActiveSheet();
      if (!worksheet) return;

      // 记录当前工作表 ID
      currentSheetId = worksheet.getSheetId();

      cells.forEach((cellAddress, index) => {
        const range = worksheet.getRange(cellAddress);
        const disposable = range.attachPopup({
          componentKey: 'SimpleVueButton',
          isVue3: true,
          extraProps: {
            label: `#${index + 1}`,
            onClick: (count: number) => {
              range.setValue(`${cellAddress}: ${count}`);
            },
          },
        });
        if (disposable) disposables.push(disposable);
      });

      if (button) button.textContent = '关闭批量显示';

      // 开始监听工作表切换
      watchSheetChange();
    } catch (error) {
      console.error('Failed to show batch popups:', error);
    }
  }

  // 批量隐藏
  function hide() {
    disposables.forEach(d => d.dispose());
    disposables = [];
    if (sheetChangeDisposable) {
      sheetChangeDisposable();
      sheetChangeDisposable = null;
    }
    currentSheetId = null;
    if (button) button.textContent = `批量显示 (${cells.join('/')})`;
  }

  // 清理
  function dispose() {
    hide();
  }

  return { createButton, dispose };
}

