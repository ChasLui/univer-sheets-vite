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
 * 导出 JSON 插件
 * 在工具栏添加一个按钮，点击后将当前工作簿的 JSON 数据打印到控制台
 */
export class ExportJsonPlugin extends Plugin {
  static override type = UniverInstanceType.UNIVER_SHEET;
  static override pluginName = "EXPORT_JSON_PLUGIN";

  constructor(
    _config: unknown,
    @Inject(Injector) protected readonly _injector: Injector,
    @Inject(ICommandService) private readonly _commandService: ICommandService,
    @Inject(IMenuManagerService) private readonly _menuManagerService: IMenuManagerService
  ) {
    super();
  }

  override onStarting(): void {
    const commandId = "export-json.operation.print-workbook";

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
          console.error("❌ 无法获取当前工作簿");
          return false;
        }

        // 导出工作簿数据
        const workbookData = workbook.save();
        console.log("📄 工作簿 JSON 数据：");
        console.log(workbookData);
        console.info("✅ 数据已打印到控制台，可以复制使用");

        return true;
      },
    };

    // 2. 注册命令
    this.disposeWithMe(this._commandService.registerCommand(command));

    // 3. 定义菜单项（在工具栏显示）
    const menuItemFactory = () => ({
      id: commandId,
      title: "📄JSON",
      tooltip: "导出当前工作簿的 JSON 数据到控制台",
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

