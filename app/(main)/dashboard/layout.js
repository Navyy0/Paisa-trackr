import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
  return (
    <div className="px-5 bg-[#0f172a] min-h-screen text-white">
      <div className="flex items-center justify-between mb-5 pt-6">
        <h1 className="text-6xl font-bold tracking-tight text-yellow-400">
          Dashboard
        </h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#facc15" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
}
