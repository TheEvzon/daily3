import { useState } from "react";
import { HabitsSection } from "./HabitsSection";
import { DeadlinesSection } from "./DeadlinesSection";
import { Daily3Section } from "./Daily3Section";
import { BacklogPickerSheet } from "./BacklogPickerSheet";

export function TodayPage() {
  const [pickerOpen, setPickerOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-lg px-4 pb-6">
      <div className="pt-6">
        <p className="text-sm text-muted-foreground">{today}</p>
        <h1 className="text-2xl font-bold">Today</h1>
      </div>

      <div className="mt-6 space-y-6">
        <HabitsSection />
        <DeadlinesSection />
        <Daily3Section onPickFromBacklog={() => setPickerOpen(true)} />
      </div>

      <BacklogPickerSheet open={pickerOpen} onOpenChange={setPickerOpen} />
    </div>
  );
}
