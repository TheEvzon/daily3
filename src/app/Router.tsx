import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./Layout";
import { TodayPage } from "@/features/daily3/TodayPage";
import { ValuesPage } from "@/features/values/ValuesPage";
import { DreamsPage } from "@/features/dreams/DreamsPage";
import { GoalsPage } from "@/features/goals/GoalsPage";
import { BacklogPage } from "@/features/backlog/BacklogPage";
import { HabitsPage } from "@/features/habits/HabitsPage";
import { SetupPage } from "@/features/setup/SetupPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: "values", element: <ValuesPage /> },
      { path: "dreams", element: <DreamsPage /> },
      { path: "goals", element: <GoalsPage /> },
      { path: "backlog", element: <BacklogPage /> },
      { path: "habits", element: <HabitsPage /> },
    ],
  },
  {
    path: "/setup",
    element: <SetupPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
