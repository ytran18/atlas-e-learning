/**
 * Generate a unique certificate ID with timestamp and random hash
 * Format: CERT-YYYYMMDD-XXXXXXXX
 *
 * Example: CERT-20260209-A7F2E491
 */
export const generateCertificateId = (): string => {
    const date = new Date();

    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");

    // Generate random 8-character hash
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();

    return `CERT-${dateStr}-${randomStr}`;
};
