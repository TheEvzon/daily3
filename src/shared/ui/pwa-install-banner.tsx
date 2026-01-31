import { Download, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { usePwaInstall } from "@/shared/hooks/usePwaInstall";

export function PwaInstallBanner() {
  const { canInstall, install, dismiss } = usePwaInstall();

  if (!canInstall) return null;

  return (
    <div className="border-b border-border bg-primary/5 px-4 py-2.5">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <Download className="h-4 w-4 shrink-0 text-primary" />
        <p className="flex-1 text-sm">
          Install Daily 3 for quick access and offline use.
        </p>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={install}
        >
          Install
        </Button>
        <button
          onClick={dismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
