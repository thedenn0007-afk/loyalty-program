export type BrandId = "matsuri" | "roast-theory" | "noir-social";
export type CustomerTier = "Seed" | "Bloom" | "Reserve" | "Afterglow";
export type MissionStatus = "locked" | "active" | "pending_review" | "verified" | "completed";
export type RewardStatus =
  | "locked"
  | "active"
  | "completed"
  | "claimable"
  | "coupon_generated"
  | "redeemed"
  | "expired";
export type CouponStatus = "generated" | "active" | "redeemed" | "expired";
export type VerificationStatus = "pending_review" | "approved" | "rejected";
export type BillingStatus = "pending_validation" | "validated" | "rejected";
export type CampaignStatus = "draft" | "scheduled" | "sending" | "delivered" | "failed" | "archived";
export type ActivityKind =
  | "scan"
  | "mission_submitted"
  | "verification_approved"
  | "verification_rejected"
  | "billing_added"
  | "billing_validated"
  | "reward_claimed"
  | "coupon_redeemed"
  | "customer_created"
  | "campaign_updated";

export type PhoneIdentity = {
  phoneNumber: string;
  countryCode: string;
};

export type ActivityEvent = {
  id: string;
  customerId: string;
  brandId: BrandId;
  type: ActivityKind;
  title: string;
  detail: string;
  timestamp: string;
};

export type Mission = {
  id: string;
  brandId: BrandId;
  title: string;
  description: string;
  loopId: string;
  rewardTitle: string;
  rewardValue: string;
  pointsAwarded: number;
  starsAwarded: number;
  proofRequired: boolean;
  approvalRequired: boolean;
  type: "scan" | "purchase" | "spend" | "social";
  goal: number;
  heroTag: string;
};

export type MissionProgress = {
  missionId: string;
  status: MissionStatus;
  progress: number;
  lastUpdated: string;
  submissionId?: string;
};

export type LoopDefinition = {
  id: string;
  brandId: BrandId;
  title: string;
  description: string;
  target: number;
  evolvesInto?: string;
};

export type RewardInstance = {
  id: string;
  customerId: string;
  missionId: string;
  brandId: BrandId;
  title: string;
  valueLabel: string;
  status: RewardStatus;
  claimedAt?: string;
  couponId?: string;
  expiresAt?: string;
};

export type CouponInstance = {
  id: string;
  rewardId: string;
  customerId: string;
  brandId: BrandId;
  code: string;
  title: string;
  status: CouponStatus;
  generatedAt: string;
  expiresAt: string;
  redeemedAt?: string;
};

export type BillingRecord = {
  id: string;
  customerId: string;
  brandId: BrandId;
  amount: number;
  items: string[];
  source: "admin_entry" | "upload";
  billReference?: string;
  imageName?: string;
  timestamp: string;
  status: BillingStatus;
};

export type VerificationSubmission = {
  id: string;
  customerId: string;
  brandId: BrandId;
  missionId: string;
  proofLabel: string;
  notes: string;
  createdAt: string;
  status: VerificationStatus;
};

export type Campaign = {
  id: string;
  brandId: BrandId;
  name: string;
  channel: "WhatsApp" | "SMS" | "Email";
  audience: string;
  status: CampaignStatus;
  scheduledFor?: string;
  delivered: number;
  failed: number;
  preview: string;
};

export type BrandTheme = {
  pageGradient: string;
  heroGradient: string;
  accent: string;
  accentSoft: string;
  text: string;
  headingFont: string;
  bodyFont: string;
  panel: string;
};

export type BrandConfig = {
  id: BrandId;
  label: string;
  heroTitle: string;
  heroDescription: string;
  signatureMood: string;
  theme: BrandTheme;
  missions: Mission[];
  loops: LoopDefinition[];
};

export type CustomerProfile = {
  id: string;
  brandId: BrandId;
  name: string;
  identity: PhoneIdentity;
  birthday: string;
  preferredBrand: BrandId;
  tier: CustomerTier;
  points: number;
  stars: number;
  totalSpend: number;
  tags: string[];
  badges: string[];
  missionProgress: MissionProgress[];
  rewardIds: string[];
  couponIds: string[];
  activityIds: string[];
  billingIds: string[];
  visitCount: number;
};

export type DemoState = {
  customers: CustomerProfile[];
  rewards: RewardInstance[];
  coupons: CouponInstance[];
  billings: BillingRecord[];
  verifications: VerificationSubmission[];
  campaigns: Campaign[];
  activities: ActivityEvent[];
  ui: {
    activeBrandId: BrandId;
    activeCustomerId: string;
    activeRole: "customer" | "admin";
    demoMode: boolean;
  };
};
