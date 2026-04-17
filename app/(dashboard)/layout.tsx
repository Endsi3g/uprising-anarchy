import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { RightPanel } from "@/components/layout/right-panel";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="flex h-full">
            <div className="flex-1 min-w-0 p-5">
              {children}
            </div>
            <RightPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
