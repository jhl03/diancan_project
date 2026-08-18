
(function () {
  if (window.__FLOW_CHAIN_REPAIR_V1__) return;
  window.__FLOW_CHAIN_REPAIR_V1__ = true;

  var state = window.__flowChainRepairState || (window.__flowChainRepairState = { orders: {}, activeOrderId: "" });

  function cleanText(node) {
    return node ? String(node.textContent || "").replace(/\s+/g, " ").trim() : "";
  }

  function escapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function pad2(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function formatNow(date) {
    var current = date || new Date();
    return [
      current.getFullYear(),
      pad2(current.getMonth() + 1),
      pad2(current.getDate())
    ].join("-") + " " + [pad2(current.getHours()), pad2(current.getMinutes()), pad2(current.getSeconds())].join(":");
  }

  function offsetTimeText(baseText, dayOffset, minuteOffset) {
    var normalized = String(baseText || "").trim().replace(/-/g, "/");
    var date = normalized ? new Date(normalized) : new Date();
    if (!date || isNaN(date.getTime())) date = new Date();
    if (dayOffset) date.setDate(date.getDate() + dayOffset);
    if (minuteOffset) date.setMinutes(date.getMinutes() + minuteOffset);
    return formatNow(date);
  }

  function deriveOutOrderId(orderId) {
    var digits = String(orderId || "").replace(/\D/g, "");
    if (!digits) return "-";
    if (digits.indexOf("2078") === 0) return digits;
    return "2078" + (digits.length > 12 ? digits.slice(-12) : digits);
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
    return [days + "天", hours + "小时", minutes + "分", seconds + "秒"].join("");
  }

  function toast(text) {
    var node = document.querySelector(".proto-inline-toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "proto-inline-toast";
      document.body.appendChild(node);
    }
    node.textContent = text;
    node.classList.add("is-show");
    window.clearTimeout(window.__flowChainRepairToastTimer || 0);
    window.__flowChainRepairToastTimer = window.setTimeout(function () {
      node.classList.remove("is-show");
    }, 1600);
  }

  function setTab(pageSelector, groupName, panelName) {
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

  function findDemoFlowOrder(orderId) {
    var demo = window.__demoFlowState;
    if (!demo || !Array.isArray(demo.orders)) return null;
    return demo.orders.find(function (item) { return item && item.orderId === orderId; }) || null;
  }

  function currentPrimaryDemoOrderId() {
    var currentId = "";
    Array.prototype.some.call(document.querySelectorAll('.bundle-page[data-page="invoice"] .table-wrap tbody tr'), function (row) {
      if ((row.textContent || "").indexOf("本次演示工单") === -1) return false;
      var match = cleanText(row.querySelectorAll("td .text")[3]).match(/券单号：([^\/\s]+)/);
      currentId = match ? match[1].trim() : "";
      return !!currentId;
    });
    return currentId || state.activeOrderId || "";
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

  function setInvoiceRowSyncState(row, stateText) {
    if (!row || !stateText) return;
    var firstCell = row.querySelector("td:first-child .text");
    if (!firstCell) return;
    Array.prototype.forEach.call(firstCell.querySelectorAll(".flow-chain-sync-state, .demo-flow-sync-state"), function (node) {
      node.remove();
    });
    firstCell.insertAdjacentHTML("beforeend", '<div class="flow-chain-sync-state"><span style="color:#d92d20;">' + escapeHtml(stateText) + "</span></div>");
    Array.prototype.forEach.call(row.querySelectorAll("button"), function (button) {
      var text = cleanText(button);
      if (text.indexOf("同步到后台") === -1 && text.indexOf("已同步到后台") === -1) return;
      if (stateText === "同步成功") {
        button.setAttribute("disabled", "disabled");
        button.textContent = "已同步到后台";
      } else {
        button.removeAttribute("disabled");
        button.textContent = "同步到后台";
      }
    });
  }

  function readInvoiceOrderMeta(orderId) {
    var row = findInvoiceRow(orderId);
    var demoOrder = findDemoFlowOrder(orderId);
    if (!row && !demoOrder) return null;
    if (!row && demoOrder) {
      var demoCreatedAt = demoOrder.createdAt || formatNow();
      return {
        orderId: demoOrder.orderId,
        outOrderId: deriveOutOrderId(demoOrder.orderId),
        createdAt: demoCreatedAt,
        orderTime: demoOrder.orderTime || offsetTimeText(demoCreatedAt, -1, -7),
        product: demoOrder.product || "椰青冰萃美式",
        store: demoOrder.store || "瑞幸-广州",
        brand: demoOrder.brand || "瑞幸",
        paid: demoOrder.paid || "9.99",
        title: demoOrder.title || "井井井",
        taxNo: demoOrder.taxNo || "-",
        supplierName: demoOrder.supplierName || "黄开良",
        supplierNo: demoOrder.supplierNo || "2077283553914077185",
        subsidy: demoOrder.subsidy || "1.5"
      };
    }
    var cells = row.querySelectorAll("td .text");
    var paid = cleanText(cells[2]) || "9.99";
    var orderInfo = cleanText(cells[3]);
    var invoiceInfo = cleanText(cells[4]);
    var storeMatch = orderInfo.match(/店铺：([^\/]+)/);
    var productMatch = orderInfo.match(/商品：([^\/]+)/);
    var titleMatch = invoiceInfo.match(/抬头：([^\/]+)/);
    var taxNoMatch = invoiceInfo.match(/税号：([^\/]+)/);
    var store = storeMatch ? storeMatch[1].trim() : "瑞幸-广州";
    var brand = store.split("-")[0] || "瑞幸";
    var title = titleMatch ? titleMatch[1].trim() : "井井井";
    var taxNo = taxNoMatch ? taxNoMatch[1].trim() : "-";
    var createdAt = formatNow();
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
      supplierName: brand === "霸王茶姬" ? "苏雨茶" : (brand === "肯德基" ? "王小河" : (brand === "麦当劳" ? "陈安宁" : "黄开良")),
      supplierNo: brand === "霸王茶姬" ? "2077283553914077992" : (brand === "肯德基" ? "2077283553914081126" : (brand === "麦当劳" ? "2077283553914082210" : "2077283553914077185")),
      subsidy: brand === "霸王茶姬" ? "2.0" : (brand === "肯德基" ? "2.5" : (brand === "麦当劳" ? "3.0" : "1.5"))
    };
  }

  function registerOrder(orderId) {
    if (!orderId) return null;
    var row = findInvoiceRow(orderId);
    var demoOrder = findDemoFlowOrder(orderId);
    if (demoOrder && demoOrder.syncMode === "fail") return null;
    var meta = readInvoiceOrderMeta(orderId);
    if (!meta) return null;
    var countdownText = "";
    var demoHallCard = document.querySelector(".demo-flow-hall-card .hall-runtime-countdown");
    if (demoHallCard) countdownText = cleanText(demoHallCard);
    if (!countdownText && demoOrder) countdownText = demoOrder.countdown || "";
    var countdownMs = parseCountdownText(countdownText);
    if (!countdownMs) countdownMs = (((1 * 24 + 23) * 60 + 59) * 60 + 59) * 1000;
    var existing = state.orders[orderId] || {};
    state.orders[orderId] = Object.assign(existing, meta, {
      deadline: existing.deadline || (Date.now() + countdownMs),
      claimed: !!existing.claimed,
      uploaded: !!existing.uploaded,
      reviewing: !!existing.reviewing,
      rejected: !!existing.rejected,
      processingDeadline: existing.processingDeadline || 0,
      syncedAtMs: existing.syncedAtMs || Date.now()
    });
    state.activeOrderId = orderId;
    if (row) setInvoiceRowSyncState(row, "同步成功");
    if (demoOrder && window.__demoFlowState) {
      demoOrder.syncState = "success";
      window.__demoFlowState.order = demoOrder;
      window.__demoFlowState.synced = true;
      window.__demoFlowState.claimed = !!state.orders[orderId].claimed;
    }
    return state.orders[orderId];
  }

  function buildTitleHtml(title, taxNo) {
    return '<div class="text invoice-title-stack" spellcheck="false"><div class="invoice-title-main-row"><div class="invoice-title-main">' + escapeHtml(title || "-") + '</div></div><div class="invoice-title-tax-row"><span>税号：' + escapeHtml(taxNo || "-") + "</span></div></div>";
  }

  function pendingBody() {
    return document.querySelector('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-pending"] .table-wrap tbody');
  }

  function processingBody() {
    return document.querySelector('.bundle-page[data-page="invoice-request-list"] .tab-panel[data-tab-group="invoice-request-list__backend-status"][data-tab-panel="backend-processing"] .table-wrap tbody');
  }

  function renderPending() {
    var tbody = pendingBody();
    if (!tbody) return;
    if (!tbody.dataset.flowChainRepairOriginalHtml) tbody.dataset.flowChainRepairOriginalHtml = tbody.innerHTML;
    var rows = Object.keys(state.orders).map(function (key) { return state.orders[key]; }).filter(function (order) {
      return order && !order.claimed && !order.uploaded && !order.reviewing && !order.rejected;
    });
    if (!rows.length) {
      tbody.innerHTML = tbody.dataset.flowChainRepairOriginalHtml;
      return;
    }
    rows.sort(function (a, b) {
      return Math.max(0, (a.deadline || 0) - Date.now()) - Math.max(0, (b.deadline || 0) - Date.now());
    });
    tbody.innerHTML = rows.map(function (order) {
      var remaining = Math.max(0, (order.deadline || 0) - Date.now());
      var expired = remaining <= 0;
      var actionHtml = expired
        ? '<div class="invoice-review-action-group"><button type="button" class="invoice-review-action" data-timeout-action="assign">分配</button><button type="button" class="invoice-review-action is-primary" data-timeout-action="upload">上传</button></div>'
        : '<div class="text" spellcheck="false"><br></div>';
      return [
        '<tr data-flow-chain-runtime="pending" data-order-id="' + escapeHtml(order.orderId) + '">',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.outOrderId || order.orderId) + '</div></td>',
        '<td><div class="text" spellcheck="false"><span style="color:#d92d20;">' + escapeHtml(expired ? "倒计时结束" : formatCountdown(remaining)) + '</span></div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + '</div></td>',
        '<td><div class="text" spellcheck="false">待处理</div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.product) + '</div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + '</div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
        '<td>' + buildTitleHtml(order.title, order.taxNo) + '</td>',
        '<td>' + actionHtml + '</td>',
        '</tr>'
      ].join("");
    }).join("") + tbody.dataset.flowChainRepairOriginalHtml;
  }

  function renderProcessing() {
    var tbody = processingBody();
    if (!tbody) return;
    if (!tbody.dataset.flowChainRepairOriginalHtml) tbody.dataset.flowChainRepairOriginalHtml = tbody.innerHTML;
    var rows = Object.keys(state.orders).map(function (key) { return state.orders[key]; }).filter(function (order) {
      return order && order.claimed && !order.uploaded && !order.reviewing && !order.rejected;
    });
    if (!rows.length) {
      tbody.innerHTML = tbody.dataset.flowChainRepairOriginalHtml;
      return;
    }
    rows.sort(function (a, b) {
      return Math.max(0, (a.processingDeadline || 0) - Date.now()) - Math.max(0, (b.processingDeadline || 0) - Date.now());
    });
    tbody.innerHTML = rows.map(function (order) {
      var remaining = Math.max(0, (order.processingDeadline || 0) - Date.now());
      return [
        '<tr data-flow-chain-runtime="processing" data-order-id="' + escapeHtml(order.orderId) + '">',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.outOrderId || order.orderId) + '</div></td>',
        '<td><div class="text" spellcheck="false"><span style="color:#d92d20;">' + escapeHtml(remaining <= 0 ? "倒计时结束" : formatCountdown(remaining)) + '</span></div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt) + '</div></td>',
        '<td><div class="text" spellcheck="false">处理中</div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.product) + '</div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.brand) + '</div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.paid) + '</div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.supplierNo) + '</div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.title) + '</div></td>',
        '</tr>'
      ].join("");
    }).join("") + tbody.dataset.flowChainRepairOriginalHtml;
  }

  function renderHall() {
    var hallPage = document.querySelector('.bundle-page[data-page="hall"]');
    if (hallPage && hallPage.getAttribute("data-final-hall-built") === "1") return;
    var grid = hallPage && hallPage.querySelector(".hall-runtime-card-grid");
    if (!grid) return;
    Array.prototype.forEach.call(grid.querySelectorAll(".flow-chain-repair-card, .demo-flow-hall-card"), function (node) {
      node.remove();
    });
    var order = Object.keys(state.orders).map(function (key) { return state.orders[key]; }).filter(function (item) {
      return item && !item.claimed && !item.uploaded && !item.reviewing && !item.rejected;
    }).sort(function (a, b) {
      return (b.syncedAtMs || 0) - (a.syncedAtMs || 0);
    })[0];
    if (!order) return;
    var remaining = Math.max(0, (order.deadline || 0) - Date.now());
    var disabled = remaining <= 0;
    var wrapper = document.createElement("div");
    wrapper.className = "hall-runtime-card demo-flow-hall-card flow-chain-repair-card";
    wrapper.setAttribute("data-order-id", order.orderId);
    wrapper.innerHTML =
      '<div class="hall-runtime-head"><div class="hall-runtime-title">' + escapeHtml(order.store) + '<span class="demo-flow-tag">本次演示工单</span></div><div class="hall-runtime-countdown">' + escapeHtml(disabled ? "倒计时结束" : formatCountdown(remaining)) + '</div></div>' +
      '<div class="hall-runtime-body"><div class="hall-runtime-image">商品图</div><div class="hall-runtime-meta"><div class="hall-runtime-sub">' + escapeHtml(order.product) + '</div><div class="hall-runtime-sub">用户支付：' + escapeHtml(order.paid) + '</div><div class="hall-runtime-sub">' + escapeHtml(order.brand) + '</div><div class="hall-runtime-sub is-accent">补贴：' + escapeHtml(order.subsidy) + '</div></div></div>' +
      '<div class="hall-runtime-actions"><button type="button" class="demo-flow-btn is-primary flow-chain-repair-claim-btn" data-order-id="' + escapeHtml(order.orderId) + '"' + (disabled ? ' disabled="disabled"' : '') + ' style="' + (disabled ? 'background:#94a3b8;border-color:#94a3b8;color:#fff;cursor:not-allowed;' : 'background:#2563eb;border-color:#2563eb;color:#fff;') + '">' + (disabled ? '已超时' : '抢单') + '</button></div>';
    grid.insertBefore(wrapper, grid.firstChild);
  }

  function renderAll() {
    renderPending();
    renderProcessing();
    renderHall();
  }

  function handleSync(button) {
    var row = button && button.closest("tr");
    if (!row) return;
    var text = cleanText(row.querySelectorAll("td .text")[3]);
    var match = text.match(/券单号：([^\/\s]+)/);
    var orderId = match ? match[1].trim() : "";
    if (!orderId) return;
    var demoOrder = findDemoFlowOrder(orderId);
    if (demoOrder && demoOrder.syncMode === "fail") {
      setInvoiceRowSyncState(row, "同步失败");
      toast("失败原因：XXXX");
      return;
    }
    registerOrder(orderId);
    setTab('.bundle-page[data-page="invoice-request-list"]', "invoice-request-list__backend-status", "backend-pending");
    renderAll();
    toast("同步成功");
  }

  function markClaimed(orderId) {
    var order = state.orders[orderId];
    if (!order) return;
    order.claimed = true;
    if (!order.processingDeadline) {
      order.processingDeadline = Date.now() + (((1 * 24 + 23) * 60 + 59) * 60 + 59) * 1000;
    }
    var demoOrder = findDemoFlowOrder(orderId);
    if (demoOrder && window.__demoFlowState) {
      demoOrder.syncState = "success";
      window.__demoFlowState.order = demoOrder;
      window.__demoFlowState.synced = true;
      window.__demoFlowState.claimed = true;
    }
    setTab('.bundle-page[data-page="invoice-request-list"]', "invoice-request-list__backend-status", "backend-processing");
    setTab('.bundle-page[data-page="supplier-after-sale"]', "supplier-tabs", "supplier-processing");
    renderAll();
  }

  function bindSyncCapture() {
    if (document.body.getAttribute("data-flow-chain-sync-bound") === "1") return;
    document.body.setAttribute("data-flow-chain-sync-bound", "1");
    document.addEventListener("click", function (event) {
      var button = event.target.closest && event.target.closest('.bundle-page[data-page="invoice"] .demo-flow-btn');
      if (!button) return;
      var text = cleanText(button);
      if (text.indexOf("同步到后台") === -1 && text.indexOf("已同步到后台") === -1) return;
      event.preventDefault();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
      event.stopPropagation();
      button.removeAttribute("onclick");
      handleSync(button);
    }, true);
  }

  function bindClaimCapture() {
    if (document.body.getAttribute("data-flow-chain-claim-bound") === "1") return;
    document.body.setAttribute("data-flow-chain-claim-bound", "1");
    document.addEventListener("click", function (event) {
      var button = event.target.closest && event.target.closest('.flow-chain-repair-claim-btn, .demo-flow-hall-card .demo-flow-btn, .demo-flow-hall-card .demo-flow-claim-btn');
      if (!button) return;
      event.preventDefault();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
      event.stopPropagation();
      button.removeAttribute("onclick");
      var card = button.closest(".demo-flow-hall-card");
      var orderId = (card && card.getAttribute("data-order-id")) || button.getAttribute("data-order-id") || currentPrimaryDemoOrderId() || state.activeOrderId || "";
      if (orderId && !state.orders[orderId]) registerOrder(orderId);
      if (!orderId || !state.orders[orderId]) return;
      var remaining = Math.max(0, (state.orders[orderId].deadline || 0) - Date.now());
      if (remaining <= 0) {
        toast("该工单已超时");
        renderAll();
        return;
      }
      markClaimed(orderId);
      toast("抢单成功");
    }, true);
  }

  function schedule() {
    bindSyncCapture();
    bindClaimCapture();
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
