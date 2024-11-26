import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl"></div>
          <div className="relative p-6">
            {children}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}