/**
 * 动态表单插件 — 全部控件类型完整演示
 *
 * 覆盖 type 0~12 + 999，每种控件展示典型配置。
 * 运行方式：在任意页面引入 <AllTypesDemo />。
 */
import { useState } from "react";
import { useDynamicForm, DynamicForm, buildFld } from "./index";
import type { FormNode } from "./types";

// ═══════════════════════════════════════════════════
// 构建覆盖所有 type 的 Schema
// ═══════════════════════════════════════════════════

const allTypesSchema: FormNode = {
  type: "default",
  key: "root",
  label: "",
  children: [
    // ──── type=0 只读展示文本 ────
    {
      type: "container",
      key: "sect_type0",
      label: "外部边框",
      children: [
        {
          type: "control",
          key: "row_type0",
          flds: [
            buildFld({
              name: "readonly_field",
              label: "计算值",
              type: 0,
              isnum: 0,
              controlclass: "text-red-600 font-mono",
            }),
          ],
        },
        {
          type: "control",
          key: "row_text",
          flds: [
            buildFld({
              name: "loc_name",
              label: "名称",
              type: 1,
              isnum: 0,
              required: 1,
              maxlen: 30,
              placeholder: "请输入名称",
            }),
          ],
        },
        {
          type: "container",
          key: "sect_type1",
          label: "type=1 — 文本/数字输入框",
          children: [
            {
              type: "control",
              key: "row_number",
              flds: [
                buildFld({
                  name: "uknom",
                  label: "额定电压",
                  unit: "kV",
                  type: 1,
                  isnum: 1,
                  required: 1,
                  maxlen: 10,
                }),
              ],
            },
            {
              type: "control",
              key: "row_disabled",
              flds: [
                buildFld({
                  name: "disabled_input",
                  label: "禁用输入",
                  unit: "",
                  type: 1,
                  isnum: 0,
                  controlclass: "w-40",
                  disabled: true,
                }),
              ],
            },
          ],
        },
        {
          type: "container",
          key: "sect_type2",
          label: "type=2 — 下拉选择框",
          children: [
            {
              type: "control",
              key: "row_select_str",
              flds: [
                buildFld({
                  name: "loss_assign",
                  label: "损耗分配",
                  type: 2,
                  isnum: 1,
                  controlclass: "w-48",
                  options: [
                    { value: "0", name: "按分组" },
                    { value: "1", name: "均匀分布", disabled: 1 },
                    { value: "2", name: "到 I 侧", className: "text-blue-600" },
                    { value: "3", name: "到 J 侧" },
                  ],
                }),
                buildFld({
                  name: "test_fld",
                  label: "附加字段",
                  unit: "cm",
                  unitclass: "text-blue-500",
                  type: 1,
                  isnum: 1,
                  labelclass: "ml-12 w-24",
                  show: (values) => values.loss_assign === 0,
                  required: 1,
                  maxlen: 10,
                }),
              ],
            },
            {
              type: "control",
              key: "row_select_disabled",
              flds: [
                buildFld({
                  name: "disabled_select",
                  label: "(禁用)",
                  type: 2,
                  isnum: 0,
                  controlclass: "w-40",
                  disabled: true,
                  options: [
                    { value: "a", name: "选项 A" },
                    { value: "b", name: "选项 B" },
                  ],
                }),
              ],
            },
          ],
        },
        {
          type: "container",
          key: "sect_type3",
          label: "type=3 — 复选框",
          props: { className: "w-2/3" },
          children: [
            {
              type: "control",
              key: "row_checkbox1",
              flds: [
                buildFld({
                  name: "outserv",
                  label: "",
                  type: 3,
                  isnum: 1,
                  labelclass: "w-0",
                  extendcontrol: <span className="ml-2">退出运行</span>,
                }),
              ],
            },
            {
              type: "control",
              key: "row_checkbox2",
              flds: [
                buildFld({
                  name: "vstep_change",
                  label: "",
                  type: 3,
                  isnum: 1,
                  labelclass: "w-0",
                  extendcontrol: <span className="ml-2">允许电压阶跃变化</span>,
                }),
              ],
            },
            {
              type: "control",
              key: "row_checkbox3",
              flds: [
                buildFld({
                  name: "auto_tap",
                  label: "",
                  type: 3,
                  isnum: 1,
                  labelclass: "w-0",
                  checkedClassName: "data-[state=checked]:bg-green-600",
                  extendcontrol: (
                    <span className="ml-2 text-green-700">
                      自动调压 (自定义颜色)
                    </span>
                  ),
                }),
              ],
            },
          ],
        },
        {
          type: "default",
          key: "root-1",
          label: "",
          props: { className: "flex space-x-2" },
          children: [
            {
              type: "container",
              key: "sect_type4-1",
              label: "type=4 — 单选组1",
              children: [
                {
                  type: "control",
                  key: "row_radio1",
                  flds: [
                    buildFld({
                      name: "iopt_net",
                      label: "",
                      type: 4,
                      isnum: 1,
                      labelclass: "w-0",
                      className: "h-auto leading-tight ",
                      options: [
                        { name: "AC 潮流 (平衡正序)", value: "0" },
                        {
                          name: "AC 潮流 (不平衡三相)",
                          value: "1",
                          extendcontrol: (
                            <span className="text-xs text-green-600 ml-2">
                              (推荐)
                            </span>
                          ),
                        },
                        { name: "DC 潮流 (线性)", value: "2", disabled: 1 },
                      ],
                    }),
                  ],
                },
              ],
            },
            {
              type: "container",
              key: "sect_type4-2",
              label: "type=4 — 单选组2",
              props: { mclassName: "h-36" },
              children: [
                {
                  type: "control",
                  key: "row_radio2",
                  flds: [
                    buildFld({
                      name: "fault_type",
                      label: "故障类型",
                      type: 4,
                      isnum: 0,
                      labelclass: "w-24",
                      className: "space-y-1 h-auto ",
                      radioClassName: "data-[state=checked]:border-red-600",
                      labelClassName: "font-medium",
                      options: [
                        { name: "单相接地", value: "SLG" },
                        {
                          name: "两相短路",
                          value: "LL",
                          className: "text-green-600",
                        },
                        { name: "三相短路", value: "3PH" },
                        { name: "两相接地", value: "DLG" },
                      ],
                    }),
                  ],
                },
                {
                  type: "control",
                  key: "temp_readonly",
                  flds: [
                    buildFld({
                      name: "temp_readonly",
                      label: "",
                      type: 0,
                      isnum: 0,
                      labelclass: "w-24",
                      controlclass: "w-0",
                      // extendcontrol: (
                      //   <span className="text-red-600 font-mono">
                      //     (仅单相接地时显示)
                      //   </span>
                      // ),
                      compute: (values) => ({
                        extendcontrol:
                          values.fault_type === "SLG" ? (
                            <span className="text-red-600 font-mono">
                              (仅单相接地时显示)
                            </span>
                          ) : (
                            <>123</>
                          ),
                      }),
                      // show: (values) => values.fault_type === "LL",
                    }),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // ──── type=8 菜单按钮 + 跳转按钮 ────
    {
      type: "container",
      key: "sect_type8",
      label: "type=8 — 菜单 + 跳转按钮",
      children: [
        {
          type: "control",
          key: "row_menu1",
          flds: [
            buildFld({
              name: "typ_id",
              label: "类型选择",
              type: 8,
              isnum: 0,
              labelclass: "w-24",
              controlclass: "w-60",
              extendcontrol: (
                <span className="text-blue-500 ml-2 text-xs">
                  {/* 这里可以放 watch 的值展示 */}
                  已选: 线路类型 #1
                </span>
              ),
              menus: [
                { name: "选择类型...", action: () => alert("打开选择窗口") },
                { name: "新建类型...", action: () => alert("新建类型") },
                { name: "重置", action: () => alert("已重置") },
              ],
              btnClick: () => alert("编辑当前类型"),
              disabledBtn: false,
            }),
          ],
        },
        {
          type: "control",
          key: "row_menu2",
          flds: [
            buildFld({
              name: "elm_select",
              label: "元件选择",
              type: 8,
              isnum: 0,
              labelclass: "w-24",
              disabled: true,
              showMenu: false,
              btnClick: () => alert("选择元件"),
              disabledBtn: false,
              extendcontrol: (
                <span className="text-xs text-gray-400 ml-2">
                  (仅按钮，无菜单)
                </span>
              ),
            }),
          ],
        },
      ],
    },

    // ──── type=9 颜色选择器 ────
    {
      type: "container",
      key: "sect_type9",
      label: "type=9 — 颜色选择器",
      children: [
        {
          type: "control",
          key: "row_color1",
          flds: [
            buildFld({
              name: "node_color",
              label: "节点颜色",
              type: 9,
              isnum: 0,
              labelclass: "w-24",
              controlclass: "",
            }),
          ],
        },
        {
          type: "control",
          key: "row_color2",
          flds: [
            buildFld({
              name: "edge_color",
              label: "连线颜色",
              type: 9,
              isnum: 0,
              labelclass: "w-24",
              controlclass: "",
            }),
          ],
        },
      ],
    },

    // ──── type=10 线型选择器 ────
    {
      type: "container",
      key: "sect_type10",
      label: "type=10 — 线型选择器",
      children: [
        {
          type: "control",
          key: "row_line_style",
          flds: [
            buildFld({
              name: "line_style",
              label: "连线样式",
              type: 10,
              isnum: 0,
              labelclass: "w-24",
              controlclass: "",
            }),
          ],
        },
      ],
    },

    // ──── type=11 线宽选择器 ────
    {
      type: "container",
      key: "sect_type11",
      label: "type=11 — 线宽选择器",
      children: [
        {
          type: "control",
          key: "row_line_width",
          flds: [
            buildFld({
              name: "line_width",
              label: "连线宽度",
              type: 11,
              isnum: 0,
              labelclass: "w-24",
              controlclass: "",
            }),
          ],
        },
      ],
    },

    // ──── type=12 垂直数字输入 ────
    {
      type: "container",
      key: "sect_type12",
      label: "type=12 — 垂直数字输入",
      children: [
        {
          type: "control",
          key: "row_vert_num",
          flds: [
            buildFld({
              name: "tap_position",
              label: "分接头档位",
              type: 12,
              isnum: 1,
              labelclass: "w-24",
              controlclass: "",
              minlen: -16,
              maxlen: 16,
            }),
          ],
        },
      ],
    },

    // ──── type=999 自定义节点 ────
    {
      type: "container",
      key: "sect_type999",
      label: "type=999 — 自定义渲染",
      children: [
        {
          type: "control",
          key: "row_custom1",
          flds: [
            buildFld({
              name: "custom_label",
              label: "自定义按钮",
              type: 999,
              isnum: 0,
              custom: (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="h-6 px-3 text-xs border rounded bg-white hover:bg-sky-100 hover:border-sky-500"
                    onClick={() => alert("自定义动作 A")}
                  >
                    线路负荷
                  </button>
                  <button
                    type="button"
                    className="h-6 px-3 text-xs border rounded bg-white hover:bg-sky-100 hover:border-sky-500"
                    onClick={() => alert("自定义动作 B")}
                  >
                    日负荷曲线
                  </button>
                </div>
              ),
            }),
          ],
        },
        {
          type: "control",
          key: "row_custom2",
          flds: [
            buildFld({
              name: "custom_info",
              label: "状态指示",
              type: 999,
              isnum: 0,
              custom: (
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 border border-green-300 rounded">
                  ● 已连接
                </span>
              ),
            }),
          ],
        },
        {
          type: "control",
          key: "row_custom3",
          flds: [
            buildFld({
              name: "custom_color",
              label: "颜色面板",
              type: 999,
              isnum: 0,
              custom: (
                <div className="flex gap-1">
                  {["#FF0000", "#00FF00", "#0000FF", "#FFA500", "#800080"].map(
                    (c) => (
                      <div
                        key={c}
                        className="w-5 h-5 rounded border cursor-pointer hover:scale-110 transition-transform"
                        style={{ background: c }}
                        onClick={() => alert(`选择了 ${c}`)}
                      />
                    ),
                  )}
                </div>
              ),
            }),
          ],
        },
      ],
    },

    // ──── 混合行: 同一行放 Label+控件+单位 ────
    {
      type: "container",
      key: "sect_combo",
      label: "组合示例 — 一行多个字段",
      children: [
        {
          type: "control",
          key: "row_combo1",
          flds: [
            buildFld({
              name: "vtarget",
              label: "目标电压",
              unit: "p.u.",
              type: 1,
              isnum: 1,
              required: 1,
            }),
            buildFld({
              name: "Vtarget",
              label: "",
              unit: "kV",
              type: 1,
              isnum: 1,
              required: 1,
              labelclass: "w-0 ml-16",
            }),
          ],
        },
        {
          type: "control",
          key: "row_combo2",
          flds: [
            buildFld({
              name: "dline",
              label: "线路长度",
              unit: "km",
              type: 1,
              isnum: 1,
              required: 1,
            }),
            buildFld({
              name: "maxload",
              label: "热极限",
              unit: "%",
              type: 1,
              isnum: 1,
              required: 1,
              labelclass: "w-12 ml-4",
            }),
            buildFld({
              name: "Top",
              label: "运行温度",
              unit: "°C",
              type: 1,
              isnum: 1,
              labelclass: "w-16 ml-4",
            }),
          ],
        },
      ],
    },

    // ──── hide/show 条件显示 ────
    {
      type: "container",
      key: "sect_hide",
      label: "条件显示 (hide / show)",
      children: [
        {
          type: "control",
          key: "row_hide1",
          flds: [
            buildFld({
              name: "always_hidden",
              label: "(始终隐藏)",
              type: 1,
              isnum: 0,
              hide: true,
              controlclass: "w-40",
            }),
            buildFld({
              name: "always_shown",
              label: "显示",
              type: 1,
              isnum: 0,
              show: true,
              controlclass: "w-40",
            }),
          ],
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════
// 表单默认值 (覆盖所有字段)
// ═══════════════════════════════════════════════════

const allTypesDefaults = {
  readonly_field: "3.1415926",
  loc_name: "Bus-001",
  uknom: 110,
  disabled_input: "不可编辑",
  loss_assign: 0,
  disabled_select: "a",
  outserv: 0,
  vstep_change: 1,
  auto_tap: 0,
  iopt_net: 0,
  fault_type: "3PH",
  typ_id: "",
  elm_select: "",
  node_color: "1",
  edge_color: "4",
  line_style: "2",
  line_width: "80",
  tap_position: 5,
  vtarget: 1.0,
  Vtarget: 110,
  dline: 5.2,
  maxload: 100,
  Top: 25,
  custom_label: "",
  custom_info: "",
  custom_color: "",
  always_shown: "",
  always_hidden: "",
};

// ═══════════════════════════════════════════════════
// 完整 Demo 页面
// ═══════════════════════════════════════════════════

export function AllTypesDemo() {
  const inst = useDynamicForm({
    schema: allTypesSchema,
    defaultValues: allTypesDefaults,
    data: {
      loc_name: "test",
    },
  });

  const [result, setResult] = useState<Record<string, any> | null>(null);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-gray-100">
      {/* 顶部标题栏 */}
      <header className="flex-none px-6 py-3 bg-white border-b shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">
          动态表单插件 — 全部控件类型演示
        </h1>
      </header>

      {/* 主体 */}
      <div className="flex flex-1 min-h-0">
        {/* 左侧表单区 */}
        <main className="flex-1 flex flex-col min-h-0">
          {/* 表单渲染区 — 可滚动 */}
          <div className="flex-1 overflow-y-auto p-6 pb-3">
            <div className="max-w-4xl mx-auto">
              <div className="border rounded-md bg-white p-4 shadow-sm">
                <DynamicForm formInstance={inst} showInlineErrors />
              </div>
            </div>
          </div>

          {/* 操作栏 — 始终可见 */}
          <div className="flex-none border-t bg-white px-6 py-3 shadow-sm">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <button
                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                onClick={async () => {
                  const values = await inst.submit();
                  if (values) {
                    setResult(values);
                    console.log("✅ 校验通过:", values);
                  } else {
                    console.log("❌ 校验失败");
                  }
                }}
              >
                提交全部字段
              </button>
              <button
                className="px-4 py-1.5 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-40"
                disabled={!inst.isDirty}
                onClick={() => {
                  inst.reset();
                  setResult(null);
                }}
              >
                重置
              </button>
              {inst.isDirty && (
                <span className="text-sm text-amber-600">表单已修改</span>
              )}
            </div>
          </div>

          {/* 提交结果 — 独立面板 */}
          {result && (
            <div className="flex-none border-t bg-gray-50 px-6 py-3">
              <div className="max-w-4xl mx-auto">
                <details open className="border rounded-md bg-white">
                  <summary className="px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-gray-100">
                    提交结果 (全部字段)
                  </summary>
                  <pre className="p-4 text-xs overflow-auto max-h-60 whitespace-pre-wrap">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </main>
        {/* 右侧参考边栏 — 始终展开 */}
        <aside className="w-1/3 flex-none bg-white border-r overflow-y-auto p-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            控件类型速查表
          </div>
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-1.5 text-left w-12">type</th>
                <th className="border p-1.5 text-left w-24">控件名</th>
                <th className="border p-1.5 text-left">说明</th>
                <th className="border p-1.5 text-left">关键属性</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1.5 font-mono">0</td>
                <td className="border p-1.5">只读文本</td>
                <td className="border p-1.5">纯展示，无输入交互</td>
                <td className="border p-1.5 font-mono">value</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-1.5 font-mono">1</td>
                <td className="border p-1.5">输入框</td>
                <td className="border p-1.5">
                  文本 / 数字，支持精度、最大最小长度
                </td>
                <td className="border p-1.5 font-mono">
                  isnum, maxlen, minlen, required, disabled, placeholder
                </td>
              </tr>
              <tr>
                <td className="border p-1.5 font-mono">2</td>
                <td className="border p-1.5">下拉选择</td>
                <td className="border p-1.5">单选下拉框</td>
                <td className="border p-1.5 font-mono">
                  options[], isnum, disabled
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-1.5 font-mono">3</td>
                <td className="border p-1.5">复选框</td>
                <td className="border p-1.5">
                  布尔值，推荐搭配 extendcontrol 文字
                </td>
                <td className="border p-1.5 font-mono">
                  extendcontrol, checkedClassName
                </td>
              </tr>
              <tr>
                <td className="border p-1.5 font-mono">4</td>
                <td className="border p-1.5">单选组</td>
                <td className="border p-1.5">多个互斥选项</td>
                <td className="border p-1.5 font-mono">
                  options[], radioClassName, labelClassName
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-1.5 font-mono">5,6,7</td>
                <td className="border p-1.5">空占位</td>
                <td className="border p-1.5">保留位，渲染为空</td>
                <td className="border p-1.5 font-mono">-</td>
              </tr>
              <tr>
                <td className="border p-1.5 font-mono">8</td>
                <td className="border p-1.5">菜单按钮</td>
                <td className="border p-1.5">
                  折叠菜单 + 跳转按钮，用于选择/新建/编辑模式
                </td>
                <td className="border p-1.5 font-mono">
                  menus[], btnClick, disabledBtn, showMenu, extendcontrol
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-1.5 font-mono">9</td>
                <td className="border p-1.5">颜色选择</td>
                <td className="border p-1.5">色块 + 编号的下拉选择器</td>
                <td className="border p-1.5 font-mono">colors? (自定义色表)</td>
              </tr>
              <tr>
                <td className="border p-1.5 font-mono">10</td>
                <td className="border p-1.5">线型选择</td>
                <td className="border p-1.5">实线/虚线/点线/点划线 SVG 预览</td>
                <td className="border p-1.5 font-mono">-</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-1.5 font-mono">11</td>
                <td className="border p-1.5">线宽选择</td>
                <td className="border p-1.5">不同粗细的 SVG 线段预览</td>
                <td className="border p-1.5 font-mono">-</td>
              </tr>
              <tr>
                <td className="border p-1.5 font-mono">12</td>
                <td className="border p-1.5">垂直数字</td>
                <td className="border p-1.5">
                  ▲▼ 按钮 + 数字输入，适合分接头/档位
                </td>
                <td className="border p-1.5 font-mono">minlen, maxlen</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-1.5 font-mono">999</td>
                <td className="border p-1.5">自定义</td>
                <td className="border p-1.5">custom 属性传入任意 ReactNode</td>
                <td className="border p-1.5 font-mono">custom (ReactNode)</td>
              </tr>
            </tbody>
          </table>
        </aside>
      </div>
    </div>
  );
}
