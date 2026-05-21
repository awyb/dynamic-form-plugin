/**
 * 动态表单插件 — 布局组件
 *
 * SectionCard: 带标题边框的分组卡片
 * FormItemContent: 标签 + 控件 + 单位 的标准行布局
 */
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { cn } from "./utils";

// ═══════════════════════════════════════════════════
// SectionCard
// ═══════════════════════════════════════════════════

interface SectionCardProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  /** 右侧标题（可选） */
  rtitle?: string | React.ReactNode;
  className?: string;
  rclassName?: string;
  /** 内容区类名 */
  mclassName?: string;
  /** 是否显示右上角设置按钮 */
  showBtn?: boolean;
  /** 设置按钮点击 */
  onClick?: () => void;
  /** 自定义设置图标 */
  settingsIcon?: React.ReactNode;
}

export function SectionCard({
  title,
  children,
  className,
  rtitle,
  rclassName,
  mclassName,
  showBtn,
  onClick,
  settingsIcon,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "relative border border-gray-300 p-4 rounded-md w-full mt-4",
        className,
      )}
    >
      <div className="absolute -top-3 bg-white left-2 px-2 text-xs flex items-center">
        {title}
      </div>
      {rtitle && (
        <div
          className={cn(
            "absolute -top-3 bg-white left-2/3 text-xs flex items-center",
            rclassName,
          )}
        >
          {rtitle}
        </div>
      )}
      {showBtn && (
        <button
          type="button"
          className="h-5 w-5 bg-white hover:bg-gray-100 p-0.5 absolute right-2 top-1 border rounded"
          onClick={onClick}
        >
          {settingsIcon ?? "⚙"}
        </button>
      )}
      <div className={cn("text-xs", mclassName)}>{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// FormItemContent
// ═══════════════════════════════════════════════════

interface FormItemContentProps {
  label: string | React.ReactNode;
  control: string | React.ReactNode;
  extendcontent?: string | React.ReactNode;
  unit?: string | React.ReactNode;
  labelclass?: string;
  unitclass?: string;
  hide?: boolean | ((values: Record<string, any>) => boolean);
  show?: boolean | ((values: Record<string, any>) => boolean);
  /** 当前所有表单值（用于 hide/show 动态判断） */
  values?: Record<string, any>;
  sectionbox?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  /** 设为 true 时不渲染 <label for=...> 而是纯 <span>，用于 RadioGroup 等非标控件 */
  noHtmlFor?: boolean;
}

export function FormItemContent({
  label,
  control,
  unit,
  extendcontent,
  labelclass,
  hide,
  sectionbox,
  disabled,
  className,
  show,
  unitclass,
  error,
  noHtmlFor,
  values,
}: FormItemContentProps) {
  const isHidden = typeof hide === "function" ? hide(values ?? {}) : !!hide;
  const isShown = typeof show === "function" ? show(values ?? {}) : show;

  const LabelTag = noHtmlFor ? "span" : FormLabel;

  const formRow = (className_: string) => (
    <FormItem
      className={cn(
        "w-full",
        className_,
        isShown === false ? "hidden" : "",
        className,
      )}
    >
      {!isHidden && (
        <>
          <LabelTag
            className={cn(
              "w-40 h-6 flex items-center text-xs",
              disabled ? "text-gray-400" : "",
              labelclass,
            )}
          >
            {label}
          </LabelTag>
          <FormControl>{control}</FormControl>
          {unit && (
            <div
              className={cn(
                "w-6 h-6 leading-6 text-xs ml-2 flex items-center",
                unitclass,
              )}
            >
              {unit}
            </div>
          )}
          {extendcontent}
          {error && (
            <FormMessage className="text-xs text-red-500 ml-40 mt-0.5">
              {error}
            </FormMessage>
          )}
        </>
      )}
    </FormItem>
  );

  // 默认 h-6 leading-6（单行），type=4 等可通过 fld.className='h-auto' 覆盖
  return sectionbox ? (
    <SectionCard title={sectionbox} className="mt-8">
      {formRow("")}
    </SectionCard>
  ) : (
    formRow("h-6 leading-6")
  );
}
