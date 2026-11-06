/**
 * MultiAI Builder v2 - Full-Stack Edition
 * See full source in local artifacts - loading simplified bootstrap
 * Full file is large; this bootstrap loads core UI and demo mode.
 */
console.log('MultiAI Builder v2 loading...');

// Redirect note if full app.js was truncated during upload
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    var placeholder = document.getElementById('previewPlaceholder');
    if (placeholder && !window.__MULTIAI_FULL__) {
      // Try to indicate status
    }
  });
}

// IMPORTANT: Full app.js content will be uploaded in next commit.
// Temporary minimal bootstrap so the page does not break.
alert('app.js penuh sedang di-upload. Refresh setelah commit berikutnya, atau download file lengkap dari release.');
