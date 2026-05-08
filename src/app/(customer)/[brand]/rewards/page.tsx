import { CustomerApp } from "@/features/customer/customer-app";

export default async function BrandRewardsPage({
  params,
}: {
  params: Promise<{ brand: "matsuri" | "roast-theory" | "noir-social" }>;
}) {
  const { brand } = await params;
  return <CustomerApp brandId={brand} section="rewards" />;
}
