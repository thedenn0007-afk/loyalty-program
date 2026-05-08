export function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export function makeCouponCode(brandId: string) {
  const brandCode = brandId.replace(/[^a-z]/g, "").slice(0, 4).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${brandCode}-${random}`;
}
