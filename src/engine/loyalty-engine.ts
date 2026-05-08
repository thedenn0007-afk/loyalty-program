import { getBrandConfig } from "@/domains/brand/brand-catalog";
import {
  ActivityEvent,
  BillingRecord,
  BrandId,
  CouponInstance,
  CustomerProfile,
  DemoState,
  Mission,
  MissionProgress,
  RewardInstance,
  RewardStatus,
  VerificationSubmission,
} from "@/domains/shared/contracts";
import { addDaysToIso, nowIso } from "@/lib/dates";
import { makeCouponCode, makeId } from "@/lib/id";

function tierFromPoints(points: number): CustomerProfile["tier"] {
  if (points >= 300) return "Afterglow";
  if (points >= 180) return "Reserve";
  if (points >= 80) return "Bloom";
  return "Seed";
}

function getMission(brandId: BrandId, missionId: string) {
  return getBrandConfig(brandId).missions.find((mission) => mission.id === missionId);
}

function addActivity(state: DemoState, activity: ActivityEvent) {
  state.activities = [activity, ...state.activities];
  return state;
}

function ensureReward(
  state: DemoState,
  customer: CustomerProfile,
  mission: Mission,
  status: RewardStatus,
  at: string,
) {
  const existing = state.rewards.find(
    (reward) => reward.customerId === customer.id && reward.missionId === mission.id,
  );

  if (existing) {
    existing.status = status;
    if (status === "claimable") {
      existing.expiresAt = addDaysToIso(at, 10);
    }
    return existing;
  }

  const reward: RewardInstance = {
    id: makeId("reward"),
    customerId: customer.id,
    missionId: mission.id,
    brandId: customer.brandId,
    title: mission.rewardTitle,
    valueLabel: mission.rewardValue,
    status,
    expiresAt: status === "claimable" ? addDaysToIso(at, 10) : undefined,
  };
  state.rewards = [reward, ...state.rewards];
  customer.rewardIds = [reward.id, ...customer.rewardIds];
  return reward;
}

function updateMissionProgress(
  customer: CustomerProfile,
  missionId: string,
  updates: Partial<MissionProgress>,
) {
  customer.missionProgress = customer.missionProgress.map((progress) =>
    progress.missionId === missionId ? { ...progress, ...updates } : progress,
  );
}

function unlockNextMissions(customer: CustomerProfile) {
  const hasCompletedAny = customer.missionProgress.some((progress) => progress.status === "completed");
  if (!hasCompletedAny) return;
  customer.missionProgress = customer.missionProgress.map((progress) =>
    progress.status === "locked" ? { ...progress, status: "active" } : progress,
  );
}

function awardMissionValue(customer: CustomerProfile, mission: Mission) {
  customer.points += mission.pointsAwarded;
  customer.stars += mission.starsAwarded;
  customer.tier = tierFromPoints(customer.points);
}

export function createCustomer(
  state: DemoState,
  input: Pick<CustomerProfile, "name" | "birthday" | "preferredBrand"> & {
    brandId: BrandId;
    phoneNumber: string;
    tags?: string[];
  },
) {
  const existing = state.customers.find(
    (customer) =>
      customer.brandId === input.brandId && customer.identity.phoneNumber === input.phoneNumber,
  );

  if (existing) {
    return { state, customer: existing, created: false };
  }

  const brand = getBrandConfig(input.brandId);
  const customer: CustomerProfile = {
    id: makeId("customer"),
    brandId: input.brandId,
    name: input.name,
    identity: { phoneNumber: input.phoneNumber, countryCode: "+91" },
    birthday: input.birthday,
    preferredBrand: input.preferredBrand,
    tier: "Seed",
    points: 0,
    stars: 0,
    totalSpend: 0,
    tags: input.tags ?? ["New"],
    badges: [],
    visitCount: 0,
    rewardIds: [],
    couponIds: [],
    activityIds: [],
    billingIds: [],
    missionProgress: brand.missions.map((mission, index) => ({
      missionId: mission.id,
      status: index === 0 ? "active" : "locked",
      progress: 0,
      lastUpdated: nowIso(),
    })),
  };
  state.customers = [customer, ...state.customers];
  const activityId = makeId("activity");
  addActivity(state, {
    id: activityId,
    customerId: customer.id,
    brandId: customer.brandId,
    type: "customer_created",
    title: "Customer created",
    detail: `${customer.name} was added from the admin console.`,
    timestamp: nowIso(),
  });
  customer.activityIds = [activityId];
  return { state, customer, created: true };
}

export function submitMissionProof(
  state: DemoState,
  customerId: string,
  missionId: string,
  proofLabel: string,
  notes: string,
) {
  const customer = state.customers.find((item) => item.id === customerId);
  if (!customer) return state;
  const mission = getMission(customer.brandId, missionId);
  if (!mission) return state;
  const createdAt = nowIso();
  const submission: VerificationSubmission = {
    id: makeId("verify"),
    customerId: customer.id,
    brandId: customer.brandId,
    missionId,
    proofLabel,
    notes,
    createdAt,
    status: "pending_review",
  };
  state.verifications = [submission, ...state.verifications];
  updateMissionProgress(customer, missionId, {
    status: "pending_review",
    progress: mission.goal,
    submissionId: submission.id,
    lastUpdated: createdAt,
  });
  ensureReward(state, customer, mission, "active", createdAt);
  const activityId = makeId("activity");
  addActivity(state, {
    id: activityId,
    customerId: customer.id,
    brandId: customer.brandId,
    type: "mission_submitted",
    title: `${mission.title} submitted`,
    detail: `Awaiting restaurant confirmation for ${proofLabel}.`,
    timestamp: createdAt,
  });
  customer.activityIds = [activityId, ...customer.activityIds];
  return state;
}

export function addBillingRecord(
  state: DemoState,
  record: Omit<BillingRecord, "id" | "status">,
) {
  const billing: BillingRecord = {
    ...record,
    id: makeId("bill"),
    status: "pending_validation",
  };
  state.billings = [billing, ...state.billings];
  const customer = state.customers.find((item) => item.id === billing.customerId);
  if (customer) {
    customer.billingIds = [billing.id, ...customer.billingIds];
    const activityId = makeId("activity");
    addActivity(state, {
      id: activityId,
      customerId: customer.id,
      brandId: customer.brandId,
      type: "billing_added",
      title: "Purchase added",
      detail: `Purchase worth ₹${billing.amount} added and waiting for validation.`,
      timestamp: billing.timestamp,
    });
    customer.activityIds = [activityId, ...customer.activityIds];
  }
  return state;
}

export function validateBillingRecord(state: DemoState, billingId: string) {
  const billing = state.billings.find((item) => item.id === billingId);
  if (!billing || billing.status !== "pending_validation") return state;
  billing.status = "validated";
  const customer = state.customers.find((item) => item.id === billing.customerId);
  if (!customer) return state;

  customer.totalSpend += billing.amount;
  customer.visitCount += 1;
  customer.points += Math.floor(billing.amount / 10);
  customer.stars += Math.max(1, Math.floor(billing.amount / 300));
  customer.tier = tierFromPoints(customer.points);

  const purchaseMission = customer.missionProgress.find((progress) => {
    const mission = getMission(customer.brandId, progress.missionId);
    return mission?.type === "purchase";
  });

  if (purchaseMission) {
    const mission = getMission(customer.brandId, purchaseMission.missionId)!;
    updateMissionProgress(customer, mission.id, {
      status: mission.approvalRequired ? "pending_review" : "completed",
      progress: mission.goal,
      lastUpdated: nowIso(),
    });
    ensureReward(state, customer, mission, mission.approvalRequired ? "active" : "claimable", nowIso());
    if (!mission.approvalRequired) {
      awardMissionValue(customer, mission);
      unlockNextMissions(customer);
    }
  }

  const activityId = makeId("activity");
  addActivity(state, {
    id: activityId,
    customerId: customer.id,
    brandId: customer.brandId,
    type: "billing_validated",
    title: "Purchase validated",
    detail: `Restaurant confirmed ₹${billing.amount} purchase with ${billing.items.join(", ")}.`,
    timestamp: nowIso(),
  });
  customer.activityIds = [activityId, ...customer.activityIds];
  return state;
}

export function approveVerification(state: DemoState, submissionId: string) {
  const submission = state.verifications.find((item) => item.id === submissionId);
  if (!submission || submission.status !== "pending_review") return state;
  submission.status = "approved";
  const customer = state.customers.find((item) => item.id === submission.customerId);
  if (!customer) return state;
  const mission = getMission(customer.brandId, submission.missionId);
  if (!mission) return state;
  updateMissionProgress(customer, mission.id, {
    status: "completed",
    progress: mission.goal,
    lastUpdated: nowIso(),
  });
  awardMissionValue(customer, mission);
  const reward = ensureReward(state, customer, mission, "claimable", nowIso());
  reward.status = "claimable";
  unlockNextMissions(customer);
  const activityId = makeId("activity");
  addActivity(state, {
    id: activityId,
    customerId: customer.id,
    brandId: customer.brandId,
    type: "verification_approved",
    title: "Restaurant approved submission",
    detail: `${mission.title} is now claimable.`,
    timestamp: nowIso(),
  });
  customer.activityIds = [activityId, ...customer.activityIds];
  return state;
}

export function rejectVerification(state: DemoState, submissionId: string) {
  const submission = state.verifications.find((item) => item.id === submissionId);
  if (!submission || submission.status !== "pending_review") return state;
  submission.status = "rejected";
  const customer = state.customers.find((item) => item.id === submission.customerId);
  if (!customer) return state;
  updateMissionProgress(customer, submission.missionId, {
    status: "active",
    progress: 0,
    lastUpdated: nowIso(),
    submissionId: undefined,
  });
  const activityId = makeId("activity");
  addActivity(state, {
    id: activityId,
    customerId: customer.id,
    brandId: customer.brandId,
    type: "verification_rejected",
    title: "Submission needs another pass",
    detail: "Restaurant rejected the proof and reopened the mission.",
    timestamp: nowIso(),
  });
  customer.activityIds = [activityId, ...customer.activityIds];
  return state;
}

export function claimReward(state: DemoState, rewardId: string) {
  const reward = state.rewards.find((item) => item.id === rewardId);
  if (!reward || reward.status !== "claimable") return state;
  const generatedAt = nowIso();
  const coupon: CouponInstance = {
    id: makeId("coupon"),
    rewardId: reward.id,
    customerId: reward.customerId,
    brandId: reward.brandId,
    code: makeCouponCode(reward.brandId),
    title: reward.valueLabel,
    status: "active",
    generatedAt,
    expiresAt: addDaysToIso(generatedAt, 10),
  };
  state.coupons = [coupon, ...state.coupons];
  reward.status = "coupon_generated";
  reward.claimedAt = generatedAt;
  reward.couponId = coupon.id;
  reward.expiresAt = coupon.expiresAt;
  const customer = state.customers.find((item) => item.id === reward.customerId);
  if (customer) {
    customer.couponIds = [coupon.id, ...customer.couponIds];
    const activityId = makeId("activity");
    addActivity(state, {
      id: activityId,
      customerId: customer.id,
      brandId: customer.brandId,
      type: "reward_claimed",
      title: "Reward claimed",
      detail: `Coupon ${coupon.code} is now active and ready for redemption.`,
      timestamp: generatedAt,
    });
    customer.activityIds = [activityId, ...customer.activityIds];
  }
  return state;
}

export function redeemCoupon(state: DemoState, couponId: string) {
  const coupon = state.coupons.find((item) => item.id === couponId);
  if (!coupon || coupon.status !== "active") return state;
  coupon.status = "redeemed";
  coupon.redeemedAt = nowIso();
  const reward = state.rewards.find((item) => item.id === coupon.rewardId);
  if (reward) {
    reward.status = "redeemed";
  }
  const customer = state.customers.find((item) => item.id === coupon.customerId);
  if (customer) {
    const activityId = makeId("activity");
    addActivity(state, {
      id: activityId,
      customerId: customer.id,
      brandId: customer.brandId,
      type: "coupon_redeemed",
      title: "Coupon redeemed",
      detail: `${coupon.code} has been validated by the restaurant.`,
      timestamp: nowIso(),
    });
    customer.activityIds = [activityId, ...customer.activityIds];
  }
  return state;
}

export function advanceCampaignState(state: DemoState, campaignId: string) {
  state.campaigns = state.campaigns.map((campaign) => {
    if (campaign.id !== campaignId) return campaign;
    if (campaign.status === "draft") return { ...campaign, status: "scheduled" };
    if (campaign.status === "scheduled") return { ...campaign, status: "sending" };
    if (campaign.status === "sending") {
      return { ...campaign, status: "delivered", delivered: campaign.delivered + 120, failed: campaign.failed + 3 };
    }
    if (campaign.status === "delivered") return { ...campaign, status: "archived" };
    return campaign;
  });
  return state;
}
