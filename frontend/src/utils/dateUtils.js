/**
 * SitePilot Date Utilities
 */
export function formatDate(dateStr, format = 'medium') {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  if (format === 'short') {
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  }

  if (format === 'full') {
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getCurrentDateISO() {
  return new Date().toISOString().split('T')[0];
}

