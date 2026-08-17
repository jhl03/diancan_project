
function openSupplierProcessingModal(type, row) {
  if (typeof supplierProcessingModalShell !== "function") return;
  supplierProcessingRuntime.type = type;
  supplierProcessingRuntime.row = row || null;
  supplierProcessingRuntime.uploaded = false;
  supplierProcessingRuntime.uploadedName = "";
  supplierProcessingRuntime.uploadedAt = "";
  var overlay = supplierProcessingModalShell();
  var title = overlay.querySelector(".invoice-review-modal-title");
  var body = overlay.querySelector(".invoice-review-modal-body");
  var confirmBtn = overlay.querySelector('[data-supplier-processing-action="confirm"]');
  if (!overlay || !title || !body || !confirmBtn) return;

  if (type === "upload" || type === "reupload") {
    var rowCells = row ? row.querySelectorAll("td .text") : [];
    var titleText = typeof getRowInvoiceTitle === "function" ? (getRowInvoiceTitle(row) || "-") : "-";
    var taxNoText = row ? (row.getAttribute("data-tax-no") || (typeof getInvoiceTaxNo === "function" ? (getInvoiceTaxNo(titleText) || "-") : "-")) : "-";
    var amountText = rowCells[4] ? rowCells[4].textContent.replace(/\s+/g, " ").trim() : (rowCells[5] ? rowCells[5].textContent.replace(/\s+/g, " ").trim() : "9.99");
    title.textContent = type === "reupload" ? "重新上传" : "上传发票";
    body.innerHTML =
      '<div class="invoice-review-modal-copy">发票抬头：' + escapeHtml(titleText) + "</div>" +
      '<div class="invoice-review-modal-copy">税号：' + escapeHtml(taxNoText || "-") + "</div>" +
      '<div class="invoice-review-modal-copy">开票金额：' + escapeHtml(amountText) + "</div>" +
      '<div class="invoice-review-modal-upload-wrap">' +
      '  <div class="invoice-review-modal-upload-meta"></div>' +
      '  <div class="invoice-review-modal-upload-row">' +
      '    <div class="invoice-review-modal-copy invoice-review-modal-upload-label">* 上传发票</div>' +
      '    <button type="button" class="invoice-review-modal-btn" data-supplier-processing-action="mock-upload">上传PDF/OFD格式文件</button>' +
      '    <div class="invoice-review-modal-copy invoice-review-modal-upload-limit">（不超过10MB）</div>' +
      "  </div>" +
      "</div>";
    if (typeof syncSupplierProcessingUploadMeta === "function") syncSupplierProcessingUploadMeta(overlay);
  } else {
    title.textContent = "放弃开票";
    body.innerHTML =
      '<div class="invoice-review-modal-copy">确定放弃对该订单开票吗？</div>' +
      '<div class="invoice-review-modal-copy">放弃后，该订单将会在该列表消失</div>';
  }
  confirmBtn.textContent = "确定";
  overlay.classList.add("is-show");
}

function buildSupplierRejectedActionGroupHtml() {
  return '<div class="invoice-review-action-group">' +
    '<button type="button" class="supplier-processing-action is-primary" data-supplier-processing-row-action="reupload">重新上传</button>' +
    "</div>";
}

function rewriteSupplierRejectedActionButtons(panel) {
  var table = panel && panel.querySelector(".table-wrap table");
  if (!table) return;
  Array.prototype.forEach.call(table.querySelectorAll("tbody tr td:last-child .text"), function (cell) {
    var text = (cell.textContent || "").replace(/\s+/g, " ").trim();
    if (text.indexOf("重新上传") === -1) return;
    if (cell.getAttribute("data-supplier-rejected-built") === "1") return;
    cell.setAttribute("data-supplier-rejected-built", "1");
    cell.innerHTML = buildSupplierRejectedActionGroupHtml();
  });
}

function stableSupplierExplainGroups(panelName) {
  if (panelName === "supplier-rejected") {
    return [
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
    ];
  }
  return [
    {
      title: "筛选项 说明",
      items: [
        "券订单号：精准搜索",
        "发票抬头：模糊搜索",
        "商品品牌 筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致"
      ]
    }
  ];
}

function ensureStableSupplierExplainStyle() {
  if (document.getElementById("supplier-stable-desc-style")) return;
  var style = document.createElement("style");
  style.id = "supplier-stable-desc-style";
  style.textContent = [
    ".supplier-stable-desc{position:absolute;border:1px solid #dbe5f0;border-radius:24px;background:#fff;box-shadow:0 10px 24px rgba(15,23,42,.06);padding:20px 24px;box-sizing:border-box;z-index:2147481903;}",
    ".supplier-stable-desc-main{font-size:32px;font-weight:800;color:#0f172a;line-height:1.2;margin:0 0 8px;}",
    ".supplier-stable-desc-group{margin-top:12px;}",
    ".supplier-stable-desc-group:first-of-type{margin-top:0;}",
    ".supplier-stable-desc-sub{font-size:18px;font-weight:700;color:#28508c;line-height:1.4;margin:0 0 10px;}",
    ".supplier-stable-desc-list{margin:0;padding-left:18px;color:#44526b;font-size:14px;line-height:1.75;}",
    ".supplier-stable-desc-list li{margin:0 0 2px;}"
  ].join("");
  document.head.appendChild(style);
}

function removeLegacySupplierExplain(panel) {
  if (!panel) return;
  Array.prototype.forEach.call(
    panel.querySelectorAll(
      '.supplier-aftersale-desc, .supplier-domfix-desc, .proto-review-desc, #supplier-filter-note-floating, #supplier-filter-note-section-processing, #supplier-filter-note-section-reviewing, #supplier-filter-note-section-timeout'
    ),
    function (node) {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    }
  );
  Array.prototype.forEach.call(panel.querySelectorAll("ul.note-list.text[data-codex-base-width='1544'], ul.note-list.text[data-codex-base-width='1572'], ul.note-list.text[data-codex-base-width='1548.4']"), function (list) {
    list.style.setProperty("display", "none", "important");
  });
}

function ensureStableSupplierExplain(panel, key, groups, tableSection) {
  if (!panel || !tableSection) return;
  ensureStableSupplierExplainStyle();
  removeLegacySupplierExplain(panel);
  var card = panel.querySelector('.supplier-stable-desc[data-stable-key="' + key + '"]');
  if (!card) {
    card = document.createElement("section");
    card.className = "supplier-stable-desc";
    card.setAttribute("data-stable-key", key);
    panel.appendChild(card);
  }
  card.innerHTML =
    '<div class="supplier-stable-desc-main">说明</div>' +
    groups.map(function (group) {
      return '<div class="supplier-stable-desc-group">' +
        '<div class="supplier-stable-desc-sub">' + group.title + '</div>' +
        '<ul class="supplier-stable-desc-list">' +
        group.items.map(function (item) { return "<li>" + item + "</li>"; }).join("") +
        "</ul></div>";
    }).join("");

  var tableTop = parseFloat(tableSection.style.top) || tableSection.offsetTop || 0;
  var tableHeight = parseFloat(tableSection.style.height) || tableSection.offsetHeight || 0;
  var tableLeft = parseFloat(tableSection.style.left) || tableSection.offsetLeft || 0;
  var tableWidth = parseFloat(tableSection.style.width) || tableSection.getBoundingClientRect().width || 1500;
  var top = tableTop + tableHeight + 24;
  card.style.left = tableLeft + "px";
  card.style.top = top + "px";
  card.style.width = tableWidth + "px";
  card.style.display = panel.classList.contains("active") ? "block" : "none";

  var needed = top + Math.max(card.scrollHeight || 220, card.offsetHeight || 220) + 28;
  panel.style.minHeight = needed + "px";
  panel.style.paddingBottom = "28px";
  var shell = panel.closest(".main-shell");
  if (shell) {
    var shellMin = parseFloat(shell.style.minHeight) || 0;
    if (needed + 180 > shellMin) shell.style.minHeight = needed + 180 + "px";
  }
}

function syncSupplierTabs() {
  hideSupplierAfterSaleLoosePanels();
  if (window.__supplierAfterSaleRequestedTab) activateSupplierAfterSaleTab(window.__supplierAfterSaleRequestedTab);
}
