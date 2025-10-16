import { LocaleType, LogLevel } from "@univerjs/core";
import type { IUniverConfig } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { locales } from "../locales";

/**
 * Univer 基础配置
 */
export const univerConfig: Partial<IUniverConfig> = {
  theme: defaultTheme,
  locale: LocaleType.ZH_CN,
  locales: locales as any,
  logLevel: LogLevel.VERBOSE,
};

/**
 * UI 插件配置
 */
export const uiPluginConfig = {
  container: "app",
};

