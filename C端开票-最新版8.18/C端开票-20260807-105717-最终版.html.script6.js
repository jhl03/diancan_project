
(function () {
  return;
  if (window.__SUPPLIER_AFTERSALE_DOM_FIX_V3__) return;
  window.__SUPPLIER_AFTERSALE_DOM_FIX_V3__ = true;

  function page() {
    return document.querySelector('.bundle-page[data-page="supplier-after-sale"]');
  }

  function panel(name) {
    var root = page();
    return root ? root.querySelector('.tab-panel[data-tab-panel="' + name + '"]') : null;
  }

  function panelChildrenNotes(target) {
    return target ? Array.from(target.children).filter(function (el) {
      return el.tagName === "UL" && el.classList.contains("note-list");
    }) : [];
  }

  function filterSection(target) {
    if (!target) return null;
    return Array.from(target.querySelectorAll('.section.ax_default[data-codex-layout-detached="true"]')).find(function (section) {
      return !!section.querySelector(".field-grid");
    }) || null;
  }

  function tableSection(target) {
    return target ? target.querySelector(".section.ax_default.table-section") : null;
  }

  function textLines(list) {
    if (!list) return [];
    return Array.from(list.querySelectorAll("li")).map(function (li) {
      return (li.textContent || "").replace(/\s+/g, " ").trim();
    }).filter(Boolean);
  }

  function ensureStyle() {
    if (document.getElementById("supplier-aftersale-dom-fix-style")) return;
    var style = document.createElement("style");
    style.id = "supplier-aftersale-dom-fix-style";
    style.textContent = [
      ".supplier-domfix-desc{position:absolute;border:1px solid #dbe5f0;border-radius:24px;background:#fff;box-shadow:0 10px 24px rgba(15,23,42,.06);padding:20px 24px;box-sizing:border-box;z-index:2147481902;}",
      ".supplier-domfix-title{font-size:32px;font-weight:800;color:#0f172a;line-height:1.2;margin:0 0 8px;}",
      ".supplier-domfix-group{margin-top:12px;}",
      ".supplier-domfix-group:first-of-type{margin-top:0;}",
      ".supplier-domfix-sub{font-size:18px;font-weight:700;color:#28508c;line-height:1.4;margin:0 0 10px;}",
      ".supplier-domfix-list{margin:0;padding-left:18px;color:#44526b;font-size:14px;line-height:1.75;}",
      ".supplier-domfix-list li{margin:0 0 2px;}",
      ".supplier-domfix-actions{display:flex;flex-direction:column;gap:8px;align-items:flex-start;}",
      ".supplier-domfix-btn{min-width:92px;height:32px;padding:0 14px;border-radius:10px;border:1px solid #c9d6ea;background:#fff;color:#12315c;font-size:13px;font-weight:700;cursor:pointer;}",
      ".supplier-domfix-btn.is-primary{background:#1d4ed8;border-color:#1d4ed8;color:#fff;}",
      ".supplier-domfix-btn.is-danger{background:#fff;border-color:#f1c7c7;color:#c24141;}"
    ].join("");
    document.head.appendChild(style);
  }

  function hideOriginalFilterBits(target) {
    var section = filterSection(target);
    if (section) {
      var title = section.querySelector(".section-title");
      if (title) title.style.setProperty("display", "none", "important");
    }
    panelChildrenNotes(target).forEach(function (list) {
      list.style.setProperty("display", "none", "important");
    });
  }

  function layoutPanel(target, filterHeight, tableTop, tableHeight) {
    var filter = filterSection(target);
    var table = tableSection(target);
    if (filter) {
      filter.style.setProperty("height", filterHeight + "px", "important");
      filter.style.setProperty("min-height", filterHeight + "px", "important");
    }
    if (table) {
      table.style.setProperty("top", tableTop + "px", "important");
      table.style.setProperty("height", tableHeight + "px", "important");
      table.style.setProperty("min-height", tableHeight + "px", "important");
    }
  }

  function buildDesc(target, key, groups) {
    var card = target.querySelector('.supplier-domfix-desc[data-fix-key="' + key + '"]');
    if (!card) {
      card = document.createElement("section");
      card.className = "supplier-domfix-desc";
      card.setAttribute("data-fix-key", key);
      target.appendChild(card);
    }
    card.innerHTML =
      '<div class="supplier-domfix-title">说明</div>' +
      groups.map(function (group) {
        return '<div class="supplier-domfix-group">' +
          '<div class="supplier-domfix-sub">' + group.title + '</div>' +
          '<ul class="supplier-domfix-list">' +
          group.items.map(function (item) { return '<li>' + item + '</li>'; }).join("") +
          "</ul></div>";
      }).join("");
    return card;
  }

  function placeDesc(target, card) {
    var table = tableSection(target);
    if (!card || !table) return;
    var top = (parseFloat(table.style.top) || table.offsetTop) + (parseFloat(table.style.height) || table.offsetHeight) + 24;
    var left = parseFloat(table.style.left) || table.offsetLeft || 0;
    var width = parseFloat(table.style.width) || table.getBoundingClientRect().width || 1500;
    card.style.left = left + "px";
    card.style.top = top + "px";
    card.style.width = width + "px";
    card.style.display = target.classList.contains("active") ? "block" : "none";
    var needed = top + Math.max(card.offsetHeight || 220, card.scrollHeight || 220) + 28;
    target.style.minHeight = needed + "px";
    target.style.paddingBottom = "28px";
    var shell = target.closest(".main-shell");
    if (shell) {
      var shellMin = parseFloat(shell.style.minHeight) || 0;
      if (needed + 180 > shellMin) shell.style.minHeight = needed + 180 + "px";
    }
  }

  function rewriteActionCell(target, type) {
    var cell = target && target.querySelector("tbody tr td:last-child .text");
    if (!cell) return;
    var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
    if (type === "timeout") {
      if (text.indexOf("上传") === -1 || text.indexOf("放弃") === -1) return;
      if (cell.getAttribute("data-domfix-timeout") === "1") return;
      cell.setAttribute("data-domfix-timeout", "1");
      cell.innerHTML =
        '<div class="supplier-domfix-actions">' +
        '  <button type="button" class="supplier-domfix-btn is-primary" data-domfix-action="upload">上传</button>' +
        '  <button type="button" class="supplier-domfix-btn is-danger" data-domfix-action="abandon">放弃</button>' +
        "</div>";
      return;
    }
    if (type === "rejected") {
      if (text.indexOf("重新上传") === -1) return;
      if (cell.getAttribute("data-domfix-rejected") === "1") return;
      cell.setAttribute("data-domfix-rejected", "1");
      cell.innerHTML =
        '<div class="supplier-domfix-actions">' +
        '  <button type="button" class="supplier-domfix-btn is-primary" data-domfix-action="reupload">重新上传</button>' +
        "</div>";
    }
  }

  function bindActions() {
    if (document.body.getAttribute("data-supplier-domfix-actions") === "1") return;
    document.body.setAttribute("data-supplier-domfix-actions", "1");
    document.addEventListener("click", function (event) {
      var btn = event.target.closest && event.target.closest("[data-domfix-action]");
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      var row = btn.closest("tr");
      var action = btn.getAttribute("data-domfix-action");
      if (typeof openSupplierProcessingModal === "function") openSupplierProcessingModal(action, row);
    }, true);
  }

  function applyReviewing() {
    var target = panel("supplier-reviewing");
    if (!target) return;
    layoutPanel(target, 160, 315, 380);
    hideOriginalFilterBits(target);
    var lists = panelChildrenNotes(target);
    var filterList = lists[0];
    if (filterList) {
      var card = buildDesc(target, "reviewing", [{ title: "筛选项 说明", items: textLines(filterList) }]);
      placeDesc(target, card);
    }
  }

  function applyTimeout() {
    var target = panel("supplier-timeout");
    if (!target) return;
    layoutPanel(target, 160, 315, 410);
    hideOriginalFilterBits(target);
    rewriteActionCell(target, "timeout");
    var lists = panelChildrenNotes(target);
    var filterList = lists[0];
    if (filterList) {
      var card = buildDesc(target, "timeout", [{ title: "筛选项 说明", items: textLines(filterList) }]);
      placeDesc(target, card);
    }
  }

  function applyRejected() {
    var target = panel("supplier-rejected");
    if (!target) return;
    layoutPanel(target, 160, 315, 340);
    rewriteActionCell(target, "rejected");
    var lists = panelChildrenNotes(target);
    var hiddenUpload = lists.find(function (list) { return getComputedStyle(list).display === "none"; }) || lists[0];
    var filterList = lists.find(function (list) { return list !== hiddenUpload; }) || lists[lists.length - 1];
    hideOriginalFilterBits(target);
    var groups = [];
    if (filterList) groups.push({ title: "筛选项 说明", items: textLines(filterList) });
    if (hiddenUpload) groups.push({ title: "重新上传 弹窗说明", items: textLines(hiddenUpload) });
    if (groups.length) {
      var card = buildDesc(target, "rejected", groups);
      placeDesc(target, card);
    }
  }

  function run() {
    ensureFixStyle();
    bindActions();
    applyReviewing();
    applyTimeout();
    applyRejected();
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
