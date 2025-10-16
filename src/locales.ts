import { LocaleType } from "@univerjs/core";
import DesignEnUS from "@univerjs/design/locale/en-US";
import DesignZhCN from "@univerjs/design/locale/zh-CN";
import DocsUIEnUS from "@univerjs/docs-ui/locale/en-US";
import DocsUIZhCN from "@univerjs/docs-ui/locale/zh-CN";
import SheetsEnUS from "@univerjs/sheets/locale/en-US";
import SheetsZhCN from "@univerjs/sheets/locale/zh-CN";
import SheetsFormulaUIEnUS from "@univerjs/sheets-formula-ui/locale/en-US";
import SheetsFormulaUIZhCN from "@univerjs/sheets-formula-ui/locale/zh-CN";
import SheetsNumfmtUIEnUS from "@univerjs/sheets-numfmt-ui/locale/en-US";
import SheetsNumfmtUIZhCN from "@univerjs/sheets-numfmt-ui/locale/zh-CN";
import SheetsUIEnUS from "@univerjs/sheets-ui/locale/en-US";
import SheetsUIZhCN from "@univerjs/sheets-ui/locale/zh-CN";
import SheetsDrawingUIEnUS from "@univerjs/sheets-drawing-ui/locale/en-US";
import SheetsDrawingUIZhCN from "@univerjs/sheets-drawing-ui/locale/zh-CN";
import UIEnUS from "@univerjs/ui/locale/en-US";
import UIZhCN from "@univerjs/ui/locale/zh-CN";

export const locales = {
  [LocaleType.EN_US]: {
    ...DesignEnUS,
    ...UIEnUS,
    ...DocsUIEnUS,
    ...SheetsEnUS,
    ...SheetsUIEnUS,
    ...SheetsDrawingUIEnUS,
    ...SheetsFormulaUIEnUS,
    ...SheetsNumfmtUIEnUS,
  },
  [LocaleType.ZH_CN]: {
    ...DesignZhCN,
    ...UIZhCN,
    ...DocsUIZhCN,
    ...SheetsZhCN,
    ...SheetsUIZhCN,
    ...SheetsDrawingUIZhCN,
    ...SheetsFormulaUIZhCN,
    ...SheetsNumfmtUIZhCN,
  },
};
