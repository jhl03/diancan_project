
(function () {
  if (window.__SUPPLIER_ACTIONS_FINAL_V2__) return;
  window.__SUPPLIER_ACTIONS_FINAL_V2__ = true;

  function page() {
    return document.querySelector('.bundle-page[data-page="supplier-after-sale"]');
  }

  function panel(name) {
    var root = page();
    return root ? root.querySelector('.tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="' + name + '"]') : null;
  }

  function openPreview(row) {
    if (row && typeof openInvoiceBrowserPreview === "function") openInvoiceBrowserPreview(row);
  }

  function patchReviewingDescGap() {
    var p = panel("supplier-reviewing");
    var table = p && p.querySelector('section.table-section[data-codex-layout-source-id="codex_pinned_114"]');
    var desc = p && (p.querySelector('.supplier-force-desc[data-force-key="supplier-reviewing"]') || p.querySelector('.supplier-static-desc'));
    if (!p || !table || !desc) return;
    var top = parseFloat(table.style.top) || table.offsetTop || 0;
    var height = Math.max(parseFloat(table.style.height) || 0, table.offsetHeight || 0, 430);
    desc.style.setProperty("top", (top + height + 72) + "px", "important");
  }

  function renderTimeoutButtons() {
    var p = panel("supplier-timeout");
    if (!p) return;
    Array.prototype.forEach.call(p.querySelectorAll("tbody tr td:last-child .text"), function (cell) {
      if (!cell) return;
      var hasButton = !!cell.querySelector('[data-supplier-processing-row-action="upload"], [data-supplier-processing-row-action="abandon"]');
      if (cell.getAttribute("data-final-timeout-built-v2") === "1" && hasButton) return;
      var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (!hasButton && (text.indexOf("上传") === -1 || text.indexOf("放弃") === -1)) return;
      cell.setAttribute("data-final-timeout-built-v2", "1");
      cell.innerHTML =
        '<div class="invoice-review-action-group">' +
        '<button type="button" class="supplier-processing-action is-primary" data-supplier-processing-row-action="upload" onclick="return window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION_DIRECT__(this)">上传</button>' +
        '<button type="button" class="supplier-processing-action is-danger" data-supplier-processing-row-action="abandon" onclick="return window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION_DIRECT__(this)">放弃</button>' +
        '</div>';
    });
  }

  function renderRejectedButtons() {
    var p = panel("supplier-rejected");
    if (!p) return;
    Array.prototype.forEach.call(p.querySelectorAll("tbody tr td:last-child .text"), function (cell) {
      if (!cell) return;
      var hasButton = !!cell.querySelector('[data-supplier-processing-row-action="reupload"], [data-final-download-action-v2="download"]');
      if (cell.getAttribute("data-final-rejected-built-v2") === "1" && hasButton) return;
      var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (!hasButton && text.indexOf("重新上传") === -1 && text.indexOf("下载") === -1) return;
      cell.setAttribute("data-final-rejected-built-v2", "1");
      cell.innerHTML =
        '<div class="invoice-review-action-group">' +
        '<button type="button" class="supplier-processing-action is-primary" data-supplier-processing-row-action="reupload">重新上传</button>' +
        '<button type="button" class="supplier-processing-action" data-final-download-action-v2="download">下载</button>' +
        '</div>';
    });
  }

  function renderUploadedButtons() {
    var p = panel("supplier-uploaded");
    if (!p) return;
    Array.prototype.forEach.call(p.querySelectorAll("tbody tr td:last-child .text"), function (cell) {
      if (!cell) return;
      var hasButton = !!cell.querySelector('[data-final-download-action-v2="download"]');
      if (cell.getAttribute("data-final-uploaded-built-v2") === "1" && hasButton) return;
      var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (!hasButton && text.indexOf("下载") === -1) return;
      cell.setAttribute("data-final-uploaded-built-v2", "1");
      cell.innerHTML =
        '<div class="invoice-review-action-group">' +
        '<button type="button" class="supplier-processing-action is-primary" data-final-download-action-v2="download">下载</button>' +
        '</div>';
    });
  }

  function patchReuploadModal() {
    if (window.__SUPPLIER_REUPLOAD_PATCHED_V2__) return;
    if (typeof openSupplierProcessingModal !== "function") return;
    window.__SUPPLIER_REUPLOAD_PATCHED_V2__ = true;
    var original = openSupplierProcessingModal;
    window.openSupplierProcessingModal = function (type, row) {
      original(type, row);
      if (type !== "reupload") return;
      var overlay = typeof supplierProcessingModalShell === "function" ? supplierProcessingModalShell() : null;
      var body = overlay && overlay.querySelector(".invoice-review-modal-body");
      if (!body) return;
      if (body.querySelector("[data-final-reupload-download-v2]")) return;
      var bar = document.createElement("div");
      bar.style.cssText = "display:flex;justify-content:flex-end;margin:0 0 12px;";
      bar.innerHTML = '<button type="button" class="invoice-review-modal-btn" data-final-reupload-download-v2="1">下载</button>';
      body.insertBefore(bar, body.firstChild);
      bar.querySelector("button").addEventListener("click", function (event) {
        event.preventDefault();
        openPreview(row);
      });
    };
  }

  function bindActions() {
    if (document.body.getAttribute("data-supplier-final-actions-bound-v2") === "1") return;
    document.body.setAttribute("data-supplier-final-actions-bound-v2", "1");
    document.addEventListener("click", function (event) {
      var downloadBtn = event.target.closest && event.target.closest('[data-final-download-action-v2="download"]');
      if (downloadBtn) {
        event.preventDefault();
        event.stopPropagation();
        openPreview(downloadBtn.closest("tr"));
      }
    }, true);
  }

  function patchDescGap(panelName, tableSourceId, extraGap) {
    var p = panel(panelName);
    var table = p && p.querySelector('section.table-section[data-codex-layout-source-id="' + tableSourceId + '"]');
    var desc = p && (
      p.querySelector('.supplier-force-desc[data-force-key="' + panelName + '"]') ||
      p.querySelector('.supplier-static-desc[data-force-key="' + panelName + '"]') ||
      p.querySelector('.supplier-domfix-desc[data-fix-key="' + (panelName === "supplier-rejected" ? "rejected" : panelName === "supplier-uploaded" ? "uploaded" : panelName) + '"]') ||
      p.querySelector(".supplier-static-desc") ||
      p.querySelector(".supplier-force-desc") ||
      p.querySelector(".supplier-domfix-desc") ||
      p.querySelector('.proto-desc-card[data-desc-key="' + (panelName === "supplier-rejected" ? "supplier-rejected-page" : panelName === "supplier-uploaded" ? "supplier-uploaded-page" : panelName) + '"]')
    );
    if (!p || !table || !desc) return;
    var top = parseFloat(table.style.top) || table.offsetTop || 0;
    var height = Math.max(parseFloat(table.style.height) || 0, table.offsetHeight || 0, 300);
    desc.style.setProperty("top", (top + height + extraGap) + "px", "important");
  }

  function run() {
    patchReuploadModal();
    bindActions();
    if (typeof bindSupplierProcessingActionCapture === "function") bindSupplierProcessingActionCapture();
    patchReviewingDescGap();
    patchDescGap("supplier-rejected", "codex_pinned_251", 56);
    patchDescGap("supplier-uploaded", "codex_pinned_124", 56);
    renderTimeoutButtons();
    renderRejectedButtons();
    renderUploadedButtons();
  }

  function schedule() {
    [0, 80, 220, 500, 900].forEach(function (delay) {
      window.setTimeout(run, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule, { once: true });
  } else {
    schedule();
  }
  window.addEventListener("load", schedule);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("hashchange", schedule);
  document.addEventListener("click", function (event) {
    var btn = event.target.closest && event.target.closest('button[data-tab-target^="supplier-"]');
    if (btn) schedule();
  }, true);
})();
