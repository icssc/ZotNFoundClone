import type { Item } from "@/db/schema";

export enum ItemBaseState {
  Lost = "lost",
  Found = "found",
}

export enum ItemDerivedState {
  Helped = "helped",
  Resolved = "resolved",
  None = "none",
}

export enum ItemSemanticStatus {
  Lost = "lost",
  Found = "found",
  LostHelped = "lost_helped",
  FoundResolved = "found_resolved",
}

export const ITEM_STATUS_META = Object.freeze({
  [ItemSemanticStatus.Lost]: {
    key: ItemSemanticStatus.Lost,
    base: ItemBaseState.Lost,
    derived: ItemDerivedState.None,
    label: "Lost",
    fullLabel: "Lost",
    tintClass: "bg-red-500/35",
    textClass: "text-red-300",
  },
  [ItemSemanticStatus.Found]: {
    key: ItemSemanticStatus.Found,
    base: ItemBaseState.Found,
    derived: ItemDerivedState.None,
    label: "Found",
    fullLabel: "Found",
    tintClass: "bg-purple-500/40",
    textClass: "text-purple-300",
  },
  [ItemSemanticStatus.LostHelped]: {
    key: ItemSemanticStatus.LostHelped,
    base: ItemBaseState.Lost,
    derived: ItemDerivedState.Helped,
    label: "Lost • Helped",
    fullLabel: "Lost (Helped)",
    tintClass: "bg-green-500/40",
    textClass: "text-green-400",
  },
  [ItemSemanticStatus.FoundResolved]: {
    key: ItemSemanticStatus.FoundResolved,
    base: ItemBaseState.Found,
    derived: ItemDerivedState.Resolved,
    label: "Found • Resolved",
    fullLabel: "Found (Resolved)",
    tintClass: "bg-green-500/40",
    textClass: "text-green-400",
  },
});

export type ItemStatusMeta = (typeof ITEM_STATUS_META)[ItemSemanticStatus];

export function deriveSemanticStatus(
  isLost: boolean,
  isHelped?: boolean | null,
  isResolved?: boolean | null
): ItemSemanticStatus {
  if (isLost) {
    if (isHelped) return ItemSemanticStatus.LostHelped;
    return ItemSemanticStatus.Lost;
  }
  if (isResolved) return ItemSemanticStatus.FoundResolved;
  return ItemSemanticStatus.Found;
}

export function getItemSemanticStatus(
  item: Pick<Item, "isLost" | "isHelped" | "isResolved">
): ItemSemanticStatus {
  return deriveSemanticStatus(item.isLost, item.isHelped, item.isResolved);
}

export function getItemStatusMeta(status: ItemSemanticStatus): ItemStatusMeta {
  return ITEM_STATUS_META[status];
}

export function getItemStatusMetaFromItem(
  item: Pick<Item, "isLost" | "isHelped" | "isResolved">
): ItemStatusMeta {
  return getItemStatusMeta(getItemSemanticStatus(item));
}


export function toggleHelped(
  item: Pick<Item, "isLost" | "isHelped" | "isResolved">
): { isHelped: boolean; isResolved: boolean } {
  if (!item.isLost) {
    // Helped not applicable
    return {
      isHelped: item.isHelped ?? false,
      isResolved: item.isResolved ?? false,
    };
  }
  return {
    isHelped: !item.isHelped,
    isResolved: item.isResolved ?? false,
  };
}

export function toggleResolved(
  item: Pick<Item, "isLost" | "isHelped" | "isResolved">
): { isHelped: boolean; isResolved: boolean } {
  if (item.isLost) {
    // Resolved not applicable
    return {
      isHelped: item.isHelped ?? false,
      isResolved: item.isResolved ?? false,
    };
  }
  return {
    isHelped: item.isHelped ?? false,
    isResolved: !item.isResolved,
  };
}

export function formatStatusLabel(
  item: Pick<Item, "isLost" | "isHelped" | "isResolved">
): string {
  return getItemStatusMetaFromItem(item).label;
}

export function getStatusClasses(
  item: Pick<Item, "isLost" | "isHelped" | "isResolved">
): {
  tintClass: string;
  textClass: string;
} {
  const meta = getItemStatusMetaFromItem(item);
  return { tintClass: meta.tintClass, textClass: meta.textClass };
}
