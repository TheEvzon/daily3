import { useLiveQuery } from "dexie-react-hooks";
import { v4 as uuid } from "uuid";
import { db } from "@/db";
import type { Value } from "@/types";

export function useValues() {
  const values = useLiveQuery(() => db.values.orderBy("order").toArray());
  return values ?? [];
}

export function useValue(id: string | undefined) {
  return useLiveQuery(() => (id ? db.values.get(id) : undefined), [id]);
}

export async function createValue(
  data: Omit<Value, "id" | "order">,
): Promise<string> {
  const count = await db.values.count();
  const id = uuid();
  await db.values.add({ ...data, id, order: count + 1 });
  return id;
}

export async function updateValue(
  id: string,
  data: Partial<Omit<Value, "id">>,
): Promise<void> {
  await db.values.update(id, data);
}

export async function deleteValue(id: string): Promise<void> {
  await db.transaction(
    "rw",
    [db.values, db.dreamValues, db.habitValues],
    async () => {
      await db.dreamValues.where("valueId").equals(id).delete();
      await db.habitValues.where("valueId").equals(id).delete();
      await db.values.delete(id);
    },
  );
}

export async function reorderValues(orderedIds: string[]): Promise<void> {
  await db.transaction("rw", db.values, async () => {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.values.update(orderedIds[i], { order: i + 1 });
    }
  });
}
