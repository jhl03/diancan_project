
(function () {
  if (window.__SUPPLIER_ACTIONS_FINAL_V1__) return;
  window.__SUPPLIER_ACTIONS_FINAL_V1__ = true;

  function supplierPage() {
    return document.querySelector('.bundle-page[data-page="supplier-after-sale"]');
  }

  function supplierPanel(name) {
    var page = supplierPage();
    return page ? page.querySelector('.tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="' + name + '"]') : null;
  }

  function previewRowFile(row) {
    if (!row || typeof openInvoiceBrowserPreview !== "function") return;
    openInvoiceBrowserPreview(row);
  }

  function renderTimeoutButtons() {
    var panel = supplierPanel("supplier-timeout");
    if (!panel) return;
    Array.prototype.forEach.call(panel.querySelectorAll("tbody tr td:last-child .text"), function (cell) {
      if (!cell) return;
      if (cell.getAttribute("data-final-timeout-built") === "1") return;
      var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (text.indexOf("上传") === -1 || text.indexOf("放弃") === -1) return;
      cell.setAttribute("data-final-timeout-built", "1");
      cell.innerHTML =
        '<div class="invoice-review-action-group">' +
        '<button type="button" class="supplier-processing-action is-primary" data-final-timeout-action="upload">上传</button>' +
        '<button type="button" class="supplier-processing-action is-danger" data-final-timeout-action="abandon">放弃</button>' +
        '</div>';
    });
  }

  function renderRejectedButtons() {
    var panel = supplierPanel("supplier-rejected");
    if (!panel) return;
    Array.prototype.forEach.call(panel.querySelectorAll("tbody tr td:last-child .text"), function (cell) {
      if (!cell) return;
      if (cell.getAttribute("data-final-rejected-built") === "1") return;
      var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (text.indexOf("重新上传") === -1) return;
      cell.setAttribute("data-final-rejected-built", "1");
      cell.innerHTML =
        '<div class="invoice-review-action-group" style="flex-direction:column;align-items:flex-start;">' +
        '<button type="button" class="supplier-processing-action is-primary" data-final-rejected-action="reupload">重新上传</button>' +
        '<button type="button" class="supplier-processing-action" data-final-rejected-action="download">下载</button>' +
        '</div>';
    });
  }

  function renderUploadedButtons() {
    var panel = supplierPanel("supplier-uploaded");
    if (!panel) return;
    Array.prototype.forEach.call(panel.querySelectorAll("tbody tr td:last-child .text"), function (cell) {
      if (!cell) return;
      if (cell.getAttribute("data-final-uploaded-built") === "1") return;
      var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (text.indexOf("下载") === -1) return;
      cell.setAttribute("data-final-uploaded-built", "1");
      cell.innerHTML =
        '<div class="invoice-review-action-group">' +
        '<button type="button" class="supplier-processing-action is-primary" data-final-uploaded-action="download">下载</button>' +
        '</div>';
    });
  }

  function fixReviewingDescGap() {
    var panel = supplierPanel("supplier-reviewing");
    var table = panel && panel.querySelector('section.table-section[data-codex-layout-source-id="codex_pinned_114"]');
    var desc = panel && panel.querySelector('.supplier-static-desc');
    if (!panel || !table || !desc) return;
    var top = parseFloat(table.style.top) || table.offsetTop || 0;
    var height = Math.max(parseFloat(table.style.height) || 0, table.offsetHeight || 0, 430);
    desc.style.setProperty("top", (top + height + 72) + "px", "important");
  }

  function patchReuploadModal() {
    return;
  }

  function bindFinalActions() {
    if (document.body.getAttribute("data-supplier-final-actions-bound") === "1") return;
    document.body.setAttribute("data-supplier-final-actions-bound", "1");
    document.addEventListener("click", function (event) {
      var timeoutBtn = event.target.closest && event.target.closest("[data-final-timeout-action]");
      if (timeoutBtn) {
        event.preventDefault();
        event.stopPropagation();
        openSupplierProcessingModal(timeoutBtn.getAttribute("data-final-timeout-action"), timeoutBtn.closest("tr"));
        return;
      }
      var rejectedBtn = event.target.closest && event.target.closest("[data-final-rejected-action]");
      if (rejectedBtn) {
        event.preventDefault();
        event.stopPropagation();
        var row = rejectedBtn.closest("tr");
        var action = rejectedBtn.getAttribute("data-final-rejected-action");
        if (action === "download") {
          previewRowFile(row);
          return;
        }
        openSupplierProcessingModal("reupload", row);
        return;
      }
      var uploadedBtn = event.target.closest && event.target.closest("[data-final-uploaded-action]");
      if (uploadedBtn) {
        event.preventDefault();
        event.stopPropagation();
        previewRowFile(uploadedBtn.closest("tr"));
      }
    }, true);
  }

  function run() {
    patchReuploadModal();
    bindFinalActions();
    renderTimeoutButtons();
    renderRejectedButtons();
    renderUploadedButtons();
    fixReviewingDescGap();
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
