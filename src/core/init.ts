import { Univer, UniverInstanceType } from "@univerjs/core";
import { FUniver } from "@univerjs/core/facade";
import type { IWorkbookData } from "@univerjs/core";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaUIPlugin } from "@univerjs/sheets-formula-ui";
import { UniverSheetsNumfmtUIPlugin } from "@univerjs/sheets-numfmt-ui";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverSheetsDrawingPlugin } from "@univerjs/sheets-drawing";
import { UniverSheetsDrawingUIPlugin } from "@univerjs/sheets-drawing-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import { UniverVue3AdapterPlugin } from "@univerjs/ui-adapter-vue3";
import { ExportJsonPlugin } from "../plugins/export-json";
import { univerConfig, uiPluginConfig } from "../config/univer-config";

/**
 * 初始化 Univer 实例
 */
export function initUniver(workbookData: IWorkbookData): FUniver {
  // 创建 Univer 实例
  const univer = new Univer(univerConfig);

  // 注册插件（顺序很重要）
  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);
  univer.registerPlugin(UniverUIPlugin, uiPluginConfig);
  univer.registerPlugin(UniverVue3AdapterPlugin);
  univer.registerPlugin(UniverDocsPlugin);
  univer.registerPlugin(UniverDocsUIPlugin);
  univer.registerPlugin(UniverSheetsPlugin);
  univer.registerPlugin(UniverSheetsUIPlugin);
  univer.registerPlugin(UniverSheetsDrawingPlugin);
  univer.registerPlugin(UniverSheetsDrawingUIPlugin);
  univer.registerPlugin(UniverSheetsFormulaUIPlugin);
  univer.registerPlugin(UniverSheetsNumfmtUIPlugin);
  univer.registerPlugin(ExportJsonPlugin);

  // 创建工作簿
  univer.createUnit(UniverInstanceType.UNIVER_SHEET, workbookData);

  // 创建 API
  const univerAPI = FUniver.newAPI(univer);

  // 暴露到全局（调试用）
  if (typeof window !== 'undefined') {
    (window as any).univer = univer;
    (window as any).univerAPI = univerAPI;
  }

  return univerAPI;
}

