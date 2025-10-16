import type { FUniver } from "@univerjs/core/facade";

/**
 * 按钮弹窗功能
 * 在指定单元格显示 Vue 按钮组件
 */
export function createButtonFeature(univerAPI: FUniver, cellAddress: string = 'F5') {
  let disposable: any = null;
  let button: HTMLButtonElement | null = null;
  let sheetChangeDisposable: (() => void) | null = null;
  let currentSheetId: string | null = null;

  // 创建控制按钮
  function createButton(): HTMLButtonElement {
    button = document.createElement('button');
    button.textContent = `显示按钮 (${cellAddress})`;
    button.className = 'univer-btn univer-btn-success';
    button.onclick = toggle;
    return button;
  }

  // 切换显示/隐藏
  function toggle() {
    if (disposable) {
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
      if (disposable && currentSheetId && activeSheetId !== currentSheetId) {
        hide();
      }
    }, 300);

    // 保存清理函数
    sheetChangeDisposable = () => clearInterval(checkInterval);
  }

  // 显示按钮
  function show() {
    try {
      const workbook = univerAPI.getActiveWorkbook();
      if (!workbook) return;
      
      const worksheet = workbook.getActiveSheet();
      if (!worksheet) return;

      // 记录当前工作表 ID
      currentSheetId = worksheet.getSheetId();

      const range = worksheet.getRange(cellAddress);
      disposable = range.attachPopup({
        componentKey: 'SimpleVueButton',
        isVue3: true,
        extraProps: {
          label: '单元格按钮',
          onClick: (count: number) => {
            range.setValue(`点击 ${count} 次`);
          },
        },
      });

      if (button) button.textContent = '关闭按钮';

      // 开始监听工作表切换
      watchSheetChange();
    } catch (error) {
      console.error('Failed to show button:', error);
    }
  }

  // 隐藏按钮
  function hide() {
    if (disposable) {
      disposable.dispose();
      disposable = null;
    }
    if (sheetChangeDisposable) {
      sheetChangeDisposable();
      sheetChangeDisposable = null;
    }
    currentSheetId = null;
    if (button) button.textContent = `显示按钮 (${cellAddress})`;
  }

  // 清理
  function dispose() {
    hide();
  }

  return { createButton, dispose };
}

