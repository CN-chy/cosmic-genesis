export const formatNumber = (num: number): string => {
  // Fix for small numbers (like 0.5 MPS) showing as 0
  if (num < 1000) {
    // If number is small and has a decimal part (e.g. 0.5), show 1 decimal place
    if (num < 10 && num % 1 !== 0) {
      return num.toFixed(1);
    }
    return Math.floor(num).toString();
  }
  
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