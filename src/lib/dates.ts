export function nowIso() {
  return new Date().toISOString();
}

export function addDaysToIso(baseIso: string, days: number) {
  const date = new Date(baseIso);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function formatDisplayDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function relativeWindow(expiresAt: string) {
  const delta = new Date(expiresAt).getTime() - Date.now();
  const days = Math.ceil(delta / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    return "Expires today";
  }
  return `Expires in ${days} day${days === 1 ? "" : "s"}`;
}
