/**
 * SitePilot Currency Formatter Utility
 * Formats Indian Rupee (INR) denominations into readable Lakhs (L) and Crores (Cr)
 */
export function formatINR(amount, options = {}) {
  const num = Number(amount) || 0;
  const { compact = false, showSign = false } = options;

  let sign = '';
  if (showSign && num > 0) sign = '+ ';
  if (showSign && num < 0) sign = '- ';

  const absNum = Math.abs(num);

  if (compact) {
    if (absNum >= 10000000) {
      return `${sign}₹${(absNum / 10000000).toFixed(2)} Cr`;
    }
    if (absNum >= 100000) {
      return `${sign}₹${(absNum / 100000).toFixed(2)} L`;
    }
    if (absNum >= 1000) {
      return `${sign}₹${(absNum / 1000).toFixed(1)} K`;
    }
  }

  return `${sign}₹${absNum.toLocaleString('en-IN')}`;
}

export function formatCompactNumber(val) {
  const num = Number(val) || 0;
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toLocaleString('en-IN');
}

