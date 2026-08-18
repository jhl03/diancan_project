
(function () {
  if (window.__DEMO_FLOW_INVOICE_FALLBACK_V1__) return;
  window.__DEMO_FLOW_INVOICE_FALLBACK_V1__ = true;

  var state = (window.__demoFlowState = window.__demoFlowState || {});

  function pad2(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function formatNow(date) {
    var target = date || new Date();
    return [
      target.getFullYear(),
      pad2(target.getMonth() + 1),
      pad2(target.getDate())
    ].join("-") + " " + [pad2(target.getHours()), pad2(target.getMinutes()), pad2(target.getSeconds())].join(":");
  }

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function shiftMinutes(base, minutes) {
    return new Date(base.getTime() - minutes * 60000);
  }

  function createOrders() {
    var base = new Date();
    var primaryStamp = String(base.getFullYear()) + pad2(base.getMonth() + 1) + pad2(base.getDate()) + pad2(base.getHours()) + pad2(base.getMinutes()) + pad2(base.getSeconds());
    return [
      {
        orderId: "D20260815095024",
        store: "霸王茶姬-深圳",
        product: "伯牙绝弦大杯",
        brand: "霸王茶姬",
        paid: "16.80",
        title: "可可乐乐文化传播有限公司",
        taxNo: "91440300MAE5XXE49N",
        supplierName: "苏雨茶",
        supplierNo: "2077283553914077992",
        subsidy: "2.0",
        syncState: "success",
        createdAt: "2026-08-15 09:50:24",
        countdown: "6天23小时58分20秒"
      },
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
        countdown: "6天23小时55分42秒"
        ,
        orderId: "D20260815094824"
      }
    ];
  }

  if (!Array.isArray(state.orders) || !state.orders.length) state.orders = createOrders();
  if (!state.order) state.order = state.orders[1] || state.orders[0];
  if (typeof state.synced !== "boolean") state.synced = false;
  if (typeof state.claimed !== "boolean") state.claimed = false;
  if (!state.auditStatus) state.auditStatus = "";
  if (typeof state.afterSaleSettled !== "boolean") state.afterSaleSettled = false;

  function toast(text) {
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
    window.clearTimeout(window.__demoFlowToastTimerLegacy || 0);
    window.__demoFlowToastTimerLegacy = window.setTimeout(function () {
      node.classList.remove("is-show");
    }, 1600);
  }

  function activatePage(pageName) {
    Array.prototype.forEach.call(document.querySelectorAll(".bundle-page"), function (page) {
      page.classList.toggle("active", page.getAttribute("data-page") === pageName);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".bundle-catalog-link[data-page]"), function (link) {
      link.classList.toggle("active", link.getAttribute("data-page") === pageName);
    });
  }

  function activateTab(pageSelector, groupName, panelName) {
    var page = document.querySelector(pageSelector);
    if (!page) return;
    Array.prototype.forEach.call(page.querySelectorAll('.tab-row[data-tab-group="' + groupName + '"] > .tab-btn'), function (button) {
      button.classList.toggle("active", button.getAttribute("data-tab-target") === panelName);
    });
    Array.prototype.forEach.call(page.querySelectorAll('.tab-panel[data-tab-group="' + groupName + '"]'), function (panel) {
      var active = panel.getAttribute("data-tab-panel") === panelName;
      panel.classList.toggle("active", active);
      panel.style.setProperty("display", active ? "block" : "none", "important");
    });
  }

  function removeRows(selector, orderId) {
    var tbody = document.querySelector(selector);
    if (!tbody) return;
    Array.prototype.forEach.call(tbody.querySelectorAll("tr"), function (row) {
      var textNode = row.querySelector("td .text");
      var rowId = row.getAttribute("data-order-id") || (textNode ? textNode.textContent.replace(/\s+/g, " ").trim() : "");
      if (rowId === orderId) row.parentNode.removeChild(row);
    });
  }

  function orderReachedResult() {
    var orderId = state.order && state.order.orderId;
    if (!orderId) return false;
    var selectors = [
      '.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-reviewing"] .table-wrap tbody',
      '.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-uploaded"] .table-wrap tbody',
      '.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-rejected"] .table-wrap tbody'
    ];
    return selectors.some(function (selector) {
      var tbody = document.querySelector(selector);
      if (!tbody) return false;
      return Array.prototype.some.call(tbody.querySelectorAll("tr"), function (row) {
        var textNode = row.querySelector("td .text");
        var rowId = row.getAttribute("data-order-id") || (textNode ? textNode.textContent.replace(/\s+/g, " ").trim() : "");
        return rowId === orderId;
      });
    });
  }

  function renderInvoiceTable() {
    var tbody = document.querySelector('.bundle-page[data-page="invoice"] section[data-codex-layout-source-id="codex_pinned_213"] .table-wrap tbody');
    if (!tbody) return;
    var primaryId = state.order.orderId;
    tbody.innerHTML = state.orders.map(function (order, index) {
      var isPrimary = order.orderId === primaryId;
      var syncText = order.syncState === "success" ? "同步成功" : (order.syncState === "fail" ? "同步失败" : "");
      var syncBlock = syncText ? ('<div><span style="color:#d92d20;">' + escapeHtml(syncText) + '</span></div>') : "";
      var actionBlock =
        '<div class="text demo-flow-action-row" spellcheck="false">' +
          '<button type="button" class="demo-flow-btn" onclick="window.__demoFlowSelectDetail&&window.__demoFlowSelectDetail(\'' + escapeHtml(order.orderId) + '\');return false;">查看详情</button>' +
          (order.syncState === "fail" ? '<button type="button" class="demo-flow-btn is-primary" onclick="window.__demoFlowSyncOrder&&window.__demoFlowSyncOrder(\'' + escapeHtml(order.orderId) + '\');return false;">同步到后台</button>' : '') +
        "</div>";
      return [
        '<tr data-demo-flow-order="' + (index + 1) + '">',
        '  <td><div class="text" spellcheck="false">待财务开票' + syncBlock + '</div></td>',
        '  <td><div class="text" spellcheck="false">点餐</div></td>',
        '  <td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
        '  <td><div class="text" spellcheck="false">券单号：' + escapeHtml(order.orderId) + ' / 店铺：' + escapeHtml(order.store) + ' / 商品：' + escapeHtml(order.product) + (isPrimary ? " / 本次演示工单" : "") + '</div></td>',
        '  <td><div class="text" spellcheck="false">抬头：' + escapeHtml(order.title) + ' / 税号：' + escapeHtml(order.taxNo) + ' / 手机：-</div></td>',
        '  <td>' + actionBlock + '</td>',
        '</tr>'
      ].join("");
    }).join("");
  }

  function renderInvoiceDetail() {
    var page = document.querySelector('.bundle-page[data-page="invoice-detail"]');
    if (!page) return;
    var order = state.order;
    Array.prototype.forEach.call(page.querySelectorAll(".field-card.ax_default"), function (card) {
      var labelNode = card.querySelector(".field-label");
      var valueNode = card.querySelector(".field-value");
      if (!labelNode || !valueNode) return;
      var label = labelNode.textContent.replace(/\s+/g, " ").trim();
      if (label === "订单号" || label === "券订单号") valueNode.textContent = order.orderId;
      if (label === "公司 / 姓名") valueNode.textContent = order.title;
      if (label === "税号 / 身份证") valueNode.textContent = order.taxNo;
      if (label === "店铺" || label === "店铺名称") valueNode.textContent = order.store;
      if (label === "规格 / 券名称" || label === "商品名称") valueNode.textContent = order.product;
      if (label === "供应商名称") valueNode.textContent = order.supplierName;
      if (label === "支付金额") valueNode.textContent = order.paid;
    });
    var bar = page.querySelector(".demo-flow-detail-bar");
    if (bar && bar.parentNode) {
      bar.parentNode.removeChild(bar);
    }
  }

  function renderPendingRow() {
    if (!state.synced || state.claimed || orderReachedResult()) return;
    var tbody = document.querySelector('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-pending"] .table-wrap tbody');
    if (!tbody) return;
    removeRows('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-pending"] .table-wrap tbody', state.order.orderId);
    var order = state.order;
    tbody.insertAdjacentHTML("afterbegin", [
      '<tr data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '">',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + '</div></td>',
      '  <td><div class="text" spellcheck="false"><span style="color:#d92d20;">' + escapeHtml(order.countdown) + '</span></div></td>',
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

  function renderHallCard() {
    var grid = document.querySelector('.bundle-page[data-page="hall"] .hall-runtime-card-grid');
    if (!grid) return;
    Array.prototype.forEach.call(grid.querySelectorAll(".demo-flow-hall-card"), function (node) {
      node.parentNode.removeChild(node);
    });
    if (!state.synced || state.claimed || orderReachedResult()) return;
    var order = state.order;
    var node = document.createElement("div");
    node.className = "hall-runtime-card demo-flow-hall-card";
    node.innerHTML =
      '<div class="hall-runtime-head"><div class="hall-runtime-title">' + escapeHtml(order.store) + '<span class="demo-flow-tag">本次演示工单</span></div><div class="hall-runtime-countdown">' + escapeHtml(order.countdown) + '</div></div>' +
      '<div class="hall-runtime-body"><div class="hall-runtime-image">商品图</div><div class="hall-runtime-meta"><div class="hall-runtime-sub">' + escapeHtml(order.product) + '</div><div class="hall-runtime-sub">用户支付：' + escapeHtml(order.paid) + '</div><div class="hall-runtime-sub">' + escapeHtml(order.brand) + '</div><div class="hall-runtime-sub is-accent">补贴：' + escapeHtml(order.subsidy) + '</div></div></div>' +
      '<div class="hall-runtime-actions"><button type="button" class="demo-flow-btn is-primary" onclick="window.__demoFlowInvoiceClaim&&window.__demoFlowInvoiceClaim();return false;">抢单</button></div>';
    grid.insertBefore(node, grid.firstChild);
  }

  function renderBackendProcessingRow() {
    if (!state.claimed || orderReachedResult()) return;
    var tbody = document.querySelector('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-processing"] .table-wrap tbody');
    if (!tbody) return;
    removeRows('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-processing"] .table-wrap tbody', state.order.orderId);
    var order = state.order;
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

  function renderSupplierProcessingRow() {
    if (!state.claimed || orderReachedResult()) return;
    var tbody = document.querySelector('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="supplier-processing"] .table-wrap tbody');
    if (!tbody) return;
    removeRows('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="supplier-processing"] .table-wrap tbody', state.order.orderId);
    var order = state.order;
    tbody.insertAdjacentHTML("afterbegin", [
      '<tr data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '">',
      '  <td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + '</div></td>',
      '  <td><div class="text" spellcheck="false"><span style="color:#d92d20;">' + escapeHtml(order.countdown) + '</span></div></td>',
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

  function renderAfterSaleUploadedRow() {
    var tbody = document.querySelector('.bundle-page[data-page="after-sale-list"] .tab-panel[data-tab-group="backend-status"][data-tab-panel="backend-uploaded"] .table-wrap tbody');
    if (!tbody) return;
    removeRows('.bundle-page[data-page="after-sale-list"] .tab-panel[data-tab-group="backend-status"][data-tab-panel="backend-uploaded"] .table-wrap tbody', state.order.orderId);
    if (state.order.syncState !== "success" && !state.auditStatus) return;
    var order = state.order;
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
      '  <td><div class="text" spellcheck="false">' + (state.afterSaleSettled ? "已补贴" : "未补贴") + '</div></td>',
      '</tr>'
    ].join(""));
  }

  function renderAll() {
    renderInvoiceTable();
    renderInvoiceDetail();
    renderPendingRow();
    renderHallCard();
    renderBackendProcessingRow();
    renderSupplierProcessingRow();
    renderAfterSaleUploadedRow();
  }

  window.__demoFlowInvoiceDetail = function () {
    activatePage("invoice-detail");
  };

  window.__demoFlowInvoiceSync = function () {
    var activeOrder = state.order;
    if (!activeOrder) return;
    if (activeOrder.syncState === "success") {
      toast("该工单已同步");
      return;
    }
    if (activeOrder.syncMode === "fail") {
      state.synced = false;
      activeOrder.syncState = "fail";
      renderAll();
      activatePage("invoice");
      toast("同步失败：示例工单同步失败");
      return;
    }
    state.synced = true;
    activeOrder.syncState = "success";
    renderAll();
    activatePage("invoice");
    activateTab('.bundle-page[data-page="invoice-request-list"]', "invoice-request-list__backend-status", "backend-pending");
    toast("同步成功");
  };

  window.__demoFlowInvoiceClaim = function () {
    if (!state.synced) {
      toast("请先同步到后台");
      return;
    }
    if (state.claimed || orderReachedResult()) {
      toast("订单已被抢");
      return;
    }
    state.claimed = true;
    removeRows('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-pending"] .table-wrap tbody', state.order.orderId);
    Array.prototype.forEach.call(document.querySelectorAll(".demo-flow-hall-card"), function (node) {
      node.parentNode.removeChild(node);
    });
    renderAll();
    activateTab('.bundle-page[data-page="invoice-request-list"]', "invoice-request-list__backend-status", "backend-processing");
    activateTab('.bundle-page[data-page="supplier-after-sale"]', "supplier-tabs", "supplier-processing");
    toast("抢单成功");
  };

  window.__demoFlowHandleAutoAuditResult = function (orderId, outcome) {
    if (!state.order || orderId !== state.order.orderId) return;
    if (state.order) state.order.syncState = "success";
    state.auditStatus =
      outcome === "pass" ? "uploaded" :
      outcome === "reject" ? "rejected" :
      "reviewing";
    renderAll();
  };

  window.__demoFlowSelectDetail = function (orderId) {
    var order = state.orders.find(function (item) { return item.orderId === orderId; });
    if (!order) return;
    state.order = order;
    state.synced = order.syncState === "success";
    renderAll();
    activatePage("invoice-detail");
  };

  window.__demoFlowSyncOrder = function (orderId) {
    var order = state.orders.find(function (item) { return item.orderId === orderId; });
    if (!order) return;
    state.order = order;
    state.synced = order.syncState === "success";
    if (order.syncState === "success") {
      renderAll();
      toast("该工单已同步");
      return;
    }
    window.__demoFlowInvoiceSync();
  };

  function schedule() {
    [0, 120, 360, 800].forEach(function (delay) {
      window.setTimeout(renderAll, delay);
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
