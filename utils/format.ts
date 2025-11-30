export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();
  
  const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx"];
  const suffixNum = Math.floor(("" + Math.floor(num)).length / 3);
  
  if (suffixNum >= suffixes.length) return num.toExponential(2);

  let shortValue = parseFloat(
    (suffixNum !== 0 ? num / Math.pow(1000, suffixNum) : num).toPrecision(3)
  );
  
  if (shortValue % 1 !== 0) {
    shortValue = parseFloat(shortValue.toFixed(1));
  }
  
  return shortValue + suffixes[suffixNum];
};

export const calculateCost = (baseCost: number, count: number): number => {
  // Cost increases by 15% per purchase
  return Math.floor(baseCost * Math.pow(1.15, count));
};