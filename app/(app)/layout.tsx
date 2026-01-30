import Sidebar  from "@/components/layout/sidebar";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex overflow-hidden">
      <Toaster position="top-right" theme="dark" richColors closeButton />
      
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar (Optional but standard) */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-neutral-950/50 backdrop-blur-md">
          <h1 className="text-sm font-medium text-white/60 capitalize">
             Farm Management System
          </h1>
          <div className="flex items-center gap-4">
             {/* Add User Profile or Notifications here */}
          </div>
        </header>

        {/* Scrollable Page content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}