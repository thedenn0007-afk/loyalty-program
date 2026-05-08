"use client";

import type { Dispatch, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { BrandId, DemoState } from "@/domains/shared/contracts";
import { loadStateFromStorage, saveStateToStorage } from "@/repositories/local-storage-repository";
import { adminService, customerService, getInitialState } from "@/services/demo-service";

type DemoAction =
  | { type: "hydrate"; payload: DemoState }
  | { type: "set-brand"; brandId: BrandId }
  | { type: "set-role"; role: "customer" | "admin" }
  | { type: "set-active-customer"; customerId: string }
  | { type: "reset" }
  | { type: "create-customer"; payload: { brandId: BrandId; name: string; phoneNumber: string; birthday: string; preferredBrand: BrandId; tags?: string[] } }
  | { type: "submit-proof"; payload: { customerId: string; missionId: string; proofLabel: string; notes: string } }
  | { type: "claim-reward"; rewardId: string }
  | { type: "add-purchase"; payload: { customerId: string; brandId: BrandId; amount: number; items: string[]; source: "admin_entry" | "upload"; billReference?: string; imageName?: string } }
  | { type: "validate-billing"; billingId: string }
  | { type: "approve-verification"; submissionId: string }
  | { type: "reject-verification"; submissionId: string }
  | { type: "redeem-coupon"; couponId: string }
  | { type: "advance-campaign"; campaignId: string };

function reducer(state: DemoState, action: DemoAction): DemoState {
  const customerApi = customerService();
  const adminApi = adminService();
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "set-brand":
      return { ...state, ui: { ...state.ui, activeBrandId: action.brandId } };
    case "set-role":
      return { ...state, ui: { ...state.ui, activeRole: action.role } };
    case "set-active-customer":
      return { ...state, ui: { ...state.ui, activeCustomerId: action.customerId } };
    case "reset":
      return getInitialState();
    case "create-customer": {
      const next = structuredClone(state);
      const result = customerApi.createCustomer(next, action.payload);
      result.state.ui.activeCustomerId = result.customer.id;
      result.state.ui.activeBrandId = result.customer.brandId;
      return result.state;
    }
    case "submit-proof": {
      const next = structuredClone(state);
      return customerApi.submitMissionProof(
        next,
        action.payload.customerId,
        action.payload.missionId,
        action.payload.proofLabel,
        action.payload.notes,
      );
    }
    case "claim-reward": {
      const next = structuredClone(state);
      return customerApi.claimReward(next, action.rewardId);
    }
    case "add-purchase": {
      const next = structuredClone(state);
      return adminApi.addPurchase(next, action.payload);
    }
    case "validate-billing": {
      const next = structuredClone(state);
      return adminApi.validateBillingRecord(next, action.billingId);
    }
    case "approve-verification": {
      const next = structuredClone(state);
      return adminApi.approveVerification(next, action.submissionId);
    }
    case "reject-verification": {
      const next = structuredClone(state);
      return adminApi.rejectVerification(next, action.submissionId);
    }
    case "redeem-coupon": {
      const next = structuredClone(state);
      return adminApi.redeemCoupon(next, action.couponId);
    }
    case "advance-campaign": {
      const next = structuredClone(state);
      return adminApi.advanceCampaignState(next, action.campaignId);
    }
    default:
      return state;
  }
}

type DemoStateContextValue = {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
};

const DemoStateContext = createContext<DemoStateContextValue | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    const stored = loadStateFromStorage();
    if (stored) {
      dispatch({ type: "hydrate", payload: stored });
    }
  }, []);

  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState() {
  const context = useContext(DemoStateContext);
  if (!context) {
    throw new Error("useDemoState must be used inside DemoStateProvider");
  }
  return context;
}
