
(function () {
  if (window.__SUPPLIER_REVIEWING_ONLY_PATCH_V1__) return;
  window.__SUPPLIER_REVIEWING_ONLY_PATCH_V1__ = true;

  function patchReviewingOnly() {
    var page = document.querySelector('.bundle-page[data-page="supplier-after-sale"]');
    if (!page) return;
    var activeBtn = page.querySelector('.tab-row[data-tab-group="supplier-tabs"] > .tab-btn.active');
    var activeTarget = activeBtn ? activeBtn.getAttribute("data-tab-target") : "";
    var reviewingPanel = page.querySelector('.tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="supplier-reviewing"]');
    var processingPanel = page.querySelector('.tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="supplier-processing"]');
    var tableSection = reviewingPanel && (reviewingPanel.querySelector('section.table-section[data-codex-layout-source-id="codex_pinned_114"]') || reviewingPanel.querySelector("section.table-section"));
    if (!reviewingPanel || activeTarget !== "supplier-reviewing") return;

    var tableTop = tableSection ? (parseFloat(tableSection.style.top) || tableSection.offsetTop || 430) : 430;

    if (processingPanel) {
      processingPanel.classList.remove("active");
      processingPanel.style.setProperty("display", "none", "important");
    }

    reviewingPanel.classList.add("active");
    reviewingPanel.style.setProperty("display", "block", "important");

    Array.prototype.forEach.call(reviewingPanel.children, function (child) {
      if (!child) return;
      var top = parseFloat(child.style.top);
      if (child === tableSection || (child.classList && child.classList.contains("supplier-static-desc"))) return;
      if (child.tagName === "SECTION" && child.getAttribute("data-codex-layout-source-id") === "codex_pinned_116") {
        child.style.setProperty("display", "none", "important");
        return;
      }
      if (child.classList && child.classList.contains("codex-layout-placeholder")) {
        if (!isNaN(top) && top < tableTop) {
          child.style.setProperty("display", "none", "important");
        }
        return;
      }
      if (child.classList && (child.classList.contains("field-card") || child.classList.contains("codex-control-field") || child.classList.contains("button"))) {
        if (!isNaN(top) && top < tableTop) {
          child.style.setProperty("display", "none", "important");
        }
        return;
      }
      if (child.tagName === "SECTION" && !child.classList.contains("table-section")) {
        child.style.setProperty("display", "none", "important");
        return;
      }
      if (!isNaN(top) && top < tableTop) {
        child.style.setProperty("display", "none", "important");
      }
    });
  }

  function scheduleReviewingOnly() {
    [0, 60, 180, 400].forEach(function (delay) {
      window.setTimeout(patchReviewingOnly, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleReviewingOnly, { once: true });
  } else {
    scheduleReviewingOnly();
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest('.bundle-page[data-page="supplier-after-sale"] .tab-row[data-tab-group="supplier-tabs"] > .tab-btn');
    if (!button) return;
    scheduleReviewingOnly();
  }, true);

  window.addEventListener("load", scheduleReviewingOnly);
  window.addEventListener("pageshow", scheduleReviewingOnly);
  window.addEventListener("hashchange", scheduleReviewingOnly);
})();
