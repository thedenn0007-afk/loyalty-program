import { DemoState } from "@/domains/shared/contracts";
import { demoStorageKey, safeParseState } from "@/services/demo-service";

export function loadStateFromStorage() {
  if (typeof window === "undefined") return null;
  return safeParseState(window.localStorage.getItem(demoStorageKey));
}

export function saveStateToStorage(state: DemoState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(demoStorageKey, JSON.stringify(state));
}
