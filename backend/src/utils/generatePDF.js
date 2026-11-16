/**
 * Construction Document / PDF Generator helper
 * Prepares formatted data structures for DPR reports, Invoices, and Project Summaries.
 */
const generatePDFReport = async (reportType, data) => {
  const generatedAt = new Date().toISOString();
  return {
    documentId: `DOC-${Date.now()}`,
    reportType,
    title: `${reportType.toUpperCase()} - SitePilot Construction System`,
    generatedAt,
    data,
    downloadUrl: `/uploads/documents/${reportType}-${Date.now()}.pdf`
  };
};

module.exports = {
  generatePDFReport
};

