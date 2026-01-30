import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { ValueBadge } from "@/shared/ui/value-badge";
import { useBacklogGroupedByGoal } from "@/features/backlog/useBacklog";
import { addToDaily3, useDaily3 } from "./useDaily3";

interface BacklogPickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BacklogPickerSheet({
  open,
  onOpenChange,
}: BacklogPickerSheetProps) {
  const groups = useBacklogGroupedByGoal();
  const todayEntries = useDaily3();
  const alreadyAdded = new Set(todayEntries.map((e) => e.backlogItemId));

  async function handlePick(backlogItemId: string) {
    await addToDaily3(backlogItemId);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Select Your Daily 3</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-5 pb-6">
          {groups.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No backlog items. Add some from the Backlog tab.
            </p>
          )}
          {groups.map((group) => (
            <div key={group.goalId ?? "unaligned"}>
              {group.goal ? (
                <div className="mb-1.5">
                  <p className="text-sm font-semibold">{group.goal.title}</p>
                  {group.dream && (
                    <p className="text-xs text-muted-foreground">
                      {group.dream.title}
                    </p>
                  )}
                  {group.values.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {group.values.map((v) => (
                        <ValueBadge key={v.id} value={v} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="mb-1.5 text-xs font-medium text-muted-foreground uppercase">
                  Unaligned
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const added = alreadyAdded.has(item.id);
                  return (
                    <button
                      key={item.id}
                      disabled={added}
                      onClick={() => handlePick(item.id)}
                      className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-accent disabled:opacity-50"
                    >
                      <span>{item.title}</span>
                      {added && (
                        <span className="text-xs text-muted-foreground">
                          Added
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
