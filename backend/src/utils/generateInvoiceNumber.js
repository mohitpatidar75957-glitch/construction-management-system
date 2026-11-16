/**
 * Generate standardized construction invoice and RA bill identifiers
 * e.g., INV-202611-0012 or RA-IND-004
 */
const generateInvoiceNumber = (prefix = 'INV', sequence = 1) => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const seqPadded = String(sequence).padStart(4, '0');
  return `${prefix}-${year}${month}-${seqPadded}`;
};

const generateRABillNumber = (projectCode = 'PRJ', billIndex = 1) => {
  const code = projectCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  return `RA-${code}-${String(billIndex).padStart(3, '0')}`;
};

module.exports = {
  generateInvoiceNumber,
  generateRABillNumber
};

