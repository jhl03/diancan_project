
(function () {
  if (window.__MINI_HALL_RUNTIME_V1__) return;
  window.__MINI_HALL_RUNTIME_V1__ = true;

  var miniHallTickTimer = 0;

  function ensureMiniHallStyle() {
    if (document.getElementById("mini-hall-runtime-style")) return;
    var style = document.createElement("style");
    style.id = "mini-hall-runtime-style";
    style.textContent = [
      '.bundle-page[data-page="mini-hall"] .page-header{display:none!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;}',
      '.bundle-page[data-page="mini-hall"] .main-shell{padding-top:8px!important;}',
      '.bundle-page[data-page="mini-hall"] > .main-shell > .section.ax_default:first-of-type{top:16px!important;}',
      '.bundle-page[data-page="mini-hall"] > .main-shell > .mini-phone-shell{height:548px!important;max-width:392px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-status-bar{padding:10px 16px 0!important;font-size:11px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-scroll-area{padding:0 12px 12px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-panel{margin-top:10px!important;padding:12px!important;border-radius:20px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-panel-title{font-size:14px!important;margin-bottom:8px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-card-list{gap:10px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-order-card{padding:12px!important;border-radius:18px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-order-top{gap:8px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-order-store{font-size:15px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-order-deadline{font-size:11px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-order-content{grid-template-columns:72px minmax(0,1fr)!important;gap:10px!important;margin-top:8px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-order-thumb{width:72px!important;height:72px!important;border-radius:14px!important;font-size:12px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-order-meta{margin-top:4px!important;font-size:12px!important;line-height:1.55!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-order-actions{margin-top:10px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-order-actions .ghost-btn{height:36px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-order-actions .ghost-btn .text{font-size:13px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-hall-final-tab-wrap{padding:0 12px 10px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-hall-final-tab-scroll{gap:8px!important;padding-bottom:2px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-hall-final-tab-btn{min-height:32px!important;padding:0 12px!important;font-size:12px!important;}',
      '.bundle-page[data-page="mini-hall"] .mini-scroll-area > .mini-panel:nth-of-type(2) > .mini-panel-title{display:none!important;}'
    ].join("");
    document.head.appendChild(style);
  }

  function getMiniHallPage() {
    return document.querySelector('.bundle-page[data-page="mini-hall"]');
  }

  function miniHallEscapeHtml(text) {
    return String(text || "").replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function miniHallToastNode() {
    var node = document.querySelector(".proto-inline-toast");
    if (node) return node;
    node = document.createElement("div");
    node.className = "proto-inline-toast";
    document.body.appendChild(node);
    return node;
  }

  function miniHallShowToast(text) {
    if (typeof showToast === "function") {
      showToast(text);
      return;
    }
    var node = miniHallToastNode();
    node.textContent = text;
    node.classList.add("is-show");
    window.clearTimeout(node.__miniHallToastTimer || 0);
    node.__miniHallToastTimer = window.setTimeout(function () {
      node.classList.remove("is-show");
    }, 1600);
  }

  function parseCountdownText(text) {
    var source = String(text || "");
    var day = parseInt((source.match(/(\d+)天/) || [0, 0])[1], 10) || 0;
    var hour = parseInt((source.match(/(\d+)小时/) || [0, 0])[1], 10) || 0;
    var minute = parseInt((source.match(/(\d+)分/) || [0, 0])[1], 10) || 0;
    var second = parseInt((source.match(/(\d+)秒/) || [0, 0])[1], 10) || 0;
    return day * 24 * 3600 + hour * 3600 + minute * 60 + second;
  }

  function pad2(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function formatCountdownText(totalSeconds) {
    var safeSeconds = Math.max(0, parseInt(totalSeconds, 10) || 0);
    var day = Math.floor(safeSeconds / 86400);
    var hour = Math.floor((safeSeconds % 86400) / 3600);
    var minute = Math.floor((safeSeconds % 3600) / 60);
    var second = safeSeconds % 60;
    return day + "天" + pad2(hour) + "小时" + pad2(minute) + "分" + pad2(second) + "秒";
  }

  function getMiniHallSourceCards() {
    if (Array.isArray(window.hallCards) && window.hallCards.length) return window.hallCards;
    return [
      { id: "hall-1", store: "瑞幸-广州", countdown: "6天23小时59分59秒", product: "椰青冰萃美式", paid: "9.99", brand: "瑞幸", subsidy: "1.5" },
      { id: "hall-2", store: "霸王茶姬-深圳", countdown: "6天23小时58分20秒", product: "伯牙绝弦大杯", paid: "16.80", brand: "霸王茶姬", subsidy: "2.0" },
      { id: "hall-3", store: "肯德基-上海", countdown: "6天23小时57分08秒", product: "香辣鸡腿堡套餐", paid: "28.50", brand: "肯德基", subsidy: "2.5" },
      { id: "hall-4", store: "麦当劳-杭州", countdown: "6天23小时55分42秒", product: "巨无霸套餐", paid: "32.00", brand: "麦当劳", subsidy: "3.0" },
      { id: "hall-5", store: "喜德基-成都", countdown: "6天23小时54分31秒", product: "藤椒鸡腿堡套餐", paid: "26.90", brand: "喜德基", subsidy: "2.2" },
      { id: "hall-6", store: "塔斯汀-武汉", countdown: "6天23小时53分12秒", product: "中国汉堡双人餐", paid: "35.80", brand: "塔斯汀", subsidy: "3.2" }
    ];
  }

  function ensureMiniHallState() {
    if (window.__miniHallRuntimeState) return window.__miniHallRuntimeState;
    var sourceCards = getMiniHallSourceCards();
    window.__miniHallRuntimeState = {
      cards: sourceCards.map(function (card, index) {
        return {
          id: card.id,
          store: card.store,
          product: card.product,
          paid: card.paid,
          brand: card.brand,
          subsidy: card.subsidy,
          sortIndex: index,
          claimed: false,
          remainingSeconds: parseCountdownText(card.countdown)
        };
      })
    };
    return window.__miniHallRuntimeState;
  }

  function compareMiniHallCards(a, b) {
    var remainingDelta = (parseInt(b && b.remainingSeconds, 10) || 0) - (parseInt(a && a.remainingSeconds, 10) || 0);
    if (remainingDelta) return remainingDelta;
    return (parseInt(a && a.sortIndex, 10) || 0) - (parseInt(b && b.sortIndex, 10) || 0);
  }

  function getVisibleMiniHallCards() {
    var activeBrand = ensureMiniHallTabState().activeBrand || "全部";
    return ensureMiniHallState().cards.filter(function (card) {
      if (card.claimed) return false;
      return activeBrand === "全部" ? true : normalizeMiniHallBrand(card.brand) === activeBrand;
    }).sort(compareMiniHallCards);
  }

  function parseMiniHallMoney(value) {
    var number = parseFloat(String(value || "").replace(/[^\d.]/g, ""));
    return isFinite(number) ? number : NaN;
  }

  function claimMiniHallCardsBatch(cards) {
    var state = ensureMiniHallState();
    var runtimeSourceCards = getMiniHallSourceCards();
    var claimedCount = 0;
    window.__hallClaimedOrders = window.__hallClaimedOrders || {};
    (cards || []).forEach(function (card) {
      if (!card || card.claimed) return;
      card.claimed = true;
      claimedCount += 1;
      window.__hallClaimedOrders[card.id] = true;
      if (Array.isArray(runtimeSourceCards)) {
        var raw = runtimeSourceCards.find(function (item) { return item.id === card.id; }) || null;
        if (raw) raw.countdown = formatCountdownText(card.remainingSeconds);
      }
      if (typeof appendHallClaimToPendingLists === "function") {
        appendHallClaimToPendingLists(card.id);
      }
    });
    if (claimedCount) {
      renderMiniHallCards();
    }
    return claimedCount;
  }

  function syncMiniHallTip(page, count) {
    var tip = page.querySelector("#mini-hall-result-tip");
    if (tip) tip.textContent = "当前展示 " + count + " 条";
    var empty = page.querySelector("#mini-hall-empty-tip");
    if (empty) empty.classList.toggle("visible", count === 0);
  }

  function buildMiniHallCardHtml(card) {
    return [
      '<div class="mini-order-card order-card ax_default mini-hall-order-card" data-card-id="' + miniHallEscapeHtml(card.id) + '" data-brand="' + miniHallEscapeHtml(card.brand) + '">',
      '  <div class="mini-order-top">',
      '    <div class="mini-order-store text" spellcheck="false">' + miniHallEscapeHtml(card.store) + "</div>",
      '    <div class="mini-order-deadline text" data-mini-hall-countdown="' + miniHallEscapeHtml(card.id) + '" spellcheck="false">' + miniHallEscapeHtml(formatCountdownText(card.remainingSeconds)) + "</div>",
      "  </div>",
      '  <div class="mini-order-content">',
      '    <div class="mini-order-thumb text" spellcheck="false">商品图</div>',
      '    <div class="mini-order-detail-col">',
      '      <div class="mini-order-meta text" spellcheck="false">商品：' + miniHallEscapeHtml(card.product) + "</div>",
      '      <div class="mini-order-meta text" spellcheck="false">用户支付：' + miniHallEscapeHtml(card.paid) + "</div>",
      '      <div class="mini-order-meta text" spellcheck="false">补贴金额：<span class="mini-order-highlight">' + miniHallEscapeHtml(card.subsidy) + " 元</span></div>",
      "    </div>",
      "  </div>",
      '  <div class="mini-order-actions">',
      '    <button type="button" class="ghost-btn ax_default mini-grab-trigger" data-mini-hall-claim="' + miniHallEscapeHtml(card.id) + '" style="background:#1d4ed8;border-color:#1d4ed8;">',
      '      <div class="text" spellcheck="false" style="color:#fff;">立即抢单</div>',
      "    </button>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderMiniHallCards() {
    var page = getMiniHallPage();
    if (!page) return;
    var list = page.querySelector("#mini-hall-card-list");
    if (!list) return;
    var cards = getVisibleMiniHallCards();
    list.innerHTML = cards.map(buildMiniHallCardHtml).join("");
    syncMiniHallTip(page, cards.length);
  }

  function syncMiniHallCountdownNodes() {
    var page = getMiniHallPage();
    if (!page) return;
    var state = ensureMiniHallState();
    Array.prototype.forEach.call(page.querySelectorAll("[data-mini-hall-countdown]"), function (node) {
      var cardId = node.getAttribute("data-mini-hall-countdown") || "";
      var card = state.cards.find(function (item) { return item.id === cardId; }) || null;
      if (!card) return;
      node.textContent = formatCountdownText(card.remainingSeconds);
    });
  }

  function tickMiniHallCountdown() {
    var state = ensureMiniHallState();
    var changed = false;
    state.cards.forEach(function (card) {
      if (card.claimed || card.remainingSeconds <= 0) return;
      card.remainingSeconds -= 1;
      changed = true;
    });
    if (changed) syncMiniHallCountdownNodes();
  }

  function startMiniHallTicker() {
    if (miniHallTickTimer) return;
    miniHallTickTimer = window.setInterval(tickMiniHallCountdown, 1000);
  }

  function claimMiniHallCard(cardId) {
    var state = ensureMiniHallState();
    var card = state.cards.find(function (item) { return item.id === cardId; }) || null;
    if (!card || card.claimed) {
      miniHallShowToast("订单已被抢");
      return;
    }
    claimMiniHallCardsBatch([card]);
    miniHallShowToast("抢单成功");
  }

  function ensureMiniHallTabState() {
    if (window.__miniHallTabState) return window.__miniHallTabState;
    window.__miniHallTabState = {
      activeBrand: "全部"
    };
    return window.__miniHallTabState;
  }

  function miniHallTabBrands() {
    return ["全部", "瑞幸", "麦当劳", "肯德基", "霸王茶姬", "星巴克", "塔斯汀", "电子卡券"];
  }

  function normalizeMiniHallBrand(brand) {
    var text = String(brand || "").trim();
    return miniHallTabBrands().indexOf(text) > -1 ? text : "电子卡券";
  }

  function buildMiniHallTabHtml() {
    var state = ensureMiniHallTabState();
    return '<div class="mini-hall-final-tab-wrap"><div class="mini-hall-final-tab-scroll">' +
      miniHallTabBrands().map(function (brand) {
        var active = (state.activeBrand || "全部") === brand;
        return '<button type="button" class="mini-hall-final-tab-btn' + (active ? ' is-active' : '') + '" data-mini-hall-tab="' + miniHallEscapeHtml(brand) + '">' + miniHallEscapeHtml(brand) + '</button>';
      }).join("") +
      '</div></div>';
  }

  function ensureMiniHallTabs() {
    var page = getMiniHallPage();
    if (!page) return;
    var scrollArea = page.querySelector(".mini-scroll-area");
    var filterPanel = scrollArea && scrollArea.querySelector(".mini-panel.ax_default");
    var cardPanel = filterPanel && filterPanel.nextElementSibling;
    if (!scrollArea || !filterPanel || !cardPanel) return;
    var tabWrap = scrollArea.querySelector(".mini-hall-final-tab-wrap");
    if (!tabWrap) {
      filterPanel.insertAdjacentHTML("afterend", buildMiniHallTabHtml());
      return;
    }
    tabWrap.outerHTML = buildMiniHallTabHtml();
  }

  function bindMiniHallActions() {
    if (document.body.getAttribute("data-mini-hall-actions-bound") === "1") return;
    document.body.setAttribute("data-mini-hall-actions-bound", "1");
    document.addEventListener("click", function (event) {
      var tabButton = event.target.closest && event.target.closest("[data-mini-hall-tab]");
      if (tabButton) {
        event.preventDefault();
        event.stopPropagation();
        ensureMiniHallTabState().activeBrand = tabButton.getAttribute("data-mini-hall-tab") || "全部";
        renderMiniHallCards();
        ensureMiniHallTabs();
        return;
      }
      var claimButton = event.target.closest && event.target.closest("[data-mini-hall-claim]");
      if (!claimButton) return;
      event.preventDefault();
      event.stopPropagation();
      claimMiniHallCard(claimButton.getAttribute("data-mini-hall-claim") || "");
    }, true);
  }

  function applyMiniHallLayout() {
    var page = getMiniHallPage();
    var main = page && page.querySelector(".main-shell");
    if (!page || !main) return;
    main.style.setProperty("padding-top", "8px", "important");
    var explainSection = main.querySelector(":scope > .section.ax_default");
    if (explainSection) {
      explainSection.style.setProperty("top", "16px", "important");
    }
  }

  function initMiniHallPage() {
    ensureMiniHallStyle();
    bindMiniHallActions();
    applyMiniHallLayout();
    ensureMiniHallTabs();
    renderMiniHallCards();
    startMiniHallTicker();
  }

  function scheduleMiniHall() {
    [0, 80, 220, 500].forEach(function (delay) {
      window.setTimeout(initMiniHallPage, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleMiniHall, { once: true });
  } else {
    scheduleMiniHall();
  }
  window.addEventListener("load", scheduleMiniHall);
  window.addEventListener("pageshow", scheduleMiniHall);
  window.addEventListener("hashchange", scheduleMiniHall);
})();
