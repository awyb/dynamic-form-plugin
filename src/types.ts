/**
 * 动态表单插件 — 类型定义
 *
 * 所有类型自包含，不依赖项目内的 @/ 路径。
 * FormNode 采用声明式树形结构，描述表单的层级布局。
 */
import type { ReactNode } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

// ═══════════════════════════════════════════════════
// 字段定义
// ═══════════════════════════════════════════════════

/** 单个表单字段的配置 */
export interface FieldConfig {
  /** 字段名（对应表单数据的 key） */
  name: string;
  /** 控件类型 (0=只读文本, 1=输入框, 2=下拉框, 3=勾选框, 4=单选组, 8=菜单按钮, 9=颜色, 10=线型, 11=线宽, 12=垂直数字输入, 999=自定义) */
  type: number;
  /** 是否为数字 (1=数字, 0=字符串) */
  isnum: number;
  /** 标签文本 */
  label?: string;
  /** 默认值 */
  // value?: string | number | boolean
  /** 单位 */
  unit?: string;
  /** 最大长度 */
  maxlen?: number;
  /** 最小长度 */
  minlen?: number;
  /** 是否必填 */
  required?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否隐藏 (支持函数，接收当前所有表单值) */
  hide?: boolean | ((values: Record<string, any>) => boolean);
  /** 是否显示 (支持函数, 与 hide 互斥，接收当前所有表单值) */
  show?: boolean | ((values: Record<string, any>) => boolean);
  /** 占位文字 */
  placeholder?: string;
  /** 最外层 div 类名 */
  className?: string;
  /** 控件容器类名 */
  className0?: string;
  /** 控件本身类名 */
  controlclass?: string;
  /** 标签类名 */
  labelclass?: string;
  /** 单位类名 */
  unitclass?: string;
  /** 下拉/单选 选项 */
  options?: {
    value: any;
    name: any;
    disabled?: number;
    extendcontrol?: ReactNode;
    className?: string;
  }[];
  /** 自定义校验规则 */
  validate?:
    | Record<string, any>
    | ((value: any, formValues: Record<string, any>) => true | string);
  /** 值变化回调 */
  onChange?: (value: any) => void;
  /** 失焦回调 */
  onBlur?: (e: any) => void;
  /** 扩展控件（渲染在控件右侧） */
  extendcontrol?: ReactNode;
  /** 自定义渲染 (仅 type=999) */
  custom?: ReactNode;
  /** type=8 的菜单项 */
  menus?: { name: string; action: () => void }[];
  /** type=8 禁用按钮 */
  disabledBtn?: boolean;
  /** type=8 按钮点击 */
  btnClick?: () => void;
  /** type=8 是否显示菜单 */
  showMenu?: boolean;
  /** type=3 复选框勾选态类名 */
  checkedClassName?: string;
  /** type=4 单选组按钮类名 */
  radioClassName?: string;
  /** type=4 单选标签类名 */
  labelClassName?: string;
  /** type=1 input ref */
  ref1?: React.Ref<HTMLInputElement>;
  /** 任意额外属性 */
  [key: string]: any;
}

// ═══════════════════════════════════════════════════
// Schema 树节点
// ═══════════════════════════════════════════════════

/**
 * 表单 Schema 的树节点。
 *
 * 三种节点类型:
 * - `container`:  带边框标题的分组卡片 (SectionCard)
 * - `control`:    单行或多行控件
 * - `default`:    无边框的 div 容器
 */
export type FormNode = {
  type: "container" | "control" | "default";
  /** 唯一标识 (用于 React key 和字段前缀) */
  key: string;
  /** 透传给容器组件 (SectionCard / div) 的属性 */
  props?: Record<string, any>;
  /** 子节点 (container / default 专用) */
  children?: FormNode[];
  /** 字段名 (control 专用，可省略，由 flds 内的 name 提供) */
  name?: string;
  /** 标签 (container 的标题 或 control 的默认标签) */
  label?: string | ReactNode;
  /** 字段列表 (control 专用，一行可放多个字段) */
  flds?: FieldConfig[];
};

// ═══════════════════════════════════════════════════
// Hook 类型
// ═══════════════════════════════════════════════════

/** useDynamicForm 的参数 */
export interface UseDynamicFormOptions<
  T extends FieldValues = Record<string, any>,
> {
  /** 表单 Schema 树 */
  schema: FormNode;
  /** 默认值 */
  defaultValues?: T;
  /** 回填数据（如从 API 加载的已保存数据，null 表示不触发回填） */
  data?: Record<string, any> | null;
  /** 是否在 data 变化时自动回填 (默认 true) */
  autoBackfill?: boolean;
  /** 提交前的额外业务校验，返回 true 通过，返回字符串为错误消息 */
  validate?: (values: T) => true | string;
}

/** useDynamicForm 的返回值 */
export interface UseDynamicFormReturn<
  T extends FieldValues = Record<string, any>,
> {
  /** react-hook-form 实例（可直接调用 form.setValue / form.watch 等） */
  form: UseFormReturn<T>;
  /** 传入的 Schema */
  schema: FormNode;
  /** 校验全部字段，通过返回 values，失败返回 null */
  submit: () => Promise<T | null>;
  /** 重置为 defaultValues */
  reset: () => void;
  /** 表单是否被修改过 */
  isDirty: boolean;
  /** 表单是否正在提交 */
  isSubmitting: boolean;
  /** 字段级的错误 map */
  errors: UseFormReturn<T>["formState"]["errors"];
}

// ═══════════════════════════════════════════════════
// 组件 Props
// ═══════════════════════════════════════════════════

/** DynamicForm 组件 Props */
export interface DynamicFormProps {
  /** useDynamicForm 的返回值 */
  formInstance: UseDynamicFormReturn<any>;
  /** 数字精度 (默认 12) */
  precision?: number;
  /** 垂直间距类名 (默认 'space-y-4') */
  spaceY?: string;
  /** <form> 附加类名 */
  className?: string;
  /** 是否在字段下方显示行内错误 */
  showInlineErrors?: boolean;
  /** 校验失败时的回调 (默认用 console.warn) */
  onValidationError?: (fieldName: string, message: string) => void;
}

/**
 * 向后兼容 Props — 与旧 DynamicFormPlus 接口一致。
 *
 * ```tsx
 * const fd = { form: useForm(...), schema: {...} }
 * <DynamicFormPlus ref={ref} formData={fd} />
 * ```
 */
export interface DynamicFormPlusProps {
  formData: { form: UseFormReturn<any>; schema: FormNode };
  spaceY?: string;
  className?: string;
  config?: Record<string, any>;
}

/** forwardRef 暴露的方法 */
export interface DynamicFormRef {
  /** 校验所有字段，通过返回表单数据，失败返回 null */
  callBack: () => Promise<Record<string, any> | null>;
}

// ═══════════════════════════════════════════════════
// 多表单编排器
// ═══════════════════════════════════════════════════

export interface MultiFormSection {
  name: string;
  instance: UseDynamicFormReturn<any>;
}

export interface MultiFormRef {
  /** 校验并收集所有 section 的值，失败返回 null */
  submitAll: () => Promise<Record<string, any> | null>;
  /** 校验并收集指定 section */
  submitSection: (name: string) => Promise<Record<string, any> | null>;
  /** 任一 section 被修改 */
  isAnyDirty: boolean;
  /** 重置所有 section */
  resetAll: () => void;
}

// ═══════════════════════════════════════════════════
// 插件全局配置
// ═══════════════════════════════════════════════════

export interface DynamicFormPluginConfig {
  /** 数字精度（默认 12） */
  precision?: number;
  /** 校验失败时的消息回调 */
  onValidationError?: (fieldName: string, message: string) => void;
}
