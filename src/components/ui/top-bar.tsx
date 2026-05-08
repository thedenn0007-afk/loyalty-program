"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandId } from "@/domains/shared/contracts";
import { brandCatalog } from "@/domains/brand/brand-catalog";
import { useDemoState } from "@/providers/demo-state-provider";

export function TopBar({
  brandId,
  mode,
}: {
  brandId: BrandId;
  mode: "customer" | "admin";
}) {
  const pathname = usePathname();
  const { state, dispatch } = useDemoState();

  return (
    <div className="glass-card sticky top-4 z-40 rounded-full px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-full bg-neutral-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Loyalty Demo
          </Link>
          <div className="hidden text-sm text-neutral-500 md:block">
            Approval-first ecosystem with customer and admin surfaces
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {brandCatalog.map((brand) => (
            <Link
              key={brand.id}
              href={mode === "customer" ? `/${brand.id}` : `/admin?brand=${brand.id}`}
              type="button"
              onClick={() => dispatch({ type: "set-brand", brandId: brand.id })}
              className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                state.ui.activeBrandId === brand.id ? "bg-neutral-950 text-white" : "bg-white/80 text-neutral-700"
              }`}
            >
              {brand.label}
            </Link>
          ))}
          <Link
            href={mode === "customer" ? `/admin?brand=${brandId}` : `/${brandId}`}
            onClick={() => dispatch({ type: "set-role", role: mode === "customer" ? "admin" : "customer" })}
            className="rounded-full border border-neutral-900/10 bg-white/70 px-3 py-2 text-xs font-medium text-neutral-900"
          >
            {mode === "customer" ? "Switch to Admin" : "Switch to Customer"}
          </Link>
          <button
            type="button"
            onClick={() => dispatch({ type: "reset" })}
            className="rounded-full bg-neutral-900/5 px-3 py-2 text-xs font-medium text-neutral-700"
          >
            Reset Demo
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-neutral-500">
        Current route: <span className="font-medium text-neutral-800">{pathname}</span>
      </div>
    </div>
  );
}
