
(function () {
  if (window.__SUPPLIER_DESC_RESTORE_V1__) return;
  window.__SUPPLIER_DESC_RESTORE_V1__ = true;
  var supplierRestoreTimer = 0;

  function ensureSupplierDescRestoreStyle() {
    if (document.getElementById("supplier-desc-restore-style-v1")) return;
    var style = document.createElement("style");
    style.id = "supplier-desc-restore-style-v1";
    style.textContent = [
      ".supplier-manual-desc-final{position:absolute;border:1px solid #dbe5f0;border-radius:24px;background:#fff;box-shadow:0 10px 24px rgba(15,23,42,.06);padding:20px 24px;box-sizing:border-box;z-index:2147481906;}",
      ".supplier-manual-desc-final .supplier-manual-desc-main{font-size:32px;font-weight:800;color:#0f172a;line-height:1.2;margin:0 0 8px;}",
      ".supplier-manual-desc-final .supplier-manual-desc-sub{font-size:18px;font-weight:700;color:#28508c;line-height:1.4;margin:18px 0 10px;}",
      ".supplier-manual-desc-final .supplier-manual-desc-sub:first-of-type{margin-top:0;}",
      ".supplier-manual-desc-final .supplier-manual-desc-list{margin:0;padding-left:18px;color:#44526b;font-size:14px;line-height:1.75;}",
      ".supplier-manual-desc-final .supplier-manual-desc-list li{margin:0 0 2px;}"
    ].join("");
    document.head.appendChild(style);
  }

  function supplierAfterSalePage() {
    return document.querySelector('.bundle-page[data-page="supplier-after-sale"]');
  }

  function supplierAfterSalePanel(name) {
    var page = supplierAfterSalePage();
    return page ? page.querySelector('.tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="' + name + '"]') : null;
  }

  function ensureManualDesc(panel, key) {
    var card = panel.querySelector('.supplier-manual-desc-final[data-manual-key="' + key + '"]');
    if (!card) {
      card = document.createElement("section");
      card.className = "section ax_default supplier-manual-desc-final";
      panel.appendChild(card);
    }
    card.setAttribute("data-manual-key", key);
    return card;
  }

  function hideLegacySupplierDesc(panel, keepCard) {
    if (!panel) return;
    Array.prototype.forEach.call(panel.querySelectorAll(".supplier-static-desc, .supplier-force-desc, .supplier-domfix-desc, .proto-desc-card"), function (node) {
      if (!node || node === keepCard || (keepCard && keepCard.contains(node))) return;
      node.style.setProperty("display", "none", "important");
    });
    Array.prototype.forEach.call(panel.children, function (child) {
      if (!child || child === keepCard) return;
      if (child.tagName === "UL" && child.classList.contains("note-list")) {
        child.style.setProperty("display", "none", "important");
      }
    });
  }

  function renderManualDesc(panelName, tableSourceId, groups, gap) {
    var panel = supplierAfterSalePanel(panelName);
    var table = panel && panel.querySelector('section.table-section[data-codex-layout-source-id="' + tableSourceId + '"]');
    if (!panel || !table) return;

    var card = ensureManualDesc(panel, panelName);
    card.innerHTML =
      '<div class="supplier-manual-desc-main text" spellcheck="false">说明</div>' +
      groups.map(function (group) {
        return '<div class="supplier-manual-desc-sub text" spellcheck="false">' + group.title + '</div>' +
          '<ul class="note-list text supplier-manual-desc-list" spellcheck="false">' +
          group.items.map(function (item) { return '<li spellcheck="false">' + item + '</li>'; }).join("") +
          '</ul>';
      }).join("");

    hideLegacySupplierDesc(panel, card);

    var tableWrap = table.querySelector(".table-wrap");
    var tableHeight = Math.max(
      parseFloat(table.style.height) || 0,
      table.offsetHeight || 0,
      table.scrollHeight || 0,
      tableWrap ? (tableWrap.offsetHeight || 0) + 64 : 0,
      tableWrap ? (tableWrap.scrollHeight || 0) + 64 : 0,
      320
    );
    var top = (parseFloat(table.style.top) || table.offsetTop || 0) + tableHeight + gap;
    var left = parseFloat(table.style.left) || table.offsetLeft || 0;
    var width = parseFloat(table.style.width) || table.getBoundingClientRect().width || 1500;
    var height = Math.max(card.scrollHeight || 220, card.offsetHeight || 220);

    card.style.setProperty("display", panel.classList.contains("active") ? "block" : "none", "important");
    card.style.setProperty("left", left + "px", "important");
    card.style.setProperty("top", top + "px", "important");
    card.style.setProperty("width", width + "px", "important");
    card.style.setProperty("min-height", height + "px", "important");

    var needed = top + height + 36;
    panel.style.setProperty("min-height", needed + "px", "important");
    panel.style.setProperty("padding-bottom", "32px", "important");

    var shell = panel.closest(".main-shell");
    if (shell) {
      var shellMin = parseFloat(shell.style.minHeight) || 0;
      if (needed + 180 > shellMin) {
        shell.style.setProperty("min-height", (needed + 180) + "px", "important");
      }
    }
  }

  function restoreSupplierActionButtons() {
    var timeoutPanel = supplierAfterSalePanel("supplier-timeout");
    Array.prototype.forEach.call((timeoutPanel && timeoutPanel.querySelectorAll("tbody tr td:last-child .text")) || [], function (cell) {
      if (!cell) return;
      var hasButton = !!cell.querySelector('[data-supplier-processing-row-action="upload"], [data-supplier-processing-row-action="abandon"]');
      var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (hasButton || (text.indexOf("上传") === -1 && text.indexOf("放弃") === -1)) return;
      cell.innerHTML =
        '<div class="invoice-review-action-group">' +
        '<button type="button" class="supplier-processing-action is-primary" data-supplier-processing-row-action="upload" onclick="return window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION_DIRECT__(this)">上传</button>' +
        '<button type="button" class="supplier-processing-action is-danger" data-supplier-processing-row-action="abandon" onclick="return window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION_DIRECT__(this)">放弃</button>' +
        '</div>';
    });

    var rejectedPanel = supplierAfterSalePanel("supplier-rejected");
    Array.prototype.forEach.call((rejectedPanel && rejectedPanel.querySelectorAll("tbody tr td:last-child .text")) || [], function (cell) {
      if (!cell) return;
      var hasButton = !!cell.querySelector('[data-supplier-processing-row-action="reupload"], [data-final-download-action-v2="download"]');
      var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (hasButton || (text.indexOf("重新上传") === -1 && text.indexOf("下载") === -1)) return;
      cell.innerHTML =
        '<div class="invoice-review-action-group">' +
        '<button type="button" class="supplier-processing-action is-primary" data-supplier-processing-row-action="reupload">重新上传</button>' +
        '<button type="button" class="supplier-processing-action" data-final-download-action-v2="download">下载</button>' +
        '</div>';
    });

    var uploadedPanel = supplierAfterSalePanel("supplier-uploaded");
    Array.prototype.forEach.call((uploadedPanel && uploadedPanel.querySelectorAll("tbody tr td:last-child .text")) || [], function (cell) {
      if (!cell) return;
      var hasButton = !!cell.querySelector('[data-final-download-action-v2="download"]');
      var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
      if (hasButton || text.indexOf("下载") === -1) return;
      cell.innerHTML =
        '<div class="invoice-review-action-group">' +
        '<button type="button" class="supplier-processing-action is-primary" data-final-download-action-v2="download">下载</button>' +
        '</div>';
    });
  }

  function restoreSupplierDescriptions() {
    ensureSupplierDescRestoreStyle();
    renderManualDesc("supplier-reviewing", "codex_pinned_114", [
      {
        title: "筛选项 说明",
        items: [
          "券订单号：精准搜索",
          "发票抬头：模糊搜索",
          "商品品牌 筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致"
        ]
      }
    ], 56);

    renderManualDesc("supplier-timeout", "codex_pinned_118", [
      {
        title: "筛选项 说明",
        items: [
          "券订单号：精准搜索",
          "发票抬头：模糊搜索",
          "商品品牌 筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致"
        ]
      }
    ], 56);

    renderManualDesc("supplier-rejected", "codex_pinned_251", [
      {
        title: "筛选项 说明",
        items: [
          "券订单号：精准搜索",
          "发票抬头：模糊搜索",
          "商品品牌 筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致"
        ]
      },
      {
        title: "重新上传 弹窗说明",
        items: [
          "发票抬头、税号、开票金额：表格回显",
          "开票金额即表格的“用户支付”",
          "“上传PDF文件”按钮：点击弹出电脑桌面文件",
          "文件不符合格式时，提示“只能上传PDF/ODF格式的文件，请重新上传”",
          "一次只能上传一个文件；上传之后，按钮置灰不可点击",
          "文件超过10MB时，提示“文件超过10MB，请重新上传”",
          "上传文件后，在上传发票字段下展示“文件链接+上传时间”",
          "点击确定时，若未上传文件，提示“请先上传发票文件”",
          "点击确定后，提示“上传成功”；进行系统自动审核，审核通过同步上传本地生活工作台对应工单；过了到达结算时间给供应商结算",
          "若未通过，进入审核中页面进行人工审核"
        ]
      }
    ], 56);

    renderManualDesc("supplier-uploaded", "codex_pinned_124", [
      {
        title: "筛选项 说明",
        items: [
          "券订单号：精准搜索",
          "发票抬头：模糊搜索",
          "商品品牌 筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致"
        ]
      }
    ], 56);

    restoreSupplierActionButtons();
  }

  function scheduleRestore() {
    window.clearTimeout(supplierRestoreTimer);
    supplierRestoreTimer = window.setTimeout(function () {
      restoreSupplierDescriptions();
    }, 30);
  }

  window.__SUPPLIER_AFTERSALE_RESTORE_NOW__ = scheduleRestore;

  function scheduleRestoreBurst() {
    [0, 80, 220, 500, 900].forEach(function (delay) {
      window.setTimeout(function () {
        restoreSupplierDescriptions();
      }, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      scheduleRestoreBurst();
    }, { once: true });
  } else {
    scheduleRestoreBurst();
  }
  window.addEventListener("load", function () {
    scheduleRestoreBurst();
  });
  window.addEventListener("pageshow", function () {
    scheduleRestoreBurst();
  });
  window.addEventListener("hashchange", function () {
    scheduleRestoreBurst();
  });
  document.addEventListener("click", function (event) {
    var supplierPage = supplierAfterSalePage();
    if (!supplierPage) return;
    var button = event.target.closest && event.target.closest("button");
    if (button && supplierPage.contains(button)) scheduleRestoreBurst();
  }, true);
})();
