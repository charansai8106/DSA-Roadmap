/**
 * Utility functions for DSA Roadmap
 */

let idCounter = 0;

/**
 * Generates a unique identifier with a given prefix
 * @param {string} prefix
 * @returns {string}
 */
function uid(prefix = "id") {
  const timestamp = (idCounter++).toString(36);
  const randomPart = Math.random().toString(36).slice(2, 6);
  return `${prefix}-${timestamp}-${randomPart}`;
}

/**
 * Safely escapes HTML special characters to prevent XSS injection
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char] || char;
  });
}

// Convenient shorthand alias for escapeHtml
const esc = escapeHtml;

/**
 * Triggers a browser file download using a temporary Blob URL
 * @param {string} content - Raw content to download
 * @param {string} mimeType - MIME type (e.g. 'application/json', 'text/csv')
 * @param {string} filename - Target file name
 */
function downloadBlob(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
}
