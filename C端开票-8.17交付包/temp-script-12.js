
(function () {
  if (window.__DEMO_FLOW_ORDER_V1__) return;
  window.__DEMO_FLOW_ORDER_V1__ = true;

  var demoFlowState = (window.__demoFlowState = window.__demoFlowState || {});

  function pad2(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function formatNowValue(date) {
    var target = date || new Date();
    return [
      target.getFullYear(),
      pad2(target.getMonth() + 1),
      pad2(target.getDate())
    ].join("-") + " " + [pad2(target.getHours()), pad2(target.getMinutes()), pad2(target.getSeconds())].join(":");
  }

  function buildDemoOrder() {
    var now = new Date();
    var stamp = String(now.getFullYear()) + pad2(now.getMonth() + 1) + pad2(now.getDate()) + pad2(now.getHours()) + pad2(now.getMinutes()) + pad2(now.getSeconds());
    return {
      orderId: "D" + stamp,
      store: "瑞幸-广州",
      product: "椰青冰萃美式",
      brand: "瑞幸",
      paid: "9.99",
      title: "井井井",
      taxNo: "-",
      supplierName: "黄开良",
      supplierNo: "2077283553914077185",
      subsidy: "1.5",
      createdAt: formatNowValue(now),
      countdown: "6天23小时59分59秒"
    };
  }

  function buildDemoInvoiceList() {
    var base = new Date();
    var primary = buildDemoOrder();
    primary.orderId = "D20260815095024";
    primary.store = "霸王茶姬-深圳";
    primary.product = "伯牙绝弦大杯";
    primary.brand = "霸王茶姬";
    primary.paid = "16.80";
    primary.title = "可可乐乐文化传播有限公司";
    primary.taxNo = "91440300MAE5XXE49N";
    primary.supplierName = "苏雨茶";
    primary.supplierNo = "2077283553914077992";
    primary.subsidy = "2.0";
    primary.syncState = "success";
    primary.createdAt = "2026-08-15 09:50:24";
    primary.countdown = "6天23小时58分20秒";
    function shiftMinutes(date, minutes) {
      return new Date(date.getTime() - minutes * 60000);
    }
    return [
      primary,
      {
        orderId: "D20260815094924",
        store: "肯德基-上海",
        product: "香辣鸡腿堡套餐",
        brand: "肯德基",
        paid: "28.50",
        title: "肯德基企业抬头",
        taxNo: "91310106MA1FRC9K1H",
        supplierName: "王小河",
        supplierNo: "2077283553914081126",
        subsidy: "2.5",
        syncState: "fail",
        createdAt: "2026-08-15 09:49:24",
        countdown: "6天23小时57分08秒"
      },
      {
        store: "麦当劳-杭州",
        product: "巨无霸套餐",
        brand: "麦当劳",
        paid: "32.00",
        title: "个人抬头-张三",
        taxNo: "-",
        supplierName: "陈安宁",
        supplierNo: "2077283553914082210",
        subsidy: "3.0",
        syncState: "fail",
        syncMode: "fail",
        createdAt: "2026-08-15 09:48:24",
        countdown: "6天23小时55分42秒",
        orderId: "D20260815094824"
      }
    ];
  }

  if (!demoFlowState.orders) demoFlowState.orders = buildDemoInvoiceList();
  if (!demoFlowState.order) demoFlowState.order = demoFlowState.orders[1] || demoFlowState.orders[0];
  if (typeof demoFlowState.synced !== "boolean") demoFlowState.synced = false;
  if (typeof demoFlowState.claimed !== "boolean") demoFlowState.claimed = false;
  if (!demoFlowState.auditStatus) demoFlowState.auditStatus = "";
  if (!demoFlowState.afterSaleSettled) demoFlowState.afterSaleSettled = false;

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function ensureDemoFlowStyle() {
    if (document.getElementById("demo-flow-style-v1")) return;
    var style = document.createElement("style");
    style.id = "demo-flow-style-v1";
    style.textContent = [
      ".demo-flow-action-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}",
      ".demo-flow-btn{border:1px solid #c9d7ee;background:#fff;color:#1f3b73;border-radius:999px;padding:8px 16px;font-size:14px;font-weight:600;cursor:pointer;}",
      ".demo-flow-btn.is-primary{background:#2563eb;border-color:#2563eb;color:#fff;}",
      ".demo-flow-btn[disabled]{opacity:.58;cursor:not-allowed;}",
      ".demo-flow-tag{display:inline-flex;align-items:center;justify-content:center;padding:2px 8px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:700;margin-left:8px;}",
      ".demo-flow-hall-card{border:1px solid #bfdbfe;background:linear-gradient(180deg,#ffffff 0%,#f8fbff 100%);}",
      ".demo-flow-detail-bar{margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;}",
      ".demo-flow-detail-status{font-size:13px;color:#475467;font-weight:600;}"
    ].join("");
    document.head.appendChild(style);
  }

  function showToastSafe(text) {
    if (typeof window.showToast === "function") {
      window.showToast(text);
      return;
    }
    var node = document.querySelector(".proto-inline-toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "proto-inline-toast";
      document.body.appendChild(node);
    }
    node.textContent = text;
    node.classList.add("is-show");
    window.clearTimeout(window.__demoFlowToastTimer || 0);
    window.__demoFlowToastTimer = window.setTimeout(function () {
      node.classList.remove("is-show");
    }, 1600);
  }

  function showBundlePageSafe(name) {
    if (typeof window.showBundlePage === "function") {
      window.showBundlePage(name);
      return;
    }
    var base = document.getElementById("base");
    if (!base) return;
    Array.prototype.forEach.call(base.querySelectorAll(".bundle-page"), function (page) {
      page.classList.toggle("active", page.getAttribute("data-page") === name);
    });
  }

  function activateTabGroup(pageSelector, groupName, targetName) {
    var page = document.querySelector(pageSelector);
    if (!page) return;
    Array.prototype.forEach.call(page.querySelectorAll('.tab-row[data-tab-group="' + groupName + '"] > .tab-btn'), function (button) {
      button.classList.toggle("active", button.getAttribute("data-tab-target") === targetName);
    });
    Array.prototype.forEach.call(page.querySelectorAll('.tab-panel[data-tab-group="' + groupName + '"]'), function (panel) {
      var active = panel.getAttribute("data-tab-panel") === targetName;
      panel.classList.toggle("active", active);
      panel.style.setProperty("display", active ? "block" : "none", "important");
    });
  }

  function rowExistsInPanel(panelSelector, orderId) {
    var tbody = document.querySelector(panelSelector);
    if (!tbody || !orderId) return false;
    return Array.prototype.some.call(tbody.querySelectorAll("tr"), function (row) {
      var attrId = row.getAttribute("data-order-id");
      if (attrId) return attrId === orderId;
      var firstText = row.querySelector("td .text");
      var rowId = firstText ? firstText.textContent.replace(/\s+/g, " ").trim() : "";
      return rowId === orderId;
    });
  }

  function orderReachedWorkflowResult() {
    var orderId = demoFlowState.order && demoFlowState.order.orderId;
    if (!orderId) return false;
    return rowExistsInPanel('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-reviewing"] .table-wrap tbody', orderId) ||
      rowExistsInPanel('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-uploaded"] .table-wrap tbody', orderId) ||
      rowExistsInPanel('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-rejected"] .table-wrap tbody', orderId) ||
      rowExistsInPanel('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="supplier-reviewing"] .table-wrap tbody', orderId) ||
      rowExistsInPanel('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="supplier-uploaded"] .table-wrap tbody', orderId) ||
      rowExistsInPanel('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="supplier-rejected"] .table-wrap tbody', orderId);
  }

  function removeRowsByOrderId(panelSelector, orderId) {
    var tbody = document.querySelector(panelSelector);
    if (!tbody || !orderId) return;
    Array.prototype.forEach.call(tbody.querySelectorAll("tr"), function (row) {
      var attrId = row.getAttribute("data-order-id");
      if (!attrId) {
        var firstText = row.querySelector("td .text");
        attrId = firstText ? firstText.textContent.replace(/\s+/g, " ").trim() : "";
      }
      if (attrId === orderId) row.parentNode.removeChild(row);
    });
  }

  function invoiceOrderInfoText(order) {
    return "券单号：" + order.orderId + " / 店铺：" + order.store + " / 商品：" + order.product + " / 创建时间：" + order.createdAt;
  }

  function invoiceInfoText(order) {
    return "抬头：" + order.title + " / 税号：" + order.taxNo + " / 手机：-";
  }

  function renderInvoicePage() {
    var page = document.querySelector('.bundle-page[data-page="invoice"]');
    var tbody = page && page.querySelector(".table-wrap tbody");
    if (!tbody) return;
    var primaryId = demoFlowState.order && demoFlowState.order.orderId;
    tbody.innerHTML = demoFlowState.orders.map(function (order, index) {
      var rowSyncState = order.syncState || "";
      var syncText = rowSyncState === "success" ? "同步成功" : (rowSyncState === "fail" ? "同步失败" : "");
      var syncBlock = syncText ? ('<div><span style="color:#d92d20;">' + escapeHtml(syncText) + "</span></div>") : "";
      var actionHtml =
        '<div class="text demo-flow-action-row" spellcheck="false">' +
          '<button type="button" class="demo-flow-btn" onclick="window.__demoFlowSelectDetail&&window.__demoFlowSelectDetail(\'' + escapeHtml(order.orderId) + '\');return false;">查看详情</button>' +
          (rowSyncState === "fail" ? '<button type="button" class="demo-flow-btn is-primary" onclick="window.__demoFlowSyncOrder&&window.__demoFlowSyncOrder(\'' + escapeHtml(order.orderId) + '\');return false;">同步到后台</button>' : '') +
        '</div>';
      var orderInfo = invoiceOrderInfoText(order) + (order.orderId === primaryId ? " / 本次演示工单" : "");
      return [
        '<tr data-demo-flow-order="' + (index + 1) + '">',
        '  <td><div class="text" spellcheck="false">待财务开票' + syncBlock + '</div></td>',
        '  <td><div class="text" spellcheck="false">点餐</div></td>',
        '  <td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
        '  <td><div class="text" spellcheck="false">' + escapeHtml(orderInfo) + '</div></td>',
        '  <td><div class="text" spellcheck="false">' + escapeHtml(invoiceInfoText(order)) + '</div></td>',
        '  <td>' + actionHtml + "</td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function updateDetailField(label, value) {
    var cards = document.querySelectorAll('.bundle-page[data-page="invoice-detail"] .field-card.ax_default');
    Array.prototype.forEach.call(cards, function (card) {
      var labelNode = card.querySelector(".field-label");
      var valueNode = card.querySelector(".field-value");
      if (!labelNode || !valueNode) return;
      if (labelNode.textContent.replace(/\s+/g, " ").trim() === label) {
        valueNode.textContent = value;
      }
    });
  }

  function renderInvoiceDetail() {
    var page = document.querySelector('.bundle-page[data-page="invoice-detail"]');
    if (!page) return;
    var order = demoFlowState.order;
    updateDetailField("订单号", order.orderId);
    updateDetailField("券订单号", order.orderId);
    updateDetailField("公司 / 姓名", order.title);
    updateDetailField("税号 / 身份证", order.taxNo);
    updateDetailField("店铺", order.store);
    updateDetailField("店铺名称", order.store);
    updateDetailField("规格 / 券名称", order.product);
    updateDetailField("商品名称", order.product);
    updateDetailField("供应商名称", order.supplierName);
    updateDetailField("支付金额", order.paid);
    var bar = page.querySelector(".demo-flow-detail-bar");
    if (bar && bar.parentNode) {
      bar.parentNode.removeChild(bar);
    }
  }

  function ensurePendingRow() {
    if (!demoFlowState.synced || demoFlowState.claimed || orderReachedWorkflowResult()) return;
    var tbody = document.querySelector('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-pending"] .table-wrap tbody');
    if (!tbody) return;
    var order = demoFlowState.order;
    removeRowsByOrderId('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-pending"] .table-wrap tbody', order.orderId);
    tbody.insertAdjacentHTML("afterbegin", [
      '<tr data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '">',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + '</div></td>',
      '  <td><div class="text" spellcheck="false"><span style="color: rgb(217, 45, 32);">' + escapeHtml(order.countdown) + '</span></div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + '</div></td>',
      '  <td><div class="text" spellcheck="false">待处理</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.product) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.title) + '</div></td>',
      '  <td><div class="text" spellcheck="false"><br></div></td>',
      '</tr>'
    ].join(""));
  }

  function ensureHallCard() {
    var page = document.querySelector('.bundle-page[data-page="hall"]');
    if (!page) return;
    var grid = page.querySelector(".hall-runtime-card-grid");
    if (!grid) return;
    Array.prototype.forEach.call(grid.querySelectorAll(".demo-flow-hall-card"), function (node) {
      node.parentNode.removeChild(node);
    });
    if (!demoFlowState.synced || demoFlowState.claimed || orderReachedWorkflowResult()) return;
    var order = demoFlowState.order;
    var wrapper = document.createElement("div");
    wrapper.className = "hall-runtime-card demo-flow-hall-card";
    wrapper.innerHTML = [
      '<div class="hall-runtime-head"><div class="hall-runtime-title">' + escapeHtml(order.store) + '<span class="demo-flow-tag">本次演示工单</span></div><div class="hall-runtime-countdown">' + escapeHtml(order.countdown) + "</div></div>",
      '<div class="hall-runtime-body"><div class="hall-runtime-image">商品图</div><div class="hall-runtime-meta"><div class="hall-runtime-sub">' + escapeHtml(order.product) + "</div><div class=\"hall-runtime-sub\">用户支付：" + escapeHtml(order.paid) + '</div><div class="hall-runtime-sub">' + escapeHtml(order.brand) + '</div><div class="hall-runtime-sub is-accent">补贴：' + escapeHtml(order.subsidy) + "</div></div></div>",
      '<div class="hall-runtime-actions"><button type="button" class="demo-flow-btn is-primary demo-flow-claim-btn" onclick="window.__demoFlowClaim&&window.__demoFlowClaim();return false;">抢单</button></div>'
    ].join("");
    grid.insertBefore(wrapper, grid.firstChild);
  }

  function ensureAfterSaleUploadedRow() {
    var tbody = document.querySelector('.bundle-page[data-page="after-sale-list"] .tab-panel[data-tab-group="backend-status"][data-tab-panel="backend-uploaded"] .table-wrap tbody');
    if (!tbody) return;
    var order = demoFlowState.order;
    removeRowsByOrderId('.bundle-page[data-page="after-sale-list"] .tab-panel[data-tab-group="backend-status"][data-tab-panel="backend-uploaded"] .table-wrap tbody', order.orderId);
    if (order.syncState !== "success" && !demoFlowState.auditStatus) return;
    tbody.insertAdjacentHTML("afterbegin", [
      '<tr data-order-id="' + escapeHtml(order.orderId) + '">',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + '</div></td>',
      '  <td><div class="text" spellcheck="false">是</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.product) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.store) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.supplierName) + '</div></td>',
      '  <td><div class="text" spellcheck="false">9.98</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.subsidy) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + (demoFlowState.afterSaleSettled ? "已补贴" : "未补贴") + '</div></td>',
      '</tr>'
    ].join(""));
  }

  function ensureBackendProcessingRow() {
    if (!demoFlowState.claimed || orderReachedWorkflowResult()) return;
    var tbody = document.querySelector('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-processing"] .table-wrap tbody');
    if (!tbody) return;
    var order = demoFlowState.order;
    removeRowsByOrderId('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-processing"] .table-wrap tbody', order.orderId);
    tbody.insertAdjacentHTML("afterbegin", [
      '<tr data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '">',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.countdown) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + '</div></td>',
      '  <td><div class="text" spellcheck="false">处理中</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.product) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.supplierNo) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.title) + '</div></td>',
      '</tr>'
    ].join(""));
  }

  function ensureSupplierProcessingRow() {
    if (!demoFlowState.claimed || orderReachedWorkflowResult()) return;
    var tbody = document.querySelector('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="supplier-processing"] .table-wrap tbody');
    if (!tbody) return;
    var order = demoFlowState.order;
    removeRowsByOrderId('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="supplier-processing"] .table-wrap tbody', order.orderId);
    tbody.insertAdjacentHTML("afterbegin", [
      '<tr data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '">',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + '</div></td>',
      '  <td><div class="text" spellcheck="false"><span style="color: rgb(217, 45, 32);">' + escapeHtml(order.countdown) + '</span></div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + '</div></td>',
      '  <td><div class="text" spellcheck="false">处理中</div></td>',
      '  <td><div class="text invoice-title-stack" spellcheck="false"><div class="invoice-title-main-row"><div class="invoice-title-main">' + escapeHtml(order.title) + '</div></div><div class="invoice-title-tax-row"><span>税号：' + escapeHtml(order.taxNo) + '</span></div></div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.product) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.store) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + '</div></td>',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.subsidy) + '</div></td>',
      '  <td><div class="invoice-review-action-group"><button type="button" class="supplier-processing-action is-primary" data-supplier-processing-row-action="upload" onclick="return window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION_DIRECT__(this)">上传</button><button type="button" class="supplier-processing-action is-danger" data-supplier-processing-row-action="abandon" onclick="return window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION_DIRECT__(this)">放弃</button></div></td>',
      '</tr>'
    ].join(""));
  }

  function clearClaimSourceRows() {
    var orderId = demoFlowState.order && demoFlowState.order.orderId;
    removeRowsByOrderId('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-pending"] .table-wrap tbody', orderId);
    Array.prototype.forEach.call(document.querySelectorAll(".demo-flow-hall-card"), function (node) {
      node.parentNode.removeChild(node);
    });
  }

  function syncDemoOrderToBackend() {
    var activeOrder = demoFlowState.order;
    if (!activeOrder) return;
    if (activeOrder.syncState === "success") {
      showToastSafe("该工单已同步");
      return;
    }
    if (activeOrder.syncMode === "fail") {
      demoFlowState.synced = false;
      activeOrder.syncState = "fail";
      renderInvoicePage();
      renderInvoiceDetail();
      ensureAfterSaleUploadedRow();
      showToastSafe("同步失败：示例工单同步失败");
      return;
    }
    demoFlowState.synced = true;
    activeOrder.syncState = "success";
    renderInvoicePage();
    renderInvoiceDetail();
    ensurePendingRow();
    ensureHallCard();
    ensureAfterSaleUploadedRow();
    activateTabGroup('.bundle-page[data-page="invoice-request-list"]', "invoice-request-list__backend-status", "backend-pending");
    showToastSafe("同步成功");
  }

  function claimDemoOrder() {
    if (!demoFlowState.synced) {
      showToastSafe("请先同步到后台");
      return;
    }
    if (demoFlowState.claimed || orderReachedWorkflowResult()) {
      showToastSafe("订单已被抢");
      return;
    }
    demoFlowState.claimed = true;
    clearClaimSourceRows();
    ensureBackendProcessingRow();
    ensureSupplierProcessingRow();
    activateTabGroup('.bundle-page[data-page="invoice-request-list"]', "invoice-request-list__backend-status", "backend-processing");
    activateTabGroup('.bundle-page[data-page="supplier-after-sale"]', "supplier-tabs", "supplier-processing");
    showToastSafe("抢单成功");
  }

  function renderDemoFlow() {
    ensureDemoFlowStyle();
    renderInvoicePage();
    renderInvoiceDetail();
    if (!demoFlowState.claimed && !orderReachedWorkflowResult()) {
      ensurePendingRow();
      ensureHallCard();
    }
    if (demoFlowState.claimed && !orderReachedWorkflowResult()) {
      ensureBackendProcessingRow();
      ensureSupplierProcessingRow();
    }
    ensureAfterSaleUploadedRow();
  }

  window.__demoFlowOpenDetail = function () {
    showBundlePageSafe("invoice-detail");
  };
  window.__demoFlowSync = function () {
    syncDemoOrderToBackend();
  };
  window.__demoFlowClaim = function () {
    claimDemoOrder();
  };
  window.__demoFlowHandleAutoAuditResult = function (orderId, outcome, payload) {
    if (!demoFlowState.order || orderId !== demoFlowState.order.orderId) return;
    if (demoFlowState.order) {
      demoFlowState.order.syncState = "success";
    }
    demoFlowState.auditStatus =
      outcome === "pass" ? "uploaded" :
      outcome === "reject" ? "rejected" :
      "reviewing";
    scheduleDemoFlowRender();
  };

  window.__demoFlowSelectDetail = function (orderId) {
    var order = demoFlowState.orders.find(function (item) { return item.orderId === orderId; });
    if (!order) return;
    demoFlowState.order = order;
    demoFlowState.synced = order.syncState === "success";
    renderInvoicePage();
    renderInvoiceDetail();
    showBundlePageSafe("invoice-detail");
  };

  window.__demoFlowSyncOrder = function (orderId) {
    var order = demoFlowState.orders.find(function (item) { return item.orderId === orderId; });
    if (!order) return;
    demoFlowState.order = order;
    demoFlowState.synced = order.syncState === "success";
    if (order.syncState === "success") {
      renderInvoicePage();
      renderInvoiceDetail();
      showToastSafe("该工单已同步");
      return;
    }
    syncDemoOrderToBackend();
  };

  function scheduleDemoFlowRender() {
    [0, 80, 220, 500, 900].forEach(function (delay) {
      window.setTimeout(renderDemoFlow, delay);
    });
  }

  document.addEventListener("click", function (event) {
    var actionButton = event.target.closest && event.target.closest("[data-demo-flow-action]");
    if (actionButton) {
      event.preventDefault();
      var action = actionButton.getAttribute("data-demo-flow-action");
      if (action === "detail") {
        showBundlePageSafe("invoice-detail");
      } else if (action === "sync") {
        syncDemoOrderToBackend();
      }
      return;
    }
    var claimButton = event.target.closest && event.target.closest(".demo-flow-claim-btn");
    if (claimButton) {
      event.preventDefault();
      claimDemoOrder();
    }
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleDemoFlowRender, { once: true });
  } else {
    scheduleDemoFlowRender();
  }
  window.addEventListener("load", scheduleDemoFlowRender);
  window.addEventListener("pageshow", scheduleDemoFlowRender);
  window.addEventListener("hashchange", scheduleDemoFlowRender);
})();
