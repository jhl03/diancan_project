
(function () {
  if (window.__SUPPLIER_DESC_FORCE_V2__) return;
  window.__SUPPLIER_DESC_FORCE_V2__ = true;

  function page() {
    return document.querySelector('.bundle-page[data-page="supplier-after-sale"]');
  }

  function panel(name) {
    var root = page();
    return root ? root.querySelector('.tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="' + name + '"]') : null;
  }

  function px(value, fallback) {
    var num = parseFloat(value);
    return isNaN(num) ? fallback : num;
  }

  function ensureStyle() {
    if (document.getElementById("supplier-force-desc-style")) return;
    var style = document.createElement("style");
    style.id = "supplier-force-desc-style";
    style.textContent = [
      ".supplier-force-desc{position:absolute;border:1px solid #dbe5f0;border-radius:24px;background:#fff;box-shadow:0 10px 24px rgba(15,23,42,.06);padding:20px 24px;box-sizing:border-box;z-index:2147481904;}",
      ".supplier-force-desc-main{font-size:32px;font-weight:800;color:#0f172a;line-height:1.2;margin:0 0 8px;}",
      ".supplier-force-desc-sub{font-size:18px;font-weight:700;color:#28508c;line-height:1.4;margin:0 0 10px;}",
      ".supplier-force-desc-list{margin:0;padding-left:18px;color:#44526b;font-size:14px;line-height:1.75;}",
      ".supplier-force-desc-list li{margin:0 0 2px;}",
      ".supplier-final-action-group{display:flex;flex-direction:column;gap:8px;align-items:flex-start;}",
      ".supplier-final-action-btn{display:inline-flex;align-items:center;justify-content:center;min-width:92px;height:32px;padding:0 14px;border-radius:10px;border:1px solid #c9d6ea;background:#fff;color:#12315c;font-size:13px;font-weight:700;cursor:pointer;box-sizing:border-box;}",
      ".supplier-final-action-btn.is-primary{background:#1d4ed8;border-color:#1d4ed8;color:#fff;}",
      ".supplier-final-action-btn.is-danger{background:#fff;border-color:#f1c7c7;color:#c24141;}"
    ].join("");
    document.head.appendChild(style);
  }

  function ensureDescCard(rootPanel, key, items) {
    var card = rootPanel.querySelector('.supplier-static-desc[data-force-key="' + key + '"]') ||
      rootPanel.querySelector(".supplier-static-desc");
    if (!card) {
      card = document.createElement("section");
      card.className = "section ax_default supplier-static-desc";
      card.setAttribute("data-force-key", key);
      rootPanel.appendChild(card);
    }
    card.setAttribute("data-force-key", key);
    card.innerHTML =
      '<div class="supplier-static-desc-main text" spellcheck="false">说明</div>' +
      '<div class="supplier-static-desc-sub text" spellcheck="false">筛选项 说明</div>' +
      '<ul class="note-list text supplier-static-desc-list" spellcheck="false">' +
      items.map(function (item) { return "<li>" + item + "</li>"; }).join("") +
      "</ul>";
    return card;
  }

  function applyPanel(name, tableSourceId, hiddenWidth, items, gap) {
    var rootPanel = panel(name);
    if (!rootPanel) return;

    var tableSection = rootPanel.querySelector('section.table-section[data-codex-layout-source-id="' + tableSourceId + '"]');
    var oldNote = hiddenWidth ? rootPanel.querySelector('ul.note-list.text[data-codex-base-width="' + hiddenWidth + '"]') : null;

    if (oldNote) oldNote.style.setProperty("display", "none", "important");
    Array.prototype.forEach.call(rootPanel.querySelectorAll(".supplier-force-desc, .supplier-aftersale-desc, .supplier-domfix-desc"), function (node) {
      node.style.setProperty("display", "none", "important");
    });
    if (!tableSection) return;

    var card = ensureDescCard(rootPanel, name, items);
    var tableLeft = px(tableSection.style.left, tableSection.offsetLeft || 0);
    var tableTop = px(tableSection.style.top, tableSection.offsetTop || 0);
    var tableWidth = px(tableSection.style.width, tableSection.getBoundingClientRect().width || 1500);
    var tableHeight = Math.max(
      px(tableSection.style.height, 0),
      tableSection.offsetHeight || 0,
      (tableSection.querySelector(".table-wrap") || {}).offsetHeight || 0,
      320
    );
    var descTop = tableTop + tableHeight + (typeof gap === "number" ? gap : 36);

    card.style.setProperty("display", "block", "important");
    card.style.setProperty("left", tableLeft + "px", "important");
    card.style.setProperty("top", descTop + "px", "important");
    card.style.setProperty("width", tableWidth + "px", "important");

    var panelMinHeight = descTop + Math.max(card.scrollHeight || 220, card.offsetHeight || 220) + 36;
    rootPanel.style.setProperty("min-height", panelMinHeight + "px", "important");
    rootPanel.style.setProperty("padding-bottom", "32px", "important");

    var shell = rootPanel.closest(".main-shell");
    if (shell) {
      var shellMin = px(shell.style.minHeight, 0);
      if (panelMinHeight + 160 > shellMin) {
        shell.style.setProperty("min-height", panelMinHeight + 160 + "px", "important");
      }
    }
  }

  function renderTimeoutButtons() {
    var rootPanel = panel("supplier-timeout");
    var cell = rootPanel && rootPanel.querySelector("tbody tr td:last-child .text");
    if (!cell) return;
    if (cell.getAttribute("data-final-timeout-built") === "1") return;
    var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
    if (text.indexOf("上传") === -1 || text.indexOf("放弃") === -1) return;
    cell.setAttribute("data-final-timeout-built", "1");
    cell.innerHTML =
      '<div class="supplier-final-action-group">' +
      '<button type="button" class="supplier-final-action-btn is-primary" data-final-timeout-action="upload">上传</button>' +
      '<button type="button" class="supplier-final-action-btn is-danger" data-final-timeout-action="abandon">放弃</button>' +
      '</div>';
  }

  function renderRejectedButtons() {
    var rootPanel = panel("supplier-rejected");
    var cell = rootPanel && rootPanel.querySelector("tbody tr td:last-child .text");
    if (!cell) return;
    if (cell.getAttribute("data-final-rejected-built") === "1") return;
    var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
    if (text.indexOf("重新上传") === -1) return;
    cell.setAttribute("data-final-rejected-built", "1");
    cell.innerHTML =
      '<div class="supplier-final-action-group">' +
      '<button type="button" class="supplier-final-action-btn is-primary" data-final-rejected-action="reupload">重新上传</button>' +
      '<button type="button" class="supplier-final-action-btn" data-final-rejected-action="download">下载</button>' +
      '</div>';
  }

  function renderUploadedButtons() {
    var rootPanel = panel("supplier-uploaded");
    var cell = rootPanel && rootPanel.querySelector("tbody tr td:last-child .text");
    if (!cell) return;
    if (cell.getAttribute("data-final-uploaded-built") === "1") return;
    var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
    if (text.indexOf("下载") === -1) return;
    cell.setAttribute("data-final-uploaded-built", "1");
    cell.innerHTML =
      '<div class="supplier-final-action-group">' +
      '<button type="button" class="supplier-final-action-btn is-primary" data-final-uploaded-action="download">下载</button>' +
      '</div>';
  }

  function previewRowFile(row) {
    if (!row || typeof openInvoiceBrowserPreview !== "function") return;
    openInvoiceBrowserPreview(row);
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
    ensureStyle();
    patchReuploadModal();
    bindFinalActions();
    applyPanel("supplier-reviewing", "codex_pinned_114", "1544", [
      "券订单号：精准搜索",
      "发票抬头：模糊搜索",
      "商品品牌 筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致"
    ], 64);
    applyPanel("supplier-timeout", "codex_pinned_118", "1572", [
      "券订单号：精准搜索",
      "发票抬头：模糊搜索",
      "商品品牌 筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致"
    ]);
    applyPanel("supplier-uploaded", "codex_pinned_124", "1545", [
      "券订单号：精准搜索",
      "发票抬头：模糊搜索",
      "商品品牌 筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致"
    ]);
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
