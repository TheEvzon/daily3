import { useLiveQuery } from "dexie-react-hooks";
import { v4 as uuid } from "uuid";
import { db } from "@/db";
import type { Dream, Value } from "@/types";

export interface DreamWithValues extends Dream {
  values: Value[];
}

export function useDreams(filterValueId?: string) {
  return (
    useLiveQuery(async () => {
      let dreams: Dream[];
      if (filterValueId) {
        const links = await db.dreamValues
          .where("valueId")
          .equals(filterValueId)
          .toArray();
        const dreamIds = links.map((l) => l.dreamId);
        dreams = await db.dreams.where("id").anyOf(dreamIds).toArray();
      } else {
        dreams = await db.dreams.where("archived").equals(0).toArray();
      }

      const allLinks = await db.dreamValues.toArray();
      const allValues = await db.values.toArray();
      const valueMap = new Map(allValues.map((v) => [v.id, v]));

      return dreams.map((dream) => {
        const dreamLinks = allLinks.filter((l) => l.dreamId === dream.id);
        const values = dreamLinks
          .map((l) => valueMap.get(l.valueId))
          .filter((v): v is Value => v !== undefined);
        return { ...dream, values } as DreamWithValues;
      });
    }, [filterValueId]) ?? []
  );
}

export function useDream(id: string | undefined) {
  return useLiveQuery(async () => {
    if (!id) return undefined;
    const dream = await db.dreams.get(id);
    if (!dream) return undefined;
    const links = await db.dreamValues.where("dreamId").equals(id).toArray();
    const values = await db.values
      .where("id")
      .anyOf(links.map((l) => l.valueId))
      .toArray();
    return { ...dream, values } as DreamWithValues;
  }, [id]);
}

export async function createDream(
  data: Omit<Dream, "id" | "createdAt" | "archived">,
  valueIds: string[],
): Promise<string> {
  const id = uuid();
  await db.transaction("rw", [db.dreams, db.dreamValues], async () => {
    await db.dreams.add({
      ...data,
      id,
      createdAt: new Date(),
      archived: false,
    });
    await db.dreamValues.bulkAdd(
      valueIds.map((valueId) => ({ dreamId: id, valueId })),
    );
  });
  return id;
}

export async function updateDream(
  id: string,
  data: Partial<Omit<Dream, "id">>,
  valueIds?: string[],
): Promise<void> {
  await db.transaction("rw", [db.dreams, db.dreamValues], async () => {
    await db.dreams.update(id, data);
    if (valueIds !== undefined) {
      await db.dreamValues.where("dreamId").equals(id).delete();
      await db.dreamValues.bulkAdd(
        valueIds.map((valueId) => ({ dreamId: id, valueId })),
      );
    }
  });
}

export async function archiveDream(id: string): Promise<void> {
  await db.dreams.update(id, { archived: true });
}

export async function deleteDream(id: string): Promise<void> {
  await db.transaction(
    "rw",
    [db.dreams, db.dreamValues, db.goals],
    async () => {
      await db.dreamValues.where("dreamId").equals(id).delete();
      // Don't cascade-delete goals — orphan them so user can reassign
      await db.dreams.delete(id);
    },
  );
}
