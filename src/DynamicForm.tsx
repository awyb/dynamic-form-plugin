/**
 * 动态表单插件 — 组件入口
 *
 * 提供三个层级的 API:
 * 1. `<DynamicForm>`       — 新 API，接收 useDynamicForm 返回值
 * 2. `<DynamicFormPlus>`   — 向后兼容，与旧接口一致
 * 3. `useMultiFormRef()`   — 多表单编排器
 */
import { forwardRef, useImperativeHandle, useMemo, useCallback } from 'react'
import { Form } from './ui/form'
import { cn } from './utils'
import { useSchemaRenderer } from './renderer'
import type { DynamicFormProps, DynamicFormPlusProps, DynamicFormRef, MultiFormSection, MultiFormRef } from './types'

// ═══════════════════════════════════════════════════
// 1. DynamicForm — 新 API
// ═══════════════════════════════════════════════════

/**
 * 推荐使用的组件。
 *
 * @example
 * ```tsx
 * const inst = useDynamicForm({ schema, defaultValues, data })
 * return <DynamicForm formInstance={inst} showInlineErrors onValidationError={...} />
 * ```
 */
export function DynamicForm({
  formInstance,
  precision = 12,
  spaceY = 'space-y-4',
  className,
  showInlineErrors = false,
  onValidationError = defaultOnError,
}: DynamicFormProps) {
  const { form, schema } = formInstance
  const {
    control,
    trigger,
    formState: { errors },
  } = form
  const values = form.watch()

  const renderNode = useSchemaRenderer({
    control,
    trigger,
    errors,
    precision,
    spaceY,
    showInlineErrors,
    onValidationError,
    values,
  })

  return (
    <Form {...form}>
      <form className={cn(spaceY, className)} onSubmit={e => e.preventDefault()}>
        {renderNode(schema)}
      </form>
    </Form>
  )
}

// ═══════════════════════════════════════════════════
// 2. DynamicFormPlus — 向后兼容 API
// ═══════════════════════════════════════════════════

/**
 * 与原始 `DynamicFormPlus` 完全兼容的包装组件。
 *
 * 接受 `formData: { form, schema }` 并暴露 `DynamicFormRef.callBack()`。
 * 旧项目可直接替换 import 路径，无需其他改动。
 */
export const DynamicFormPlus = forwardRef<DynamicFormRef, DynamicFormPlusProps>(
  ({ formData, className, spaceY = 'space-y-4' }, ref) => {
    const { form, schema } = formData
    const {
      control,
      trigger,
      getValues,
      formState: { errors },
    } = form
    const values = form.watch()

    const renderNode = useSchemaRenderer({
      control,
      trigger,
      errors,
      precision: 12,
      spaceY,
      showInlineErrors: false,
      onValidationError: defaultOnError,
      values,
    })

    useImperativeHandle(ref, () => ({
      async callBack() {
        const isValid = await trigger()
        if (!isValid) return null
        return getValues()
      },
    }))

    return (
      <Form {...form}>
        <form className={cn(spaceY, className)} onSubmit={e => e.preventDefault()}>
          {renderNode(schema)}
        </form>
      </Form>
    )
  }
)

DynamicFormPlus.displayName = 'DynamicFormPlus'

// ═══════════════════════════════════════════════════
// 3. useMultiFormRef — 多表单编排器
// ═══════════════════════════════════════════════════

/**
 * 将多个 `useDynamicForm` 实例合并为一个提交入口。
 *
 * @example
 * ```tsx
 * const basic = useDynamicForm({ schema: basicSchema, defaultValues, data })
 * const lf    = useDynamicForm({ schema: lfSchema,    defaultValues, data })
 * const multi = useMultiFormRef([
 *   { name: 'basic', instance: basic },
 *   { name: 'lf',    instance: lf },
 * ])
 *
 * useImperativeHandle(parentRef, () => ({
 *   callBack: multi.submitAll,
 * }))
 * ```
 */
export function useMultiFormRef(sections: MultiFormSection[]): MultiFormRef {
  const sectionsRef = useMemo(() => ({ current: sections }), [])
  sectionsRef.current = sections

  const submitAll = useCallback(async () => {
    const merged: Record<string, any> = {}
    for (const sec of sectionsRef.current) {
      const vals = await sec.instance.submit()
      if (vals === null) return null
      Object.assign(merged, vals)
    }
    return merged
  }, [])

  const submitSection = useCallback(async (name: string) => {
    const sec = sectionsRef.current.find(s => s.name === name)
    return sec ? sec.instance.submit() : null
  }, [])

  const isAnyDirty = sections.some(s => s.instance.isDirty)

  const resetAll = useCallback(() => {
    sectionsRef.current.forEach(s => s.instance.reset())
  }, [])

  return useMemo(
    () => ({ submitAll, submitSection, isAnyDirty, resetAll }),
    [submitAll, submitSection, isAnyDirty, resetAll]
  )
}

// ═══════════════════════════════════════════════════
// 默认处理
// ═══════════════════════════════════════════════════

function defaultOnError(fieldName: string, message: string) {
  if (typeof console !== 'undefined') {
    console.warn(`[DynamicForm] ${fieldName}: ${message}`)
  }
}
