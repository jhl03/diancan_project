
(function () {
  return;
  if (window.__SUPPLIER_AFTERSALE_UI_FIX_V2__) return;
  window.__SUPPLIER_AFTERSALE_UI_FIX_V2__ = true;

  function supplierPage() {
    return document.querySelector('.bundle-page[data-page="supplier-after-sale"]');
  }

  function panelByName(name) {
    var page = supplierPage();
    return page ? page.querySelector('.tab-panel[data-tab-panel="' + name + '"]') : null;
  }

  function activePanel() {
    var page = supplierPage();
    return page ? page.querySelector('.tab-panel.active[data-tab-group="supplier-tabs"]') : null;
  }

  function findFilterSection(panel) {
    if (!panel) return null;
    return Array.prototype.find.call(panel.querySelectorAll('.section.ax_default[data-codex-layout-detached="true"]'), function (section) {
      return !!section.querySelector(".field-grid");
    }) || null;
  }

  function findTableSection(panel) {
    return panel ? panel.querySelector(".section.ax_default.table-section") : null;
  }

  function directNoteLists(panel) {
    return panel ? Array.prototype.filter.call(panel.children, function (child) {
      return child.tagName === "UL" && child.classList.contains("note-list");
    }) : [];
  }

  function ensureFixStyle() {
    if (document.getElementById("supplier-aftersale-fix-style")) return;
    var style = document.createElement("style");
    style.id = "supplier-aftersale-fix-style";
    style.textContent = [
      ".supplier-aftersale-desc{position:absolute;border:1px solid #dbe5f0;border-radius:24px;background:#fff;box-shadow:0 10px 24px rgba(15,23,42,.06);padding:20px 24px;box-sizing:border-box;z-index:2147481901;}",
      ".supplier-aftersale-desc-main{font-size:32px;font-weight:800;color:#0f172a;line-height:1.2;margin:0 0 8px;}",
      ".supplier-aftersale-desc-group{margin-top:12px;}",
      ".supplier-aftersale-desc-group:first-of-type{margin-top:0;}",
      ".supplier-aftersale-desc-sub{font-size:18px;font-weight:700;color:#28508c;line-height:1.4;margin:0 0 10px;}",
      ".supplier-aftersale-desc-list{margin:0;padding-left:18px;color:#44526b;font-size:14px;line-height:1.75;}",
      ".supplier-aftersale-desc-list li{margin:0 0 2px;}",
      ".supplier-aftersale-action-group{display:flex;flex-direction:column;gap:8px;align-items:flex-start;}",
      ".supplier-aftersale-action-btn{min-width:92px;height:32px;padding:0 14px;border-radius:10px;border:1px solid #c9d6ea;background:#fff;color:#12315c;font-size:13px;font-weight:700;cursor:pointer;}",
      ".supplier-aftersale-action-btn.is-primary{background:#1d4ed8;border-color:#1d4ed8;color:#fff;}",
      ".supplier-aftersale-action-btn.is-danger{background:#fff;border-color:#f1c7c7;color:#c24141;}"
    ].join("");
    document.head.appendChild(style);
  }

  function hideFilterTitle(panel) {
    var section = findFilterSection(panel);
    var title = section ? section.querySelector(".section-title") : null;
    if (title) title.style.setProperty("display", "none", "important");
  }

  function setPanelFrame(panel, filterHeight, tableTop, tableHeight) {
    var filterSection = findFilterSection(panel);
    var tableSection = findTableSection(panel);
    if (filterSection) {
      filterSection.style.setProperty("height", filterHeight + "px", "important");
      filterSection.style.setProperty("min-height", filterHeight + "px", "important");
    }
    if (tableSection) {
      tableSection.style.setProperty("top", tableTop + "px", "important");
      tableSection.style.setProperty("height", tableHeight + "px", "important");
      tableSection.style.setProperty("min-height", tableHeight + "px", "important");
    }
  }

  function noteTextsFromList(list) {
    if (!list) return [];
    return Array.prototype.map.call(list.querySelectorAll("li"), function (li) {
      return (li.textContent || "").replace(/\s+/g, " ").trim();
    }).filter(Boolean);
  }

  function buildDesc(panel, key, groups) {
    var card = panel.querySelector('.supplier-aftersale-desc[data-fix-key="' + key + '"]');
    if (!card) {
      card = document.createElement("section");
      card.className = "supplier-aftersale-desc";
      card.setAttribute("data-fix-key", key);
      panel.appendChild(card);
    }
    card.innerHTML =
      '<div class="supplier-aftersale-desc-main">说明</div>' +
      groups.map(function (group) {
        return '<div class="supplier-aftersale-desc-group">' +
          '<div class="supplier-aftersale-desc-sub">' + group.title + '</div>' +
          '<ul class="supplier-aftersale-desc-list">' +
          group.items.map(function (item) { return '<li>' + item + '</li>'; }).join("") +
          "</ul></div>";
      }).join("");
    return card;
  }

  function placeDesc(panel, card) {
    var table = findTableSection(panel);
    if (!table || !card) return;
    var top = (parseFloat(table.style.top) || table.offsetTop) + (parseFloat(table.style.height) || table.offsetHeight) + 24;
    var left = parseFloat(table.style.left) || table.offsetLeft || 0;
    var width = parseFloat(table.style.width) || table.getBoundingClientRect().width || 1500;
    card.style.left = left + "px";
    card.style.top = top + "px";
    card.style.width = width + "px";
    card.style.display = panel.classList.contains("active") ? "block" : "none";

    var needed = top + Math.max(card.offsetHeight || 220, card.scrollHeight || 220) + 28;
    panel.style.minHeight = needed + "px";
    panel.style.paddingBottom = "28px";
    var shell = panel.closest(".main-shell");
    if (shell) {
      var shellMin = parseFloat(shell.style.minHeight) || 0;
      if (needed + 180 > shellMin) shell.style.minHeight = needed + 180 + "px";
    }
  }

  function hideDirectNotes(panel, keepHiddenUpload) {
    directNoteLists(panel).forEach(function (list, index) {
      if (keepHiddenUpload && index === 0 && getComputedStyle(list).display === "none") return;
      list.style.setProperty("display", "none", "important");
    });
  }

  function rewriteTimeoutButtons(panel) {
    var cell = panel && panel.querySelector("tbody tr td:last-child .text");
    if (!cell || cell.getAttribute("data-fix-timeout") === "1") return;
    var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
    if (text.indexOf("上传") === -1 || text.indexOf("放弃") === -1) return;
    cell.setAttribute("data-fix-timeout", "1");
    cell.innerHTML =
      '<div class="supplier-aftersale-action-group">' +
      '  <button type="button" class="supplier-aftersale-action-btn is-primary" data-fix-action="upload">上传</button>' +
      '  <button type="button" class="supplier-aftersale-action-btn is-danger" data-fix-action="abandon">放弃</button>' +
      "</div>";
  }

  function rewriteRejectedButton(panel) {
    var cell = panel && panel.querySelector("tbody tr td:last-child .text");
    if (!cell || cell.getAttribute("data-fix-rejected") === "1") return;
    var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
    if (text.indexOf("重新上传") === -1) return;
    cell.setAttribute("data-fix-rejected", "1");
    cell.innerHTML =
      '<div class="supplier-aftersale-action-group">' +
      '  <button type="button" class="supplier-aftersale-action-btn is-primary" data-fix-action="reupload">重新上传</button>' +
      "</div>";
  }

  function wireActions() {
    if (document.body.getAttribute("data-supplier-aftersale-fix-actions") === "1") return;
    document.body.setAttribute("data-supplier-aftersale-fix-actions", "1");
    document.addEventListener("click", function (event) {
      var btn = event.target.closest && event.target.closest("[data-fix-action]");
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      var row = btn.closest("tr");
      var action = btn.getAttribute("data-fix-action");
      if (typeof openSupplierProcessingModal === "function") {
        openSupplierProcessingModal(action, row);
      }
    }, true);
  }

  function applyPanelFixes(panelName) {
    var panel = panelByName(panelName);
    if (!panel) return;
    hideFilterTitle(panel);
    if (panelName === "supplier-reviewing") {
      setPanelFrame(panel, 160, 315, 380);
      var reviewNote = directNoteLists(panel)[0];
      if (reviewNote) {
        var reviewCard = buildDesc(panel, "reviewing", [{ title: "筛选项 说明", items: noteTextsFromList(reviewNote) }]);
        hideDirectNotes(panel, false);
        placeDesc(panel, reviewCard);
      }
      return;
    }
    if (panelName === "supplier-timeout") {
      setPanelFrame(panel, 160, 315, 410);
      rewriteTimeoutButtons(panel);
      var timeoutNote = directNoteLists(panel)[0];
      if (timeoutNote) {
        var timeoutCard = buildDesc(panel, "timeout", [{ title: "筛选项 说明", items: noteTextsFromList(timeoutNote) }]);
        hideDirectNotes(panel, false);
        placeDesc(panel, timeoutCard);
      }
      return;
    }
    if (panelName === "supplier-rejected") {
      setPanelFrame(panel, 160, 315, 340);
      rewriteRejectedButton(panel);
      var lists = directNoteLists(panel);
      var hiddenUpload = lists.find(function (list) { return getComputedStyle(list).display === "none"; });
      var filterList = lists.find(function (list) { return list !== hiddenUpload; });
      if (filterList) {
        var groups = [{ title: "筛选项 说明", items: noteTextsFromList(filterList) }];
        if (hiddenUpload) groups.push({ title: "重新上传 弹窗说明", items: noteTextsFromList(hiddenUpload) });
        var rejectedCard = buildDesc(panel, "rejected", groups);
        hideDirectNotes(panel, true);
        placeDesc(panel, rejectedCard);
      }
    }
  }

  function runFixes() {
    ensureFixStyle();
    wireActions();
    applyPanelFixes("supplier-reviewing");
    applyPanelFixes("supplier-timeout");
    applyPanelFixes("supplier-rejected");
  }

  function scheduleFixes() {
    [0, 80, 220, 500, 900].forEach(function (delay) {
      window.setTimeout(runFixes, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleFixes, { once: true });
  } else {
    scheduleFixes();
  }
  window.addEventListener("load", scheduleFixes);
  window.addEventListener("pageshow", scheduleFixes);
  window.addEventListener("hashchange", scheduleFixes);
  document.addEventListener("click", function (event) {
    var btn = event.target.closest && event.target.closest('button[data-tab-target^="supplier-"]');
    if (!btn) return;
    scheduleFixes();
  }, true);
})();
