import { BaseModel } from "../models";

export class StateUtility {
  public static combineArrays<T extends BaseModel>(
    arrayA: T[],
    arrayB: T[]
  ): T[] {
    // Index B by id for O(1) lookups
    const bById = new Map<T["id"], T>();
    for (const item of arrayB) {
      bById.set(item.id, item);
    }

    const result: T[] = [];
    const seen = new Set<T["id"]>();

    // 1. Update or remove items from A (preserve A's order)
    for (const itemA of arrayA) {
      const itemB = bById.get(itemA.id);
      if (itemB) {
        result.push(itemB); // update
        seen.add(itemA.id);
      }
      // else: removed (do nothing)
    }

    // 2. Append new items from B (preserve B's order)
    for (const itemB of arrayB) {
      if (!seen.has(itemB.id)) {
        result.push(itemB);
      }
    }

    return result;
  }

  public static upsertItem<T extends BaseModel>(array: T[], newItem: T) {
    let found = false;

    const result = array.map((item) => {
      if (item.id === newItem.id) {
        found = true;
        return newItem; // update
      }
      return item;
    });

    if (!found) {
      result.push(newItem); // add to end
    }

    return result;
  }
}
