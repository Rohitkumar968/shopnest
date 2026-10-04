/**
 * formatPrice — converts a numeric price to INR display string.
 * DummyJSON prices are small USD-like demo numbers; multiply by 80 for INR.
 */
export const INR_FACTOR = 80;

export const toINR = (price) => Math.round((price || 0) * INR_FACTOR);

export const formatPrice = (price) => {
  const inr = toINR(price);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inr);
};

export default formatPrice;
