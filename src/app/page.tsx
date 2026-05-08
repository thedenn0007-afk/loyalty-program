import Link from "next/link";
import { brandCatalog } from "@/domains/brand/brand-catalog";

export default function LandingPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <section className="glass-card gradient-ring overflow-hidden rounded-[2rem] px-8 py-10 md:px-12 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                Restaurant loyalty ecosystem demo
              </p>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
                  Approval-driven loyalty, crafted like a real product.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-neutral-600">
                  Explore customer journeys, reward lifecycles, admin-led billing, verification gates,
                  coupon redemption, and multi-brand experiences inside one production-structured frontend.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/matsuri"
                  className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:translate-y-[-1px]"
                >
                  Open Customer Journey
                </Link>
                <Link
                  href="/admin"
                  className="rounded-full border border-neutral-900/10 bg-white/70 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-white"
                >
                  Open Admin Console
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              <div className="glass-card rounded-[1.75rem] p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">What’s inside</p>
                <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                  <li>Approval-first mission and reward lifecycles</li>
                  <li>Admin-led customer creation and phone lookup</li>
                  <li>Billing simulation with products and validation</li>
                  <li>Coupon generation, expiry, and redemption controls</li>
                  <li>Three premium brand expressions on one engine</li>
                </ul>
              </div>
              <div className="glass-card rounded-[1.75rem] p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Demo flow</p>
                <ol className="mt-4 space-y-3 text-sm text-neutral-700">
                  <li>Customer enters branded experience</li>
                  <li>Customer completes mission or waits for review</li>
                  <li>Admin validates proof or purchase</li>
                  <li>Reward becomes claimable and coupon is generated</li>
                  <li>Admin redeems coupon with full audit trail</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {brandCatalog.map((brand) => (
            <Link
              key={brand.id}
              href={`/${brand.id}`}
              className="group glass-card overflow-hidden rounded-[2rem] p-6 transition hover:translate-y-[-4px]"
              style={{
                backgroundImage: brand.theme.heroGradient,
                color: brand.theme.text,
              }}
            >
              <div className="rounded-[1.4rem] bg-white/10 p-6 backdrop-blur-lg">
                <p className="text-xs uppercase tracking-[0.35em] opacity-75">{brand.label}</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{brand.heroTitle}</h2>
                <p className="mt-3 text-sm leading-7 opacity-90">{brand.heroDescription}</p>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <span>{brand.signatureMood}</span>
                  <span className="transition group-hover:translate-x-1">Explore</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
