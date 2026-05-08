import { AdminApp } from "@/features/admin/admin-app";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: "matsuri" | "roast-theory" | "noir-social" }>;
}) {
  const params = await searchParams;
  const brand = params.brand ?? "matsuri";
  return <AdminApp brandId={brand} section="settings" />;
}
