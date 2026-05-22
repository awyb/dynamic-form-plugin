/**
 * 动态表单插件 — 控件组件
 *
 * 13 种控件类型，全部自包含。
 * 依赖 shadcn/ui 作为 peer dependency。
 */
import React, { forwardRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import { cn } from "./utils";
import type { FieldConfig } from "./types";

// ═══════════════════════════════════════════════════
// 默认常量
// ═══════════════════════════════════════════════════

const DEFAULT_COLORS: Record<string, string> = {
  "0": "#000000",
  "1": "#FF0000",
  "2": "#00FF00",
  "3": "#0000FF",
  "4": "#FFFF00",
  "5": "#FF00FF",
  "6": "#00FFFF",
  "7": "#808080",
  "8": "#800000",
  "9": "#008000",
  "10": "#000080",
  "11": "#808000",
  "12": "#800080",
};

const DEFAULT_LINE_TYPES = new Map([
  ["1", { label: "实线-直线", type: "linear", strokeDasharray: "", value: 1 }],
  [
    "2",
    { label: "虚线-直线", type: "linear", strokeDasharray: "6 4", value: 2 },
  ],
  [
    "3",
    { label: "点线-直线", type: "linear", strokeDasharray: "2 4", value: 3 },
  ],
  [
    "4",
    {
      label: "点划线-直线",
      type: "linear",
      strokeDasharray: "6 2 2 2",
      value: 4,
    },
  ],
]);

const DEFAULT_LINE_WIDTHS: Record<string, number> = {
  "10": 0.1,
  "20": 0.2,
  "30": 0.3,
  "40": 0.4,
  "50": 0.5,
  "60": 0.6,
  "70": 0.7,
  "80": 0.8,
  "120": 1.2,
  "180": 1.8,
  "240": 2.4,
  "320": 3.2,
};

// ═══════════════════════════════════════════════════
// 类型
// ═══════════════════════════════════════════════════

export type ControlMainProps = FieldConfig & {
  value: any;
  onChange?: (value: any) => void;
  onBlur?: (e: any) => void;
  onClick?: (e: any) => void;
  /** form element id (from FormControl Slot) */
  id?: string;
  /** 颜色表覆盖 */
  colors?: Record<string, string>;
  /** 数字精度 */
  precision?: number;
  /** 图标 */
  unfoldIcon?: React.ReactNode;
  arrowIcon?: React.ReactNode;
};

// ═══════════════════════════════════════════════════
// ControlMain — 根据 type 分发
// ═══════════════════════════════════════════════════

export const ControlMain = forwardRef<any, ControlMainProps>((props, ref) => {
  const { type, custom } = props;

  switch (type) {
    case 1:
      return <ControlInput {...props} ref={ref} />;
    case 2:
      return <ControlSelect {...props} ref={ref} />;
    case 3:
      return <ControlCheckbox {...props} ref={ref} />;
    case 4:
      return <ControlRadioGroup {...props} ref={ref} />;
    case 8:
      return <ControlMenuButton {...props} ref={ref} />;
    case 9:
      return <ControlColorPicker {...props} ref={ref} />;
    case 10:
      return <ControlLineStyle {...props} ref={ref} />;
    case 11:
      return <ControlLineWidth {...props} ref={ref} />;
    case 12:
      return <ControlVerticalNumber {...props} ref={ref} />;
    case 999:
      return (custom ?? null) as any;
    default:
      return (
        <div
          className={cn(
            "flex items-center",
            // props.controlclass,
            props.className0,
          )}
        >
          <span className={cn("text-xs", props.controlclass)}>
            {props.value}
          </span>
          {props.extendcontrol}
        </div>
      );
  }
});

ControlMain.displayName = "ControlMain";

// ═══════════════════════════════════════════════════
// type=1 — 文本/数字输入框
// ═══════════════════════════════════════════════════

const ControlInput = forwardRef<HTMLInputElement, ControlMainProps>(
  (props, ref) => {
    const {
      id,
      name,
      maxlen,
      minlen,
      label,
      placeholder,
      controlclass,
      extendcontrol,
      className0,
      ref1,
      value,
      onChange,
      onBlur,
      onClick,
      disabled,
    } = props;


    return (
      <div className={cn("flex items-center", className0)}>
        <Input
          id={id}
          name={name}
          ref={ref1 || ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onClick={onClick}
          disabled={!!disabled}
          maxLength={maxlen}
          minLength={minlen}
          placeholder={placeholder ?? `${label}`}
          className={controlclass}
          autoComplete="off"
        />
        {extendcontrol}
      </div>
    );
  },
);
ControlInput.displayName = "ControlInput";

// ═══════════════════════════════════════════════════
// type=2 — 下拉选择
// ═══════════════════════════════════════════════════

const ControlSelect = forwardRef<HTMLButtonElement, ControlMainProps>(
  (props, ref) => {
    const {
      id,
      name,
      onChange,
      value,
      controlclass,
      options = [],
      isnum,
      disabled,
      extendcontrol,
      className0,
    } = props;

    return (
      <div className={cn("flex items-center", className0)}>
        <Select
          name={name}
          onValueChange={(val) => onChange?.(isnum ? Number(val) : val)}
          value={value?.toString()}
          disabled={!!disabled}
        >
          <SelectTrigger
            id={id}
            ref={ref}
            className={cn(
              "w-40 h-6 leading-6 text-xs bg-white rounded-none pl-2",
              controlclass,
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {options.map(
              (opt: {
                value: any;
                name: any;
                className?: string;
                disabled?: boolean;
              }) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value.toString()}
                  className={cn("text-xs pl-2", opt.className)}
                  disabled={!!opt.disabled}
                >
                  {opt.name}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        {extendcontrol}
      </div>
    );
  },
);
ControlSelect.displayName = "ControlSelect";

// ═══════════════════════════════════════════════════
// type=3 — 复选框
// ═══════════════════════════════════════════════════

const ControlCheckbox = forwardRef<HTMLButtonElement, ControlMainProps>(
  (props, ref) => {
    const {
      id,
      name,
      value,
      extendcontrol,
      className0,
      checkedClassName,
      onClick,
    } = props;

    return (
      <div className={cn("flex items-center", className0)}>
        <Checkbox
          id={id}
          name={name}
          ref={ref}
          checked={Boolean(value)}
          onClick={onClick}
          className={checkedClassName}
        />
        {extendcontrol}
      </div>
    );
  },
);
ControlCheckbox.displayName = "ControlCheckbox";

// ═══════════════════════════════════════════════════
// type=4 — 单选组
// ═══════════════════════════════════════════════════

const ControlRadioGroup = forwardRef<HTMLButtonElement, ControlMainProps>(
  (props, _ref) => {
    const {
      onChange,
      value,
      extendcontrol,
      isnum,
      options = [],
      radioClassName,
      labelClassName,
    } = props;

    return (
      <RadioGroup
        value={value?.toString()}
        onValueChange={(val) => onChange?.(isnum ? Number(val) : val)}
      >
        {options.map(
          (opt: {
            value: any;
            name: any;
            disabled?: number;
            className?: string;
            extendcontrol?: any;
          }) => (
            <label
              key={opt.value}
              className={cn(
                "flex items-center gap-2 h-6 cursor-pointer",
                !!opt.disabled && "text-gray-400",
                labelClassName,
              )}
            >
              <RadioGroupItem
                value={opt.value}
                className={radioClassName}
                disabled={!!opt.disabled}
              />
              <span className={cn("text-xs", opt.className)}>{opt.name}</span>
              {opt.extendcontrol}
            </label>
          ),
        )}
        {extendcontrol}
      </RadioGroup>
    );
  },
);
ControlRadioGroup.displayName = "ControlRadioGroup";

// ═══════════════════════════════════════════════════
// type=8 — 菜单按钮 + 跳转按钮
// ═══════════════════════════════════════════════════

const ControlMenuButton = forwardRef<HTMLButtonElement, ControlMainProps>(
  (props, ref) => {
    const {
      btnClick,
      disabled,
      menus,
      extendcontrol,
      disabledBtn,
      showMenu = true,
      controlclass,
      className0,
      unfoldIcon,
      arrowIcon,
    } = props;

    return (
      <div
        className={cn("flex items-center", controlclass, className0, "pl-0")}
      >
        {showMenu && (
          <Menubar className="h-5 rounded-none p-0">
            <MenubarMenu>
              <MenubarTrigger
                ref={ref}
                className="p-0 rounded-none h-5"
                disabled={disabled}
              >
                <div
                  className={cn(
                    "flex items-center justify-center h-5 w-6 rounded-none border text-xs",
                    disabled ? "" : "bg-white hover:bg-gray-100",
                  )}
                >
                  {unfoldIcon ?? "···"}
                </div>
              </MenubarTrigger>
              <MenubarContent className="z-[9999] min-w-0 rounded-none">
                {menus?.map(
                  (menu: { name: string; action: () => void }, i: number) => (
                    <MenubarItem
                      className="text-xs p-1 h-6"
                      key={i}
                      onClick={menu.action}
                    >
                      {menu.name}
                    </MenubarItem>
                  ),
                )}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
        <Button
          type="button"
          disabled={!!disabledBtn}
          className="p-1 h-5 w-6 rounded-none bg-white border ml-0.5 hover:bg-gray-100 text-black"
          onClick={btnClick}
        >
          {arrowIcon ?? "→"}
        </Button>
        {extendcontrol && (
          <span className="whitespace-nowrap ml-1">{extendcontrol}</span>
        )}
      </div>
    );
  },
);
ControlMenuButton.displayName = "ControlMenuButton";

// ═══════════════════════════════════════════════════
// type=9 — 色块选择器
// ═══════════════════════════════════════════════════

const ControlColorPicker = forwardRef<HTMLButtonElement, ControlMainProps>(
  (props, ref) => {
    const {
      id,
      name,
      onChange,
      value,
      controlclass,
      extendcontrol,
      colors = DEFAULT_COLORS,
      className0,
    } = props;

    return (
      <div className={cn("flex items-center", className0)}>
        <Select name={name} onValueChange={onChange} value={value?.toString()}>
          <SelectTrigger
            id={id}
            ref={ref}
            className={cn(
              "w-40 h-6 leading-6 text-xs bg-white rounded-none pl-2",
              controlclass,
            )}
          >
            <SelectValue>
              {typeof Number(value) === "number" ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4"
                    style={{ background: colors[value] }}
                  />
                  {value}
                </div>
              ) : (
                <span className="text-gray-400">{value ?? "Select"}</span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[9999] w-24 min-w-24 max-h-40 overflow-y-auto">
            {Object.entries(colors).map(([key, color]) => (
              <SelectItem
                key={key}
                value={key}
                className="text-xs pl-2 flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4"
                    style={{
                      background: color as React.CSSProperties["background"],
                    }}
                  />
                  {key}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {extendcontrol}
      </div>
    );
  },
);
ControlColorPicker.displayName = "ControlColorPicker";

// ═══════════════════════════════════════════════════
// type=10 — 线型选择器
// ═══════════════════════════════════════════════════

const SvgLine = ({ pattern, w = 60 }: { pattern: string; w?: number }) => (
  <svg width={w} height="10" className="flex-shrink-0">
    <line
      x1="0"
      y1="5"
      x2={w}
      y2="5"
      stroke="black"
      strokeWidth="1"
      strokeDasharray={pattern}
    />
  </svg>
);

const ControlLineStyle = forwardRef<HTMLButtonElement, ControlMainProps>(
  (props, ref) => {
    const { id, name, onChange, value, controlclass, extendcontrol } = props;

    return (
      <div className="flex items-center">
        <Select name={name} onValueChange={onChange} value={value?.toString()}>
          <SelectTrigger
            id={id}
            ref={ref}
            className={cn(
              "w-40 h-6 leading-6 text-xs bg-white rounded-none pl-2",
              controlclass,
            )}
          >
            <SelectValue>
              {typeof Number(value - 1) === "number" ? (
                <SvgLine
                  pattern={
                    DEFAULT_LINE_TYPES.get(value?.toString())
                      ?.strokeDasharray ?? ""
                  }
                />
              ) : (
                <span className="text-gray-400">Select</span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[9999] w-24 min-w-24 max-h-40 overflow-y-auto">
            {Array.from(DEFAULT_LINE_TYPES).map(([key, line]) => (
              <SelectItem key={key} value={key} className="text-xs pl-2">
                <SvgLine pattern={line.strokeDasharray} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {extendcontrol}
      </div>
    );
  },
);
ControlLineStyle.displayName = "ControlLineStyle";

// ═══════════════════════════════════════════════════
// type=11 — 线宽选择器
// ═══════════════════════════════════════════════════

const SvgLineWidth = ({ w }: { w: number }) => (
  <svg width="40" height="10" className="flex-shrink-0">
    <line x1="0" y1="5" x2="40" y2="5" stroke="black" strokeWidth={w} />
  </svg>
);

const ControlLineWidth = forwardRef<HTMLButtonElement, ControlMainProps>(
  (props, ref) => {
    const { id, name, onChange, value, controlclass, extendcontrol } = props;

    return (
      <div className="flex items-center">
        <Select name={name} onValueChange={onChange} value={value?.toString()}>
          <SelectTrigger
            id={id}
            ref={ref}
            className={cn(
              "w-40 h-6 leading-6 text-xs bg-white rounded-none pl-2",
              controlclass,
            )}
          >
            <SelectValue>
              {typeof Number(value) === "number" ? (
                <div className="flex items-center gap-2">
                  <SvgLineWidth w={DEFAULT_LINE_WIDTHS[value] ?? 1} />
                  {DEFAULT_LINE_WIDTHS[value]}
                </div>
              ) : (
                <span className="text-gray-400">Select</span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[9999] w-24 min-w-24 max-h-40 overflow-y-auto">
            {Object.entries(DEFAULT_LINE_WIDTHS).map(([key, w]) => (
              <SelectItem key={key} value={key} className="text-xs pl-2">
                <div className="flex items-center gap-2">
                  <SvgLineWidth w={w} />
                  {w}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {extendcontrol}
      </div>
    );
  },
);
ControlLineWidth.displayName = "ControlLineWidth";

// ═══════════════════════════════════════════════════
// type=12 — 垂直数字输入
// ═══════════════════════════════════════════════════

const ControlVerticalNumber = forwardRef<HTMLInputElement, ControlMainProps>(
  (props, ref) => {
    const {
      id,
      name,
      onChange,
      value,
      controlclass,
      minlen = 0,
      maxlen = 100,
      disabled,
    } = props;
    const num = Number(value ?? 0);

    return (
      <div
        className={cn(
          "inline-grid grid-cols-[1fr_auto] items-center border rounded overflow-hidden h-6 min-h-6",
          "bg-white border-gray-300",
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : "",
          controlclass,
        )}
      >
        <Input
          id={id}
          name={name}
          ref={ref}
          type="text"
          inputMode="numeric"
          value={value ?? ""}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d-]/g, "");
            const parsed = raw === "" || raw === "-" ? minlen : Number(raw);
            const clamped = Math.min(maxlen, Math.max(minlen, parsed));
            onChange?.(clamped);
          }}
          disabled={disabled}
          className="w-full border-none outline-none pl-2 text-xs leading-none disabled:bg-transparent disabled:cursor-not-allowed"
        />
        <div
          className="flex flex-col border-l border-gray-300 -mt-[2px]"
          style={{ height: "inherit" }}
        >
          <button
            type="button"
            className="flex-1 px-1 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 disabled:opacity-40 flex items-center justify-center leading-none"
            disabled={disabled || num >= maxlen}
            onClick={() => onChange?.(Math.min(maxlen, num + 1))}
          >
            ▲
          </button>
          <div className="h-px bg-gray-300" />
          <button
            type="button"
            className="flex-1 px-1 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 disabled:opacity-40 flex items-center justify-center leading-none"
            disabled={disabled || num <= minlen}
            onClick={() => onChange?.(Math.max(minlen, num - 1))}
          >
            ▼
          </button>
        </div>
      </div>
    );
  },
);
ControlVerticalNumber.displayName = "ControlVerticalNumber";
