
(function () {
  if (window.__SUPPLIER_PROCESSING_IMAGE_TOOL__) return;
  window.__SUPPLIER_PROCESSING_IMAGE_TOOL__ = true;

  var STORAGE_KEY = "codex.supplier-processing-image-layout.v1";
  var COLLAPSE_KEY = "codex.supplier-processing-image-tool-collapsed.v1";
  var DEFAULT_LAYOUT = { left: 700, top: 907, width: 570 };
  var toolRoot = null;
  var observer = null;
  var dragState = null;
  var state = { dragEnabled: false, bound: false, collapsed: false };

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }
    fn();
  }

  function supplierPage() {
    return document.querySelector('.bundle-page[data-page="supplier-after-sale"]');
  }

  function candidateImages() {
    var page = supplierPage();
    if (!page) return [];
    return Array.prototype.filter.call(page.querySelectorAll(".image-block"), function (node) {
      var img = node.querySelector("img");
      var alt = img ? String(img.getAttribute("alt") || "") : "";
      return !!img && (alt.indexOf("状态机") > -1 || node.id === "codex_added_59" || node.id === "codex_added_294");
    });
  }

  function processingImage() {
    var images = candidateImages();
    if (!images.length) return null;
    var visible = images.filter(function (node) {
      var rect = node.getBoundingClientRect();
      var style = getComputedStyle(node);
      return style.display !== "none" && rect.width > 0 && rect.height > 0;
    });
    var pool = visible.length ? visible : images;
    pool.sort(function (a, b) {
      var ar = a.getBoundingClientRect();
      var br = b.getBoundingClientRect();
      return br.width * br.height - ar.width * ar.height;
    });
    return pool[0] || null;
  }

  function parseNumber(value, fallback) {
    var number = parseFloat(String(value || "").replace("px", "").trim());
    return isFinite(number) ? number : fallback;
  }

  function normalizeLayout(layout) {
    return {
      left: Math.round(parseNumber(layout && layout.left, DEFAULT_LAYOUT.left)),
      top: Math.round(parseNumber(layout && layout.top, DEFAULT_LAYOUT.top)),
      width: Math.max(120, Math.round(parseNumber(layout && layout.width, DEFAULT_LAYOUT.width)))
    };
  }

  function currentLayout() {
    var image = processingImage();
    if (image) {
      var style = getComputedStyle(image);
      return normalizeLayout({
        left: image.style.left || style.left,
        top: image.style.top || style.top,
        width: image.style.width || style.width
      });
    }
    return normalizeLayout(DEFAULT_LAYOUT);
  }

  function loadCollapsedState() {
    try {
      return window.localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function saveCollapsedState() {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, state.collapsed ? "1" : "0");
    } catch (error) {}
  }

  function saveLayout(layout) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeLayout(layout)));
    } catch (error) {}
  }

  function loadLayout() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? normalizeLayout(JSON.parse(raw)) : null;
    } catch (error) {
      return null;
    }
  }

  function clearLayout() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {}
  }

  function snippetText(layout) {
    var next = normalizeLayout(layout);
    var image = processingImage();
    var selector = image && image.id ? "#" + image.id : ".bundle-page[data-page=\"supplier-after-sale\"] .image-block";
    return [
      selector + "{",
      "  left:" + next.left + "px !important;",
      "  top:" + next.top + "px !important;",
      "  width:" + next.width + "px !important;",
      "  height:auto !important;",
      "}"
    ].join("\n");
  }

  function ensureStyle() {
    if (document.getElementById("supplier-image-tool-style")) return;
    var style = document.createElement("style");
    style.id = "supplier-image-tool-style";
    style.textContent = [
      "#supplier-image-tool{position:fixed;right:18px;top:18px;width:280px;padding:14px 14px 12px;border:1px solid #d9e3ef;border-radius:18px;background:rgba(255,255,255,.98);box-shadow:0 14px 36px rgba(15,23,42,.18);z-index:2147483604;color:#122033;font:12px/1.5 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;backdrop-filter:blur(8px);}",
      "#supplier-image-tool[hidden]{display:none!important;}",
      "#supplier-image-tool.is-collapsed .supplier-image-tool__body{display:none;}",
      ".supplier-image-tool__header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;}",
      ".supplier-image-tool__title{font-size:14px;font-weight:800;margin:0 0 10px;}",
      ".supplier-image-tool__header .supplier-image-tool__title{margin:0;}",
      ".supplier-image-tool__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:10px;}",
      ".supplier-image-tool__field{display:grid;gap:4px;}",
      ".supplier-image-tool__field span{font-size:11px;color:#52607a;font-weight:700;text-transform:uppercase;}",
      ".supplier-image-tool__field input{width:100%;box-sizing:border-box;height:34px;padding:0 10px;border:1px solid #d6deea;border-radius:10px;background:#f8fbff;color:#0f172a;font-size:12px;font-weight:600;}",
      ".supplier-image-tool__actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:8px;}",
      ".supplier-image-tool__actions--nudge{grid-template-columns:repeat(4,minmax(0,1fr));}",
      ".supplier-image-tool__btn{height:34px;border:1px solid #c9d6ea;border-radius:10px;background:#fff;color:#12315c;font-size:12px;font-weight:700;cursor:pointer;}",
      ".supplier-image-tool__btn--primary{background:#0f4aa6;border-color:#0f4aa6;color:#fff;}",
      ".supplier-image-tool__btn--nudge{font-size:16px;font-weight:800;padding:0;}",
      ".supplier-image-tool__btn--collapse{min-width:64px;}",
      ".supplier-image-tool__hint{margin:6px 0 8px;color:#5b6881;}",
      ".supplier-image-tool__code{width:100%;height:84px;box-sizing:border-box;padding:10px;border:1px solid #d6deea;border-radius:12px;background:#f8fbff;color:#16335f;font:12px/1.45 Consolas,\"SFMono-Regular\",monospace;resize:none;}",
      ".supplier-image-tool__status{min-height:18px;margin-top:8px;color:#0f4aa6;font-weight:700;}",
      "body.supplier-image-tool-dragging{user-select:none;cursor:grabbing!important;}",
      ".bundle-page[data-page=\"supplier-after-sale\"] .image-block.supplier-image-drag-enabled{cursor:move;box-shadow:0 0 0 2px rgba(15,74,166,.35),0 12px 28px rgba(15,23,42,.18);border-radius:12px;}",
      ".bundle-page[data-page=\"supplier-after-sale\"] .image-block.supplier-image-drag-active{cursor:grabbing;}",
      ".supplier-filter-note-section{position:absolute!important;border:1px solid #dbe5f0;border-radius:24px;background:#fff;box-shadow:0 10px 24px rgba(15,23,42,.06);padding:20px 24px;box-sizing:border-box;z-index:2147481900;margin:0!important;}",
      ".supplier-filter-note-main{font-size:32px;font-weight:800;color:#0f172a;line-height:1.2;margin:0 0 8px;}",
      ".supplier-filter-note-sub{font-size:18px;font-weight:700;color:#28508c;line-height:1.4;margin:0 0 12px;}",
      ".supplier-filter-note-section .note-list{margin:0;}"
    ].join("");
    document.head.appendChild(style);
  }

  function pageVisible() {
    var page = supplierPage();
    return !!(page && page.classList.contains("active") && processingImage());
  }

  function showStatus(message) {
    if (!toolRoot) return;
    var status = toolRoot.querySelector('[data-role="status"]');
    if (status) status.textContent = message || "";
  }

  function syncCollapseState() {
    if (!toolRoot) return;
    toolRoot.classList.toggle("is-collapsed", !!state.collapsed);
    var button = toolRoot.querySelector('[data-action="toggle-collapse"]');
    if (button) button.textContent = state.collapsed ? "展开" : "收起";
  }

  function syncDragState() {
    if (!toolRoot) return;
    var button = toolRoot.querySelector('[data-action="toggle-drag"]');
    if (button) button.textContent = state.dragEnabled ? "关闭拖动" : "开启拖动";
    var image = processingImage();
    if (image) {
      image.classList.toggle("supplier-image-drag-enabled", !!state.dragEnabled);
      image.setAttribute("draggable", "false");
    }
  }

  function syncTool(layout) {
    if (!toolRoot) return;
    var next = normalizeLayout(layout || currentLayout());
    Array.prototype.forEach.call(toolRoot.querySelectorAll("input[data-field]"), function (input) {
      input.value = next[input.getAttribute("data-field")];
    });
    var code = toolRoot.querySelector('[data-role="snippet"]');
    if (code) code.value = snippetText(next);
    syncCollapseState();
    syncDragState();
  }

  function applyImageNodeLayout(layout) {
    var image = processingImage();
    if (!image) return;
    image.style.setProperty("left", layout.left + "px", "important");
    image.style.setProperty("top", layout.top + "px", "important");
    image.style.setProperty("width", layout.width + "px", "important");
    image.style.setProperty("height", "auto", "important");
    image.style.setProperty("min-height", "0px", "important");
    image.style.touchAction = "none";
  }

  function applyLayout(layout, persist) {
    var next = normalizeLayout(layout);
    document.documentElement.style.setProperty("--supplier-processing-image-left", next.left + "px");
    document.documentElement.style.setProperty("--supplier-processing-image-top", next.top + "px");
    document.documentElement.style.setProperty("--supplier-processing-image-width", next.width + "px");
    applyImageNodeLayout(next);
    if (persist !== false) saveLayout(next);
    syncTool(next);
    return next;
  }

  function persistedOrDefaultLayout() {
    return loadLayout() || normalizeLayout(DEFAULT_LAYOUT);
  }

  function ensureTool() {
    if (toolRoot && toolRoot.parentNode) return toolRoot;
    toolRoot = document.createElement("aside");
    toolRoot.id = "supplier-image-tool";
    toolRoot.innerHTML = [
      '<div class="supplier-image-tool__header">',
      '  <div class="supplier-image-tool__title">售后单图片位置</div>',
      '  <button type="button" class="supplier-image-tool__btn supplier-image-tool__btn--collapse" data-action="toggle-collapse">收起</button>',
      "</div>",
      '<div class="supplier-image-tool__body">',
      '<div class="supplier-image-tool__grid">',
      '  <label class="supplier-image-tool__field"><span>left</span><input type="number" step="1" data-field="left"></label>',
      '  <label class="supplier-image-tool__field"><span>top</span><input type="number" step="1" data-field="top"></label>',
      '  <label class="supplier-image-tool__field"><span>width</span><input type="number" step="1" data-field="width"></label>',
      "</div>",
      '<div class="supplier-image-tool__actions">',
      '  <button type="button" class="supplier-image-tool__btn supplier-image-tool__btn--primary" data-action="toggle-drag">开启拖动</button>',
      '  <button type="button" class="supplier-image-tool__btn" data-action="copy-css">复制CSS</button>',
      "</div>",
      '<div class="supplier-image-tool__actions supplier-image-tool__actions--nudge">',
      '  <button type="button" class="supplier-image-tool__btn supplier-image-tool__btn--nudge" data-action="nudge-left">←</button>',
      '  <button type="button" class="supplier-image-tool__btn supplier-image-tool__btn--nudge" data-action="nudge-up">↑</button>',
      '  <button type="button" class="supplier-image-tool__btn supplier-image-tool__btn--nudge" data-action="nudge-down">↓</button>',
      '  <button type="button" class="supplier-image-tool__btn supplier-image-tool__btn--nudge" data-action="nudge-right">→</button>',
      "</div>",
      '<div class="supplier-image-tool__actions">',
      '  <button type="button" class="supplier-image-tool__btn" data-action="export-html">导出HTML</button>',
      '  <button type="button" class="supplier-image-tool__btn" data-action="reset">恢复默认</button>',
      "</div>",
      '<div class="supplier-image-tool__hint">先点“开启拖动”，再直接拖图片。导出 HTML 是最安全的保存方式。</div>',
      '<textarea class="supplier-image-tool__code" data-role="snippet" readonly></textarea>',
      '<div class="supplier-image-tool__status" data-role="status"></div>',
      "</div>"
    ].join("");
    document.body.appendChild(toolRoot);

    toolRoot.addEventListener("input", function (event) {
      var target = event.target;
      var field = target && target.getAttribute ? target.getAttribute("data-field") : "";
      if (!field) return;
      var next = currentLayout();
      next[field] = parseNumber(target.value, next[field]);
      applyLayout(next, true);
      showStatus("坐标已更新");
    });

    toolRoot.addEventListener("click", function (event) {
      var action = event.target && event.target.getAttribute ? event.target.getAttribute("data-action") : "";
      if (!action) return;
      event.preventDefault();
      if (action === "toggle-drag") {
        state.dragEnabled = !state.dragEnabled;
        syncDragState();
        showStatus(state.dragEnabled ? "现在可以直接拖图片了" : "已关闭拖动");
        return;
      }
      if (action === "toggle-collapse") {
        state.collapsed = !state.collapsed;
        saveCollapsedState();
        syncCollapseState();
        return;
      }
      if (action === "copy-css") {
        copySnippet();
        return;
      }
      if (action.indexOf("nudge-") === 0) {
        var step = event.shiftKey ? 20 : 5;
        var layout = currentLayout();
        if (action === "nudge-left") layout.left -= step;
        if (action === "nudge-right") layout.left += step;
        if (action === "nudge-up") layout.top -= step;
        if (action === "nudge-down") layout.top += step;
        applyLayout(layout, true);
        showStatus("图片已微调");
        return;
      }
      if (action === "export-html") {
        exportHtml();
        return;
      }
      if (action === "reset") {
        clearLayout();
        applyLayout(DEFAULT_LAYOUT, true);
        showStatus("已恢复默认位置");
      }
    });

    return toolRoot;
  }

  function directPanelNoteList(panel, tableSection) {
    if (!panel) return null;
    var cutoff = tableSection ? tableSection.offsetTop : Number.MAX_SAFE_INTEGER;
    var matches = [];
    for (var i = 0; i < panel.children.length; i += 1) {
      var child = panel.children[i];
      if (child.tagName !== "UL" || !child.classList.contains("note-list")) continue;
      if (child.offsetTop < cutoff) matches.push(child);
    }
    if (!matches.length) return null;
    matches.sort(function (a, b) {
      return b.offsetTop - a.offsetTop;
    });
    return matches[0];
  }

  function filterSection(panel) {
    if (!panel) return null;
    var sections = Array.prototype.filter.call(
      panel.querySelectorAll('.section.ax_default[data-codex-layout-detached="true"]'),
      function (section) {
        return !!section.querySelector(".field-grid");
      }
    );
    return sections[0] || null;
  }

  function ensureSupplierPanelSizing() {
    var page = supplierPage();
    if (!page) return;
    var activePanel = page.querySelector('.tab-panel.active[data-tab-group="supplier-tabs"]');
    if (!activePanel) return;
    var activeName = activePanel.getAttribute("data-tab-panel");
    if (activeName === "supplier-reviewing") {
      var reviewFilter = activePanel.querySelector('section[data-codex-layout-source-id="codex_pinned_116"]');
      var reviewTable = activePanel.querySelector('section.table-section[data-codex-layout-source-id="codex_pinned_114"]');
      if (reviewFilter) {
        reviewFilter.style.setProperty("height", "160px", "important");
        reviewFilter.style.setProperty("min-height", "160px", "important");
      }
      if (reviewTable) {
        reviewTable.style.setProperty("top", "315px", "important");
        reviewTable.style.setProperty("height", "380px", "important");
        reviewTable.style.setProperty("min-height", "380px", "important");
      }
      return;
    }
    if (activeName === "supplier-timeout") {
      var timeoutFilter = activePanel.querySelector('section[data-codex-layout-source-id="codex_pinned_119"]');
      var timeoutTable = activePanel.querySelector('section.table-section[data-codex-layout-source-id="codex_pinned_118"]');
      if (timeoutFilter) {
        timeoutFilter.style.setProperty("height", "160px", "important");
        timeoutFilter.style.setProperty("min-height", "160px", "important");
      }
      if (timeoutTable) {
        timeoutTable.style.setProperty("top", "315px", "important");
        timeoutTable.style.setProperty("height", "410px", "important");
        timeoutTable.style.setProperty("min-height", "410px", "important");
      }
    }
  }

  function ensureTabFilterExplainSection(panelName, tableSourceId, sectionId) {
    var page = supplierPage();
    if (!page) return;
    var panel = page.querySelector('.tab-panel[data-tab-panel="' + panelName + '"]');
    if (!panel) return;

    var tableSection =
      (tableSourceId && panel.querySelector('.section.ax_default.table-section[data-codex-layout-source-id="' + tableSourceId + '"]')) ||
      panel.querySelector(".section.ax_default.table-section");
    if (!tableSection) return;

    var filterShell = filterSection(panel);
    var filterTitle = filterShell ? filterShell.querySelector(".section-title") : null;
    if (filterTitle) filterTitle.style.display = "none";

    var originalNote = directPanelNoteList(panel, tableSection);
    if (originalNote) originalNote.style.display = "none";

    var explain = document.getElementById(sectionId);
    if (!explain) {
      explain = document.createElement("section");
      explain.id = sectionId;
      explain.className = "supplier-filter-note-section ax_default";
      explain.innerHTML = [
        '<div class="supplier-filter-note-main text" spellcheck="false">说明</div>',
        '<div class="supplier-filter-note-sub text" spellcheck="false">筛选项&nbsp;&nbsp;说明</div>',
        '<ul class="note-list text" spellcheck="false">',
        '  <li spellcheck="false">券订单号：精准搜索</li>',
        '  <li spellcheck="false">发票抬头：模糊搜索</li>',
        '  <li spellcheck="false">商品品牌 筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致</li>',
        "</ul>"
      ].join("");
    }
    if (explain.parentNode !== panel) {
      panel.appendChild(explain);
    }
    if (!panel.classList.contains("active")) return;
    explain.style.left = tableSection.style.left || "0px";
    explain.style.top = (tableSection.offsetTop + tableSection.offsetHeight + 28) + "px";
    explain.style.width = tableSection.style.width || "1590px";
    explain.style.minWidth = "0px";
  }

  function ensureFilterExplainSections() {
    var floating = document.getElementById("supplier-filter-note-floating");
    if (floating) floating.style.display = "none";
    ["supplier-filter-note-section-processing", "supplier-filter-note-section-reviewing", "supplier-filter-note-section-timeout"].forEach(function (id) {
      var legacy = document.getElementById(id);
      if (legacy) legacy.style.display = "none";
    });
  }

  function copySnippet() {
    if (!toolRoot) return;
    var code = toolRoot.querySelector('[data-role="snippet"]');
    if (!code) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code.value).then(function () {
        showStatus("CSS 已复制");
      }).catch(function () {
        code.focus();
        code.select();
        document.execCommand("copy");
        showStatus("CSS 已复制");
      });
      return;
    }
    code.focus();
    code.select();
    document.execCommand("copy");
    showStatus("CSS 已复制");
  }

  function exportHtml() {
    var clone = document.documentElement.cloneNode(true);
    var status = clone.querySelector('[data-role="status"]');
    if (status) status.textContent = "";
    var html = "<!DOCTYPE html>\n" + clone.outerHTML;
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var link = document.createElement("a");
    var fileName = (window.location.pathname.split("/").pop() || "supplier-after-sale.html").replace(/\.html?$/i, "");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + "-image-adjusted.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () {
      URL.revokeObjectURL(link.href);
    }, 1200);
    showStatus("已导出当前 HTML");
  }

  function refreshTool() {
    ensureTool();
    ensureSupplierPanelSizing();
    ensureFilterExplainSections();
    if (typeof restoreSupplierReviewingPage === "function") restoreSupplierReviewingPage();
    if (typeof restoreSupplierTimeoutPage === "function") restoreSupplierTimeoutPage();
    if (typeof restoreSupplierRejectedPage === "function") restoreSupplierRejectedPage();
    toolRoot.hidden = !pageVisible();
    if (toolRoot.hidden) return;
    var layout = persistedOrDefaultLayout();
    applyLayout(layout, false);
    syncTool(layout);
  }

  function scheduleRefreshBursts() {
    var delays = [0, 80, 220, 500, 900];
    delays.forEach(function (delay) {
      window.setTimeout(refreshTool, delay);
    });
  }

  function endDrag() {
    if (!dragState) return;
    saveLayout(currentLayout());
    var image = processingImage();
    if (image) image.classList.remove("supplier-image-drag-active");
    document.body.classList.remove("supplier-image-tool-dragging");
    dragState = null;
    showStatus("拖动完成，可复制 CSS 或导出 HTML");
  }

  function bindEvents() {
    if (state.bound) return;
    state.bound = true;

    document.addEventListener("pointerdown", function (event) {
      if (!state.dragEnabled || !pageVisible()) return;
      var image = processingImage();
      if (!image || !image.contains(event.target) || event.button !== 0) return;
      event.preventDefault();
      var layout = currentLayout();
      dragState = {
        startX: event.clientX,
        startY: event.clientY,
        left: layout.left,
        top: layout.top,
        width: layout.width
      };
      image.classList.add("supplier-image-drag-active");
      document.body.classList.add("supplier-image-tool-dragging");
    });

    document.addEventListener("pointermove", function (event) {
      if (!dragState) return;
      event.preventDefault();
      applyLayout({
        left: dragState.left + (event.clientX - dragState.startX),
        top: dragState.top + (event.clientY - dragState.startY),
        width: dragState.width
      }, false);
    });

    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);

    window.addEventListener("hashchange", function () {
      scheduleRefreshBursts();
    });
    window.addEventListener("pageshow", function () {
      scheduleRefreshBursts();
    });
    window.addEventListener("load", function () {
      scheduleRefreshBursts();
    });
  }

  function observePage() {
    if (observer || !window.MutationObserver) return;
    var base = document.getElementById("base");
    if (!base) return;
    observer = new MutationObserver(function () {
      refreshTool();
    });
    observer.observe(base, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  function init() {
    ensureStyle();
    ensureTool();
    state.collapsed = loadCollapsedState();
    applyLayout(persistedOrDefaultLayout(), false);
    bindEvents();
    observePage();
    scheduleRefreshBursts();
  }

  ready(init);
})();
