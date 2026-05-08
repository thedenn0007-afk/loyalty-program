import { buildSeedState } from "@/domains/customer/seed-customers";
import { getBrandConfig } from "@/domains/brand/brand-catalog";
import {
  BillingRecord,
  BrandId,
  CustomerProfile,
  DemoState,
  Mission,
} from "@/domains/shared/contracts";
import {
  addBillingRecord,
  advanceCampaignState,
  approveVerification,
  claimReward,
  createCustomer,
  redeemCoupon,
  rejectVerification,
  submitMissionProof,
  validateBillingRecord,
} from "@/engine/loyalty-engine";
import { nowIso } from "@/lib/dates";

export const demoStorageKey = "loyalty-ecosystem-demo-state";

export function getInitialState() {
  return buildSeedState();
}

export function safeParseState(raw: string | null): DemoState {
  if (!raw) return getInitialState();
  try {
    return JSON.parse(raw) as DemoState;
  } catch {
    return getInitialState();
  }
}

export function getCustomerById(state: DemoState, customerId: string) {
  return state.customers.find((customer) => customer.id === customerId) ?? state.customers[0];
}

export function getCustomerByPhone(state: DemoState, brandId: BrandId, phoneNumber: string) {
  return state.customers.find(
    (customer) => customer.brandId === brandId && customer.identity.phoneNumber === phoneNumber,
  );
}

export function getBrandViewModel(state: DemoState, brandId: BrandId) {
  const brand = getBrandConfig(brandId);
  const customers = state.customers.filter((customer) => customer.brandId === brandId);
  const pendingVerifications = state.verifications.filter(
    (verification) => verification.brandId === brandId && verification.status === "pending_review",
  );
  const activeCoupons = state.coupons.filter(
    (coupon) => coupon.brandId === brandId && coupon.status === "active",
  );

  return {
    brand,
    customers,
    pendingVerifications,
    activeCoupons,
    kpis: {
      members: customers.length,
      pendingApprovals: pendingVerifications.length,
      redemptions: state.coupons.filter(
        (coupon) => coupon.brandId === brandId && coupon.status === "redeemed",
      ).length,
      liveCampaigns: state.campaigns.filter(
        (campaign) => campaign.brandId === brandId && ["scheduled", "sending"].includes(campaign.status),
      ).length,
    },
  };
}

export function getCustomerExperience(state: DemoState, customerId: string) {
  const customer = getCustomerById(state, customerId);
  const brand = getBrandConfig(customer.brandId);
  const missionMap = new Map<string, Mission>(brand.missions.map((mission) => [mission.id, mission]));
  const rewards = state.rewards.filter((reward) => reward.customerId === customer.id);
  const coupons = state.coupons.filter((coupon) => coupon.customerId === customer.id);
  const activities = state.activities.filter((activity) => activity.customerId === customer.id);
  const billings = state.billings.filter((billing) => billing.customerId === customer.id);
  const verifications = state.verifications.filter((item) => item.customerId === customer.id);

  return {
    customer,
    brand,
    journeys: customer.missionProgress.map((progress) => ({
      ...progress,
      mission: missionMap.get(progress.missionId)!,
    })),
    rewards,
    coupons,
    activities,
    billings,
    verifications,
  };
}

export function customerService() {
  return {
    createCustomer,
    submitMissionProof,
    claimReward,
  };
}

export function adminService() {
  return {
    addPurchase(
      state: DemoState,
      payload: Omit<BillingRecord, "id" | "status" | "timestamp"> & { timestamp?: string },
    ) {
      return addBillingRecord(state, {
        ...payload,
        timestamp: payload.timestamp ?? nowIso(),
      });
    },
    validateBillingRecord,
    approveVerification,
    rejectVerification,
    redeemCoupon,
    advanceCampaignState,
  };
}
