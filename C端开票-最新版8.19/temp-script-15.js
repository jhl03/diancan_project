
(function () {
  if (window.__LATEST_FILE_TIMESTAMP_PATCH_V1__) return;
  window.__LATEST_FILE_TIMESTAMP_PATCH_V1__ = true;

  function pad2(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function formatTime(offsetMinutes) {
    var current = new Date(Date.now() - (parseInt(offsetMinutes, 10) || 0) * 60000);
    return [
      current.getFullYear(),
      pad2(current.getMonth() + 1),
      pad2(current.getDate())
    ].join("-") + " " + [pad2(current.getHours()), pad2(current.getMinutes()), pad2(current.getSeconds())].join(":");
  }

  function formatStamp(offsetMinutes) {
    var current = new Date(Date.now() - (parseInt(offsetMinutes, 10) || 0) * 60000);
    return String(current.getFullYear()) + pad2(current.getMonth() + 1) + pad2(current.getDate()) + "_" + pad2(current.getHours()) + pad2(current.getMinutes()) + pad2(current.getSeconds());
  }

  function replaceLegacyFileMarkup(node) {
    if (!node || !node.innerHTML) return;
    var html = node.innerHTML;
    if (
      html.indexOf("invoice_20260521_104813.pdf") === -1 &&
      html.indexOf("invoice_20260520_104813.pdf") === -1 &&
      html.indexOf("2026-05-21 10:48:13") === -1 &&
      html.indexOf("2026-05-20 10:48:13") === -1 &&
      html.indexOf("2026-05-22 10:48:13") === -1
    ) {
      return;
    }
    html = html
      .replace(/invoice_20260521_104813\.pdf/g, "invoice_demo_" + formatStamp(0) + ".pdf")
      .replace(/invoice_20260520_104813\.pdf/g, "invoice_demo_" + formatStamp(1) + ".pdf")
      .replace(/2026-05-21 10:48:13/g, formatTime(0))
      .replace(/2026-05-20 10:48:13/g, formatTime(1))
      .replace(/2026-05-22 10:48:13/g, formatTime(2));
    node.innerHTML = html;
  }

  function patchStaticFileTimestamps() {
    Array.prototype.forEach.call(
      document.querySelectorAll(
        '.bundle-page[data-page="after-sale-list"] .modal-card,' +
        '.bundle-page[data-page="after-sale-list"] .field-value.text,' +
        '.bundle-page[data-page="invoice-request-list"] .modal-card,' +
        '.bundle-page[data-page="invoice-request-list"] .field-value.text,' +
        '.bundle-page[data-page="supplier-after-sale"] #codex_added_113'
      ),
      replaceLegacyFileMarkup
    );
    Array.prototype.forEach.call(document.querySelectorAll("[data-view-file-name]"), function (node) {
      node.textContent = "invoice_demo_" + formatStamp(0) + ".pdf";
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-view-file-time]"), function (node) {
      node.textContent = formatTime(0);
    });
  }

  function schedulePatch() {
    [0, 120, 360, 800].forEach(function (delay) {
      window.setTimeout(patchStaticFileTimestamps, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedulePatch, { once: true });
  } else {
    schedulePatch();
  }
  window.addEventListener("load", schedulePatch);
  window.addEventListener("pageshow", schedulePatch);
  window.addEventListener("hashchange", schedulePatch);
})();
