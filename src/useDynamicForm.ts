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
import { useEffect, useRef, useCallback, useMemo } from 'react'
import { useForm, FieldValues } from 'react-hook-form'
import { collectAllFlds } from './utils'
import type { UseDynamicFormOptions, UseDynamicFormReturn } from './types'

export type { UseDynamicFormOptions, UseDynamicFormReturn }

export function useDynamicForm<T extends FieldValues = Record<string, any>>(
  options: UseDynamicFormOptions<T>
): UseDynamicFormReturn<T> {
  const { schema, defaultValues, data, validate, autoBackfill = true } = options

  // 同步合并初始 data 到默认值，避免 effect 异步回填导致「先显示 defaultValues，再跳变为 data」
  const initialValues = useMemo(() => {
    if (!autoBackfill || !data) return defaultValues
    const flds = collectAllFlds(schema)
    const v: Record<string, any> = {}
    for (const f of flds) {
      if (data[f.name] !== undefined) v[f.name] = data[f.name]
    }
    if (Object.keys(v).length === 0) return defaultValues
    return { ...(defaultValues ?? {}), ...v }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const form = useForm<T>({
    defaultValues: initialValues as any,
    mode: 'onBlur',
  })

  const { formState } = form
  const isSubmitting = formState.isSubmitting
  const errors = formState.errors
  const currentValues = form.watch()
  // 脏检测的基准值，回填后同步更新
  const baselineRef = useRef<Record<string, any>>((initialValues ?? {}) as Record<string, any>)
  const baseline = baselineRef.current
  const isDirty = Object.keys(currentValues).some(
    key => JSON.stringify(currentValues[key]) !== JSON.stringify(baseline[key])
  )
  // 首轮已通过 initialValues 合并，这里预填 key 跳过 effect 首轮重复执行
  const initKey =
    autoBackfill && data ? JSON.stringify(initialValues) : ""
  const lastBackfillKeyRef = useRef<string>(initKey)
  // 追踪最近一次回填后的合并值，reset 时直接跳到该值而非 defaultValues
  const currentMergedRef = useRef<Record<string, any> | null>(
    initialValues !== defaultValues ? (initialValues as Record<string, any>) : null
  )

  // ── 自动回填 ──
  useEffect(() => {
    if (!autoBackfill || !data) return

    const flds = collectAllFlds(schema)
    const values: Record<string, any> = {}
    for (const fld of flds) {
      if (data[fld.name] !== undefined) {
        values[fld.name] = data[fld.name]
      }
    }

    if (Object.keys(values).length > 0) {
      const merged = { ...defaultValues, ...values }
      const key = JSON.stringify(merged)
      if (lastBackfillKeyRef.current === key) return
      lastBackfillKeyRef.current = key

      form.reset(merged as any, { keepDirty: false })
      baselineRef.current = merged as Record<string, any>
      currentMergedRef.current = merged as Record<string, any>
    }
  }, [data, schema, autoBackfill, defaultValues])

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
    const target = currentMergedRef.current ?? (defaultValues ?? {})
    form.reset(target as any)
    baselineRef.current = target as Record<string, any>
    lastBackfillKeyRef.current = currentMergedRef.current
      ? JSON.stringify(currentMergedRef.current)
      : ""
  }, [form, defaultValues])

  return { form, schema, submit, reset, isDirty, isSubmitting, errors }
}
