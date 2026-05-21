/**
 * 动态表单插件 — 核心 Hook
 *
 * 封装了 useForm、data 回填、校验、提交等全部逻辑，
 * 将原先每个表单组件 15+ 行的样板代码压缩为一个 hook 调用。
 *
 * @example
 * ```tsx
 * const inst = useDynamicForm({
 *   schema,
 *   defaultValues: { loc_name: '', uknom: 10 },
 *   data,              // ← 自动回填
 *   validate: (vals) => vals.tstop >= 1 ? true : '时长必须 >= 1',
 * })
 *
 * // 渲染
 * <DynamicForm formInstance={inst} />
 *
 * // 提交
 * const values = await inst.submit()
 * ```
 */
import { useEffect, useRef, useCallback } from 'react'
import { useForm, FieldValues } from 'react-hook-form'
import { collectAllFlds } from './utils'
import type { UseDynamicFormOptions, UseDynamicFormReturn } from './types'

export type { UseDynamicFormOptions, UseDynamicFormReturn }

export function useDynamicForm<T extends FieldValues = Record<string, any>>(
  options: UseDynamicFormOptions<T>
): UseDynamicFormReturn<T> {
  const { schema, defaultValues, data, validate, autoBackfill = true } = options

  const form = useForm<T>({
    defaultValues: defaultValues as any,
    mode: 'onBlur',
  })

  // 手动 deep-dirty：用 watch() 订阅所有字段变化，然后与 defaultValues 做浅层比较
  // 这比依赖 formState.isDirty 的 Proxy 订阅更可靠

  const { formState } = form
  const isSubmitting = formState.isSubmitting
  const errors = formState.errors
  const currentValues = form.watch()
  const defaults = (defaultValues ?? {}) as Record<string, any>
  const isDirty = Object.keys(currentValues).some(key => currentValues[key] !== defaults[key])
  // 跟踪上次回填的 data 引用，避免重复
  const prevDataRef = useRef<Record<string, any> | null | undefined>(undefined)

  // ── 自动回填 ──
  useEffect(() => {
    if (!autoBackfill || !data) return
    if (prevDataRef.current === data) return
    prevDataRef.current = data

    const flds = collectAllFlds(schema)
    const values: Record<string, any> = {}
    for (const fld of flds) {
      if (data[fld.name] !== undefined) {
        values[fld.name] = data[fld.name]
      }
    }

    if (Object.keys(values).length > 0) {
      form.reset({ ...defaultValues, ...values } as any, { keepDirty: false })
    }
  }, [data, schema, autoBackfill])

  // ── 提交 ──
  const submit = useCallback(async (): Promise<T | null> => {
    const isValid = await form.trigger()
    if (!isValid) return null

    const values = form.getValues() as T

    // 自定义业务校验
    if (validate) {
      const result = validate(values)
      if (result !== true) {
        form.setError('__root' as any, { message: result })
        return null
      }
    }

    return values
  }, [form, validate])

  // ── 重置 ──
  const reset = useCallback(() => {
    form.reset(defaultValues as any)
    prevDataRef.current = undefined
  }, [form, defaultValues])

  return { form, schema, submit, reset, isDirty, isSubmitting, errors }
}
