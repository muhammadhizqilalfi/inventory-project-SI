import Sidebar from "../components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 w-full overflow-y-auto px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
