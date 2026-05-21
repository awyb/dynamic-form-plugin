/**
 * 动态表单插件 — 工具函数
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FormNode, FieldConfig } from "./types";

// ═══════════════════════════════════════════════════
// CSS 类名合并 (等同于 @/lib/utils 的 cn)
// ═══════════════════════════════════════════════════

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ═══════════════════════════════════════════════════
// 从 Schema 树中收集所有 FieldConfig
// ═══════════════════════════════════════════════════

/**
 * 深度遍历 Schema 树，提取所有 `control` 节点中的字段定义。
 * 用于批量回填数据、批量注册等场景。
 */
export function collectAllFlds(schema: FormNode): FieldConfig[] {
  const result: FieldConfig[] = [];

  const traverse = (node: FormNode) => {
    if (node.type === "control" && node.flds) {
      result.push(...node.flds);
    }
    if (
      (node.type === "container" || node.type === "default") &&
      node.children
    ) {
      node.children.forEach(traverse);
    }
  };

  traverse(schema);
  return result;
}

// ═══════════════════════════════════════════════════
// 构建字段默认值
// ═══════════════════════════════════════════════════

/**
 * 便捷工厂 — 用默认值填充 FieldConfig 的可选字段。
 *
 * @example
 * ```ts
 * buildFld({ name: 'uknom', label: '额定电压', unit: 'kV', type: 1, isnum: 1, required: 1 })
 * ```
 */
export function buildFld(fld: FieldConfig): FieldConfig {
  return {
    // 用户传入的优先，未传的使用默认值
    ...fld,
    maxlen: fld.maxlen ?? (fld.isnum === 1 ? 10 : 24),
    minlen: fld.minlen ?? 0,
    controlclass:
      "w-24 pl-2 rounded-none disabled:cursor-default " +
      (fld.controlclass ?? ""),
    labelclass: fld.labelclass ?? "",
  };
}

// ═══════════════════════════════════════════════════
// 名称去重
// ═══════════════════════════════════════════════════

/**
 * 根据已用名称集合，为 base 生成一个不重复的名称。
 *
 * 例如 generateName('Bus', ['Bus', 'Bus2']) → 'Bus1'
 */
export function generateName(base: string, usedNames: string[]): string {
  const usedSet = new Set(usedNames);
  if (!usedSet.has(base)) return base;

  const usedIndices: number[] = [];
  for (const name of usedSet) {
    if (name === base) continue;
    const match = name.match(new RegExp(`^${escapeRegex(base)}(\\d+)$`));
    if (match) usedIndices.push(Number(match[1]));
  }

  usedIndices.sort((a, b) => a - b);
  let index = 1;
  for (const used of usedIndices) {
    if (used !== index) break;
    index++;
  }
  return base + index;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
