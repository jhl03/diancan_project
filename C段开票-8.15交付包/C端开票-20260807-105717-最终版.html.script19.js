
(function () {
  if (window.__FLOW_FINAL_FIX_V1__) return;
  window.__FLOW_FINAL_FIX_V1__ = true;

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

  function computeSettlementAmount(paid) {
    var value = parseFloat(String(paid || "").replace(/[^\d.]/g, ""));
    if (!isFinite(value)) return "9.98";
    return Math.max(0, value - 0.01).toFixed(2);
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

  function guessTaxNo(title) {
    var normalizedTitle = String(title || "").trim();
    var taxNoMap = {
      "可可乐乐文化传播有限公司": "91440300MAE5XXE49N",
      "深圳市可可乐乐文化传播有限公司": "91440300MAE5XXE49N",
      "肯德基企业抬头": "91310106MA1FRC9K1H",
      "杭州示例科技有限公司": "91330106MA2B1C7X9M",
      "上海样例科技有限公司": "91310000MA2F9L8X2Q"
    };
    return taxNoMap[normalizedTitle] || "-";
  }

  function showToast(text) {
    var node = document.querySelector(".proto-inline-toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "proto-inline-toast";
      document.body.appendChild(node);
    }
    node.textContent = text;
    node.classList.add("is-show");
    window.clearTimeout(window.__FLOW_FINAL_FIX_TOAST_TIMER__ || 0);
    window.__FLOW_FINAL_FIX_TOAST_TIMER__ = window.setTimeout(function () {
      node.classList.remove("is-show");
    }, 1600);
  }

  function ensureStyle() {
    if (document.getElementById("flow-final-fix-style")) return;
    var style = document.createElement("style");
    style.id = "flow-final-fix-style";
    style.textContent =
      '.hall-runtime-actions .flow-chain-repair-claim-btn,.hall-runtime-actions .flow-fix-hall-claim-btn,.hall-runtime-actions .hall-claim-btn,.hall-runtime-actions .flow-final-claim-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:72px!important;height:36px!important;padding:0 18px!important;border-radius:999px!important;border:1px solid #2563eb!important;background:#2563eb!important;color:#fff!important;font:700 14px/1 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif!important;cursor:pointer!important;box-sizing:border-box!important;}' +
      '.hall-runtime-actions .flow-chain-repair-claim-btn[disabled],.hall-runtime-actions .flow-fix-hall-claim-btn[disabled],.hall-runtime-actions .hall-claim-btn[disabled],.hall-runtime-actions .flow-final-claim-btn[disabled]{background:#94a3b8!important;border-color:#94a3b8!important;color:#fff!important;cursor:not-allowed!important;}' +
      '.flow-final-runtime-muted{color:#667085;font-size:12px;line-height:1.45;}' +
      '.flow-final-runtime-cell-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}';
    document.head.appendChild(style);
  }

  function getBuckets() {
    var buckets = [];
    if (window.__FLOW_RUNTIME_FIX_STATE__ && window.__FLOW_RUNTIME_FIX_STATE__.orders) {
      buckets.push(window.__FLOW_RUNTIME_FIX_STATE__.orders);
    }
    if (window.__flowChainRepairState && window.__flowChainRepairState.orders) {
      buckets.push(window.__flowChainRepairState.orders);
    }
    return buckets;
  }

  function collectOrders() {
    var merged = {};
    getBuckets().forEach(function (bucket) {
      Object.keys(bucket).forEach(function (key) {
        merged[key] = Object.assign({}, merged[key] || {}, bucket[key] || {});
      });
    });
    return merged;
  }

  function upsertOrder(order) {
    if (!order || !order.orderId) return null;
    var buckets = getBuckets();
    if (!buckets.length) {
      window.__flowChainRepairState = window.__flowChainRepairState || { orders: {}, activeOrderId: "" };
      buckets = [window.__flowChainRepairState.orders];
    }
    buckets.forEach(function (bucket) {
      var existing = bucket[order.orderId] || {};
      bucket[order.orderId] = Object.assign({}, existing, order);
    });
    if (window.__flowChainRepairState) {
      window.__flowChainRepairState.activeOrderId = order.orderId;
    }
    return order;
  }

  function currentPrimaryDemoOrderId() {
    var currentId = "";
    Array.prototype.some.call(document.querySelectorAll('.bundle-page[data-page="invoice"] .table-wrap tbody tr'), function (row) {
      if ((row.textContent || "").indexOf("本次演示工单") === -1) return false;
      var cells = row.querySelectorAll("td .text");
      var text = cells[3] ? cleanText(cells[3]) : cleanText(row);
      var match = text.match(/券单号：([^\/\s]+)/);
      currentId = match ? match[1].trim() : "";
      return !!currentId;
    });
    return currentId;
  }

  function findDemoOrder(orderId) {
    var demo = window.__demoFlowState;
    if (!demo || !Array.isArray(demo.orders)) return null;
    return demo.orders.find(function (item) { return item && item.orderId === orderId; }) || null;
  }

  function findInvoiceSourceRow(orderId) {
    var target = null;
    Array.prototype.some.call(document.querySelectorAll('.bundle-page[data-page="invoice"] .table-wrap tbody tr'), function (row) {
      if ((row.textContent || "").indexOf(orderId) === -1) return false;
      target = row;
      return true;
    });
    return target;
  }

  function readInvoiceMeta(orderId) {
    if (!orderId) return null;
    var row = findInvoiceSourceRow(orderId);
    var demoOrder = findDemoOrder(orderId);
    if (!row && !demoOrder) return null;
    if (!row && demoOrder) {
      var demoCreatedAt = demoOrder.createdAt || formatNow();
      var demoBrand = demoOrder.brand || ((demoOrder.store || "瑞幸-广州").split("-")[0] || "瑞幸");
      var demoTitle = demoOrder.title || "井井井";
      return {
        orderId: demoOrder.orderId,
        outOrderId: deriveOutOrderId(demoOrder.orderId),
        createdAt: demoCreatedAt,
        orderTime: demoOrder.orderTime || offsetTimeText(demoCreatedAt, -1, -7),
        product: demoOrder.product || "椰青冰萃美式",
        store: demoOrder.store || "瑞幸-广州",
        brand: demoBrand,
        paid: demoOrder.paid || "9.99",
        title: demoTitle,
        taxNo: demoOrder.taxNo || guessTaxNo(demoTitle),
        supplierName: demoOrder.supplierName || supplierNameMap[demoBrand] || "黄开良",
        supplierNo: demoOrder.supplierNo || supplierNoMap[demoBrand] || "2077283553914077185",
        subsidy: demoOrder.subsidy || subsidyMap[demoBrand] || "1.5",
        settlement: demoOrder.settlement || computeSettlementAmount(demoOrder.paid || "9.99")
      };
    }
    var cells = row.querySelectorAll("td .text");
    var paid = cleanText(cells[2]) || (demoOrder && demoOrder.paid) || "9.99";
    var orderInfo = cleanText(cells[3]);
    var invoiceInfo = cleanText(cells[4]);
    var createdAtMatch = orderInfo.match(/创建时间：([^\/]+)/);
    var storeMatch = orderInfo.match(/店铺：([^\/]+)/);
    var productMatch = orderInfo.match(/商品：([^\/]+)/);
    var titleMatch = invoiceInfo.match(/抬头：([^\/]+)/);
    var taxNoMatch = invoiceInfo.match(/税号：([^\/]+)/);
    var store = storeMatch ? storeMatch[1].trim() : ((demoOrder && demoOrder.store) || "瑞幸-广州");
    var brand = (demoOrder && demoOrder.brand) || store.split("-")[0] || "瑞幸";
    var title = titleMatch ? titleMatch[1].trim() : ((demoOrder && demoOrder.title) || "井井井");
    var taxNo = taxNoMatch ? taxNoMatch[1].trim() : ((demoOrder && demoOrder.taxNo) || guessTaxNo(title));
    var createdAt = (createdAtMatch ? createdAtMatch[1].trim() : "") || (demoOrder && demoOrder.createdAt) || formatNow();
    return {
      orderId: orderId,
      outOrderId: deriveOutOrderId(orderId),
      createdAt: createdAt,
      orderTime: (demoOrder && demoOrder.orderTime) || offsetTimeText(createdAt, -1, -7),
      product: productMatch ? productMatch[1].trim() : ((demoOrder && demoOrder.product) || "椰青冰萃美式"),
      store: store,
      brand: brand,
      paid: paid,
      title: title,
      taxNo: taxNo || "-",
      supplierName: (demoOrder && demoOrder.supplierName) || supplierNameMap[brand] || "黄开良",
      supplierNo: (demoOrder && demoOrder.supplierNo) || supplierNoMap[brand] || "2077283553914077185",
      subsidy: (demoOrder && demoOrder.subsidy) || subsidyMap[brand] || "1.5",
      settlement: (demoOrder && demoOrder.settlement) || computeSettlementAmount(paid)
    };
  }

  function ensureSyncedOrder(orderId) {
    if (!orderId) return null;
    var merged = collectOrders();
    var existing = merged[orderId] || {};
    var meta = readInvoiceMeta(orderId);
    if (!meta) return null;
    var countdownNode = document.querySelector('.bundle-page[data-page="hall"] .demo-flow-hall-card .hall-runtime-countdown');
    var countdownMs = parseCountdownText(cleanText(countdownNode));
    if (!countdownMs) countdownMs = (((1 * 24 + 23) * 60 + 59) * 60 + 59) * 1000;
    return upsertOrder(Object.assign({}, existing, meta, {
      syncedAtMs: existing.syncedAtMs || Date.now(),
      deadline: existing.deadline || (Date.now() + countdownMs),
      claimed: !!existing.claimed,
      uploaded: !!existing.uploaded,
      reviewing: !!existing.reviewing,
      rejected: !!existing.rejected,
      processingDeadline: existing.processingDeadline || 0
    }));
  }

  function ensureClaimedOrder(orderId) {
    var synced = ensureSyncedOrder(orderId);
    if (!synced) return null;
    return upsertOrder(Object.assign({}, synced, {
      claimed: true,
      uploaded: false,
      reviewing: false,
      rejected: false,
      processingDeadline: synced.processingDeadline || (Date.now() + (((1 * 24 + 23) * 60 + 59) * 60 + 59) * 1000)
    }));
  }

  function buildCopyButton(copyText, ariaLabel) {
    return '<button type="button" class="invoice-title-copy" data-copy-text="' + escapeHtml(copyText) + '" aria-label="' + escapeHtml(ariaLabel) + '">' +
      '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect x="5" y="3.5" width="7.5" height="9" rx="1.5" stroke-width="1.4"></rect>' +
      '<path d="M3.5 10.5H3C2.17157 10.5 1.5 9.82843 1.5 9V3C1.5 2.17157 2.17157 1.5 3 1.5H8C8.82843 1.5 9.5 2.17157 9.5 3V3.5" stroke-width="1.4"></path>' +
      "</svg></button>";
  }

  function buildTitleHtml(title, taxNo) {
    var safeTitle = escapeHtml(title || "-");
    var safeTaxNo = escapeHtml(taxNo || "-");
    var titleCopyButton = title ? buildCopyButton(title, "复制发票抬头") : "";
    var taxCopyButton = taxNo && taxNo !== "-" ? buildCopyButton(taxNo, "复制税号") : "";
    return '<div class="text invoice-title-stack" spellcheck="false">' +
      '<div class="invoice-title-main-row"><div class="invoice-title-main">' + safeTitle + "</div>" + titleCopyButton + "</div>" +
      '<div class="invoice-title-tax-row"><span>税号：' + safeTaxNo + "</span>" + taxCopyButton + "</div>" +
      "</div>";
  }

  function buildOrderIndex(orders) {
    var byOrderId = {};
    var byOutOrderId = {};
    Object.keys(orders).forEach(function (key) {
      var order = orders[key];
      if (!order) return;
      byOrderId[order.orderId] = order;
      if (order.outOrderId) byOutOrderId[order.outOrderId] = order;
    });
    return { byOrderId: byOrderId, byOutOrderId: byOutOrderId };
  }

  function resolveOrderFromRow(row, index) {
    if (!row || !index) return null;
    var orderId = row.getAttribute("data-order-id") || "";
    if (orderId && index.byOrderId[orderId]) return index.byOrderId[orderId];
    var firstCellText = cleanText(row.querySelector("td .text"));
    if (firstCellText && index.byOrderId[firstCellText]) return index.byOrderId[firstCellText];
    if (firstCellText && index.byOutOrderId[firstCellText]) return index.byOutOrderId[firstCellText];
    return null;
  }

  function normalizeInvoiceTitleHeaders() {
    Array.prototype.forEach.call(document.querySelectorAll('.bundle-page[data-page="invoice-request-list"] thead th .text'), function (node) {
      var text = cleanText(node);
      if (text === "发票抬头") {
        node.textContent = "发票抬头/税号";
      }
    });
  }

  function enhanceInvoiceTitleCells(pageSelector, index) {
    var page = document.querySelector(pageSelector);
    if (!page) return;
    Array.prototype.forEach.call(page.querySelectorAll(".table-wrap table"), function (table) {
      var titleIndexes = [];
      Array.prototype.forEach.call(table.querySelectorAll("thead tr:first-child th"), function (th, idx) {
        var text = cleanText(th);
        if (text.indexOf("发票抬头") > -1) {
          titleIndexes.push(idx);
        }
      });
      if (!titleIndexes.length) return;
      Array.prototype.forEach.call(table.querySelectorAll("tbody tr"), function (row) {
        titleIndexes.forEach(function (titleIndex) {
          var cells = row.querySelectorAll("td");
          var cell = cells[titleIndex];
          if (!cell) return;
          var order = resolveOrderFromRow(row, index);
          var text = cleanText(cell);
          var title = row.getAttribute("data-invoice-title") || (order && order.title) || "";
          var taxNo = row.getAttribute("data-tax-no") || (order && order.taxNo) || "";
          if (!title && text) {
            var taxSplitIndex = text.indexOf("税号：");
            title = taxSplitIndex > -1 ? text.slice(0, taxSplitIndex).trim() : text.trim();
          }
          if (!taxNo) {
            var match = text.match(/税号[:：]\s*([A-Za-z0-9\-]+)/);
            taxNo = match ? match[1].trim() : guessTaxNo(title);
          }
          if (!title) return;
          row.setAttribute("data-invoice-title", title);
          row.setAttribute("data-tax-no", taxNo || "-");
          cell.innerHTML = buildTitleHtml(title, taxNo || "-");
        });
      });
    });
  }

  function renderAfterSaleRuntime(orders) {
    var tbody = document.querySelector('.bundle-page[data-page="after-sale-list"] .tab-panel[data-tab-group="backend-status"][data-tab-panel="backend-uploaded"] .table-wrap tbody');
    if (!tbody) return;
    Array.prototype.forEach.call(tbody.querySelectorAll('tr[data-final-runtime="after-sale-uploaded"]'), function (row) {
      row.remove();
    });
    Object.keys(orders).map(function (key) {
      return orders[key];
    }).filter(function (order) {
      return !!(order && order.orderId);
    }).sort(function (a, b) {
      return (b.syncedAtMs || 0) - (a.syncedAtMs || 0);
    }).reverse().forEach(function (order) {
      Array.prototype.forEach.call(tbody.querySelectorAll('tr[data-order-id="' + order.orderId + '"]'), function (row) {
        row.remove();
      });
      if (typeof isBlockedAfterSaleRowId === "function" && isBlockedAfterSaleRowId(order.orderId)) {
        return;
      }
      var createdAt = order.createdAt || formatNow();
      var createdMs = parseDateValue(createdAt);
      tbody.insertAdjacentHTML("afterbegin", [
        '<tr data-final-runtime="after-sale-uploaded" data-order-id="' + escapeHtml(order.orderId) + '" data-after-sale-created-ts="' + escapeHtml(String(createdMs || 0)) + '">',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.outOrderId || deriveOutOrderId(order.orderId)) + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(createdAt) + "</div></td>",
        '<td data-after-sale-elapsed-cell="1"><div class="text" spellcheck="false">' + escapeHtml(createdMs ? formatElapsedDuration(Date.now() - createdMs) : "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.orderTime || offsetTimeText(createdAt, -1, -7)) + "</div></td>",
        '<td><div class="text" spellcheck="false">是</div></td>',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.product || "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.store || "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.brand || "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.paid || "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.supplierName || "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.settlement || computeSettlementAmount(order.paid || "")) + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.subsidy || "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.uploaded ? "已补贴" : "未补贴") + "</div></td>",
        '<td data-after-sale-action-cell="1"><div class="invoice-review-action-group"><button type="button" class="invoice-review-action is-primary" data-after-sale-edit-subsidy="runtime-' + escapeHtml(order.orderId) + '">修改补贴金额</button></div></td>',
        "</tr>"
      ].join(""));
    });
  }

  function getSupplierProcessingPanels() {
    return Array.prototype.slice.call(document.querySelectorAll('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-group="supplier-tabs"][data-tab-panel="supplier-processing"]'));
  }

  function getCanonicalSupplierProcessingPanel() {
    var panels = getSupplierProcessingPanels();
    if (!panels.length) return null;
    var canonical = panels.find(function (panel) {
      return !!panel.querySelector("section.table-section .table-wrap tbody");
    }) || panels[0];
    panels.forEach(function (panel) {
      if (panel === canonical) {
        panel.classList.add("active");
        panel.style.setProperty("display", "block", "important");
        panel.style.setProperty("visibility", "visible", "important");
        panel.style.setProperty("pointer-events", "auto", "important");
        panel.style.setProperty("height", "auto", "important");
        panel.style.setProperty("min-height", "0", "important");
        return;
      }
      panel.classList.remove("active");
      panel.style.setProperty("display", "none", "important");
      panel.style.setProperty("visibility", "hidden", "important");
      panel.style.setProperty("pointer-events", "none", "important");
      panel.style.setProperty("height", "0", "important");
      panel.style.setProperty("min-height", "0", "important");
      panel.style.setProperty("overflow", "hidden", "important");
    });
    return canonical;
  }

  function renderSupplierProcessingRuntime(orders) {
    var panel = getCanonicalSupplierProcessingPanel();
    if (!panel) return;
    var tbody = panel.querySelector(".table-wrap tbody");
    if (!tbody) return;
    Array.prototype.forEach.call(tbody.querySelectorAll('tr[data-final-runtime="supplier-processing"]'), function (row) {
      row.remove();
    });
    Object.keys(orders).map(function (key) {
      return orders[key];
    }).filter(function (order) {
      return !!(order && order.claimed && !order.uploaded && !order.reviewing && !order.rejected);
    }).sort(function (a, b) {
      return Math.max(0, (a.processingDeadline || 0) - Date.now()) - Math.max(0, (b.processingDeadline || 0) - Date.now());
    }).reverse().forEach(function (order) {
      Array.prototype.forEach.call(tbody.querySelectorAll('tr[data-order-id="' + order.orderId + '"]'), function (row) {
        row.remove();
      });
      var remaining = Math.max(0, (order.processingDeadline || order.deadline || 0) - Date.now());
      tbody.insertAdjacentHTML("afterbegin", [
        '<tr data-final-runtime="supplier-processing" data-order-id="' + escapeHtml(order.orderId) + '" data-invoice-title="' + escapeHtml(order.title || "-") + '" data-tax-no="' + escapeHtml(order.taxNo || "-") + '">',
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.orderId) + "</div></td>",
        '<td><div class="text" spellcheck="false"><span style="color: rgb(217, 45, 32);">' + escapeHtml(formatCountdown(remaining)) + "</span></div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.createdAt || formatNow()) + "</div></td>",
        '<td><div class="text" spellcheck="false">处理中</div></td>',
        '<td>' + buildTitleHtml(order.title || "-", order.taxNo || "-") + "</td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.paid || "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.product || "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.store || "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.brand || "-") + "</div></td>",
        '<td><div class="text" spellcheck="false">' + escapeHtml(order.subsidy || "-") + "</div></td>",
        '<td><div class="invoice-review-action-group" style="position:relative;z-index:5;pointer-events:auto;"><button type="button" class="supplier-processing-action is-primary" data-supplier-processing-row-action="upload" onclick="window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION__(event,this)">上传</button><button type="button" class="supplier-processing-action is-danger" data-supplier-processing-row-action="abandon" onclick="window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION__(event,this)">放弃</button></div></td>',
        "</tr>"
      ].join(""));
    });
  }

  function normalizeHallButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('.bundle-page[data-page="hall"] .hall-runtime-actions button'), function (button) {
      button.classList.add("flow-final-claim-btn");
      if (!cleanText(button)) button.textContent = "抢单";
    });
  }

  var finalSupplierActionState = {
    type: "",
    row: null,
    orderId: "",
    fileName: "",
    uploadTime: ""
  };

  function updateOrder(orderId, patch) {
    if (!orderId) return;
    getBuckets().forEach(function (bucket) {
      if (!bucket[orderId]) return;
      bucket[orderId] = Object.assign({}, bucket[orderId], patch || {});
    });
    if (window.__flowChainRepairState && window.__flowChainRepairState.orders[orderId]) {
      window.__flowChainRepairState.activeOrderId = orderId;
    }
  }

  function removeOrder(orderId) {
    if (!orderId) return;
    getBuckets().forEach(function (bucket) {
      if (bucket[orderId]) delete bucket[orderId];
    });
    if (window.__flowChainRepairState && window.__flowChainRepairState.activeOrderId === orderId) {
      window.__flowChainRepairState.activeOrderId = "";
    }
  }

  function ensureFinalSupplierActionStyle() {
    if (document.getElementById("flow-final-supplier-action-style")) return;
    var style = document.createElement("style");
    style.id = "flow-final-supplier-action-style";
    style.textContent =
      '.flow-final-supplier-overlay{position:fixed;inset:0;background:rgba(15,23,42,.36);display:none;align-items:center;justify-content:center;z-index:2147483400;padding:24px;}' +
      '.flow-final-supplier-overlay.is-show{display:flex;}' +
      '.flow-final-supplier-dialog{width:min(760px,calc(100vw - 40px));background:#fff;border-radius:24px;box-shadow:0 24px 60px rgba(15,23,42,.22);padding:26px 28px 22px;box-sizing:border-box;}' +
      '.flow-final-supplier-title{font:700 26px/1.2 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;color:#142033;margin:0 0 18px;}' +
      '.flow-final-supplier-copy{font:500 15px/1.65 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;color:#344054;margin-top:10px;}' +
      '.flow-final-supplier-upload{margin-top:18px;padding:18px 20px;border:1px dashed #c5d6f3;border-radius:18px;background:#f8fbff;}' +
      '.flow-final-supplier-upload-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}' +
      '.flow-final-supplier-upload-btn{display:inline-flex;align-items:center;justify-content:center;height:38px;padding:0 18px;border:none;border-radius:999px;background:#2563eb;color:#fff;font:700 14px/1 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer;}' +
      '.flow-final-supplier-upload-tip{font:500 13px/1.5 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;color:#667085;}' +
      '.flow-final-supplier-upload-meta{margin-top:14px;font:600 13px/1.6 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;color:#1d4ed8;display:none;}' +
      '.flow-final-supplier-upload-meta.is-show{display:block;}' +
      '.flow-final-supplier-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:22px;}' +
      '.flow-final-supplier-btn{display:inline-flex;align-items:center;justify-content:center;min-width:104px;height:42px;padding:0 20px;border-radius:999px;border:1px solid #d0d9e7;background:#fff;color:#344054;font:700 14px/1 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer;}' +
      '.flow-final-supplier-btn.is-primary{background:#2563eb;border-color:#2563eb;color:#fff;}' +
      '.flow-final-supplier-warning{font:600 15px/1.7 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;color:#344054;margin-top:10px;}' +
      '.flow-final-force-action-group{display:flex;flex-direction:column;gap:10px;align-items:flex-end;position:relative;z-index:2147483600;pointer-events:auto;}' +
      '.flow-final-force-btn{display:inline-flex;align-items:center;justify-content:center;min-width:72px;height:32px;padding:0 18px;border-radius:999px;border:1px solid #c7d6f4;background:#fff;color:#1d4ed8;font:700 14px/1 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer;pointer-events:auto;position:relative;z-index:2147483600;}' +
      '.flow-final-force-btn.is-primary{background:#2563eb;border-color:#2563eb;color:#fff;}' +
      '.flow-final-force-btn.is-danger{border-color:#f3b6b6;color:#e25656;background:#fff;}';
    document.head.appendChild(style);
  }

  function getFinalSupplierActionOverlay() {
    ensureFinalSupplierActionStyle();
    var overlay = document.querySelector(".flow-final-supplier-overlay");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "flow-final-supplier-overlay";
    overlay.innerHTML = [
      '<div class="flow-final-supplier-dialog">',
      '  <div class="flow-final-supplier-title"></div>',
      '  <div class="flow-final-supplier-body"></div>',
      '  <div class="flow-final-supplier-actions">',
      '    <button type="button" class="flow-final-supplier-btn" data-final-supplier-modal="cancel">取消</button>',
      '    <button type="button" class="flow-final-supplier-btn is-primary" data-final-supplier-modal="confirm">确定</button>',
      '  </div>',
      '  <input type="file" class="flow-final-supplier-file-input" accept=".pdf,.ofd,application/pdf" style="display:none;">',
      '</div>'
    ].join("");
    document.body.appendChild(overlay);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay || event.target.getAttribute("data-final-supplier-modal") === "cancel") {
        overlay.classList.remove("is-show");
        return;
      }
      if (event.target.getAttribute("data-final-supplier-modal") === "pick-file") {
        var input = overlay.querySelector(".flow-final-supplier-file-input");
        if (input) {
          input.value = "";
          input.click();
        }
        return;
      }
      if (event.target.getAttribute("data-final-supplier-modal") !== "confirm") return;
      if (!finalSupplierActionState.orderId) {
        overlay.classList.remove("is-show");
        return;
      }
      if (finalSupplierActionState.type === "abandon") {
        removeOrder(finalSupplierActionState.orderId);
        overlay.classList.remove("is-show");
        renderFinal();
        showToast("放弃成功");
        return;
      }
      if (finalSupplierActionState.type === "upload" || finalSupplierActionState.type === "reupload") {
        if (!finalSupplierActionState.fileName) {
          showToast("请先上传发票文件");
          return;
        }
        updateOrder(finalSupplierActionState.orderId, {
          claimed: false,
          reviewing: true,
          uploaded: false,
          rejected: false,
          fileName: finalSupplierActionState.fileName,
          uploadTime: finalSupplierActionState.uploadTime || formatNow()
        });
        overlay.classList.remove("is-show");
        setTab('.bundle-page[data-page="supplier-after-sale"]', "supplier-tabs", "supplier-reviewing");
        renderFinal();
        showToast(finalSupplierActionState.type === "reupload" ? "重新上传成功，已进入审核中" : "上传成功，已进入审核中");
      }
    });
    overlay.addEventListener("change", function (event) {
      if (!event.target.classList.contains("flow-final-supplier-file-input")) return;
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      var fileName = String(file.name || "");
      if (!/\.((pdf)|(ofd))$/i.test(fileName)) {
        finalSupplierActionState.fileName = "";
        finalSupplierActionState.uploadTime = "";
        syncFinalSupplierUploadMeta(overlay);
        showToast("只能上传PDF/OFD格式的文件，请重新上传");
        event.target.value = "";
        return;
      }
      if (Number(file.size || 0) > 10 * 1024 * 1024) {
        finalSupplierActionState.fileName = "";
        finalSupplierActionState.uploadTime = "";
        syncFinalSupplierUploadMeta(overlay);
        showToast("文件超过10MB，请重新上传");
        event.target.value = "";
        return;
      }
      finalSupplierActionState.fileName = fileName;
      finalSupplierActionState.uploadTime = formatNow();
      syncFinalSupplierUploadMeta(overlay);
    });
    return overlay;
  }

  function syncFinalSupplierUploadMeta(overlay) {
    var meta = overlay && overlay.querySelector(".flow-final-supplier-upload-meta");
    if (!meta) return;
    if (!finalSupplierActionState.fileName) {
      meta.classList.remove("is-show");
      meta.innerHTML = "";
      return;
    }
    meta.classList.add("is-show");
    meta.innerHTML =
      '<div>' + escapeHtml(finalSupplierActionState.fileName) + '</div>' +
      '<div>上传时间：' + escapeHtml(finalSupplierActionState.uploadTime || "-") + '</div>';
  }

  function openFinalSupplierActionModal(type, row) {
    var overlay = getFinalSupplierActionOverlay();
    var title = overlay.querySelector(".flow-final-supplier-title");
    var body = overlay.querySelector(".flow-final-supplier-body");
    if (!title || !body) return;
    var order = row ? resolveOrderFromRow(row, buildOrderIndex(collectOrders())) : null;
    var rowCells = row ? row.querySelectorAll("td .text") : [];
    var fallbackRowOrderId = row ? (row.getAttribute("data-order-id") || (rowCells[0] ? cleanText(rowCells[0]) : "")) : "";
    var fallbackPaid = rowCells[5] ? cleanText(rowCells[5]) : (rowCells[4] ? cleanText(rowCells[4]) : "-");
    var fallbackTitle = row ? (row.getAttribute("data-invoice-title") || (rowCells[4] ? cleanText(rowCells[4]) : "-")) : "-";
    var fallbackTaxNo = row ? (row.getAttribute("data-tax-no") || "-") : "-";
    finalSupplierActionState.type = type;
    finalSupplierActionState.row = row || null;
    finalSupplierActionState.orderId = (order && order.orderId) || fallbackRowOrderId || "";
    finalSupplierActionState.fileName = "";
    finalSupplierActionState.uploadTime = "";
    if (type === "upload" || type === "reupload") {
      title.textContent = type === "reupload" ? "重新上传" : "上传发票";
      body.innerHTML = [
        '<div class="flow-final-supplier-copy">发票抬头：' + escapeHtml((order && order.title) || fallbackTitle || "-") + '</div>',
        '<div class="flow-final-supplier-copy">税号：' + escapeHtml((order && order.taxNo) || fallbackTaxNo || "-") + '</div>',
        '<div class="flow-final-supplier-copy">开票金额：' + escapeHtml((order && order.paid) || fallbackPaid || "-") + '</div>',
        '<div class="flow-final-supplier-upload">',
        '  <div class="flow-final-supplier-upload-row">',
        '    <div class="flow-final-supplier-copy">* 上传发票</div>',
        '    <button type="button" class="flow-final-supplier-upload-btn" data-final-supplier-modal="pick-file">上传PDF/OFD格式文件</button>',
        '    <div class="flow-final-supplier-upload-tip">（不超过10MB）</div>',
        '  </div>',
        '  <div class="flow-final-supplier-upload-meta"></div>',
        '</div>'
      ].join("");
      syncFinalSupplierUploadMeta(overlay);
    } else {
      title.textContent = "放弃开票";
      body.innerHTML =
        '<div class="flow-final-supplier-warning">确定放弃对该订单开票吗？</div>' +
        '<div class="flow-final-supplier-warning">放弃后，该订单将在该列表消失。</div>';
    }
    overlay.classList.add("is-show");
  }

  function invokeFinalSupplierRowAction(button) {
    if (!button) return false;
    var action = button.getAttribute("data-supplier-processing-row-action") || button.getAttribute("data-force-row-action");
    if (!action) return false;
    openFinalSupplierActionModal(action, button.closest("tr"));
    return false;
  }

  window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION__ = function (event, button) {
    if (event) {
      if (typeof event.preventDefault === "function") event.preventDefault();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
      if (typeof event.stopPropagation === "function") event.stopPropagation();
    }
    return invokeFinalSupplierRowAction(button);
  };

  window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION_DIRECT__ = function (button) {
    return invokeFinalSupplierRowAction(button);
  };

  window.__FLOW_FINAL_FORCE_SUPPLIER_ACTION__ = function (button) {
    return invokeFinalSupplierRowAction(button);
  };

  function bindFinalSupplierProcessingActions() {
    if (document.body.getAttribute("data-flow-final-supplier-actions-bound") === "1") return;
    document.body.setAttribute("data-flow-final-supplier-actions-bound", "1");
    function closestElement(node, selector) {
      var current = node;
      while (current) {
        if (current.matches && current.matches(selector)) return current;
        current = current.parentElement || current.parentNode;
      }
      return null;
    }
    window.addEventListener("click", function (event) {
      var button = closestElement(event.target, '.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-panel="supplier-processing"] .supplier-processing-action');
      if (!button) {
        button = closestElement(event.target, '.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-panel="supplier-processing"] .flow-final-force-btn');
      }
      if (!button) return;
      if (button.classList.contains("hall-claim-btn")) return;
      var action = button.getAttribute("data-supplier-processing-row-action") || button.getAttribute("data-force-row-action");
      if (!action) return;
      event.preventDefault();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
      event.stopPropagation();
      openFinalSupplierActionModal(action, button.closest("tr"));
    }, true);
  }

  function forceSupplierProcessingActionCells() {
    var panel = getCanonicalSupplierProcessingPanel();
    if (!panel) return;
    Array.prototype.forEach.call(panel.querySelectorAll(".table-wrap table"), function (table) {
      var actionIndex = -1;
      Array.prototype.forEach.call(table.querySelectorAll("thead tr:first-child th"), function (th, idx) {
        if (actionIndex !== -1) return;
        if (cleanText(th).indexOf("操作") > -1) actionIndex = idx;
      });
      if (actionIndex === -1) return;
      Array.prototype.forEach.call(table.querySelectorAll("tbody tr"), function (row) {
        var cells = row.querySelectorAll("td");
        var cell = cells[actionIndex];
        if (!cell) return;
        if (!row.getAttribute("data-order-id")) {
          var firstText = row.querySelector("td .text");
          if (firstText) row.setAttribute("data-order-id", cleanText(firstText));
        }
        cell.style.setProperty("position", "relative", "important");
        cell.style.setProperty("z-index", "2147483500", "important");
        cell.style.setProperty("pointer-events", "auto", "important");
        row.style.setProperty("position", "relative", "important");
        row.style.setProperty("z-index", "2147483400", "important");
        cell.innerHTML =
          '<div class="flow-final-force-action-group">' +
          '<button type="button" class="flow-final-force-btn is-primary" data-force-row-action="upload" onclick="return window.__FLOW_FINAL_FORCE_SUPPLIER_ACTION__(this)">上传</button>' +
          '<button type="button" class="flow-final-force-btn is-danger" data-force-row-action="abandon" onclick="return window.__FLOW_FINAL_FORCE_SUPPLIER_ACTION__(this)">放弃</button>' +
          '</div>';
      });
    });
  }

  function wireSupplierProcessingButtons() {
    var panel = getCanonicalSupplierProcessingPanel();
    if (!panel) return;
    Array.prototype.forEach.call(panel.querySelectorAll('.supplier-processing-action[data-supplier-processing-row-action]'), function (button) {
      if (button.classList.contains("hall-claim-btn")) return;
      button.setAttribute("onclick", "return window.__FLOW_FINAL_HANDLE_SUPPLIER_ROW_ACTION_DIRECT__(this)");
      button.style.setProperty("position", "relative", "important");
      button.style.setProperty("z-index", "2147483600", "important");
      button.style.setProperty("pointer-events", "auto", "important");
      var group = button.closest(".invoice-review-action-group");
      if (group) {
        group.style.setProperty("position", "relative", "important");
        group.style.setProperty("z-index", "2147483600", "important");
        group.style.setProperty("pointer-events", "auto", "important");
      }
      var cell = button.closest("td");
      if (cell) {
        cell.style.setProperty("position", "relative", "important");
        cell.style.setProperty("z-index", "2147483500", "important");
        cell.style.setProperty("pointer-events", "auto", "important");
      }
      var row = button.closest("tr");
      if (row) {
        row.style.setProperty("position", "relative", "important");
        row.style.setProperty("z-index", "2147483400", "important");
      }
    });
  }

  function ensureSupplierProcessingFilterHost(panel, filterSection) {
    if (!panel || !filterSection) return null;
    var host = filterSection.querySelector(".flow-final-supplier-filter-host");
    if (!host) {
      host = document.createElement("div");
      host.className = "flow-final-supplier-filter-host";
      filterSection.appendChild(host);
    }
    host.style.setProperty("display", "grid", "important");
    host.style.setProperty("grid-template-columns", "minmax(0,1.15fr) minmax(0,1.15fr) 280px 140px 140px", "important");
    host.style.setProperty("gap", "14px", "important");
    host.style.setProperty("align-items", "end", "important");
    host.style.setProperty("margin-top", "10px", "important");
    host.style.setProperty("width", "100%", "important");
    host.style.setProperty("box-sizing", "border-box", "important");
    var detached = [];
    Array.prototype.forEach.call(panel.children, function (child) {
      if (!child || child === filterSection) return;
      var isFieldCard = child.classList && child.classList.contains("field-card") && child.classList.contains("ax_default");
      var isSelect = child.id === "codex_added_7";
      var isButton = child.id === "codex_added_13" || child.id === "codex_added_14";
      if (isFieldCard || isSelect || isButton) detached.push(child);
    });
    detached.forEach(function (node) {
      node.style.setProperty("position", "relative", "important");
      node.style.setProperty("left", "auto", "important");
      node.style.setProperty("top", "auto", "important");
      node.style.setProperty("margin", "0", "important");
      node.style.setProperty("max-width", "none", "important");
      node.style.setProperty("min-width", "0", "important");
      node.style.setProperty("z-index", "auto", "important");
      if (node.id === "codex_added_13" || node.id === "codex_added_14") {
        node.style.setProperty("width", "140px", "important");
        node.style.setProperty("height", "40px", "important");
        node.style.setProperty("display", "flex", "important");
        node.style.setProperty("align-items", "center", "important");
        node.style.setProperty("justify-content", "center", "important");
      } else if (node.id === "codex_added_7") {
        node.style.setProperty("width", "280px", "important");
        node.style.setProperty("height", "92px", "important");
      } else {
        node.style.setProperty("width", "100%", "important");
        node.style.setProperty("height", "92px", "important");
      }
      if (node.parentNode !== host) host.appendChild(node);
    });
    return host;
  }

  function stabilizeSupplierProcessingLayout() {
    var panel = getCanonicalSupplierProcessingPanel();
    if (!panel) return;
    var filterSection = panel.querySelector('section[data-codex-layout-source-id="codex_pinned_208"]') || panel.querySelector("section.section.ax_default");
    var tableSection = panel.querySelector('section.table-section[data-codex-layout-source-id="codex_pinned_207"]') || panel.querySelector("section.table-section");
    var filterProxy = panel.querySelector('[data-codex-layout-proxy="true"][data-codex-layout-source-id="codex_pinned_208"]');
    var tableProxy = panel.querySelector('[data-codex-layout-proxy="true"][data-codex-layout-source-id="codex_pinned_207"]');
    var tableWrap = tableSection && tableSection.querySelector(".table-wrap");
    var table = tableWrap && tableWrap.querySelector("table");
    var desc = panel.querySelector('.proto-desc-card[data-desc-key="supplier-processing"]') || panel.querySelector('.supplier-static-desc');
    var imageBlock = panel.querySelector("#codex_added_59");
    panel.style.setProperty("position", "relative", "important");
    panel.style.setProperty("display", "block", "important");
    if (filterProxy) {
      filterProxy.style.setProperty("display", "none", "important");
      filterProxy.style.setProperty("height", "0", "important");
      filterProxy.style.setProperty("min-height", "0", "important");
      filterProxy.style.setProperty("margin", "0", "important");
      filterProxy.style.setProperty("padding", "0", "important");
      filterProxy.style.setProperty("border", "0", "important");
    }
    if (tableProxy) {
      tableProxy.style.setProperty("display", "none", "important");
      tableProxy.style.setProperty("height", "0", "important");
      tableProxy.style.setProperty("min-height", "0", "important");
      tableProxy.style.setProperty("margin", "0", "important");
      tableProxy.style.setProperty("padding", "0", "important");
      tableProxy.style.setProperty("border", "0", "important");
    }
    if (filterSection) {
      filterSection.style.setProperty("position", "relative", "important");
      filterSection.style.setProperty("left", "auto", "important");
      filterSection.style.setProperty("top", "auto", "important");
      filterSection.style.setProperty("width", "100%", "important");
      filterSection.style.setProperty("max-width", "none", "important");
      filterSection.style.setProperty("height", "auto", "important");
      filterSection.style.setProperty("min-height", "0", "important");
      filterSection.style.setProperty("margin", "0 0 2px 0", "important");
      filterSection.style.setProperty("padding-bottom", "4px", "important");
      filterSection.style.setProperty("overflow", "visible", "important");
      filterSection.style.setProperty("z-index", "auto", "important");
      ensureSupplierProcessingFilterHost(panel, filterSection);
    }
    if (tableSection) {
      tableSection.style.setProperty("position", "relative", "important");
      tableSection.style.setProperty("left", "auto", "important");
      tableSection.style.setProperty("top", "auto", "important");
      tableSection.style.setProperty("width", "100%", "important");
      tableSection.style.setProperty("max-width", "none", "important");
      tableSection.style.setProperty("height", "auto", "important");
      tableSection.style.setProperty("overflow", "visible", "important");
      tableSection.style.setProperty("margin-top", "0", "important");
      tableSection.style.setProperty("pointer-events", "auto", "important");
    }
    if (tableWrap) {
      var desiredWrapHeight = Math.max(
        240,
        Math.min(
          Math.max(
            table ? (table.scrollHeight || 0) : 0,
            tableWrap.scrollHeight || 0
          ) + 12,
          520
        )
      );
      tableWrap.style.setProperty("height", desiredWrapHeight + "px", "important");
      tableWrap.style.setProperty("max-height", desiredWrapHeight + "px", "important");
      tableWrap.style.setProperty("min-height", desiredWrapHeight + "px", "important");
      tableWrap.style.setProperty("overflow-y", "auto", "important");
      tableWrap.style.setProperty("overflow-x", "auto", "important");
      tableWrap.style.setProperty("margin-top", "6px", "important");
      tableWrap.style.setProperty("pointer-events", "auto", "important");
      if (tableSection) {
        tableSection.style.setProperty("min-height", desiredWrapHeight + 92 + "px", "important");
      }
    }
    ["codex_added_105", "codex_added_108", "codex_added_113"].forEach(function (id) {
      var target = panel.querySelector("#" + id);
      if (target) target.style.setProperty("display", "none", "important");
    });
    Array.prototype.forEach.call(panel.children, function (child) {
      if (!child || child === filterSection || child === tableSection || child === desc || child === imageBlock) return;
      if (child.classList && child.classList.contains("codex-layout-placeholder")) {
        child.style.setProperty("display", "none", "important");
        child.style.setProperty("height", "0", "important");
        child.style.setProperty("min-height", "0", "important");
        child.style.setProperty("margin", "0", "important");
        return;
      }
      var top = parseFloat(child.style.top);
      var isModal = child.classList && child.classList.contains("modal-card");
      var isModalGrid = child.classList && child.classList.contains("modal-grid");
      if (isModal || (!isNaN(top) && top >= 650)) {
        child.style.setProperty("display", "none", "important");
        child.style.setProperty("pointer-events", "none", "important");
      }
      if (isModalGrid) {
        child.style.setProperty("display", "none", "important");
        child.style.setProperty("pointer-events", "none", "important");
      }
    });
    if (filterSection && tableSection && filterSection.nextElementSibling !== tableSection) {
      filterSection.insertAdjacentElement("afterend", tableSection);
    }
    if (desc) {
      desc.style.setProperty("display", "block", "important");
      desc.style.setProperty("position", "relative", "important");
      desc.style.setProperty("left", "auto", "important");
      desc.style.setProperty("top", "auto", "important");
      desc.style.setProperty("width", "100%", "important");
      desc.style.setProperty("max-width", "none", "important");
      desc.style.setProperty("margin-top", "10px", "important");
      desc.style.setProperty("z-index", "auto", "important");
      if (tableSection && tableSection.nextElementSibling !== desc) {
        tableSection.insertAdjacentElement("afterend", desc);
      }
    }
    if (imageBlock && desc) {
      imageBlock.style.setProperty("display", "block", "important");
      imageBlock.style.setProperty("position", "relative", "important");
      imageBlock.style.setProperty("left", "auto", "important");
      imageBlock.style.setProperty("top", "auto", "important");
      imageBlock.style.setProperty("margin", "14px 0 0 0", "important");
      imageBlock.style.setProperty("z-index", "auto", "important");
      if (imageBlock.parentNode !== desc) desc.appendChild(imageBlock);
    }
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

  function renderFinal() {
    ensureStyle();
    var orders = collectOrders();
    var index = buildOrderIndex(orders);
    normalizeInvoiceTitleHeaders();
    normalizeHallButtons();
    renderAfterSaleRuntime(orders);
    renderSupplierProcessingRuntime(orders);
    enhanceInvoiceTitleCells('.bundle-page[data-page="invoice-request-list"]', index);
    enhanceInvoiceTitleCells('.bundle-page[data-page="supplier-after-sale"]', index);
    enhanceInvoiceTitleCells('.bundle-page[data-page="after-sale-list"]', index);
    stabilizeSupplierProcessingLayout();
    forceSupplierProcessingActionCells();
    wireSupplierProcessingButtons();
  }

  function handleSync(orderId) {
    var order = ensureSyncedOrder(orderId);
    if (!order) return;
    renderFinal();
  }

  function handleClaim(orderId) {
    var order = ensureClaimedOrder(orderId);
    if (!order) return;
    setTab('.bundle-page[data-page="invoice-request-list"]', "invoice-request-list__backend-status", "backend-processing");
    setTab('.bundle-page[data-page="supplier-after-sale"]', "supplier-tabs", "supplier-processing");
    renderFinal();
  }

  function extractOrderIdFromInvoiceButton(button) {
    var row = button && button.closest("tr");
    if (!row) return "";
    var cells = row.querySelectorAll("td .text");
    var text = cells[3] ? cleanText(cells[3]) : cleanText(row);
    var match = text.match(/券单号：([^\/\s]+)/);
    return match ? match[1].trim() : "";
  }

  function extractOrderIdFromClaimButton(button) {
    var card = button && button.closest(".demo-flow-hall-card, .hall-runtime-card");
    var orderId = (card && card.getAttribute("data-order-id")) || button.getAttribute("data-order-id") || button.getAttribute("data-flow-fix-claim-id") || button.getAttribute("data-hall-claim") || "";
    if (/^D?\d{12,}$/.test(orderId)) return orderId;
    return currentPrimaryDemoOrderId() || "";
  }

  function bindCapture() {
    if (document.body.getAttribute("data-flow-final-fix-bound") === "1") return;
    document.body.setAttribute("data-flow-final-fix-bound", "1");
    document.addEventListener("click", function (event) {
      var syncButton = event.target.closest && event.target.closest('.bundle-page[data-page="invoice"] .demo-flow-btn');
      if (syncButton) {
        var syncText = cleanText(syncButton);
        if (syncText.indexOf("同步到后台") > -1 || syncText.indexOf("已同步到后台") > -1) {
          var syncOrderId = extractOrderIdFromInvoiceButton(syncButton);
          if (syncOrderId) {
            window.setTimeout(function () {
              handleSync(syncOrderId);
            }, 160);
          }
          return;
        }
      }
      var claimButton = event.target.closest && event.target.closest('.flow-chain-repair-claim-btn, .flow-fix-hall-claim-btn, .hall-claim-btn, .demo-flow-hall-card .demo-flow-btn');
      if (!claimButton) return;
      var claimOrderId = extractOrderIdFromClaimButton(claimButton);
      if (!claimOrderId) return;
      window.setTimeout(function () {
        handleClaim(claimOrderId);
      }, 120);
    }, true);
  }

  var renderTimer = 0;
  function queueRender(delay) {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(renderFinal, typeof delay === "number" ? delay : 80);
  }

  function bindMutationObserver() {
    if (window.__FLOW_FINAL_FIX_OBSERVER__) return;
    if (!document.body) return;
    window.__FLOW_FINAL_FIX_OBSERVER__ = new MutationObserver(function () {
      queueRender(40);
    });
    window.__FLOW_FINAL_FIX_OBSERVER__.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-order-id", "data-tax-no", "data-invoice-title"]
    });
  }

  function schedule() {
    bindCapture();
    bindFinalSupplierProcessingActions();
    bindMutationObserver();
    [0, 100, 260, 600].forEach(function (delay) {
      window.setTimeout(renderFinal, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule, { once: true });
  } else {
    schedule();
  }
  window.addEventListener("load", schedule);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("hashchange", function () {
    queueRender(80);
  });
  window.addEventListener("focus", function () {
    queueRender(60);
  });

  window.__FLOW_FINAL_FIX_SELF_CHECK__ = function () {
    var orders = collectOrders();
    var orderIds = Object.keys(orders);
    var supplierRows = document.querySelectorAll('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-panel="supplier-processing"] tbody tr[data-final-runtime="supplier-processing"]').length;
    var afterSaleRows = document.querySelectorAll('.bundle-page[data-page="after-sale-list"] .tab-panel[data-tab-panel="backend-uploaded"] tbody tr[data-final-runtime="after-sale-uploaded"]').length;
    var titleHeaders = Array.prototype.map.call(document.querySelectorAll('.bundle-page[data-page="invoice-request-list"] thead th .text'), function (node) {
      return cleanText(node);
    }).filter(function (text) {
      return text.indexOf("发票抬头") > -1;
    });
    var titleCopyButtons = document.querySelectorAll('.bundle-page[data-page="invoice-request-list"] .invoice-title-copy').length;
    return {
      orderCount: orderIds.length,
      orderIds: orderIds,
      supplierProcessingRuntimeRows: supplierRows,
      afterSaleRuntimeRows: afterSaleRows,
      invoiceTitleHeaders: titleHeaders,
      invoiceCopyButtons: titleCopyButtons,
      supplierActionBound: document.body.getAttribute("data-flow-final-supplier-actions-bound") === "1",
      supplierDescPresent: !!document.querySelector('.bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-panel="supplier-processing"] .proto-desc-card[data-desc-key="supplier-processing"], .bundle-page[data-page="supplier-after-sale"] .tab-panel[data-tab-panel="supplier-processing"] .supplier-static-desc')
    };
  };
})();
