"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getBrandConfig } from "@/domains/brand/brand-catalog";
import { BrandId } from "@/domains/shared/contracts";
import { formatDisplayDate } from "@/lib/dates";
import { useDemoState } from "@/providers/demo-state-provider";
import { getBrandViewModel, getCustomerByPhone, getCustomerExperience } from "@/services/demo-service";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TopBar } from "@/components/ui/top-bar";

export function AdminApp({
  brandId,
  section,
}: {
  brandId: BrandId;
  section: "dashboard" | "customers" | "loyalty" | "campaigns" | "verification" | "settings";
}) {
  const { state, dispatch } = useDemoState();
  const brand = getBrandConfig(brandId);
  const view = getBrandViewModel(state, brandId);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("1998-01-01");
  const [purchasePhone, setPurchasePhone] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("780");
  const [purchaseItems, setPurchaseItems] = useState("Brunch Set, Dessert Tea");

  const activeCustomer = useMemo(() => {
    return getCustomerExperience(state, state.ui.activeCustomerId);
  }, [state]);

  const navItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "customers", label: "Customers" },
    { key: "loyalty", label: "Loyalty" },
    { key: "campaigns", label: "Campaigns" },
    { key: "verification", label: "Verification" },
    { key: "settings", label: "Settings" },
  ] as const;

  return (
    <main className="min-h-screen px-4 py-4 md:px-6 lg:px-8" style={{ backgroundImage: brand.theme.pageGradient }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <TopBar brandId={brandId} mode="admin" />
        <section className="overflow-hidden rounded-[2rem] bg-neutral-950 px-8 py-8 text-white">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Admin control layer · {brand.label}</p>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                Business logic stays gated until the restaurant confirms it.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/75">
                This console is the operational source of truth for customer onboarding, purchase validation,
                proof review, coupon redemption, and campaign simulation.
              </p>
              <div className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.key === "dashboard" ? `/admin?brand=${brandId}` : `/admin/${item.key}?brand=${brandId}`}
                    className={`rounded-full px-4 py-2 text-sm ${
                      section === item.key ? "bg-white text-neutral-950" : "bg-white/10 text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <MetricCard label="Members" value={String(view.kpis.members)} detail="Live customers in this brand" />
              <MetricCard label="Pending" value={String(view.kpis.pendingApprovals)} detail="Proofs and validations waiting" />
              <MetricCard label="Redemptions" value={String(view.kpis.redemptions)} detail="Coupons already redeemed" />
              <MetricCard label="Campaigns" value={String(view.kpis.liveCampaigns)} detail="Sending or scheduled journeys" />
            </div>
          </div>
        </section>

        {section === "dashboard" ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionCard title="Presenter shortcuts" subtitle="Smooth demo movement without bypassing the operational flow.">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "set-role", role: "customer" })}
                  className="w-full rounded-[1.25rem] bg-neutral-950 px-4 py-3 text-left text-sm font-medium text-white"
                >
                  Return to customer view for {activeCustomer.customer.name}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const pending = view.pendingVerifications[0];
                    if (pending) {
                      dispatch({ type: "set-active-customer", customerId: pending.customerId });
                    }
                  }}
                  className="w-full rounded-[1.25rem] bg-white/80 px-4 py-3 text-left text-sm font-medium text-neutral-900"
                >
                  Jump to first pending review customer
                </button>
                <p className="rounded-[1.25rem] bg-white/70 p-4 text-sm leading-7 text-neutral-600">
                  These controls only move the presenter between the correct operational records. They do not skip approvals, coupon generation, or redemption logic.
                </p>
              </div>
            </SectionCard>
            <SectionCard title="Brand-level pipeline" subtitle="A quick read of the journey from pending submission to active coupon.">
              <div className="grid gap-4 md:grid-cols-2">
                {view.pendingVerifications.map((verification) => (
                  <div key={verification.id} className="rounded-[1.4rem] bg-white/72 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{verification.proofLabel}</h3>
                      <StatusBadge label="Pending review" tone="warning" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{verification.notes}</p>
                  </div>
                ))}
                {view.activeCoupons.map((coupon) => (
                  <div key={coupon.id} className="rounded-[1.4rem] bg-white/72 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{coupon.code}</h3>
                      <StatusBadge label="Active coupon" tone="success" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{coupon.title}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        ) : null}

        {section === "customers" ? (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <SectionCard title="Create or open customer" subtitle="Phone number is the primary lookup and identity key.">
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Customer name" className="rounded-2xl border border-neutral-900/10 bg-white/80 px-4 py-3 outline-none" />
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" className="rounded-2xl border border-neutral-900/10 bg-white/80 px-4 py-3 outline-none" />
                </div>
                <input value={birthday} onChange={(event) => setBirthday(event.target.value)} type="date" className="rounded-2xl border border-neutral-900/10 bg-white/80 px-4 py-3 outline-none" />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "create-customer",
                        payload: { brandId, name, phoneNumber: phone, birthday, preferredBrand: brandId, tags: ["New"] },
                      })
                    }
                    className="rounded-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
                  >
                    Create Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const match = getCustomerByPhone(state, brandId, phone);
                      if (match) dispatch({ type: "set-active-customer", customerId: match.id });
                    }}
                    className="rounded-full bg-white px-4 py-3 text-sm font-medium text-neutral-900"
                  >
                    Open by Phone
                  </button>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Add purchase to active customer" subtitle="Admin-led billing is the primary value-entry path.">
              <div className="space-y-4">
                <input value={purchasePhone} onChange={(event) => setPurchasePhone(event.target.value)} placeholder="Lookup phone number before adding purchase" className="rounded-2xl border border-neutral-900/10 bg-white/80 px-4 py-3 outline-none" />
                <div className="grid gap-3 md:grid-cols-[0.5fr_1fr]">
                  <input value={purchaseAmount} onChange={(event) => setPurchaseAmount(event.target.value)} placeholder="Spend amount" className="rounded-2xl border border-neutral-900/10 bg-white/80 px-4 py-3 outline-none" />
                  <input value={purchaseItems} onChange={(event) => setPurchaseItems(event.target.value)} placeholder="Products purchased" className="rounded-2xl border border-neutral-900/10 bg-white/80 px-4 py-3 outline-none" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const match = getCustomerByPhone(state, brandId, purchasePhone);
                      if (!match) return;
                      dispatch({
                        type: "add-purchase",
                        payload: {
                          customerId: match.id,
                          brandId,
                          amount: Number(purchaseAmount),
                          items: purchaseItems.split(",").map((item) => item.trim()).filter(Boolean),
                          source: "admin_entry",
                          billReference: `${brandId.toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`,
                        },
                      });
                      dispatch({ type: "set-active-customer", customerId: match.id });
                    }}
                    className="rounded-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
                  >
                    Add Purchase
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const match = getCustomerByPhone(state, brandId, purchasePhone);
                      if (!match) return;
                      dispatch({
                        type: "add-purchase",
                        payload: {
                          customerId: match.id,
                          brandId,
                          amount: Number(purchaseAmount),
                          items: purchaseItems.split(",").map((item) => item.trim()).filter(Boolean),
                          source: "upload",
                          imageName: "bill-scan.jpg",
                        },
                      });
                    }}
                    className="rounded-full bg-white px-4 py-3 text-sm font-medium text-neutral-900"
                  >
                    Attach Optional Upload
                  </button>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Active customer record" subtitle="Create, track, and operate lifecycle changes from one individual record." className="xl:col-span-2">
              <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="space-y-4">
                  <div className="rounded-[1.4rem] bg-white/72 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Customer</p>
                    <h3 className="mt-2 text-2xl font-semibold">{activeCustomer.customer.name}</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      {activeCustomer.customer.identity.countryCode} {activeCustomer.customer.identity.phoneNumber}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeCustomer.customer.tags.map((tag) => (
                        <StatusBadge key={tag} label={tag} />
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <MetricCard label="Points" value={String(activeCustomer.customer.points)} detail="From validated engagement" />
                    <MetricCard label="Stars" value={String(activeCustomer.customer.stars)} detail="From verified purchases" />
                    <MetricCard label="Visits" value={String(activeCustomer.customer.visitCount)} detail="Validated restaurant visits" />
                  </div>
                </div>
                <div className="space-y-4">
                  {activeCustomer.activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="rounded-[1.3rem] border border-neutral-900/8 bg-white/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">{formatDisplayDate(activity.timestamp)}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{activity.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>
        ) : null}

        {section === "loyalty" ? (
          <SectionCard title="Journey and rule map" subtitle="The same engine powers all three brands, but each one has its own mission language and loop design.">
            <div className="grid gap-4 md:grid-cols-2">
              {brand.loops.map((loop) => (
                <div key={loop.id} className="rounded-[1.5rem] border border-neutral-900/8 bg-white/72 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Loop</p>
                  <h3 className="mt-2 text-2xl font-semibold">{loop.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{loop.description}</p>
                  <div className="mt-4 text-sm text-neutral-500">Target: {loop.target} steps</div>
                </div>
              ))}
              {brand.missions.map((mission) => (
                <div key={mission.id} className="rounded-[1.5rem] border border-neutral-900/8 bg-white/72 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold">{mission.title}</h3>
                    <StatusBadge label={mission.approvalRequired ? "Approval required" : "Auto"} tone={mission.approvalRequired ? "warning" : "success"} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{mission.description}</p>
                  <p className="mt-4 text-sm text-neutral-500">Reward: {mission.rewardValue}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {section === "campaigns" ? (
          <SectionCard title="Campaign lifecycle simulator" subtitle="Campaigns preview targeting, sending states, and analytics without bypassing loyalty rules.">
            <div className="grid gap-4 lg:grid-cols-3">
              {state.campaigns
                .filter((campaign) => campaign.brandId === brandId)
                .map((campaign) => (
                  <div key={campaign.id} className="rounded-[1.5rem] border border-neutral-900/8 bg-white/72 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{campaign.channel}</p>
                        <h3 className="mt-2 text-xl font-semibold">{campaign.name}</h3>
                      </div>
                      <StatusBadge label={campaign.status} tone={campaign.status === "sending" ? "warning" : campaign.status === "delivered" ? "success" : "neutral"} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{campaign.preview}</p>
                    <p className="mt-4 text-sm text-neutral-500">
                      Delivered {campaign.delivered} · Failed {campaign.failed}
                    </p>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "advance-campaign", campaignId: campaign.id })}
                      className="mt-4 rounded-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
                    >
                      Advance Lifecycle
                    </button>
                  </div>
                ))}
            </div>
          </SectionCard>
        ) : null}

        {section === "verification" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <SectionCard title="Proof and approval queue" subtitle="Only admin actions resolve verification and unlock claimable rewards.">
              <div className="space-y-4">
                {state.verifications
                  .filter((verification) => verification.brandId === brandId)
                  .map((verification) => (
                    <div key={verification.id} className="rounded-[1.4rem] border border-neutral-900/8 bg-white/72 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{verification.proofLabel}</h3>
                        <StatusBadge label={verification.status.replace("_", " ")} tone={verification.status === "approved" ? "success" : verification.status === "rejected" ? "danger" : "warning"} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{verification.notes}</p>
                      {verification.status === "pending_review" ? (
                        <div className="mt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() => dispatch({ type: "approve-verification", submissionId: verification.id })}
                            className="rounded-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
                          >
                            Approve Submission
                          </button>
                          <button
                            type="button"
                            onClick={() => dispatch({ type: "reject-verification", submissionId: verification.id })}
                            className="rounded-full bg-white px-4 py-3 text-sm font-medium text-neutral-900"
                          >
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
            </SectionCard>
            <SectionCard title="Billing and coupon validation" subtitle="Purchases and coupons stay operationally controlled from this layer.">
              <div className="space-y-4">
                {state.billings
                  .filter((billing) => billing.brandId === brandId)
                  .map((billing) => (
                    <div key={billing.id} className="rounded-[1.4rem] border border-neutral-900/8 bg-white/72 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">₹{billing.amount} · {billing.items.join(", ")}</h3>
                        <StatusBadge label={billing.status.replace("_", " ")} tone={billing.status === "validated" ? "success" : "warning"} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        Source: {billing.source === "admin_entry" ? "Admin entry" : "Optional upload"} · {billing.billReference ?? billing.imageName ?? "No reference"}
                      </p>
                      {billing.status === "pending_validation" ? (
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "validate-billing", billingId: billing.id })}
                          className="mt-4 rounded-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
                        >
                          Validate Bill
                        </button>
                      ) : null}
                    </div>
                  ))}
                {state.coupons
                  .filter((coupon) => coupon.brandId === brandId)
                  .map((coupon) => (
                    <div key={coupon.id} className="rounded-[1.4rem] border border-neutral-900/8 bg-white/72 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{coupon.code}</h3>
                        <StatusBadge label={coupon.status} tone={coupon.status === "active" ? "success" : "neutral"} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{coupon.title}</p>
                      {coupon.status === "active" ? (
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "redeem-coupon", couponId: coupon.id })}
                          className="mt-4 rounded-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
                        >
                          Redeem Coupon
                        </button>
                      ) : null}
                    </div>
                  ))}
              </div>
            </SectionCard>
          </div>
        ) : null}

        {section === "settings" ? (
          <SectionCard title="Brand system preview" subtitle="Themes, motion personality, and restaurant identity are config-driven rather than hardcoded into pages.">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-[1.5rem] p-6 text-white" style={{ backgroundImage: brand.theme.heroGradient }}>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Heading font</p>
                <p className="mt-4 text-3xl" style={{ fontFamily: brand.theme.headingFont }}>{brand.label}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/72 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Mood</p>
                <p className="mt-4 text-2xl font-semibold">{brand.signatureMood}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/72 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Layout intent</p>
                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  Section order, copy voice, reward naming, and visual pacing all shift with brand config while the engine stays shared.
                </p>
              </div>
            </div>
          </SectionCard>
        ) : null}
      </div>
    </main>
  );
}
