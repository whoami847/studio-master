
import AdminNav from '@/components/layout/AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        <AdminNav />
        <main>{children}</main>
      </div>
    </div>
  );
}
