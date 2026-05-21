/**
 * @package @whu/dynamic-form-plugin
 *
 * 声明式动态表单插件 — 基于 react-hook-form + shadcn/ui
 *
 * 核心概念:
 * - FormNode 树   → 声明式描述表单布局
 * - useDynamicForm → 封装表单状态、回填、校验、提交
 * - DynamicForm    → 将 Schema 树渲染为 React 组件
 *
 * @example
 * ```tsx
 * import { useDynamicForm, DynamicForm } from '@whu/dynamic-form-plugin'
 *
 * const inst = useDynamicForm({
 *   schema: { type: 'default', key: 'root', children: [...] },
 *   defaultValues: { uknom: 10 },
 *   data: savedData,
 * })
 *
 * return <DynamicForm formInstance={inst} showInlineErrors />
 * const values = await inst.submit()
 * ```
 */

// ── 类型 ──
export type {
  FieldConfig,
  FormNode,
  UseDynamicFormOptions,
  UseDynamicFormReturn,
  DynamicFormProps,
  DynamicFormPlusProps,
  DynamicFormRef,
  MultiFormSection,
  MultiFormRef,
  DynamicFormPluginConfig,
} from './types'

// ── Hook ──
export { useDynamicForm } from './useDynamicForm'

// ── 组件 ──
export { DynamicForm, DynamicFormPlus, useMultiFormRef } from './DynamicForm'

// ── 控件 (可独立使用) ──
export { ControlMain } from './controls'

// ── 布局 (可独立使用) ──
export { SectionCard, FormItemContent } from './layouts'

// ── 渲染器 (高级用法) ──
export { useSchemaRenderer } from './renderer'

// ── 工具 ──
export { cn, collectAllFlds, buildFld, generateName } from './utils'
