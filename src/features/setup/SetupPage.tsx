import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValuesStep } from "./ValuesStep";
import { DreamsStep } from "./DreamsStep";
import { GoalsStep } from "./GoalsStep";
import { HabitsStep } from "./HabitsStep";

const STEPS = ["Values", "Dreams", "Goals", "Habits"] as const;

export function SetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/");
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleSkip() {
    navigate("/");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-8">
      {/* Header */}
      <div className="pt-8">
        <p className="text-sm text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </p>
        <h1 className="mt-1 text-2xl font-bold">
          {step === 0 && "Define Your Values"}
          {step === 1 && "Dream Big"}
          {step === 2 && "Set Your Goals"}
          {step === 3 && "Create Your Habits"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === 0 && "What matters most to you? Pick 5-10 values."}
          {step === 1 && "What do you want from life? No limits."}
          {step === 2 && "Set dated milestones for your top dreams."}
          {step === 3 && "Write identity statements — who you are becoming."}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-4 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor: i <= step ? "var(--primary)" : "var(--muted)",
            }}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="mt-6 flex-1">
        {step === 0 && <ValuesStep />}
        {step === 1 && <DreamsStep />}
        {step === 2 && <GoalsStep />}
        {step === 3 && <HabitsStep />}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={step === 0 ? handleSkip : handleBack}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {step === 0 ? "Skip setup" : "Back"}
        </button>
        <button
          onClick={handleNext}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {step === STEPS.length - 1 ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
}
