import { useEffect, useState } from "react";
import { AppRouter } from "@/app/Router";
import { db } from "@/db";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    db.values.count().then((count) => {
      // Redirect to setup on first launch (no values yet)
      // Only redirect if we're on the root path to avoid interrupting direct nav
      if (count === 0 && window.location.pathname === "/") {
        window.location.replace("/setup");
        return;
      }
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <AppRouter />;
}
