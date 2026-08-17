
(function () {
  if (window.__SETTLEMENT_LAYOUT_FIX_V1__) return;
  window.__SETTLEMENT_LAYOUT_FIX_V1__ = true;

  function hideProxy(node) {
    if (!node) return;
    node.style.setProperty("display", "none", "important");
    node.style.setProperty("height", "0", "important");
    node.style.setProperty("min-height", "0", "important");
    node.style.setProperty("margin", "0", "important");
    node.style.setProperty("padding", "0", "important");
    node.style.setProperty("border", "0", "important");
  }

  function normalizeSection(section, marginTop) {
    if (!section) return;
    section.style.setProperty("display", "block", "important");
    section.style.setProperty("visibility", "visible", "important");
    section.style.setProperty("pointer-events", "auto", "important");
    section.style.setProperty("position", "relative", "important");
    section.style.setProperty("left", "auto", "important");
    section.style.setProperty("top", "auto", "important");
    section.style.setProperty("width", "100%", "important");
    section.style.setProperty("max-width", "none", "important");
    section.style.setProperty("height", "auto", "important");
    section.style.setProperty("min-height", "0", "important");
    section.style.setProperty("margin", marginTop + "px 0 0 0", "important");
    section.style.setProperty("z-index", "auto", "important");
  }

  function normalizeTableWrap(section) {
    if (!section) return;
    var wrap = section.querySelector(".table-wrap");
    if (!wrap) return;
    wrap.style.setProperty("position", "relative", "important");
    wrap.style.setProperty("left", "auto", "important");
    wrap.style.setProperty("top", "auto", "important");
    wrap.style.setProperty("width", "100%", "important");
    wrap.style.setProperty("max-width", "none", "important");
    wrap.style.setProperty("height", "auto", "important");
    wrap.style.setProperty("min-height", "0", "important");
    wrap.style.setProperty("margin-top", "12px", "important");
    wrap.style.setProperty("z-index", "auto", "important");
  }

  function fixSettlementLayout() {
    var page = document.querySelector('.bundle-page[data-page="settlement"]');
    var main = page && page.querySelector(".main-shell");
    if (!page || !main) return;
    var header = main.querySelector(".page-header.ax_default");

    var descSection = page.querySelector('section[data-codex-layout-source-id="codex_pinned_259"]');
    var tableSection = page.querySelector('section[data-codex-layout-source-id="codex_pinned_260"]');
    if (!descSection || !tableSection) return;

    if (header) {
      header.style.setProperty("display", "none", "important");
      header.style.setProperty("height", "0", "important");
      header.style.setProperty("min-height", "0", "important");
      header.style.setProperty("margin", "0", "important");
      header.style.setProperty("padding", "0", "important");
    }

    Array.prototype.forEach.call(
      main.querySelectorAll('.codex-layout-placeholder[data-codex-layout-source-id="codex_pinned_259"], .codex-layout-placeholder[data-codex-layout-source-id="codex_pinned_260"]'),
      hideProxy
    );

    normalizeSection(tableSection, 0);
    normalizeTableWrap(tableSection);
    normalizeSection(descSection, 18);

    if (tableSection.parentNode !== main) main.appendChild(tableSection);
    if (descSection.parentNode !== main) main.appendChild(descSection);
    if (tableSection.nextElementSibling !== descSection) {
      main.insertBefore(descSection, tableSection.nextElementSibling);
    }

    main.style.setProperty("min-height", "auto", "important");
    main.style.setProperty("padding-top", "8px", "important");
    main.style.setProperty("padding-bottom", "28px", "important");
  }

  function schedule() {
    [0, 80, 220, 500].forEach(function (delay) {
      window.setTimeout(fixSettlementLayout, delay);
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
})();
