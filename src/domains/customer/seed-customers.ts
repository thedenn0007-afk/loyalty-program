import {
  ActivityEvent,
  BillingRecord,
  Campaign,
  CouponInstance,
  CustomerProfile,
  DemoState,
  RewardInstance,
  VerificationSubmission,
} from "@/domains/shared/contracts";
import { brandCatalog } from "@/domains/brand/brand-catalog";

const baseActivities: ActivityEvent[] = [
  {
    id: "activity_scan_aanya",
    customerId: "cust_matsuri_aanya",
    brandId: "matsuri",
    type: "scan",
    title: "First scan completed",
    detail: "Aanya activated the branded experience from the table QR.",
    timestamp: "2026-05-07T09:30:00.000Z",
  },
  {
    id: "activity_pending_mika",
    customerId: "cust_matsuri_mika",
    brandId: "matsuri",
    type: "mission_submitted",
    title: "Story proof submitted",
    detail: "Mika submitted an Instagram Story screenshot and is waiting for review.",
    timestamp: "2026-05-08T05:10:00.000Z",
  },
  {
    id: "activity_coupon_noir",
    customerId: "cust_noir_zev",
    brandId: "noir-social",
    type: "reward_claimed",
    title: "Reward claimed",
    detail: "Zev claimed a VIP Friday invite and received a live coupon.",
    timestamp: "2026-05-08T03:15:00.000Z",
  },
];

const baseRewards: RewardInstance[] = [
  {
    id: "reward_mika_story",
    customerId: "cust_matsuri_mika",
    missionId: "matsuri-story",
    brandId: "matsuri",
    title: "Creator Cream Reward",
    valueLabel: "Invite-only creator drink upgrade",
    status: "active",
  },
  {
    id: "reward_zev_vip",
    customerId: "cust_noir_zev",
    missionId: "noir-story",
    brandId: "noir-social",
    title: "Velvet Invite",
    valueLabel: "VIP Friday guest-list entry",
    status: "coupon_generated",
    claimedAt: "2026-05-08T03:15:00.000Z",
    couponId: "coupon_noir_vip",
    expiresAt: "2026-05-18T03:15:00.000Z",
  },
];

const baseCoupons: CouponInstance[] = [
  {
    id: "coupon_noir_vip",
    rewardId: "reward_zev_vip",
    customerId: "cust_noir_zev",
    brandId: "noir-social",
    code: "NOIR-7YTR4Q",
    title: "VIP Friday guest-list entry",
    status: "active",
    generatedAt: "2026-05-08T03:15:00.000Z",
    expiresAt: "2026-05-18T03:15:00.000Z",
  },
];

const baseVerifications: VerificationSubmission[] = [
  {
    id: "verify_mika_story",
    customerId: "cust_matsuri_mika",
    brandId: "matsuri",
    missionId: "matsuri-story",
    proofLabel: "Instagram Story Screenshot",
    notes: "Shared the spring dessert table setup to Stories.",
    createdAt: "2026-05-08T05:10:00.000Z",
    status: "pending_review",
  },
];

const baseBillings: BillingRecord[] = [
  {
    id: "bill_roast_kian",
    customerId: "cust_roast_kian",
    brandId: "roast-theory",
    amount: 680,
    items: ["Double Espresso", "Almond Croissant"],
    source: "admin_entry",
    billReference: "RT-4102",
    timestamp: "2026-05-08T02:20:00.000Z",
    status: "pending_validation",
  },
];

const baseCampaigns: Campaign[] = [
  {
    id: "campaign_matsuri_weekend",
    brandId: "matsuri",
    name: "Weekend Dessert Bloom",
    channel: "WhatsApp",
    audience: "Dessert regulars",
    status: "scheduled",
    scheduledFor: "2026-05-09T06:00:00.000Z",
    delivered: 0,
    failed: 0,
    preview: "Return for a floral parfait ritual this weekend and unlock a soft upgrade.",
  },
  {
    id: "campaign_roast_morning",
    brandId: "roast-theory",
    name: "7AM Club Revival",
    channel: "SMS",
    audience: "Lapsed commuters",
    status: "sending",
    delivered: 143,
    failed: 7,
    preview: "Clock in before 7AM for a double-star morning this week.",
  },
  {
    id: "campaign_noir_vip",
    brandId: "noir-social",
    name: "VIP Friday Circuit",
    channel: "Email",
    audience: "After-hours regulars",
    status: "delivered",
    delivered: 88,
    failed: 2,
    preview: "Friday is velvet-only. Confirm your circuit and unlock guest-list access.",
  },
];

const baseCustomers: CustomerProfile[] = [
  {
    id: "cust_matsuri_aanya",
    brandId: "matsuri",
    name: "Aanya Kapoor",
    identity: { phoneNumber: "9876543210", countryCode: "+91" },
    birthday: "1997-08-12",
    preferredBrand: "matsuri",
    tier: "Seed",
    points: 25,
    stars: 0,
    totalSpend: 0,
    tags: ["New"],
    badges: ["First Scan"],
    visitCount: 1,
    missionProgress: brandCatalog
      .find((brand) => brand.id === "matsuri")!
      .missions.map((mission) => ({
        missionId: mission.id,
        status: mission.id === "matsuri-scan" ? "completed" : mission.id === "matsuri-dessert" ? "active" : "locked",
        progress: mission.id === "matsuri-scan" ? 1 : 0,
        lastUpdated: "2026-05-07T09:30:00.000Z",
      })),
    rewardIds: [],
    couponIds: [],
    activityIds: ["activity_scan_aanya"],
    billingIds: [],
  },
  {
    id: "cust_matsuri_mika",
    brandId: "matsuri",
    name: "Mika Shah",
    identity: { phoneNumber: "9123456780", countryCode: "+91" },
    birthday: "1995-11-19",
    preferredBrand: "matsuri",
    tier: "Bloom",
    points: 120,
    stars: 4,
    totalSpend: 2140,
    tags: ["Creator", "Frequent Visitor"],
    badges: ["Dessert Ritualist"],
    visitCount: 4,
    missionProgress: brandCatalog
      .find((brand) => brand.id === "matsuri")!
      .missions.map((mission) => ({
        missionId: mission.id,
        status: mission.id === "matsuri-story" ? "pending_review" : "completed",
        progress: 1,
        lastUpdated: mission.id === "matsuri-story" ? "2026-05-08T05:10:00.000Z" : "2026-05-06T08:00:00.000Z",
        submissionId: mission.id === "matsuri-story" ? "verify_mika_story" : undefined,
      })),
    rewardIds: ["reward_mika_story"],
    couponIds: [],
    activityIds: ["activity_pending_mika"],
    billingIds: [],
  },
  {
    id: "cust_roast_kian",
    brandId: "roast-theory",
    name: "Kian Malhotra",
    identity: { phoneNumber: "9988776655", countryCode: "+91" },
    birthday: "1992-03-02",
    preferredBrand: "roast-theory",
    tier: "Bloom",
    points: 180,
    stars: 6,
    totalSpend: 3640,
    tags: ["7AM Club"],
    badges: ["Morning Ritual"],
    visitCount: 6,
    missionProgress: brandCatalog
      .find((brand) => brand.id === "roast-theory")!
      .missions.map((mission) => ({
        missionId: mission.id,
        status: mission.id === "roast-reel" ? "active" : "completed",
        progress: mission.id === "roast-reel" ? 0 : 1,
        lastUpdated: "2026-05-08T02:20:00.000Z",
      })),
    rewardIds: [],
    couponIds: [],
    activityIds: [],
    billingIds: ["bill_roast_kian"],
  },
  {
    id: "cust_noir_zev",
    brandId: "noir-social",
    name: "Zev Arora",
    identity: { phoneNumber: "9000012345", countryCode: "+91" },
    birthday: "1990-12-07",
    preferredBrand: "noir-social",
    tier: "Reserve",
    points: 320,
    stars: 8,
    totalSpend: 8920,
    tags: ["VIP", "After Hours"],
    badges: ["Nightline"],
    visitCount: 8,
    missionProgress: brandCatalog
      .find((brand) => brand.id === "noir-social")!
      .missions.map((mission) => ({
        missionId: mission.id,
        status: "completed",
        progress: 1,
        lastUpdated: "2026-05-08T03:15:00.000Z",
      })),
    rewardIds: ["reward_zev_vip"],
    couponIds: ["coupon_noir_vip"],
    activityIds: ["activity_coupon_noir"],
    billingIds: [],
  },
];

export function buildSeedState(): DemoState {
  return {
    customers: baseCustomers,
    rewards: baseRewards,
    coupons: baseCoupons,
    billings: baseBillings,
    verifications: baseVerifications,
    campaigns: baseCampaigns,
    activities: baseActivities,
    ui: {
      activeBrandId: "matsuri",
      activeCustomerId: "cust_matsuri_aanya",
      activeRole: "customer",
      demoMode: true,
    },
  };
}
