
(function () {
  if (window.__FLOW_RUNTIME_FIX_V2__) return;
  window.__FLOW_RUNTIME_FIX_V2__ = true;

  var state = window.__FLOW_RUNTIME_FIX_STATE__ || (window.__FLOW_RUNTIME_FIX_STATE__ = { orders: {} });
  var supplierNameMap = {
    "瑞幸": "黄开良",
    "霸王茶姬": "苏雨茶",
    "肯德基": "王小河",
    "麦当劳": "陈安宁",
    "塔斯汀": "陶元飞",
    "喜德基": "周远航"
  };
  var supplierNoMap = {
    "瑞幸": "2077283553914077185",
    "霸王茶姬": "2077283553914077992",
    "肯德基": "2077283553914081126",
    "麦当劳": "2077283553914082210",
    "塔斯汀": "2077283553914083318",
    "喜德基": "2077283553914087788"
  };
  var supplierNoByName = {
    "黄开良": "2077283553914077185",
    "苏雨茶": "2077283553914077992",
    "王小河": "2077283553914081126",
    "陈安宁": "2077283553914082210",
    "陶元飞": "2077283553914083318",
    "周远航": "2077283553914087788"
  };
  var subsidyMap = {
    "瑞幸": "1.5",
    "霸王茶姬": "2.0",
    "肯德基": "2.5",
    "麦当劳": "3.0",
    "塔斯汀": "3.2",
    "喜德基": "2.2"
  };

  function cleanText(node) {
    return node ? String(node.textContent || "").replace(/\s+/g, " ").trim() : "";
  }

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function notify(text) {
    var node = document.querySelector(".proto-inline-toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "proto-inline-toast";
      document.body.appendChild(node);
    }
    node.textContent = text;
    node.classList.add("is-show");
    window.clearTimeout(window.__flowFixToastTimer || 0);
    window.__flowFixToastTimer = window.setTimeout(function () {
      node.classList.remove("is-show");
    }, 1600);
  }

  function parseCountdownText(text) {
    var source = String(text || "").replace(/\s+/g, "");
    if (!source || source.indexOf("倒计时结束") > -1 || source.indexOf("已超时") > -1) return 0;
    var matched = source.match(/(?:(\d+)天)?(?:(\d+)小时)?(?:(\d+)分)?(?:(\d+)秒)?/);
    if (!matched) return 0;
    var days = parseInt(matched[1] || "0", 10);
    var hours = parseInt(matched[2] || "0", 10);
    var minutes = parseInt(matched[3] || "0", 10);
    var seconds = parseInt(matched[4] || "0", 10);
    return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
  }

  function formatCountdown(ms) {
    if (!ms || ms <= 0) return "倒计时结束";
    var totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    var parts = [];
    if (days > 0) parts.push(days + "天");
    parts.push(hours + "小时");
    parts.push(minutes + "分");
    parts.push(seconds + "秒");
    return parts.join("");
  }

  function formatNow(date) {
    var current = date || new Date();
    function pad(value) {
      return value < 10 ? "0" + value : String(value);
    }
    return [
      current.getFullYear(),
      pad(current.getMonth() + 1),
      pad(current.getDate())
    ].join("-") + " " + [pad(current.getHours()), pad(current.getMinutes()), pad(current.getSeconds())].join(":");
  }

  function computeSettlementAmount(paid) {
    var value = parseFloat(String(paid || "").replace(/[^\d.]/g, ""));
    if (!isFinite(value)) return "9.98";
    return Math.max(0, value - 0.01).toFixed(2);
  }

  function buildTitleHtml(title, taxNo) {
    return '<div class="text invoice-title-stack" spellcheck="false">' +
      '<div class="invoice-title-main-row"><div class="invoice-title-main">' + escapeHtml(title) + "</div></div>" +
      '<div class="invoice-title-tax-row"><span>税号：' + escapeHtml(taxNo || "-") + "</span></div>" +
      "</div>";
  }

  function activateTab(pageSelector, groupName, targetName) {
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

  function getInvoiceRequestPanel(panelName) {
    return document.querySelector('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="' + panelName + '"]');
  }

  function getSupplierPanel(panelName) {
    return document.querySelector('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="' + panelName + '"]');
  }

  function currentPrimaryDemoOrderId() {
    var currentId = "";
    Array.prototype.some.call(document.querySelectorAll('.bundle-page[data-page="invoice"] .table-wrap tbody tr'), function (row) {
      if ((row.textContent || "").indexOf("本次演示工单") === -1) return false;
      var match = cleanText(row.querySelectorAll("td .text")[3]).match(/券单号：([^\/\s]+)/);
      currentId = match ? match[1].trim() : "";
      return !!currentId;
    });
    if (currentId) return currentId;
    var detailCards = document.querySelectorAll('.bundle-page[data-page="invoice-detail"] .field-card.ax_default');
    Array.prototype.some.call(detailCards, function (card) {
      var label = cleanText(card.querySelector(".field-label"));
      if (label !== "订单号" && label !== "券订单号") return false;
      currentId = cleanText(card.querySelector(".field-value"));
      return !!currentId;
    });
    return currentId;
  }

  function findInvoiceRow(orderId) {
    var target = null;
    Array.prototype.some.call(document.querySelectorAll('.bundle-page[data-page="invoice"] .table-wrap tbody tr'), function (row) {
      if ((row.textContent || "").indexOf(orderId) === -1) return false;
      target = row;
      return true;
    });
    return target;
  }

  function deriveOutOrderId(orderId) {
    var digits = String(orderId || "").replace(/\D/g, "");
    if (!digits) return "-";
    if (digits.indexOf("2078") === 0) return digits;
    return "2078" + (digits.length > 12 ? digits.slice(-12) : digits);
  }

  function offsetTimeText(baseText, dayOffset, minuteOffset) {
    var normalized = String(baseText || "").trim().replace(/-/g, "/");
    var date = normalized ? new Date(normalized) : new Date();
    if (!date || isNaN(date.getTime())) date = new Date();
    if (dayOffset) date.setDate(date.getDate() + dayOffset);
    if (minuteOffset) date.setMinutes(date.getMinutes() + minuteOffset);
    return formatNow(date);
  }

  function readInvoiceListOrderMeta(orderId) {
    var row = findInvoiceRow(orderId);
    if (!row) return null;
    var cells = row.querySelectorAll("td .text");
    var paid = cleanText(cells[2]) || "9.99";
    var orderInfo = cleanText(cells[3]);
    var invoiceInfo = cleanText(cells[4]);
    var storeMatch = orderInfo.match(/店铺：([^\/]+)/);
    var productMatch = orderInfo.match(/商品：([^\/]+)/);
    var createdAtMatch = orderInfo.match(/创建时间：([^\/]+)/);
    var titleMatch = invoiceInfo.match(/抬头：([^\/]+)/);
    var taxNoMatch = invoiceInfo.match(/税号：([^\/]+)/);
    var store = storeMatch ? storeMatch[1].trim() : "瑞幸-广州";
    var brand = store.split("-")[0] || "瑞幸";
    var title = titleMatch ? titleMatch[1].trim() : "井井井";
    var taxNo = taxNoMatch ? taxNoMatch[1].trim() : "-";
    var createdAt = (createdAtMatch ? createdAtMatch[1].trim() : "") || formatNow();
    return {
      orderId: orderId,
      outOrderId: deriveOutOrderId(orderId),
      createdAt: createdAt,
      orderTime: offsetTimeText(createdAt, -1, -7),
      product: productMatch ? productMatch[1].trim() : "椰青冰萃美式",
      store: store,
      brand: brand,
      paid: paid,
      title: title,
      taxNo: taxNo || "-",
      supplierName: supplierNameMap[brand] || "黄开良",
      supplierNo: supplierNoMap[brand] || "2077283553914077185",
      subsidy: subsidyMap[brand] || "1.5",
      settlement: computeSettlementAmount(paid)
    };
  }

  function registerSyncedOrder(orderId) {
    if (!orderId) return;
    var row = findInvoiceRow(orderId);
    if (!row) return;
    var rowText = cleanText(row.querySelector("td .text"));
    if (rowText.indexOf("同步失败") > -1) {
      delete state.orders[orderId];
      return;
    }
    if (rowText.indexOf("同步成功") === -1 && !document.querySelector('.demo-flow-hall-card')) return;
    var meta = readInvoiceListOrderMeta(orderId);
    if (!meta) return;
    var existing = state.orders[orderId] || {};
    var demoCard = document.querySelector(".demo-flow-hall-card");
    var countdownText = demoCard ? cleanText(demoCard.querySelector(".hall-runtime-countdown")) : "";
    var countdownMs = parseCountdownText(countdownText);
    if (!countdownMs) countdownMs = (((1 * 24 + 23) * 60 + 59) * 60 + 59) * 1000;
    state.orders[orderId] = Object.assign(existing, meta, {
      source: "demo",
      deadline: existing.deadline || (Date.now() + countdownMs),
      claimed: !!existing.claimed,
      uploaded: !!existing.uploaded,
      reviewing: !!existing.reviewing,
      rejected: !!existing.rejected,
      processingDeadline: existing.processingDeadline || 0,
      fileName: existing.fileName || "",
      uploadTime: existing.uploadTime || ""
    });
    if (demoCard) demoCard.setAttribute("data-order-id", orderId);
  }

  function buildPendingRow(order) {
    var remaining = Math.max(0, (order.deadline || 0) - Date.now());
    var expired = remaining <= 0;
    var countdownHtml = '<span style="color: rgb(217, 45, 32);">' + escapeHtml(expired ? "倒计时结束" : formatCountdown(remaining)) + "</span>";
    var actionHtml = expired
      ? '<div class="invoice-review-action-group"><button type="button" class="invoice-review-action" data-timeout-action="assign">分配</button><button type="button" class="invoice-review-action is-primary" data-timeout-action="upload">上传</button></div>'
      : '<div class="text" spellcheck="false"><br></div>';
    return [
      '<tr data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '" data-paid="' + escapeHtml(order.paid) + '" data-flow-runtime="pending">',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.outOrderId || order.orderId) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + countdownHtml + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + "</div></td>",
      '<td><div class="text" spellcheck="false">待处理</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.product) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + "</div></td>",
      '<td>' + buildTitleHtml(order.title, order.taxNo) + "</td>",
      "<td>" + actionHtml + "</td>",
      "</tr>"
    ].join("");
  }

  function buildProcessingRow(order) {
    var remainingBase = order.processingDeadline || (Date.now() + (((1 * 24 + 23) * 60 + 59) * 60 + 59) * 1000);
    if (!order.processingDeadline) order.processingDeadline = remainingBase;
    var remaining = Math.max(0, remainingBase - Date.now());
    var countdownHtml = '<span style="color: rgb(217, 45, 32);">' + escapeHtml(remaining <= 0 ? "倒计时结束" : formatCountdown(remaining)) + "</span>";
    return [
      '<tr data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '" data-paid="' + escapeHtml(order.paid) + '" data-flow-runtime="processing">',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.outOrderId || order.orderId) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + countdownHtml + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + "</div></td>",
      '<td><div class="text" spellcheck="false">处理中</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.product) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.supplierNo) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.title) + "</div></td>",
      "</tr>"
    ].join("");
  }

  function renderPendingTable() {
    var panel = getInvoiceRequestPanel("backend-pending");
    var tbody = panel && panel.querySelector(".table-wrap tbody");
    if (!tbody) return;
    if (!tbody.dataset.flowFixOriginalHtml) tbody.dataset.flowFixOriginalHtml = tbody.innerHTML;
    var rows = Object.keys(state.orders).map(function (key) { return state.orders[key]; }).filter(function (order) {
      return order && !order.claimed && !order.uploaded && !order.reviewing && !order.rejected;
    });
    if (!rows.length) {
      tbody.innerHTML = tbody.dataset.flowFixOriginalHtml;
      return;
    }
    rows.sort(function (a, b) {
      var aMs = Math.max(0, (a.deadline || 0) - Date.now());
      var bMs = Math.max(0, (b.deadline || 0) - Date.now());
      var aExpired = aMs <= 0 ? 0 : 1;
      var bExpired = bMs <= 0 ? 0 : 1;
      if (aExpired !== bExpired) return aExpired - bExpired;
      return aMs - bMs;
    });
    tbody.innerHTML = rows.map(buildPendingRow).join("");
  }

  function renderProcessingTable() {
    var panel = getInvoiceRequestPanel("backend-processing");
    var tbody = panel && panel.querySelector(".table-wrap tbody");
    if (!tbody) return;
    if (!tbody.dataset.flowFixOriginalHtml) tbody.dataset.flowFixOriginalHtml = tbody.innerHTML;
    var rows = Object.keys(state.orders).map(function (key) { return state.orders[key]; }).filter(function (order) {
      return order && order.claimed && !order.uploaded && !order.reviewing && !order.rejected;
    });
    if (!rows.length) {
      tbody.innerHTML = tbody.dataset.flowFixOriginalHtml;
      return;
    }
    rows.sort(function (a, b) {
      return Math.max(0, (a.processingDeadline || 0) - Date.now()) - Math.max(0, (b.processingDeadline || 0) - Date.now());
    });
    tbody.innerHTML = rows.map(buildProcessingRow).join("");
  }

  function updateDemoHallCard() {
    var hallPage = document.querySelector('.bundle-page[data-page="hall"]');
    if (hallPage && hallPage.getAttribute("data-final-hall-built") === "1") return;
    var grid = hallPage && hallPage.querySelector(".hall-runtime-card-grid");
    if (!grid) return;
    Array.prototype.forEach.call(grid.querySelectorAll(".demo-flow-hall-card"), function (node) {
      node.remove();
    });
    var orderId = currentPrimaryDemoOrderId() || (state.order && state.order.orderId) || "";
    if (orderId && !state.orders[orderId]) registerSyncedOrder(orderId);
    if (!orderId || !state.orders[orderId]) return;
    var order = state.orders[orderId];
    if (order.claimed || order.uploaded || order.reviewing || order.rejected) return;
    var remaining = Math.max(0, (order.deadline || 0) - Date.now());
    var buttonText = remaining <= 0 ? "已超时" : "抢单";
    var buttonStyle = remaining <= 0
      ? "background:#94a3b8;border-color:#94a3b8;color:#fff;cursor:not-allowed;"
      : "background:#2563eb;border-color:#2563eb;color:#fff;";
    var wrapper = document.createElement("div");
    wrapper.className = "hall-runtime-card demo-flow-hall-card flow-fix-hall-card";
    wrapper.setAttribute("data-order-id", orderId);
    wrapper.innerHTML =
      '<div class="hall-runtime-head"><div class="hall-runtime-title">' + escapeHtml(order.store) + '<span class="demo-flow-tag">本次演示工单</span></div><div class="hall-runtime-countdown">' + escapeHtml(remaining <= 0 ? "倒计时结束" : formatCountdown(remaining)) + "</div></div>" +
      '<div class="hall-runtime-body"><div class="hall-runtime-image">商品图</div><div class="hall-runtime-meta"><div class="hall-runtime-sub">' + escapeHtml(order.product) + '</div><div class="hall-runtime-sub">用户支付：' + escapeHtml(order.paid) + '</div><div class="hall-runtime-sub">' + escapeHtml(order.brand) + '</div><div class="hall-runtime-sub is-accent">补贴：' + escapeHtml(order.subsidy) + '</div></div></div>' +
      '<div class="hall-runtime-actions"><button type="button" class="demo-flow-btn is-primary flow-fix-hall-claim-btn" data-flow-fix-claim-id="' + escapeHtml(orderId) + '" ' + (remaining <= 0 ? 'disabled="disabled"' : '') + ' style="' + buttonStyle + '">' + buttonText + '</button></div>';
    grid.insertBefore(wrapper, grid.firstChild);
  }

  function normalizeLegacyHallClaimButtons() {
    return;
  }

  function refineSupplierProcessingLayout() {
    var panel = getSupplierPanel("supplier-processing");
    if (!panel) return;
    var tableSection = panel.querySelector('section.table-section[data-codex-layout-source-id="codex_pinned_207"]') || panel.querySelector("section.table-section");
    var tableWrap = tableSection && tableSection.querySelector(".table-wrap");
    var desc = panel.querySelector('.proto-desc-card[data-desc-key="supplier-processing"]');
    if (tableSection) {
      tableSection.style.setProperty("height", "214px", "important");
      tableSection.style.setProperty("min-height", "214px", "important");
      tableSection.style.setProperty("overflow", "hidden", "important");
    }
    if (tableWrap) {
      tableWrap.style.setProperty("height", "132px", "important");
      tableWrap.style.setProperty("max-height", "132px", "important");
      tableWrap.style.setProperty("min-height", "132px", "important");
      tableWrap.style.setProperty("overflow-y", "auto", "important");
      tableWrap.style.setProperty("overflow-x", "auto", "important");
      tableWrap.style.setProperty("margin-top", "10px", "important");
    }
    if (desc && tableSection) {
      var top = parseFloat(tableSection.style.top);
      var height = parseFloat(tableSection.style.height);
      if (!isNaN(top) && !isNaN(height)) {
        desc.style.setProperty("top", top + height + 28 + "px", "important");
        desc.style.setProperty("margin-top", "0", "important");
      }
    }
  }

  function removeRuntimeRows(tbody) {
    if (!tbody) return;
    Array.prototype.forEach.call(tbody.querySelectorAll("tr[data-flow-runtime]"), function (row) {
      row.remove();
    });
  }

  function buildSupplierProcessingPcRow(order) {
    var remaining = Math.max(0, (order.processingDeadline || 0) - Date.now());
    return [
      '<tr data-flow-runtime="supplier-processing" data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '">',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + "</div></td>",
      '<td><div class="text" spellcheck="false"><span style="color: rgb(217, 45, 32);">' + escapeHtml(remaining <= 0 ? "倒计时结束" : formatCountdown(remaining)) + "</span></div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + "</div></td>",
      '<td><div class="text" spellcheck="false">处理中</div></td>',
      '<td>' + buildTitleHtml(order.title, order.taxNo) + "</td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.product) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.store) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.subsidy) + '</div></td>',
      '<td><div class="invoice-review-action-group"><button type="button" class="supplier-processing-action is-primary" data-supplier-processing-row-action="upload" onclick="return window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION_DIRECT__(this)">上传</button><button type="button" class="supplier-processing-action is-danger" data-supplier-processing-row-action="abandon" onclick="return window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION_DIRECT__(this)">放弃</button></div></td>',
      "</tr>"
    ].join("");
  }

  function buildSupplierReviewingPcRow(order) {
    return [
      '<tr data-flow-runtime="supplier-reviewing" data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '">',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + "</div></td>",
      '<td><div class="text" spellcheck="false">审核中</div></td>',
      '<td>' + buildTitleHtml(order.title, order.taxNo) + "</td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.product) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.store) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.subsidy) + '</div></td>',
      "</tr>"
    ].join("");
  }

  function buildSupplierUploadedPcRow(order) {
    return [
      '<tr data-flow-runtime="supplier-uploaded" data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '" data-file-name="' + escapeHtml(order.fileName || "") + '" data-upload-time="' + escapeHtml(order.uploadTime || "") + '">',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + "</div></td>",
      '<td><div class="text" spellcheck="false">已上传</div></td>',
      '<td>' + buildTitleHtml(order.title, order.taxNo) + "</td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.product) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.store) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.uploadTime || formatNow()) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.subsidy) + '</div></td>',
      '<td><div class="text" spellcheck="false">未补贴</div></td>',
      '<td><div class="invoice-review-action-group"><button type="button" class="invoice-review-action" data-review-open-file="1">下载</button></div></td>',
      "</tr>"
    ].join("");
  }

  function buildSupplierRejectedPcRow(order) {
    return [
      '<tr data-flow-runtime="supplier-rejected" data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title) + '" data-tax-no="' + escapeHtml(order.taxNo) + '">',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + "</div></td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + '</div></td>',
      '<td><div class="text" spellcheck="false">已驳回</div></td>',
      '<td>' + buildTitleHtml(order.title, order.taxNo) + "</td>",
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.product) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.store) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.rejectReason || "发票抬头与税号不匹配，请核对后重新上传清晰文件。") + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.uploadTime || formatNow()) + '</div></td>',
      '<td><div class="text" spellcheck="false">' + escapeHtml(order.subsidy) + '</div></td>',
      '<td><div class="invoice-review-action-group"><button type="button" class="supplier-processing-action is-primary" data-supplier-processing-row-action="reupload">重新上传</button></div></td>',
      "</tr>"
    ].join("");
  }

  function renderSupplierPcRuntime() {
    var processingPanel = getSupplierPanel("supplier-processing");
    var reviewingPanel = getSupplierPanel("supplier-reviewing");
    var uploadedPanel = getSupplierPanel("supplier-uploaded");
    var rejectedPanel = getSupplierPanel("supplier-rejected");
    var processingBody = processingPanel && processingPanel.querySelector(".table-wrap tbody");
    var reviewingBody = reviewingPanel && reviewingPanel.querySelector(".table-wrap tbody");
    var uploadedBody = uploadedPanel && uploadedPanel.querySelector(".table-wrap tbody");
    var rejectedBody = rejectedPanel && rejectedPanel.querySelector(".table-wrap tbody");
    removeRuntimeRows(processingBody);
    removeRuntimeRows(reviewingBody);
    removeRuntimeRows(uploadedBody);
    removeRuntimeRows(rejectedBody);
    Object.keys(state.orders).forEach(function (key) {
      var order = state.orders[key];
      if (!order) return;
      if (order.claimed && !order.uploaded && !order.reviewing && !order.rejected && processingBody) {
        processingBody.insertAdjacentHTML("afterbegin", buildSupplierProcessingPcRow(order));
        return;
      }
      if (order.reviewing && !order.uploaded && reviewingBody) {
        reviewingBody.insertAdjacentHTML("afterbegin", buildSupplierReviewingPcRow(order));
        return;
      }
      if (order.uploaded && uploadedBody) {
        uploadedBody.insertAdjacentHTML("afterbegin", buildSupplierUploadedPcRow(order));
        return;
      }
      if (order.rejected && rejectedBody) {
        rejectedBody.insertAdjacentHTML("afterbegin", buildSupplierRejectedPcRow(order));
      }
    });
  }

  function buildMiniHallRuntimeCard(order) {
    var remaining = Math.max(0, (order.deadline || 0) - Date.now());
    var disabled = remaining <= 0;
    return '<div class="mini-order-card order-card ax_default mini-hall-order-card flow-fix-mini-runtime" data-runtime-mini-order="' + escapeHtml(order.orderId) + '">' +
      '<div class="mini-order-top"><div class="mini-order-store text" spellcheck="false">' + escapeHtml(order.store) + '</div><div class="mini-order-deadline text" spellcheck="false">' + escapeHtml(disabled ? "倒计时结束" : formatCountdown(remaining)) + '</div></div>' +
      '<div class="mini-order-content"><div class="mini-order-thumb text" spellcheck="false">商品图</div><div class="mini-order-detail-col"><div class="mini-order-meta text" spellcheck="false">商品：' + escapeHtml(order.product) + '</div><div class="mini-order-meta text" spellcheck="false">用户支付：' + escapeHtml(order.paid) + '</div><div class="mini-order-meta text" spellcheck="false">补贴金额：<span class="mini-order-highlight">' + escapeHtml(order.subsidy) + ' 元</span></div></div></div>' +
      '<div class="mini-order-actions"><div class="ghost-btn ax_default mini-grab-trigger flow-fix-mini-claim" data-runtime-mini-claim="' + escapeHtml(order.orderId) + '" style="background:' + (disabled ? '#94a3b8' : '#1d4ed8') + ';border-color:' + (disabled ? '#94a3b8' : '#1d4ed8') + ';"><div class="text" spellcheck="false" style="color:#fff;">' + (disabled ? '已超时' : '立即抢单') + '</div></div></div>' +
      '</div>';
  }

  function getMiniHallRuntimeActiveBrand() {
    var activeFromState = window.__miniHallTabState && window.__miniHallTabState.activeBrand;
    var activeButton = document.querySelector('.bundle-page[data-page="mini-hall"] .mini-hall-final-tab-btn.is-active');
    var activeFromDom = cleanText(activeButton);
    return String(activeFromState || activeFromDom || "全部").trim() || "全部";
  }

  function normalizeMiniHallRuntimeBrand(brand) {
    var text = String(brand || "").trim();
    return ["瑞幸", "麦当劳", "肯德基", "霸王茶姬", "星巴克", "塔斯汀"].indexOf(text) > -1 ? text : "电子卡券";
  }

  function shouldRenderMiniHallRuntimeOrder(order) {
    var activeBrand = getMiniHallRuntimeActiveBrand();
    if (activeBrand === "全部") return true;
    return normalizeMiniHallRuntimeBrand(order && order.brand) === activeBrand;
  }

  function buildMiniAfterSaleRuntimeCard(order, status) {
    var stateText = status === "processing" ? "处理中" : (status === "reviewing" ? "审核中" : (status === "rejected" ? "已驳回" : "已上传"));
    var deadlineText = status === "processing" ? ("上传倒计时：" + formatCountdown(Math.max(0, (order.processingDeadline || order.deadline || 0) - Date.now()))) : "";
    var actionHtml = "";
    if (status === "processing") {
      actionHtml = '<div class="mini-order-actions compact"><button type="button" class="ghost-btn ax_default flow-fix-mini-action" data-flow-fix-mini-action="abandon" data-order-id="' + escapeHtml(order.orderId) + '"><div class="text" spellcheck="false">放弃</div></button><button type="button" class="ghost-btn ax_default flow-fix-mini-action" data-flow-fix-mini-action="upload" data-order-id="' + escapeHtml(order.orderId) + '" style="background:#1d4ed8;border-color:#1d4ed8;"><div class="text" spellcheck="false" style="color:#fff;">上传</div></button></div>';
    } else if (status === "rejected") {
      actionHtml = '<div class="mini-order-reject-reason ax_default"><div class="mini-order-reject-label text" spellcheck="false">驳回原因</div><div class="mini-order-reject-text text" spellcheck="false">' + escapeHtml(order.rejectReason || "发票抬头与税号不匹配，请核对后重新上传清晰文件。") + '</div></div><div class="mini-order-actions compact"><button type="button" class="ghost-btn ax_default flow-fix-mini-action" data-flow-fix-mini-action="reupload" data-order-id="' + escapeHtml(order.orderId) + '" style="background:#1d4ed8;border-color:#1d4ed8;"><div class="text" spellcheck="false" style="color:#fff;">重新上传</div></button></div>';
    } else if (status === "uploaded") {
      actionHtml = '<div class="mini-order-actions compact"><button type="button" class="ghost-btn ax_default flow-fix-mini-action" data-flow-fix-mini-action="view-file" data-order-id="' + escapeHtml(order.orderId) + '"><div class="text" spellcheck="false">查看文件</div></button></div>';
    }
    return '<div class="mini-order-card order-card ax_default mini-after-sale-list-card flow-fix-mini-runtime" data-runtime-mini-order="' + escapeHtml(order.orderId) + '">' +
      '<div class="mini-order-top"><div class="mini-order-store text" spellcheck="false">' + escapeHtml(order.store) + '</div><div class="mini-order-deadline text' + (status === "processing" ? '' : ' hidden') + '" spellcheck="false">' + escapeHtml(status === "processing" ? deadlineText : "") + '</div></div>' +
      '<div class="mini-order-subhead"><div class="mini-order-subtext text" spellcheck="false">订单号：' + escapeHtml(order.orderId) + '</div><div class="mini-order-state-pill text" spellcheck="false">' + escapeHtml(stateText) + '</div></div>' +
      '<div class="mini-order-content"><div class="mini-order-thumb text" spellcheck="false">商品图</div><div class="mini-order-detail-col"><div class="mini-order-meta text" spellcheck="false">商品品牌：' + escapeHtml(order.brand) + '</div><div class="mini-order-meta text" spellcheck="false">商品名称：' + escapeHtml(order.product) + '</div><div class="mini-order-meta text" spellcheck="false">用户支付：' + escapeHtml(order.paid) + '</div><div class="mini-order-meta text" spellcheck="false">补贴金额：<span class="mini-order-highlight">' + escapeHtml(order.subsidy) + ' 元</span></div></div></div>' +
      actionHtml +
      '</div>';
  }

  function renderMiniRuntime() {
    var hallList = document.getElementById("mini-hall-card-list");
    var processingList = document.getElementById("mini-after-sale-processing-list");
    var reviewingList = document.getElementById("mini-after-sale-reviewing-list");
    var rejectedList = document.getElementById("mini-after-sale-rejected-list");
    var uploadedList = document.getElementById("mini-after-sale-uploaded-list");
    [hallList, processingList, reviewingList, rejectedList, uploadedList].forEach(function (list) {
      if (!list) return;
      Array.prototype.forEach.call(list.querySelectorAll(".flow-fix-mini-runtime"), function (node) { node.remove(); });
    });
    var hallRuntimeOrders = Object.keys(state.orders).map(function (key) {
      return state.orders[key];
    }).filter(function (order) {
      return order && !order.claimed && !order.uploaded && !order.reviewing && !order.rejected && shouldRenderMiniHallRuntimeOrder(order);
    }).sort(function (a, b) {
      return Math.max(0, (b.deadline || 0) - Date.now()) - Math.max(0, (a.deadline || 0) - Date.now());
    });
    hallRuntimeOrders.forEach(function (order) {
      if (!hallList) return;
      hallList.insertAdjacentHTML("beforeend", buildMiniHallRuntimeCard(order));
    });
    Object.keys(state.orders).forEach(function (key) {
      var order = state.orders[key];
      if (!order) return;
      if (order.claimed && !order.uploaded && !order.reviewing && !order.rejected && processingList) {
        processingList.insertAdjacentHTML("afterbegin", buildMiniAfterSaleRuntimeCard(order, "processing"));
      }
      if (order.reviewing && !order.uploaded && reviewingList) {
        reviewingList.insertAdjacentHTML("afterbegin", buildMiniAfterSaleRuntimeCard(order, "reviewing"));
      }
      if (order.rejected && rejectedList) {
        rejectedList.insertAdjacentHTML("afterbegin", buildMiniAfterSaleRuntimeCard(order, "rejected"));
      }
      if (order.uploaded && uploadedList) {
        uploadedList.insertAdjacentHTML("afterbegin", buildMiniAfterSaleRuntimeCard(order, "uploaded"));
      }
    });
  }

  function clearLegacyPendingOperationText() {
    var panel = getInvoiceRequestPanel("backend-pending");
    var tbody = panel && panel.querySelector(".table-wrap tbody");
    if (!tbody) return;
    Array.prototype.forEach.call(tbody.querySelectorAll("tr td:last-child .text"), function (cell) {
      var text = cleanText(cell);
      if (text.indexOf("待供应商抢单") > -1) {
        cell.innerHTML = "<br>";
      }
    });
  }

  function renderAll() {
    normalizeLegacyHallClaimButtons();
    renderPendingTable();
    renderProcessingTable();
    clearLegacyPendingOperationText();
    refineSupplierProcessingLayout();
    renderSupplierPcRuntime();
    updateDemoHallCard();
    renderMiniRuntime();
  }

  function markClaimed(orderId, supplierName) {
    if (!orderId || !state.orders[orderId]) return;
    state.orders[orderId].claimed = true;
    state.orders[orderId].supplierName = supplierName || state.orders[orderId].supplierName;
    state.orders[orderId].supplierNo = supplierNoByName[supplierName] || state.orders[orderId].supplierNo;
    if (!state.orders[orderId].processingDeadline) {
      state.orders[orderId].processingDeadline = Date.now() + (((1 * 24 + 23) * 60 + 59) * 60 + 59) * 1000;
    }
    window.__supplierAfterSaleRequestedTab = "supplier-processing";
    activateTab('.bundle-page[data-page="invoice-request-list"]', "invoice-request-list__backend-status", "backend-processing");
    activateTab('.bundle-page[data-page="supplier-after-sale"]', "supplier-tabs", "supplier-processing");
    renderAll();
  }

  function bindSyncWrappers() {
    if (window.__flowFixSyncWrapped === "1") return;
    window.__flowFixSyncWrapped = "1";

    var originalSyncOrder = window.__demoFlowSyncOrder;
    if (typeof originalSyncOrder === "function") {
      window.__demoFlowSyncOrder = function (orderId) {
        var result = originalSyncOrder.apply(this, arguments);
        [40, 140, 320].forEach(function (delay) {
          window.setTimeout(function () {
            registerSyncedOrder(orderId);
            renderAll();
          }, delay);
        });
        return result;
      };
    }

    var originalInvoiceSync = window.__demoFlowInvoiceSync;
    if (typeof originalInvoiceSync === "function") {
      window.__demoFlowInvoiceSync = function () {
        var targetOrderId = currentPrimaryDemoOrderId();
        var result = originalInvoiceSync.apply(this, arguments);
        [40, 140, 320].forEach(function (delay) {
          window.setTimeout(function () {
            registerSyncedOrder(targetOrderId || currentPrimaryDemoOrderId());
            renderAll();
          }, delay);
        });
        return result;
      };
    }

    var originalClaim = window.__demoFlowClaim;
    if (typeof originalClaim === "function") {
      window.__demoFlowClaim = function () {
        var orderId = currentPrimaryDemoOrderId();
        var result = originalClaim.apply(this, arguments);
        if (orderId && state.orders[orderId]) markClaimed(orderId);
        window.setTimeout(renderAll, 40);
        return result;
      };
    }

    var originalRuntimeResult = window.__demoFlowHandleAutoAuditResult;
    if (typeof originalRuntimeResult === "function") {
      window.__demoFlowHandleAutoAuditResult = function (orderId, outcome, payload) {
        var result = originalRuntimeResult.apply(this, arguments);
        if (orderId && state.orders[orderId]) {
          if (outcome === "pass") {
            state.orders[orderId].uploaded = true;
            state.orders[orderId].fileName = (payload && payload.fileName) || state.orders[orderId].fileName || "";
            state.orders[orderId].uploadTime = (payload && (payload.uploadTime || payload.operatorTime)) || state.orders[orderId].uploadTime || formatNow();
          } else if (outcome === "reject") {
            state.orders[orderId].rejected = true;
          } else if (outcome === "fail") {
            state.orders[orderId].reviewing = true;
          }
        }
        window.setTimeout(renderAll, 40);
        return result;
      };
    }
  }

  function bindHallClaimInterceptor() {
    if (document.body.getAttribute("data-flow-fix-demo-claim-bound") === "1") return;
    document.body.setAttribute("data-flow-fix-demo-claim-bound", "1");
    document.addEventListener("click", function (event) {
      var button = event.target.closest && event.target.closest('.flow-fix-hall-claim-btn, .demo-flow-claim-btn, .demo-flow-hall-card .demo-flow-btn');
      if (!button) return;
      event.preventDefault();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
      event.stopPropagation();
      var card = button.closest(".demo-flow-hall-card");
      var rawClaimId = button.getAttribute("data-flow-fix-claim-id") || button.getAttribute("data-hall-claim") || "";
      var orderId = (card && card.getAttribute("data-order-id")) || (/^D?\d{12,}$/.test(rawClaimId) ? rawClaimId : "") || currentPrimaryDemoOrderId() || (state.order && state.order.orderId) || "";
      if (orderId && !state.orders[orderId]) registerSyncedOrder(orderId);
      if (!orderId || !state.orders[orderId]) return;
      var remaining = Math.max(0, (state.orders[orderId].deadline || 0) - Date.now());
      if (remaining <= 0) {
        notify("该工单已超时");
        renderAll();
        return;
      }
      markClaimed(orderId);
      notify("抢单成功");
      window.setTimeout(renderAll, 40);
    }, true);
  }

  function bindTabStateCapture() {
    if (document.body.getAttribute("data-flow-fix-tab-bound") === "1") return;
    document.body.setAttribute("data-flow-fix-tab-bound", "1");
    document.addEventListener("click", function (event) {
      var supplierTab = event.target.closest && event.target.closest('.bundle-page[data-page="supplier-after-sale"] .tab-row[data-tab-group="supplier-tabs"] > .tab-btn');
      if (supplierTab) {
        window.__supplierAfterSaleRequestedTab = supplierTab.getAttribute("data-tab-target") || "";
        return;
      }
    }, true);
  }

  function bindMiniRuntimeCapture() {
    if (document.body.getAttribute("data-flow-fix-mini-bound") === "1") return;
    document.body.setAttribute("data-flow-fix-mini-bound", "1");
    document.addEventListener("click", function (event) {
      var claimButton = event.target.closest && event.target.closest(".flow-fix-mini-claim");
      if (claimButton) {
        event.preventDefault();
        if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
        event.stopPropagation();
        var claimOrderId = claimButton.getAttribute("data-runtime-mini-claim") || "";
        if (!claimOrderId || !state.orders[claimOrderId]) return;
        var remain = Math.max(0, (state.orders[claimOrderId].deadline || 0) - Date.now());
        if (remain <= 0) {
          notify("该工单已超时");
          renderAll();
          return;
        }
        markClaimed(claimOrderId);
        notify("抢单成功");
        return;
      }
      var actionButton = event.target.closest && event.target.closest(".flow-fix-mini-action");
      if (!actionButton) return;
      event.preventDefault();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
      event.stopPropagation();
      var orderId = actionButton.getAttribute("data-order-id") || "";
      var action = actionButton.getAttribute("data-flow-fix-mini-action") || "";
      if (!orderId || !state.orders[orderId]) return;
      if (action === "abandon") {
        delete state.orders[orderId];
        notify("放弃成功");
      } else if (action === "upload") {
        state.orders[orderId].claimed = false;
        state.orders[orderId].reviewing = true;
        state.orders[orderId].uploadTime = formatNow();
        notify("系统自动审核中...");
      } else if (action === "reupload") {
        state.orders[orderId].rejected = false;
        state.orders[orderId].reviewing = true;
        state.orders[orderId].uploadTime = formatNow();
        notify("重新上传成功，已进入审核中");
      } else if (action === "view-file") {
        notify("下载成功，在浏览器查看");
      }
      renderAll();
    }, true);
  }

  window.__flowFixHandleRuntimeUpload = function (row, uploadedName, uploadedAt) {
    var orderId = row && row.getAttribute("data-order-id");
    if (orderId && state.orders[orderId]) {
      state.orders[orderId].uploaded = true;
      state.orders[orderId].fileName = uploadedName || state.orders[orderId].fileName || "";
      state.orders[orderId].uploadTime = uploadedAt || state.orders[orderId].uploadTime || formatNow();
      renderAll();
    }
    notify("上传成功");
  };

  window.__flowFixHandleRuntimeAssign = function (row, supplierName) {
    var orderId = row && row.getAttribute("data-order-id");
    if (orderId) {
      markClaimed(orderId, supplierName);
    }
    notify("分配成功");
  };

  window.__flowFixHandleSupplierAbandon = function (row) {
    var orderId = row && row.getAttribute("data-order-id");
    if (orderId && state.orders[orderId]) {
      delete state.orders[orderId];
      renderAll();
    }
    if (orderId) {
      Array.prototype.forEach.call(document.querySelectorAll('[data-order-id="' + orderId + '"]'), function (node) {
        if (node && node.parentNode && node.tagName === "TR") node.remove();
      });
      Array.prototype.forEach.call(document.querySelectorAll('[data-runtime-mini-order="' + orderId + '"]'), function (node) {
        if (node && node.parentNode) node.remove();
      });
    }
    if (row && row.parentNode) row.remove();
  };

  function schedule() {
    bindSyncWrappers();
    bindHallClaimInterceptor();
    bindTabStateCapture();
    bindMiniRuntimeCapture();
    renderAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule, { once: true });
  } else {
    schedule();
  }
  window.addEventListener("load", schedule);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("hashchange", schedule);
  window.setInterval(renderAll, 1000);
})();
