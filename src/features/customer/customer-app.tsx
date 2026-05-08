"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getBrandConfig } from "@/domains/brand/brand-catalog";
import { BrandId, Mission } from "@/domains/shared/contracts";
import { formatDisplayDate, relativeWindow } from "@/lib/dates";
import { useDemoState } from "@/providers/demo-state-provider";
import { getCustomerExperience } from "@/services/demo-service";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TopBar } from "@/components/ui/top-bar";

function missionTone(status: string) {
  if (status === "completed") return "success";
  if (status === "pending_review") return "warning";
  if (status === "locked") return "neutral";
  return "accent";
}

function rewardTone(status: string) {
  if (status === "claimable") return "success";
  if (status === "coupon_generated") return "accent";
  return "neutral";
}

function CustomerActions({
  brandId,
  customerId,
  mission,
}: {
  brandId: BrandId;
  customerId: string;
  mission: Mission;
}) {
  const { dispatch } = useDemoState();

  if (!mission.proofRequired) {
    return (
      <div className="rounded-[1.25rem] bg-neutral-950 px-4 py-3 text-sm text-white">
        This mission unlocks through restaurant validation after a confirmed purchase.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        dispatch({
          type: "submit-proof",
          payload: {
            customerId,
            missionId: mission.id,
            proofLabel: `${mission.title} proof`,
            notes: `Submitted from the ${brandId} customer flow.`,
          },
        })
      }
      className="rounded-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
    >
      Submit Proof For Review
    </button>
  );
}

export function CustomerApp({
  brandId,
  section,
}: {
  brandId: BrandId;
  section: "home" | "missions" | "rewards" | "profile";
}) {
  const { state, dispatch } = useDemoState();
  const brand = getBrandConfig(brandId);
  const customerId =
    state.ui.activeCustomerId && getCustomerExperience(state, state.ui.activeCustomerId).customer.brandId === brandId
      ? state.ui.activeCustomerId
      : state.customers.find((customer) => customer.brandId === brandId)?.id ?? state.customers[0].id;
  const experience = getCustomerExperience(state, customerId);

  return (
    <main className="min-h-screen px-4 py-4 md:px-6 lg:px-8" style={{ backgroundImage: brand.theme.pageGradient }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <TopBar brandId={brandId} mode="customer" />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] p-8 text-white"
          style={{ backgroundImage: brand.theme.heroGradient, color: brand.theme.text }}
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.35em] opacity-75">{brand.label}</p>
              <div>
                <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl" style={{ fontFamily: brand.theme.headingFont }}>
                  {brand.heroTitle}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 opacity-90">{brand.heroDescription}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["home", "missions", "rewards", "profile"] as const).map((item) => (
                  <Link
                    key={item}
                    href={item === "home" ? `/${brandId}` : `/${brandId}/${item}`}
                    className={`rounded-full px-4 py-2 text-sm ${
                      section === item ? "bg-white/90 text-neutral-950" : "bg-white/10 text-white"
                    }`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Link>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-[1.75rem] p-5 text-neutral-950">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Active persona</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em]">{experience.customer.name}</h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {experience.customer.identity.countryCode} {experience.customer.identity.phoneNumber}
                  </p>
                </div>
                <StatusBadge label={experience.customer.tier} tone="accent" />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <MetricCard label="Points" value={String(experience.customer.points)} detail="Engagement progression" />
                <MetricCard label="Stars" value={String(experience.customer.stars)} detail="Purchase-verified loyalty" />
                <MetricCard label="Spend" value={`₹${experience.customer.totalSpend}`} detail="Validated bill-linked value" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {state.customers
                  .filter((customer) => customer.brandId === brandId)
                  .map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => dispatch({ type: "set-active-customer", customerId: customer.id })}
                      className={`rounded-full px-3 py-2 text-xs font-medium ${
                        customer.id === experience.customer.id ? "bg-neutral-950 text-white" : "bg-neutral-900/5 text-neutral-700"
                      }`}
                    >
                      {customer.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </motion.section>

        {section === "home" ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <SectionCard
              title="Your next brand-worthy move"
              subtitle="The engine only advances after the restaurant verifies the right action."
            >
              <div className="space-y-4">
                {experience.journeys.slice(0, 2).map((entry) => (
                  <div key={entry.missionId} className="rounded-[1.4rem] border border-neutral-900/8 bg-white/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-neutral-500">{entry.mission.heroTag}</p>
                        <h3 className="text-lg font-semibold">{entry.mission.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">{entry.mission.description}</p>
                      </div>
                      <StatusBadge label={entry.status.replace("_", " ")} tone={missionTone(entry.status) as never} />
                    </div>
                    <div className="mt-4">
                      {entry.status === "active" && entry.mission.proofRequired ? (
                        <CustomerActions brandId={brandId} customerId={experience.customer.id} mission={entry.mission} />
                      ) : entry.status === "pending_review" ? (
                        <div className="rounded-[1.25rem] bg-amber-500/12 px-4 py-3 text-sm text-amber-800">
                          Waiting for restaurant confirmation. The presenter can switch to admin and approve this in the Verification Center.
                        </div>
                      ) : (
                        <div className="rounded-[1.25rem] bg-neutral-950 px-4 py-3 text-sm text-white">
                          Reward outcome: {entry.mission.rewardValue}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Live experience state" subtitle="These are the exact lifecycle moments the demo presenter can move through.">
              <div className="space-y-4">
                <div className="rounded-[1.4rem] bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Pending approvals</p>
                  <p className="mt-2 text-3xl font-semibold">{experience.verifications.filter((item) => item.status === "pending_review").length}</p>
                </div>
                <div className="rounded-[1.4rem] bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Active coupons</p>
                  <p className="mt-2 text-3xl font-semibold">{experience.coupons.filter((coupon) => coupon.status === "active").length}</p>
                </div>
                <div className="rounded-[1.4rem] bg-white/70 p-4">
                  <p className="text-sm leading-7 text-neutral-600">
                    Smooth demo handoff: use <span className="font-medium text-neutral-900">Switch to Admin</span>, resolve the pending event, then return here to claim or view the newly activated reward.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        ) : null}

        {section === "missions" ? (
          <SectionCard title="Mission roadmap" subtitle="Each mission has explicit state, proof logic, and reward outcomes.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {experience.journeys.map((entry) => (
                <div key={entry.missionId} className="rounded-[1.5rem] border border-neutral-900/8 bg-white/72 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{entry.mission.heroTag}</p>
                      <h3 className="mt-2 text-xl font-semibold">{entry.mission.title}</h3>
                    </div>
                    <StatusBadge label={entry.status.replace("_", " ")} tone={missionTone(entry.status) as never} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{entry.mission.description}</p>
                  <div className="mt-4 rounded-[1.1rem] bg-neutral-900/[0.04] p-4 text-sm text-neutral-700">
                    Reward: {entry.mission.rewardValue}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-500">
                    <span>Points +{entry.mission.pointsAwarded}</span>
                    <span>Stars +{entry.mission.starsAwarded}</span>
                    <span>{entry.mission.approvalRequired ? "Restaurant approval" : "Auto progression"}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {section === "rewards" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <SectionCard title="Reward wallet" subtitle="Coupons are only created after a claimable reward is explicitly claimed.">
              <div className="space-y-4">
                {experience.rewards.map((reward) => (
                  <div key={reward.id} className="rounded-[1.5rem] border border-neutral-900/8 bg-white/72 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold">{reward.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">{reward.valueLabel}</p>
                      </div>
                      <StatusBadge label={reward.status.replace("_", " ")} tone={rewardTone(reward.status) as never} />
                    </div>
                    {reward.status === "claimable" ? (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "claim-reward", rewardId: reward.id })}
                        className="mt-4 rounded-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
                      >
                        Claim Reward
                      </button>
                    ) : null}
                    {reward.expiresAt ? (
                      <p className="mt-3 text-sm text-neutral-500">{relativeWindow(reward.expiresAt)}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Coupons and redemption" subtitle="Redemption happens on the admin side to prevent customer-side bypasses.">
              <div className="space-y-4">
                {experience.coupons.length === 0 ? (
                  <p className="rounded-[1.4rem] bg-white/72 p-4 text-sm leading-7 text-neutral-600">
                    No active coupons yet. Claim an approved reward or use the seeded Noir Social persona to see a live coupon.
                  </p>
                ) : null}
                {experience.coupons.map((coupon) => (
                  <div key={coupon.id} className="rounded-[1.5rem] border border-neutral-900/8 bg-white/72 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Coupon code</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-[0.06em]">{coupon.code}</h3>
                      </div>
                      <StatusBadge label={coupon.status} tone={coupon.status === "active" ? "success" : "neutral"} />
                    </div>
                    <p className="mt-3 text-sm text-neutral-600">{coupon.title}</p>
                    <div className="mt-4 text-sm text-neutral-500">
                      {formatDisplayDate(coupon.generatedAt)} · {relativeWindow(coupon.expiresAt)}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        ) : null}

        {section === "profile" ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionCard title="Member profile" subtitle="Phone number is the canonical identity key across admin and customer surfaces.">
              <div className="space-y-4">
                <div className="rounded-[1.4rem] bg-white/72 p-4">
                  <p className="text-sm text-neutral-500">Phone</p>
                  <p className="mt-1 text-xl font-semibold">
                    {experience.customer.identity.countryCode} {experience.customer.identity.phoneNumber}
                  </p>
                </div>
                <div className="rounded-[1.4rem] bg-white/72 p-4">
                  <p className="text-sm text-neutral-500">Tags</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {experience.customer.tags.map((tag) => (
                      <StatusBadge key={tag} label={tag} />
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.4rem] bg-white/72 p-4">
                  <p className="text-sm text-neutral-500">Badges</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {experience.customer.badges.map((badge) => (
                      <StatusBadge key={badge} label={badge} tone="accent" />
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Activity timeline" subtitle="Every approval, purchase, claim, and redemption is tracked visibly for demo credibility.">
              <div className="space-y-4">
                {experience.activities.map((activity) => (
                  <div key={activity.id} className="rounded-[1.3rem] border border-neutral-900/8 bg-white/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-semibold">{activity.title}</h3>
                      <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">{formatDisplayDate(activity.timestamp)}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{activity.detail}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        ) : null}
      </div>
    </main>
  );
}
