/**
 * 动态表单插件 — Schema 渲染器
 *
 * 将 FormNode 树递归渲染为 React 元素。
 * 独立于 hook/组件，可被任意表单方案复用。
 */
import React, { useCallback } from "react";
import { FormField } from "./ui/form";
import { cn } from "./utils";
import { SectionCard, FormItemContent } from "./layouts";
import { ControlMain } from "./controls";
import type { FormNode, FieldConfig } from "./types";

// ═══════════════════════════════════════════════════
// 校验规则生成
// ═══════════════════════════════════════════════════

function buildRules(fld: FieldConfig) {
  const rules: Record<string, any> = {};

  if (fld.required) {
    rules.required = `${fld.label || fld.name}不能为空`;
  }
  if (fld.isnum === 1) {
    rules.pattern = {
      value: /^[+-]?(\d+(\.\d+)?|\.\d+)$/,
      message: "请输入数字",
    };
  }
  if (fld.validate) {
    if (typeof fld.validate === "function") {
      rules.validate = fld.validate;
    } else {
      Object.assign(rules, fld.validate);
    }
  }

  return rules;
}

// ═══════════════════════════════════════════════════
// useSchemaRenderer
// ═══════════════════════════════════════════════════

interface RenderContext {
  control: any;
  trigger: (name?: string | string[]) => Promise<boolean>;
  errors: Record<string, any>;
  precision: number;
  spaceY: string;
  showInlineErrors: boolean;
  onValidationError: (fieldName: string, message: string) => void;
  values: Record<string, any>;
}

export function useSchemaRenderer(ctx: RenderContext) {
  const {
    control,
    trigger,
    errors,
    precision,
    spaceY,
    showInlineErrors,
    onValidationError,
    values,
  } = ctx;

  // 单字段失焦校验
  const validateOne = useCallback(
    async (name: string) => {
      const ok = await trigger(name);
      if (!ok) {
        const msg =
          typeof errors[name]?.message === "string"
            ? errors[name]?.message
            : "";
        if (msg) onValidationError(name, msg);
      }
    },
    [trigger, errors, onValidationError],
  );

  const renderNode = useCallback(
    (schema: FormNode): React.ReactNode => {
      // ── control ──
      if (schema.type === "control" && schema.flds) {
        return (
          <div
            className={cn(
              "flex flex-row items-center",
              schema.props?.className,
            )}
            key={schema.key}
          >
            {schema.flds.map((fld) => {
              const fieldError = errors[fld.name];

              // 动态属性合并
              const dynFld = fld.compute
                ? { ...fld, ...fld.compute(values) }
                : fld;
              return (
                <div key={dynFld.name} className="flex flex-col">
                  <FormField
                    control={control}
                    name={dynFld.name}
                    rules={buildRules(dynFld)}
                    render={({ field }) => (
                      <FormItemContent
                        label={dynFld.label ?? dynFld.name}
                        disabled={dynFld.disabled}
                        show={dynFld.show}
                        hide={dynFld.hide}
                        values={values}
                        unit={dynFld.unit}
                        labelclass={dynFld.labelclass}
                        unitclass={dynFld.unitclass}
                        className={dynFld.className}
                        noHtmlFor={
                          dynFld.type === 4 ||
                          dynFld.type === 8 ||
                          dynFld.type === 0 ||
                          dynFld.type === 999
                        }
                        error={
                          showInlineErrors && fieldError
                            ? String(fieldError.message ?? "")
                            : undefined
                        }
                        control={
                          <ControlMain
                            {...field}
                            {...dynFld}
                            precision={precision}
                            onChange={(val: any) => {
                              field.onChange?.(val);
                              dynFld.onChange?.(val);
                            }}
                            value={
                              dynFld.type === 3
                                ? Boolean(field.value)
                                : field.value
                            }
                            onClick={(e: any) => {
                              if (dynFld.type === 3 && dynFld.isnum === 1) {
                                field.onChange((Number(field.value) + 1) % 2);
                              }
                              dynFld.onClick?.(e);
                            }}
                            onBlur={(e: any) => {
                              validateOne(dynFld.name);
                              dynFld.onBlur?.(e);
                              field.onBlur?.();
                              // 数字输入自动精度处理
                              if (
                                dynFld.isnum === 1 &&
                                dynFld.type === 1 &&
                                e?.target?.value !== "" &&
                                !isNaN(Number(e.target.value))
                              ) {
                                const formatted = parseFloat(
                                  Number(e.target.value).toPrecision(precision),
                                );
                                if (formatted !== field.value) {
                                  field.onChange?.(formatted);
                                }
                              }
                            }}
                          />
                        }
                      />
                    )}
                  />
                </div>
              );
            })}
          </div>
        );
      }

      // ── container ──
      if (schema.type === "container") {
        return (
          <SectionCard
            key={schema.key || Math.random()}
            mclassName={cn(spaceY, schema.props?.mclassName)}
            title={schema.label}
            {...schema.props}
          >
            {schema.children?.map((child) => (
              <React.Fragment key={child.key}>
                {renderNode(child)}
              </React.Fragment>
            ))}
          </SectionCard>
        );
      }

      // ── default ──
      if (schema.type === "default") {
        return (
          <div
            className={cn(spaceY, schema.props?.className)}
            key={schema.key || Math.random()}
            {...schema.props}
          >
            {schema.children?.map((child) => (
              <React.Fragment key={child.key}>
                {renderNode(child)}
              </React.Fragment>
            ))}
          </div>
        );
      }

      return null;
    },
    [control, errors, precision, spaceY, showInlineErrors, validateOne, values],
  );

  return renderNode;
}
