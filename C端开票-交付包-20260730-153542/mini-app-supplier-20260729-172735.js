(function () {
  var hallRuntime = (window.__MINI_HALL_RUNTIME__ = window.__MINI_HALL_RUNTIME__ || {
    brands: ["瑞幸", "星巴克", "霸王茶姬", "肯德基", "麦当劳", "塔斯汀"],
    selectedBrands: [],
    dropdownOpen: false,
    grabbedCardIds: []
  });

  var afterSaleRuntime = (window.__MINI_AFTER_SALE_RUNTIME__ = window.__MINI_AFTER_SALE_RUNTIME__ || {
    previousPage: "mini-my",
    currentOrderId: "after-1",
    currentTab: "processing",
    currentAction: "",
    uploadHost: "",
    abandonHost: "",
    chatHost: "",
    fileHost: "",
    selectedChatId: "",
    uploadProgressHost: "",
    uploadProgressValue: 0,
    uploadProgressTimer: null,
    orders: [
      {
        id: "after-1",
        status: "processing",
        brand: "瑞幸",
        store: "瑞幸-广州",
        product: "椰青冰萃美式",
        pay: "9.99",
        subsidy: "1.5 元",
        orderNo: "6928014816062569567",
        deadline: "1天23小时59分59秒",
        invoiceTitle: "深圳市可可乐乐文化传播有限公司",
        taxNo: "91440300MAE5XXE49N",
        uploadedFile: null,
        rejectReason: "",
        removed: false
      },
      {
        id: "after-2",
        status: "processing",
        brand: "霸王茶姬",
        store: "霸王茶姬-深圳",
        product: "伯牙绝弦大杯",
        pay: "18.00",
        subsidy: "2.0 元",
        orderNo: "6928014816062569701",
        deadline: "2天11小时08分08秒",
        invoiceTitle: "霸王茶姬（深圳）餐饮管理有限公司",
        taxNo: "91440300SZ888888",
        uploadedFile: null,
        rejectReason: "",
        removed: false
      },
      {
        id: "after-3",
        status: "reviewing",
        brand: "星巴克",
        store: "星巴克-上海",
        product: "冰美式",
        pay: "16.00",
        subsidy: "1.0 元",
        orderNo: "6928014816062569722",
        deadline: "",
        invoiceTitle: "星巴克（上海）餐饮有限公司",
        taxNo: "91310000SH666666",
        uploadedFile: {
          name: "invoice_starbucks_20260729.pdf",
          time: "2026-07-29 10:15:22",
          chat: "星巴克售后群"
        },
        rejectReason: "",
        removed: false
      },
      {
        id: "after-4",
        status: "timeout",
        brand: "肯德基",
        store: "肯德基-杭州",
        product: "香辣鸡腿堡",
        pay: "24.00",
        subsidy: "2.5 元",
        orderNo: "6928014816062569733",
        deadline: "00天08小时21分15秒",
        invoiceTitle: "杭州百胜餐饮有限公司",
        taxNo: "91330000HZ777777",
        uploadedFile: {
          name: "invoice_kfc_20260726.pdf",
          time: "2026-07-26 09:38:20",
          chat: "肯德基工单沟通群"
        },
        rejectReason: "",
        removed: false
      },
      {
        id: "after-5",
        status: "rejected",
        brand: "麦当劳",
        store: "麦当劳-北京",
        product: "双层吉士堡",
        pay: "22.00",
        subsidy: "1.8 元",
        orderNo: "6928014816062569744",
        deadline: "",
        invoiceTitle: "北京金拱门食品有限公司",
        taxNo: "91110000BJ999999",
        uploadedFile: {
          name: "invoice_reject_20260728.pdf",
          time: "2026-07-28 18:28:08",
          chat: "麦当劳补贴单群"
        },
        rejectReason: "驳回原因：发票抬头与税号不匹配，请核对后重新上传清晰文件。",
        removed: false
      },
      {
        id: "after-6",
        status: "uploaded",
        brand: "塔斯汀",
        store: "塔斯汀-武汉",
        product: "香辣鸡腿中国汉堡",
        pay: "19.90",
        subsidy: "1.2 元",
        orderNo: "6928014816062569755",
        deadline: "",
        invoiceTitle: "武汉塔斯汀餐饮有限公司",
        taxNo: "91420100WH555555",
        uploadedFile: {
          name: "invoice_upload_20260729.pdf",
          time: "2026-07-29 14:08:11",
          chat: "塔斯汀售后群"
        },
        rejectReason: "",
        removed: false
      }
    ],
    chats: [
      {
        id: "chat-luckin",
        name: "瑞幸售后群",
        desc: "最近上传 2 个文件",
        files: [
          { name: "invoice_luckin_20260729.pdf", time: "2026-07-29 16:18:05" },
          { name: "invoice_luckin_20260728.ofd", time: "2026-07-28 18:05:14" }
        ]
      },
      {
        id: "chat-chagee",
        name: "霸王茶姬补贴群",
        desc: "最近上传 2 个文件",
        files: [
          { name: "invoice_chagee_20260729.pdf", time: "2026-07-29 15:42:10" },
          { name: "invoice_chagee_20260727.pdf", time: "2026-07-27 12:08:46" }
        ]
      },
      {
        id: "chat-kfc",
        name: "肯德基工单沟通群",
        desc: "最近上传 2 个文件",
        files: [
          { name: "invoice_kfc_20260729.ofd", time: "2026-07-29 11:21:45" },
          { name: "invoice_kfc_20260726.pdf", time: "2026-07-26 09:38:20" }
        ]
      }
    ]
  });

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function createNodeFromHtml(html) {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();
    return wrapper.firstElementChild;
  }

  function showBundlePage(name) {
    if (typeof window.__CODEx_BUNDLE_SHOW_PAGE === "function") {
      window.__CODEx_BUNDLE_SHOW_PAGE(name, true);
      return;
    }

    var base = document.getElementById("base");
    if (!base) return;
    Array.prototype.forEach.call(base.querySelectorAll(".bundle-page"), function (page) {
      page.classList.toggle("active", page.getAttribute("data-page") === name);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".bundle-catalog-link[data-page]"), function (link) {
      link.classList.toggle("active", link.getAttribute("data-page") === name);
    });
    location.hash = name;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function upsertBundlePage(pageName, html) {
    var base = document.getElementById("base");
    if (!base) return;
    var existing = base.querySelector('.bundle-page[data-page="' + pageName + '"]');
    var nextNode = createNodeFromHtml(html);
    if (existing) {
      existing.replaceWith(nextNode);
    } else {
      base.appendChild(nextNode);
    }
  }

  function ensureSupplierMiniCatalog() {
    var catalog = document.getElementById("bundle-catalog");
    if (!catalog) return;

    var supplierGroup = Array.prototype.find.call(catalog.querySelectorAll(".bundle-catalog-group"), function (group) {
      var summary = group.querySelector("summary");
      return summary && summary.textContent.indexOf("供应商端") >= 0;
    });
    if (!supplierGroup) return;

    var summary = supplierGroup.querySelector("summary");
    if (summary) summary.textContent = "供应商端【PC&小程序】";

    Array.prototype.forEach.call(
      supplierGroup.querySelectorAll('.bundle-catalog-link[data-page="mini-hall"], .bundle-catalog-link[data-page="mini-my"], .bundle-catalog-link[data-page="mini-after-sale"]'),
      function (link) {
        link.remove();
      }
    );

    var settlementLink = supplierGroup.querySelector('.bundle-catalog-link[data-page="settlement"]');
    if (!settlementLink) return;
    settlementLink.insertAdjacentHTML(
      "afterend",
      '<button type="button" class="bundle-catalog-link" data-page="mini-hall">接单大厅（小程序版）</button>' +
        '<button type="button" class="bundle-catalog-link" data-page="mini-my">我的（小程序版）</button>' +
        '<button type="button" class="bundle-catalog-link" data-page="mini-after-sale">售后补贴单（小程序版）</button>'
    );
  }

  function renderPhonePage(title, subtitle, noteItems, phoneHtml, pageName) {
    return (
      '<section class="bundle-page" data-page="' +
      pageName +
      '" aria-label="' +
      escapeHtml(title) +
      '"><main class="main-shell">' +
      '<header class="page-header ax_default"><h1 class="text" spellcheck="false">' +
      escapeHtml(title) +
      '</h1><p class="text" spellcheck="false">' +
      escapeHtml(subtitle) +
      '</p></header>' +
      '<section class="section ax_default"><div class="section-title text" spellcheck="false">页面说明</div><ul class="note-list text" spellcheck="false">' +
      noteItems
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("") +
      "</ul></section>" +
      phoneHtml +
      "</main></section>"
    );
  }

  function hallPageHtml() {
    var phoneHtml =
      '<div class="mini-phone-shell ax_default">' +
      renderStatusBar() +
      '<div class="mini-scroll-area">' +
      '<section class="mini-panel ax_default">' +
      '<div class="mini-panel-title text" spellcheck="false">筛选区</div>' +
      '<div class="mini-search-filter-wrap">' +
      '<div class="mini-search-filter-row">' +
      '<div class="mini-search-shell ax_default">' +
      '<span class="mini-search-icon" aria-hidden="true"></span>' +
      '<div class="mini-search-placeholder text" spellcheck="false">搜索商品名称</div>' +
      '</div>' +
      '<button type="button" class="ghost-btn ax_default mini-search-submit"><div class="text" spellcheck="false">搜索</div></button>' +
      '<button type="button" class="ghost-btn ax_default mini-filter-trigger" aria-expanded="false" aria-label="筛选品牌"></button>' +
      "</div>" +
      '<div class="mini-selected-brand-row" id="mini-hall-selected-brand-row">' +
      '<div class="mini-selected-brand-label text" spellcheck="false">已选品牌</div>' +
      '<div class="mini-selected-brand-text text" id="mini-hall-selected-brand-text" spellcheck="false">全部品牌</div>' +
      "</div>" +
      '<div class="mini-search-result-tip text" id="mini-hall-result-tip" spellcheck="false">当前展示 2 条</div>' +
      '<div class="mini-brand-popover" id="mini-hall-brand-popover">' +
      '<div class="mini-brand-popover-title text" spellcheck="false">选择品牌（多选）</div>' +
      '<div class="mini-brand-options" id="mini-hall-brand-options"></div>' +
      '<div class="mini-brand-popover-actions">' +
      '<button type="button" class="ghost-btn ax_default mini-brand-reset"><div class="text" spellcheck="false">清空</div></button>' +
      '<button type="button" class="ghost-btn ax_default mini-brand-done"><div class="text" spellcheck="false">完成</div></button>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</section>" +
      '<section class="mini-panel ax_default">' +
      '<div class="mini-panel-title text" spellcheck="false">待抢单列表</div>' +
      '<div class="mini-card-list" id="mini-hall-card-list">' +
      hallOrderCardHtml({
        id: "luckin-1",
        brand: "瑞幸",
        store: "瑞幸-广州",
        product: "椰青冰萃美式",
        pay: "9.99",
        subsidy: "1.5 元",
        deadline: "6天23小时59分"
      }) +
      hallOrderCardHtml({
        id: "chagee-1",
        brand: "霸王茶姬",
        store: "霸王茶姬-深圳",
        product: "伯牙绝弦大杯",
        pay: "18.00",
        subsidy: "2.0 元",
        deadline: "2天11小时08分"
      }) +
      "</div>" +
      '<div class="mini-empty-tip text" id="mini-hall-empty-tip" spellcheck="false">暂无匹配商品</div>' +
      "</section>" +
      renderBottomNav("接单大厅") +
      "</div>" +
      "</div>";

    return renderPhonePage(
      "接单大厅（小程序版）",
      "纯代码重建：沿用 PC 端接单大厅的核心字段与筛选逻辑，转为小程序卡片式原型。",
      ["新增入口：接单大厅。", "所有字段的数据源与 PC 端对应页面保持一致。"],
      phoneHtml,
      "mini-hall"
    );
  }

  function myPageHtml() {
    var phoneHtml =
      '<div class="mini-phone-shell mini-my-shell ax_default">' +
      renderStatusBar() +
      '<div class="mini-my-hero">' +
      '<div class="mini-my-avatar text" spellcheck="false">头像</div>' +
      '<div class="mini-my-greet text" spellcheck="false">hi，亲爱的用户</div>' +
      "</div>" +
      '<section class="mini-panel ax_default">' +
      '<div class="mini-panel-title text" spellcheck="false">账户余额</div>' +
      '<div class="mini-wallet-amount text" spellcheck="false">0</div>' +
      '<div class="mini-balance-grid">' +
      miniFieldCard("可提现金额（元）", "0") +
      miniFieldCard("冻结金额（元）", "0") +
      "</div>" +
      '<div class="mini-balance-actions">' +
      '<div class="ghost-btn ax_default" style="background:#3b82f6;border-color:#3b82f6;"><div class="text" spellcheck="false" style="color:#fff;">立即提现</div></div>' +
      '<div class="ghost-btn ax_default"><div class="text" spellcheck="false">提现记录</div></div>' +
      "</div>" +
      "</section>" +
      '<section class="mini-entry-panel ax_default">' +
      '<div class="mini-entry-panel-title text" spellcheck="false">待处理订单</div>' +
      '<div class="mini-entry-grid">' +
      '<button type="button" class="ghost-btn ax_default mini-my-entry mini-entry-card">' +
      '<div class="mini-entry-card-visual">' +
      '<div class="mini-entry-icon text" spellcheck="false">占位图</div>' +
      '<div class="mini-entry-title text" spellcheck="false">售后补贴单</div>' +
      "</div>" +
      "</button>" +
      "</div>" +
      "</section>" +
      '<section class="mini-panel ax_default mini-exit-row"><div class="text" spellcheck="false">退出登录</div><div class="text" spellcheck="false">›</div></section>' +
      "</div>";

    return renderPhonePage(
      "我的（小程序版）",
      "纯代码重建：在小程序“我的”页新增售后补贴单入口，并可跳转到补贴单列表。",
      ["待处理订单区域为新增区域。", "点击“售后补贴单”入口进入补贴单列表页面。"],
      phoneHtml,
      "mini-my"
    );
  }

  function afterSaleListPageHtml() {
    var phoneHtml =
      '<div class="mini-phone-shell ax_default">' +
      renderStatusBar() +
      '<div class="mini-scroll-area">' +
      '<div class="mini-page-backbar">' +
      '<button type="button" class="mini-page-back-trigger mini-after-sale-list-back" aria-label="返回上一页">‹</button>' +
      '<div class="mini-page-back-title text" spellcheck="false">售后补贴单</div>' +
      "</div>" +
      '<section class="mini-panel ax_default">' +
      '<div class="tab-row mini-after-sale-tab-row" data-tab-group="mini-after-sale-tabs">' +
      miniTabButton("mini-processing", "处理中", true) +
      miniTabButton("mini-reviewing", "审核中", false) +
      miniTabButton("mini-timeout", "超时未上传", false) +
      miniTabButton("mini-rejected", "已驳回", false) +
      miniTabButton("mini-uploaded", "已上传", false) +
      "</div>" +
      '<div class="tab-panel active" data-tab-group="mini-after-sale-tabs" data-tab-panel="mini-processing"><div class="mini-after-sale-card-grid" id="mini-after-sale-processing-list"></div></div>' +
      '<div class="tab-panel" data-tab-group="mini-after-sale-tabs" data-tab-panel="mini-reviewing"><div class="mini-after-sale-card-grid" id="mini-after-sale-reviewing-list"></div></div>' +
      '<div class="tab-panel" data-tab-group="mini-after-sale-tabs" data-tab-panel="mini-timeout"><div class="mini-after-sale-card-grid" id="mini-after-sale-timeout-list"></div></div>' +
      '<div class="tab-panel" data-tab-group="mini-after-sale-tabs" data-tab-panel="mini-rejected"><div class="mini-after-sale-card-grid" id="mini-after-sale-rejected-list"></div></div>' +
      '<div class="tab-panel" data-tab-group="mini-after-sale-tabs" data-tab-panel="mini-uploaded"><div class="mini-after-sale-card-grid" id="mini-after-sale-uploaded-list"></div></div>' +
      "</section>" +
      renderUploadModal("list") +
      renderAbandonModal("list") +
      renderChatModal("list") +
      renderFileModal("list") +
      "</div>" +
      "</div>";

    return renderPhonePage(
      "售后补贴单（小程序版）",
      "纯代码重建：小程序端售后补贴单沿用供应商 PC 端售后单结构，并补充移动端弹窗交互。",
      [
        "内容与供应商 PC 端售后单保持一致，保留处理中、审核中、超时未上传、已驳回、已上传 Tab。",
        "只有点击商品图区域进入详情页；上传、重新上传、放弃按钮直接在列表内处理。",
        "上传、重新上传与放弃弹层均限制在小程序边框内显示。",
        "上传弹窗：点击“选择微信对话文件”按钮，调出微信对话窗口；点击某一个对话后可以看到该对话窗口的所有文件，点击文件后显示上传进度条，上传后文件进入审核中列表【系统自动审核文件】。"
      ],
      phoneHtml,
      "mini-after-sale"
    );
  }

  function afterSaleDetailPageHtml() {
    var phoneHtml =
      '<div class="mini-phone-shell ax_default">' +
      renderStatusBar() +
      '<div class="mini-scroll-area">' +
      '<section class="mini-panel ax_default">' +
      '<div class="mini-detail-toolbar">' +
      '<button type="button" class="mini-page-back-trigger mini-after-sale-back" aria-label="返回上一页">‹</button>' +
      '<div class="mini-detail-title text" spellcheck="false">补贴单详情</div>' +
      "</div>" +
      '<div class="mini-detail-timer-top text" id="mini-after-sale-detail-timer" spellcheck="false">1天23小时59分59秒</div>' +
      '<div class="mini-detail-summary mini-grid-1">' +
      miniFieldCard("订单号", '<span id="mini-after-sale-detail-order-no">-</span>') +
      miniFieldCard("商品品牌", '<span id="mini-after-sale-detail-brand">-</span>') +
      '<div class="mini-grid-2">' +
      miniFieldCard("用户支付", '<span id="mini-after-sale-detail-pay">-</span>') +
      miniFieldCard("补贴金额", '<span id="mini-after-sale-detail-subsidy">-</span>') +
      "</div>" +
      '<div class="mini-grid-2">' +
      miniFieldCard("发票抬头", '<span id="mini-after-sale-detail-invoice-title">-</span>') +
      miniFieldCard("税号", '<span id="mini-after-sale-detail-tax-no">-</span>') +
      "</div>" +
      "</div>" +
      "</section>" +
      '<section class="mini-panel ax_default mini-detail-reason-panel" id="mini-after-sale-detail-reason-panel" style="display:none;">' +
      '<div class="mini-panel-title text" spellcheck="false">驳回原因</div>' +
      '<div class="mini-field-card ax_default"><div class="mini-field-value text" id="mini-after-sale-detail-reason-text" spellcheck="false">-</div></div>' +
      "</section>" +
      '<section class="mini-panel ax_default">' +
      '<div class="mini-panel-title text" spellcheck="false">操作区</div>' +
      '<div class="mini-detail-actions compact" id="mini-after-sale-detail-actions"></div>' +
      "</section>" +
      "</div>" +
      renderUploadModal("detail") +
      renderAbandonModal("detail") +
      renderChatModal("detail") +
      renderFileModal("detail") +
      "</div>";

    return renderPhonePage(
      "售后补贴单详情（小程序版）",
      "纯代码重建：详情页承接列表跳转，并在移动端内完成上传、重新上传与放弃交互。",
      [
        "点击“选择微信对话文件”后，先弹出微信对话框选择层；选中对话框后，再展示该对话框内全部文件。",
        "选中文件后，在“上传发票”字段下回显文件链接与上传时间，并支持点击删除图标移除已选文件。",
        "重新上传会用新文件替换旧文件；这是与 PC 端不同的移动端交互。",
        "点击“提交”后，订单进入“审核中”Tab，列表页与详情页状态同步更新。"
      ],
      phoneHtml,
      "mini-after-sale-detail"
    );
  }

  function miniFieldCard(label, valueHtml) {
    return (
      '<div class="mini-field-card ax_default"><div class="mini-field-label text" spellcheck="false">' +
      label +
      '</div><div class="mini-field-value text" spellcheck="false">' +
      valueHtml +
      "</div></div>"
    );
  }

  function miniTabButton(target, label, active) {
    return (
      '<button class="tab-btn ax_default' +
      (active ? " active" : "") +
      '" data-tab-target="' +
      target +
      '"><span class="text" spellcheck="false">' +
      label +
      "</span></button>"
    );
  }

  function renderStatusBar() {
    return (
      '<div class="mini-status-bar"><div class="text" spellcheck="false">09:41</div><div class="text" spellcheck="false">供应商小程序</div><div class="text" spellcheck="false">5G 100%</div></div>'
    );
  }

  function renderBottomNav(activeText) {
    var items = ["首页", "工作台", "订单", "接单大厅", "我的"];
    return (
      '<div class="mini-bottom-nav ax_default">' +
      items
        .map(function (item) {
          return (
            '<div class="mini-nav-item' +
            (item === activeText ? " active" : "") +
            '"><div class="mini-nav-dot"></div><div class="text" spellcheck="false">' +
            item +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function hallOrderCardHtml(card) {
    var grabbed = hallRuntime.grabbedCardIds.indexOf(card.id) >= 0;
    var buttonLabel = grabbed ? "已抢单" : "立即抢单";
    return (
      '<div class="mini-order-card order-card ax_default mini-hall-order-card' +
      (grabbed ? " grabbed" : "") +
      '" data-card-id="' +
      card.id +
      '" data-brand="' +
      escapeHtml(card.brand) +
      '">' +
      '<div class="mini-order-top"><div class="mini-order-store text" spellcheck="false">' +
      escapeHtml(card.store) +
      '</div><div class="mini-order-deadline text" spellcheck="false">' +
      escapeHtml(card.deadline) +
      "</div></div>" +
      '<div class="mini-order-content">' +
      '<div class="mini-order-thumb text" spellcheck="false">商品图</div>' +
      '<div class="mini-order-detail-col">' +
      '<div class="mini-order-meta text" spellcheck="false">商品：' +
      escapeHtml(card.product) +
      "</div>" +
      '<div class="mini-order-meta text" spellcheck="false">用户支付：' +
      escapeHtml(card.pay) +
      "</div>" +
      '<div class="mini-order-meta text" spellcheck="false">补贴金额：<span class="mini-order-highlight">' +
      escapeHtml(card.subsidy) +
      "</span></div>" +
      "</div>" +
      "</div>" +
      '<div class="mini-order-actions"><div class="ghost-btn ax_default mini-grab-trigger' +
      (grabbed ? " grabbed" : "") +
      '" style="background:#1d4ed8;border-color:#1d4ed8;"><div class="text" spellcheck="false" style="color:#fff;">' +
      buttonLabel +
      "</div></div></div>" +
      "</div>"
    );
  }

  function renderUploadModal(host) {
    return (
      '<div class="mini-inline-modal" data-mini-modal="upload" data-host="' +
      host +
      '">' +
      '<div class="mini-inline-modal-mask" data-host="' +
      host +
      '"></div>' +
      '<div class="mini-inline-modal-card ax_default">' +
      '<div class="mini-inline-modal-head">' +
      '<div class="mini-inline-modal-title text" data-upload-title="' +
      host +
      '" spellcheck="false">上传发票</div>' +
      '<button type="button" class="mini-modal-close-x mini-after-sale-upload-close" data-host="' +
      host +
      '" aria-label="关闭">×</button>' +
      "</div>" +
      '<div class="mini-upload-echo">' +
      '<div class="mini-grid-2">' +
      miniFieldCard("发票抬头", '<span data-upload-invoice-title="' + host + '">-</span>') +
      miniFieldCard("税号", '<span data-upload-tax-no="' + host + '">-</span>') +
      "</div>" +
      '<div class="mini-grid-1">' +
      miniFieldCard("用户支付", '<span data-upload-pay="' + host + '">-</span>') +
      "</div>" +
      '<div class="mini-field-card ax_default">' +
      '<div class="mini-field-label text" spellcheck="false">上传发票</div>' +
      '<div class="mini-file-link-row">' +
      '<button type="button" class="mini-upload-file-trigger" data-host="' +
      host +
      '">选择微信对话文件</button>' +
      '<span class="mini-upload-file-note text" spellcheck="false">（大小不超过10MB）</span>' +
      "</div>" +
      '<div class="mini-upload-progress" data-upload-progress-host="' +
      host +
      '" style="display:none;"><div class="mini-upload-progress-bar"><div class="mini-upload-progress-fill" data-upload-progress-fill="' +
      host +
      '" style="width:0%;"></div></div><div class="mini-upload-progress-text text" data-upload-progress-text="' +
      host +
      '" spellcheck="false">上传中 0%</div></div>' +
      '<div class="mini-uploaded-file-line" data-file-line-host="' +
      host +
      '"></div>' +
      "</div>" +
      "</div>" +
      '<div class="mini-detail-actions compact" style="margin-top:14px;">' +
      '<button type="button" class="ghost-btn ax_default mini-after-sale-upload-close" data-host="' +
      host +
      '"><div class="text" spellcheck="false">取消</div></button>' +
      '<button type="button" class="ghost-btn ax_default mini-after-sale-upload-submit" data-host="' +
      host +
      '" style="background:#1d4ed8;border-color:#1d4ed8;"><div class="text" spellcheck="false" style="color:#fff;">提交</div></button>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderAbandonModal(host) {
    return (
      '<div class="mini-inline-modal" data-mini-modal="abandon" data-host="' +
      host +
      '">' +
      '<div class="mini-inline-modal-mask" data-host="' +
      host +
      '"></div>' +
      '<div class="mini-inline-modal-card ax_default">' +
      '<div class="mini-inline-modal-head">' +
      '<div class="mini-inline-modal-title text" spellcheck="false">放弃开票</div>' +
      '<button type="button" class="mini-modal-close-x mini-after-sale-abandon-close" data-host="' +
      host +
      '" aria-label="关闭">×</button>' +
      "</div>" +
      '<div class="mini-field-card ax_default"><div class="mini-field-value mini-abandon-message text" spellcheck="false">确定放弃对该订单开票吗？<br>放弃后，该订单将在该列表消失。</div></div>' +
      '<div class="mini-detail-actions compact" style="margin-top:14px;">' +
      '<button type="button" class="ghost-btn ax_default mini-after-sale-abandon-close" data-host="' +
      host +
      '"><div class="text" spellcheck="false">取消</div></button>' +
      '<button type="button" class="ghost-btn ax_default mini-after-sale-abandon-submit" data-host="' +
      host +
      '" style="background:#dc2626;border-color:#dc2626;"><div class="text" spellcheck="false" style="color:#fff;">确定</div></button>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderChatModal(host) {
    return (
      '<div class="mini-inline-modal" data-mini-modal="chat" data-host="' +
      host +
      '">' +
      '<div class="mini-inline-modal-mask" data-host="' +
      host +
      '"></div>' +
      '<div class="mini-inline-modal-card ax_default">' +
      '<div class="mini-inline-modal-head">' +
      '<div class="mini-inline-modal-title text" spellcheck="false">选择微信对话框</div>' +
      '<button type="button" class="mini-modal-close-x mini-after-sale-chat-close" data-host="' +
      host +
      '" aria-label="关闭">×</button>' +
      "</div>" +
      '<div class="mini-upload-echo">' +
      '<div class="mini-chat-section-title text" spellcheck="false">选择对话框</div>' +
      '<div class="mini-chat-list" data-chat-list-host="' +
      host +
      '"></div>' +
      '<div class="mini-chat-section-title text" spellcheck="false">该对话框内文件</div>' +
      '<div class="mini-chat-file-list" data-chat-file-list-host="' +
      host +
      '"></div>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderFileModal(host) {
    return (
      '<div class="mini-inline-modal" data-mini-modal="file" data-host="' +
      host +
      '">' +
      '<div class="mini-inline-modal-mask" data-host="' +
      host +
      '"></div>' +
      '<div class="mini-inline-modal-card ax_default">' +
      '<div class="mini-inline-modal-head">' +
      '<div class="mini-inline-modal-title text" spellcheck="false">查看文件</div>' +
      '<button type="button" class="mini-modal-close-x mini-after-sale-file-close" data-host="' +
      host +
      '" aria-label="关闭">×</button>' +
      "</div>" +
      '<div class="mini-upload-echo">' +
      miniFieldCard("文件名称", '<span data-view-file-name="' + host + '">-</span>') +
      miniFieldCard("上传时间", '<span data-view-file-time="' + host + '">-</span>') +
      miniFieldCard("提示", "点击下方按钮后，将调起手机自带浏览器查看文件。") +
      "</div>" +
      '<div class="mini-detail-actions compact" style="margin-top:14px;">' +
      '<button type="button" class="ghost-btn ax_default mini-after-sale-file-close" data-host="' +
      host +
      '"><div class="text" spellcheck="false">取消</div></button>' +
      '<button type="button" class="ghost-btn ax_default mini-after-sale-file-open" data-host="' +
      host +
      '" style="background:#1d4ed8;border-color:#1d4ed8;"><div class="text" spellcheck="false" style="color:#fff;">在浏览器查看</div></button>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function ensureMiniProgramPages() {
    ensureSupplierMiniCatalog();
    upsertBundlePage("mini-hall", hallPageHtml());
    upsertBundlePage("mini-my", myPageHtml());
    upsertBundlePage("mini-after-sale", afterSaleListPageHtml());
    upsertBundlePage("mini-after-sale-detail", afterSaleDetailPageHtml());
  }

  function getMiniHallRoot() {
    return document.querySelector('.bundle-page[data-page="mini-hall"]');
  }

  function renderHallBrandOptions() {
    var root = getMiniHallRoot();
    if (!root) return;

    var optionWrap = root.querySelector("#mini-hall-brand-options");
    if (optionWrap) {
      optionWrap.innerHTML = hallRuntime.brands
        .map(function (brand) {
          var active = hallRuntime.selectedBrands.indexOf(brand) >= 0 ? " active" : "";
          return (
            '<button type="button" class="ghost-btn ax_default mini-brand-option' +
            active +
            '" data-brand="' +
            escapeHtml(brand) +
            '"><div class="text" spellcheck="false">' +
            escapeHtml(brand) +
            "</div></button>"
          );
        })
        .join("");
    }

    var popover = root.querySelector("#mini-hall-brand-popover");
    if (popover) popover.classList.toggle("open", hallRuntime.dropdownOpen);

    var trigger = root.querySelector(".mini-filter-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", hallRuntime.dropdownOpen ? "true" : "false");

    var brandRow = root.querySelector("#mini-hall-selected-brand-row");
    var brandText = root.querySelector("#mini-hall-selected-brand-text");
    var hasSelected = hallRuntime.selectedBrands.length > 0;
    if (brandRow) brandRow.classList.toggle("visible", hasSelected);
    if (brandText) brandText.textContent = hasSelected ? hallRuntime.selectedBrands.join("、") : "全部品牌";
  }

  function applyHallFilter() {
    var root = getMiniHallRoot();
    if (!root) return;

    var visibleCount = 0;
    Array.prototype.forEach.call(root.querySelectorAll(".mini-hall-order-card"), function (card) {
      var brand = card.getAttribute("data-brand") || "";
      var matched = !hallRuntime.selectedBrands.length || hallRuntime.selectedBrands.indexOf(brand) >= 0;
      card.classList.toggle("hidden-by-filter", !matched);
      if (matched) visibleCount += 1;
    });

    var resultTip = root.querySelector("#mini-hall-result-tip");
    if (resultTip) resultTip.textContent = "当前展示 " + visibleCount + " 条";
    var emptyTip = root.querySelector("#mini-hall-empty-tip");
    if (emptyTip) emptyTip.classList.toggle("visible", visibleCount === 0);
  }

  function getOrderById(orderId) {
    return (
      afterSaleRuntime.orders.find(function (order) {
        return order.id === orderId;
      }) || afterSaleRuntime.orders[0]
    );
  }

  function getStatusText(status) {
    return (
      {
        processing: "待处理",
        reviewing: "审核中",
        timeout: "超时未上传",
        rejected: "已驳回",
        uploaded: "已上传"
      }[status] || "待处理"
    );
  }

  function getOrdersByStatus(status) {
    return afterSaleRuntime.orders.filter(function (order) {
      return order.status === status && !order.removed;
    });
  }

  function getListPageRoot() {
    return document.querySelector('.bundle-page[data-page="mini-after-sale"]');
  }

  function getDetailPageRoot() {
    return document.querySelector('.bundle-page[data-page="mini-after-sale-detail"]');
  }

  function getListActions(order) {
    if (order.status === "processing" || order.status === "timeout") {
      return [
        { label: "放弃", action: "abandon", primary: false },
        { label: "上传", action: "upload", primary: true }
      ];
    }
    if (order.status === "rejected") {
      return [{ label: "重新上传", action: "reupload", primary: true }];
    }
    if (order.status === "uploaded") {
      return [{ label: "查看文件", action: "view-file", primary: false }];
    }
    return [];
  }

  function listCardHtml(order) {
    var actions = getListActions(order);
    var showDeadline = order.status === "processing" || order.status === "timeout";
    return (
      '<div class="mini-order-card order-card ax_default mini-after-sale-list-card" data-order-id="' +
      order.id +
      '">' +
      '<div class="mini-order-top">' +
      '<div class="mini-order-store text" spellcheck="false">' +
      escapeHtml(order.store) +
      '</div>' +
      '<div class="mini-order-deadline text' +
      (showDeadline ? "" : " hidden") +
      '" spellcheck="false">' +
      escapeHtml(order.deadline) +
      "</div>" +
      "</div>" +
      '<div class="mini-order-subhead">' +
      '<div class="mini-order-subtext text" spellcheck="false">订单号：' +
      escapeHtml(order.orderNo) +
      '</div><div class="mini-order-state-pill text" spellcheck="false">' +
      escapeHtml(getStatusText(order.status)) +
      "</div></div>" +
      '<div class="mini-order-content">' +
      '<div class="mini-order-thumb mini-after-sale-thumb-open text" data-order-id="' +
      order.id +
      '" spellcheck="false">商品图</div>' +
      '<div class="mini-order-detail-col">' +
      '<div class="mini-order-meta text" spellcheck="false">商品品牌：' +
      escapeHtml(order.brand) +
      "</div>" +
      '<div class="mini-order-meta text" spellcheck="false">商品名称：' +
      escapeHtml(order.product) +
      "</div>" +
      '<div class="mini-order-meta text" spellcheck="false">用户支付：' +
      escapeHtml(order.pay) +
      "</div>" +
      '<div class="mini-order-meta text" spellcheck="false">补贴金额：<span class="mini-order-highlight">' +
      escapeHtml(order.subsidy) +
      "</span></div>" +
      "</div>" +
      "</div>" +
      (order.status === "rejected" && order.rejectReason
        ? '<div class="mini-order-reject-reason ax_default"><div class="mini-order-reject-label text" spellcheck="false">驳回原因</div><div class="mini-order-reject-text text" spellcheck="false">' +
          escapeHtml(order.rejectReason.replace(/^驳回原因：?/, "").trim()) +
          "</div></div>"
        : "") +
      '<div class="mini-order-actions compact">' +
      actions
        .map(function (item) {
          return (
            '<button type="button" class="ghost-btn ax_default mini-after-sale-card-action" data-order-id="' +
            order.id +
            '" data-action="' +
            item.action +
            '"' +
            (item.primary ? ' style="background:#1d4ed8;border-color:#1d4ed8;"' : "") +
            '><div class="text" spellcheck="false"' +
            (item.primary ? ' style="color:#fff;"' : "") +
            ">" +
            item.label +
            "</div></button>"
          );
        })
        .join("") +
      "</div>" +
      "</div>"
    );
  }

  function renderAfterSaleLists() {
    var root = getListPageRoot();
    if (!root) return;

    [
      { key: "processing", id: "mini-after-sale-processing-list" },
      { key: "reviewing", id: "mini-after-sale-reviewing-list" },
      { key: "timeout", id: "mini-after-sale-timeout-list" },
      { key: "rejected", id: "mini-after-sale-rejected-list" },
      { key: "uploaded", id: "mini-after-sale-uploaded-list" }
    ].forEach(function (item) {
      var container = root.querySelector("#" + item.id);
      if (!container) return;
      var orders = getOrdersByStatus(item.key);
      container.innerHTML = orders.length
        ? orders.map(function (order) { return listCardHtml(order); }).join("")
        : '<div class="mini-empty-tip visible text" spellcheck="false">暂无示例卡片</div>';
    });

    setAfterSaleTab(afterSaleRuntime.currentTab);
    renderModalHost(root, "list");
  }

  function setAfterSaleTab(status) {
    var root = getListPageRoot();
    if (!root) return;
    var target = {
      processing: "mini-processing",
      reviewing: "mini-reviewing",
      timeout: "mini-timeout",
      rejected: "mini-rejected",
      uploaded: "mini-uploaded"
    }[status] || "mini-processing";

    Array.prototype.forEach.call(root.querySelectorAll('.tab-row[data-tab-group="mini-after-sale-tabs"] .tab-btn'), function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-tab-target") === target);
    });
    Array.prototype.forEach.call(root.querySelectorAll('.tab-panel[data-tab-group="mini-after-sale-tabs"]'), function (panel) {
      panel.classList.toggle("active", panel.getAttribute("data-tab-panel") === target);
    });
  }

  function renderDetailPage() {
    var root = getDetailPageRoot();
    if (!root) return;
    var order = getOrderById(afterSaleRuntime.currentOrderId);

    setText(root, "#mini-after-sale-detail-order-no", order.orderNo);
    setText(root, "#mini-after-sale-detail-brand", order.brand);
    setText(root, "#mini-after-sale-detail-pay", order.pay);
    setText(root, "#mini-after-sale-detail-subsidy", order.subsidy);
    setText(root, "#mini-after-sale-detail-invoice-title", order.invoiceTitle);
    setText(root, "#mini-after-sale-detail-tax-no", order.taxNo);
    setText(root, "#mini-after-sale-detail-timer", order.deadline || getStatusText(order.status));
    setText(root, "#mini-after-sale-detail-reason-text", order.rejectReason ? order.rejectReason.replace(/^驳回原因：?/, "").trim() : "");

    var reasonPanel = root.querySelector("#mini-after-sale-detail-reason-panel");
    if (reasonPanel) {
      reasonPanel.style.display = order.status === "rejected" && order.rejectReason ? "" : "none";
    }

    var actionWrap = root.querySelector("#mini-after-sale-detail-actions");
    if (actionWrap) {
      actionWrap.innerHTML = detailActionHtml(order);
    }

    renderModalHost(root, "detail");
  }

  function detailActionHtml(order) {
    if (order.status === "processing" || order.status === "timeout") {
      return (
        '<button type="button" class="ghost-btn ax_default mini-after-sale-detail-action" data-action="abandon"><div class="text" spellcheck="false">放弃</div></button>' +
        '<button type="button" class="ghost-btn ax_default mini-after-sale-detail-action" data-action="upload" style="background:#1d4ed8;border-color:#1d4ed8;"><div class="text" spellcheck="false" style="color:#fff;">上传</div></button>'
      );
    }
    if (order.status === "rejected") {
      return '<button type="button" class="ghost-btn ax_default mini-after-sale-detail-action" data-action="reupload" style="background:#1d4ed8;border-color:#1d4ed8;"><div class="text" spellcheck="false" style="color:#fff;">重新上传</div></button>';
    }
    return "";
  }

  function renderModalHost(pageRoot, host) {
    if (!pageRoot) return;
    var order = getOrderById(afterSaleRuntime.currentOrderId);

    var uploadModal = pageRoot.querySelector('.mini-inline-modal[data-mini-modal="upload"][data-host="' + host + '"]');
    if (uploadModal) {
      uploadModal.classList.toggle("open", afterSaleRuntime.uploadHost === host);
      var titleEl = uploadModal.querySelector('[data-upload-title="' + host + '"]');
      if (titleEl) titleEl.textContent = afterSaleRuntime.currentAction === "reupload" ? "重新上传发票" : "上传发票";
      var invoiceTitle = uploadModal.querySelector('[data-upload-invoice-title="' + host + '"]');
      var taxNo = uploadModal.querySelector('[data-upload-tax-no="' + host + '"]');
      var pay = uploadModal.querySelector('[data-upload-pay="' + host + '"]');
      if (invoiceTitle) invoiceTitle.textContent = order.invoiceTitle;
      if (taxNo) taxNo.textContent = order.taxNo;
      if (pay) pay.textContent = order.pay;
      renderUploadedFileLine(uploadModal, order, host);
    }

    var abandonModal = pageRoot.querySelector('.mini-inline-modal[data-mini-modal="abandon"][data-host="' + host + '"]');
    if (abandonModal) {
      abandonModal.classList.toggle("open", afterSaleRuntime.abandonHost === host);
    }

    var chatModal = pageRoot.querySelector('.mini-inline-modal[data-mini-modal="chat"][data-host="' + host + '"]');
    if (chatModal) {
      chatModal.classList.toggle("open", afterSaleRuntime.chatHost === host);
      renderChatLists(chatModal, host);
    }

    var fileModal = pageRoot.querySelector('.mini-inline-modal[data-mini-modal="file"][data-host="' + host + '"]');
    if (fileModal) {
      fileModal.classList.toggle("open", afterSaleRuntime.fileHost === host);
      var fileName = fileModal.querySelector('[data-view-file-name="' + host + '"]');
      var fileTime = fileModal.querySelector('[data-view-file-time="' + host + '"]');
      if (fileName) fileName.textContent = order.uploadedFile ? order.uploadedFile.name : "-";
      if (fileTime) fileTime.textContent = order.uploadedFile ? order.uploadedFile.time : "-";
    }

    renderUploadProgress(pageRoot, host);
  }

  function renderUploadedFileLine(uploadModal, order, host) {
    var line = uploadModal.querySelector('[data-file-line-host="' + host + '"]');
    if (!line) return;
    if (!order.uploadedFile) {
      line.innerHTML = "";
      return;
    }
    line.innerHTML =
      '<span class="mini-uploaded-file-name">' +
      escapeHtml(order.uploadedFile.name) +
      '</span><span class="mini-uploaded-file-time">' +
      escapeHtml(order.uploadedFile.time) +
      '</span><button type="button" class="mini-uploaded-file-delete" data-host="' +
      host +
      '" aria-label="删除已选文件">×</button>';
  }

  function renderUploadProgress(pageRoot, host) {
    var wrap = pageRoot.querySelector('[data-upload-progress-host="' + host + '"]');
    if (!wrap) return;
    var show = afterSaleRuntime.uploadProgressHost === host && afterSaleRuntime.uploadProgressValue > 0;
    wrap.style.display = show ? "" : "none";
    var fill = pageRoot.querySelector('[data-upload-progress-fill="' + host + '"]');
    var text = pageRoot.querySelector('[data-upload-progress-text="' + host + '"]');
    var value = Math.max(0, Math.min(100, afterSaleRuntime.uploadProgressValue || 0));
    if (fill) fill.style.width = value + "%";
    if (text) text.textContent = value >= 100 ? "上传完成" : "上传中 " + value + "%";
  }

  function renderChatLists(chatModal, host) {
    var chatList = chatModal.querySelector('[data-chat-list-host="' + host + '"]');
    var fileList = chatModal.querySelector('[data-chat-file-list-host="' + host + '"]');
    if (!chatList || !fileList) return;

    chatList.innerHTML = afterSaleRuntime.chats
      .map(function (chat) {
        var active = afterSaleRuntime.selectedChatId === chat.id ? " active" : "";
        return (
          '<button type="button" class="ghost-btn ax_default mini-chat-item mini-chat-select' +
          active +
          '" data-chat-id="' +
          chat.id +
          '" data-host="' +
          host +
          '"><div class="mini-chat-item-title text" spellcheck="false">' +
          escapeHtml(chat.name) +
          '</div><div class="mini-chat-item-desc text" spellcheck="false">' +
          escapeHtml(chat.desc) +
          "</div></button>"
        );
      })
      .join("");

    var currentChat = afterSaleRuntime.chats.find(function (chat) {
      return chat.id === afterSaleRuntime.selectedChatId;
    });
    if (!currentChat) {
      fileList.innerHTML = '<div class="mini-chat-item-desc text" spellcheck="false">请选择上方对话框</div>';
      return;
    }

    fileList.innerHTML = currentChat.files
      .map(function (file) {
        return (
          '<button type="button" class="ghost-btn ax_default mini-chat-item mini-chat-file" data-host="' +
          host +
          '" data-file-name="' +
          escapeHtml(file.name) +
          '" data-file-time="' +
          escapeHtml(file.time) +
          '"><div class="mini-chat-item-title text" spellcheck="false">' +
          escapeHtml(file.name) +
          '</div><div class="mini-chat-item-desc text" spellcheck="false">' +
          escapeHtml(currentChat.name + " · " + file.time) +
          "</div></button>"
        );
      })
      .join("");
  }

  function setText(root, selector, value) {
    var node = root.querySelector(selector);
    if (node) node.textContent = value;
  }

  function openAfterSaleList(fromPage) {
    afterSaleRuntime.previousPage = fromPage || afterSaleRuntime.previousPage || "mini-my";
    showBundlePage("mini-after-sale");
    renderAfterSaleLists();
  }

  function openAfterSaleDetail(orderId) {
    afterSaleRuntime.currentOrderId = orderId;
    closeAllAfterSaleModals();
    renderDetailPage();
    showBundlePage("mini-after-sale-detail");
  }

  function closeAllAfterSaleModals() {
    afterSaleRuntime.uploadHost = "";
    afterSaleRuntime.abandonHost = "";
    afterSaleRuntime.chatHost = "";
    afterSaleRuntime.fileHost = "";
    afterSaleRuntime.currentAction = "";
    afterSaleRuntime.selectedChatId = "";
    afterSaleRuntime.uploadProgressHost = "";
    afterSaleRuntime.uploadProgressValue = 0;
    window.clearTimeout(afterSaleRuntime.uploadProgressTimer);
  }

  function openUpload(orderId, host, action) {
    afterSaleRuntime.currentOrderId = orderId;
    afterSaleRuntime.currentAction = action || "upload";
    afterSaleRuntime.uploadHost = host;
    afterSaleRuntime.abandonHost = "";
    afterSaleRuntime.chatHost = "";
    afterSaleRuntime.fileHost = "";
    afterSaleRuntime.selectedChatId = "";
    afterSaleRuntime.uploadProgressHost = "";
    afterSaleRuntime.uploadProgressValue = 0;
    renderAfterSaleLists();
    renderDetailPage();
  }

  function openAbandon(orderId, host) {
    afterSaleRuntime.currentOrderId = orderId;
    afterSaleRuntime.currentAction = "abandon";
    afterSaleRuntime.abandonHost = host;
    afterSaleRuntime.uploadHost = "";
    afterSaleRuntime.chatHost = "";
    afterSaleRuntime.fileHost = "";
    afterSaleRuntime.selectedChatId = "";
    renderAfterSaleLists();
    renderDetailPage();
  }

  function openChat(host) {
    afterSaleRuntime.fileHost = "";
    afterSaleRuntime.chatHost = host;
    afterSaleRuntime.selectedChatId = "";
    renderAfterSaleLists();
    renderDetailPage();
  }

  function openFileViewer(orderId, host) {
    afterSaleRuntime.currentOrderId = orderId;
    afterSaleRuntime.fileHost = host;
    afterSaleRuntime.uploadHost = "";
    afterSaleRuntime.abandonHost = "";
    afterSaleRuntime.chatHost = "";
    renderAfterSaleLists();
    renderDetailPage();
  }

  function closeHostModal(host, type) {
    if (type === "upload") afterSaleRuntime.uploadHost = "";
    if (type === "abandon") afterSaleRuntime.abandonHost = "";
    if (type === "file") afterSaleRuntime.fileHost = "";
    if (type === "chat") {
      afterSaleRuntime.chatHost = "";
      afterSaleRuntime.selectedChatId = "";
    }
    renderAfterSaleLists();
    renderDetailPage();
  }

  function startUploadProgress(host) {
    afterSaleRuntime.uploadProgressHost = host;
    afterSaleRuntime.uploadProgressValue = 8;
    window.clearTimeout(afterSaleRuntime.uploadProgressTimer);
    window.clearTimeout(afterSaleRuntime.uploadProgressDoneTimer);
    var steps = [36, 68, 100];
    function tick() {
      if (!steps.length) return;
      afterSaleRuntime.uploadProgressValue = steps.shift();
      renderAfterSaleLists();
      renderDetailPage();
      if (afterSaleRuntime.uploadProgressValue < 100) {
        afterSaleRuntime.uploadProgressTimer = window.setTimeout(tick, 220);
      } else {
        afterSaleRuntime.uploadProgressDoneTimer = window.setTimeout(function () {
          submitUpload(host);
        }, 260);
      }
    }
    renderAfterSaleLists();
    renderDetailPage();
    afterSaleRuntime.uploadProgressTimer = window.setTimeout(tick, 180);
  }

  function openFileInBrowser(order) {
    if (!order || !order.uploadedFile) return;
    var fileName = escapeHtml(order.uploadedFile.name);
    var fileTime = escapeHtml(order.uploadedFile.time);
    var store = escapeHtml(order.store);
    var previewHtml =
      "<!DOCTYPE html><html lang='zh-CN'><head><meta charset='utf-8'><title>" +
      fileName +
      "</title><style>body{margin:0;padding:28px;background:#f6f8fc;font-family:'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;color:#0f172a}.card{max-width:720px;margin:0 auto;background:#fff;border:1px solid #dbe5f5;border-radius:18px;padding:24px;box-shadow:0 18px 40px rgba(15,23,42,.08)}h1{margin:0 0 12px;font-size:24px}p{margin:8px 0;line-height:1.8}.tag{display:inline-block;padding:4px 10px;border-radius:999px;background:#eff6ff;color:#2563eb;font-weight:700;font-size:12px}</style></head><body><div class='card'><span class='tag'>浏览器查看示意</span><h1>" +
      fileName +
      "</h1><p>门店：" +
      store +
      "</p><p>上传时间：" +
      fileTime +
      "</p><p>该原型用于演示：点击“查看文件”后，会调起手机自带浏览器查看已上传文件。</p></div></body></html>";
    var win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(previewHtml);
    win.document.close();
  }

  function submitUpload(host) {
    var order = getOrderById(afterSaleRuntime.currentOrderId);
    if (!order.uploadedFile) {
      var fallbackChat = afterSaleRuntime.chats[0];
      if (fallbackChat && fallbackChat.files[0]) {
        order.uploadedFile = {
          name: fallbackChat.files[0].name,
          time: fallbackChat.files[0].time,
          chat: fallbackChat.name
        };
      }
    }
    order.status = "reviewing";
    order.deadline = "";
    closeAllAfterSaleModals();
    afterSaleRuntime.currentTab = "reviewing";
    renderAfterSaleLists();
    renderDetailPage();
    showBundlePage(host === "detail" ? "mini-after-sale" : "mini-after-sale");
  }

  function submitAbandon(host) {
    var order = getOrderById(afterSaleRuntime.currentOrderId);
    order.removed = true;
    closeAllAfterSaleModals();
    renderAfterSaleLists();
    renderDetailPage();
    showBundlePage("mini-after-sale");
  }

  function bindMiniHallEvents() {
    document.addEventListener(
      "click",
      function (event) {
        var root = getMiniHallRoot();
        if (!root || !root.classList.contains("active")) return;

        var filterTrigger = event.target.closest(".mini-filter-trigger");
        if (filterTrigger) {
          event.preventDefault();
          hallRuntime.dropdownOpen = !hallRuntime.dropdownOpen;
          renderHallBrandOptions();
          return;
        }

        var brandOption = event.target.closest(".mini-brand-option");
        if (brandOption) {
          event.preventDefault();
          var brand = brandOption.getAttribute("data-brand") || "";
          var idx = hallRuntime.selectedBrands.indexOf(brand);
          if (idx >= 0) {
            hallRuntime.selectedBrands.splice(idx, 1);
          } else {
            hallRuntime.selectedBrands.push(brand);
          }
          renderHallBrandOptions();
          return;
        }

        var resetBtn = event.target.closest(".mini-brand-reset");
        if (resetBtn) {
          event.preventDefault();
          hallRuntime.selectedBrands = [];
          renderHallBrandOptions();
          applyHallFilter();
          return;
        }

        var doneBtn = event.target.closest(".mini-brand-done");
        if (doneBtn) {
          event.preventDefault();
          hallRuntime.dropdownOpen = false;
          renderHallBrandOptions();
          applyHallFilter();
          return;
        }

        var searchBtn = event.target.closest(".mini-search-submit");
        if (searchBtn) {
          event.preventDefault();
          applyHallFilter();
          return;
        }

        var grabBtn = event.target.closest(".mini-grab-trigger");
        if (grabBtn) {
          event.preventDefault();
          var card = grabBtn.closest(".mini-hall-order-card");
          var cardId = card ? card.getAttribute("data-card-id") : "";
          if (cardId && hallRuntime.grabbedCardIds.indexOf(cardId) < 0) {
            hallRuntime.grabbedCardIds.push(cardId);
          }
          applyHallFilter();
          var listWrap = root.querySelector("#mini-hall-card-list");
          if (listWrap) {
            listWrap.innerHTML = hallOrderCardHtml({
              id: "luckin-1",
              brand: "瑞幸",
              store: "瑞幸-广州",
              product: "椰青冰萃美式",
              pay: "9.99",
              subsidy: "1.5 元",
              deadline: "6天23小时59分"
            }) +
            hallOrderCardHtml({
              id: "chagee-1",
              brand: "霸王茶姬",
              store: "霸王茶姬-深圳",
              product: "伯牙绝弦大杯",
              pay: "18.00",
              subsidy: "2.0 元",
              deadline: "2天11小时08分"
            });
            applyHallFilter();
          }
          return;
        }

        if (hallRuntime.dropdownOpen && !event.target.closest(".mini-search-filter-wrap")) {
          hallRuntime.dropdownOpen = false;
          renderHallBrandOptions();
        }
      },
      true
    );
  }

  function bindMiniAfterSaleEvents() {
    document.addEventListener(
      "click",
      function (event) {
        var myEntry = event.target.closest(".mini-my-entry");
        if (myEntry) {
          event.preventDefault();
          afterSaleRuntime.previousPage = "mini-my";
          afterSaleRuntime.currentTab = "processing";
          openAfterSaleList("mini-my");
          return;
        }

        var listBack = event.target.closest(".mini-after-sale-list-back");
        if (listBack) {
          event.preventDefault();
          showBundlePage(afterSaleRuntime.previousPage || "mini-my");
          return;
        }

        var detailBack = event.target.closest(".mini-after-sale-back");
        if (detailBack) {
          event.preventDefault();
          showBundlePage("mini-after-sale");
          renderAfterSaleLists();
          return;
        }

        var tabBtn = event.target.closest('.bundle-page[data-page="mini-after-sale"] .tab-btn[data-tab-target]');
        if (tabBtn) {
          event.preventDefault();
          afterSaleRuntime.currentTab =
            {
              "mini-processing": "processing",
              "mini-reviewing": "reviewing",
              "mini-timeout": "timeout",
              "mini-rejected": "rejected",
              "mini-uploaded": "uploaded"
            }[tabBtn.getAttribute("data-tab-target")] || "processing";
          setAfterSaleTab(afterSaleRuntime.currentTab);
          return;
        }

        var thumbOpen = event.target.closest(".mini-after-sale-thumb-open");
        if (thumbOpen) {
          event.preventDefault();
          openAfterSaleDetail(thumbOpen.getAttribute("data-order-id") || afterSaleRuntime.currentOrderId);
          return;
        }

        var listAction = event.target.closest(".mini-after-sale-card-action");
        if (listAction) {
          event.preventDefault();
          event.stopPropagation();
          var orderId = listAction.getAttribute("data-order-id") || afterSaleRuntime.currentOrderId;
          var action = listAction.getAttribute("data-action") || "";
          if (action === "upload" || action === "reupload") {
            openUpload(orderId, "list", action);
          } else if (action === "abandon") {
            openAbandon(orderId, "list");
          } else if (action === "view-file") {
            openFileViewer(orderId, "list");
          }
          return;
        }

        var detailAction = event.target.closest(".mini-after-sale-detail-action");
        if (detailAction) {
          event.preventDefault();
          var detailActionName = detailAction.getAttribute("data-action") || "";
          if (detailActionName === "upload" || detailActionName === "reupload") {
            openUpload(afterSaleRuntime.currentOrderId, "detail", detailActionName);
          } else if (detailActionName === "abandon") {
            openAbandon(afterSaleRuntime.currentOrderId, "detail");
          }
          return;
        }

        var uploadClose = event.target.closest(".mini-after-sale-upload-close");
        if (uploadClose) {
          event.preventDefault();
          closeHostModal(uploadClose.getAttribute("data-host") || "detail", "upload");
          return;
        }

        var uploadMask = event.target.closest('.mini-inline-modal-mask');
        if (uploadMask) {
          var uploadHost = uploadMask.getAttribute("data-host") || "";
          if (afterSaleRuntime.chatHost === uploadHost) {
            closeHostModal(uploadHost, "chat");
          } else if (afterSaleRuntime.uploadHost === uploadHost) {
            closeHostModal(uploadHost, "upload");
          } else if (afterSaleRuntime.abandonHost === uploadHost) {
            closeHostModal(uploadHost, "abandon");
          }
          return;
        }

        var uploadTrigger = event.target.closest(".mini-upload-file-trigger");
        if (uploadTrigger) {
          event.preventDefault();
          openChat(uploadTrigger.getAttribute("data-host") || "detail");
          return;
        }

        var chatClose = event.target.closest(".mini-after-sale-chat-close");
        if (chatClose) {
          event.preventDefault();
          closeHostModal(chatClose.getAttribute("data-host") || "detail", "chat");
          return;
        }

        var chatSelect = event.target.closest(".mini-chat-select");
        if (chatSelect) {
          event.preventDefault();
          afterSaleRuntime.selectedChatId = chatSelect.getAttribute("data-chat-id") || "";
          renderAfterSaleLists();
          renderDetailPage();
          return;
        }

        var chatFile = event.target.closest(".mini-chat-file");
        if (chatFile) {
          event.preventDefault();
          var order = getOrderById(afterSaleRuntime.currentOrderId);
          var currentChat = afterSaleRuntime.chats.find(function (item) {
            return item.id === afterSaleRuntime.selectedChatId;
          });
          order.uploadedFile = {
            name: chatFile.getAttribute("data-file-name") || "invoice_demo.pdf",
            time: chatFile.getAttribute("data-file-time") || "2026-07-29 18:10:59",
            chat: currentChat ? currentChat.name : ""
          };
          afterSaleRuntime.chatHost = "";
          afterSaleRuntime.selectedChatId = "";
          startUploadProgress(chatFile.getAttribute("data-host") || "detail");
          renderAfterSaleLists();
          renderDetailPage();
          return;
        }

        var fileDelete = event.target.closest(".mini-uploaded-file-delete");
        if (fileDelete) {
          event.preventDefault();
          getOrderById(afterSaleRuntime.currentOrderId).uploadedFile = null;
          renderAfterSaleLists();
          renderDetailPage();
          return;
        }

        var uploadSubmit = event.target.closest(".mini-after-sale-upload-submit");
        if (uploadSubmit) {
          event.preventDefault();
          submitUpload(uploadSubmit.getAttribute("data-host") || "detail");
          return;
        }

        var fileClose = event.target.closest(".mini-after-sale-file-close");
        if (fileClose) {
          event.preventDefault();
          closeHostModal(fileClose.getAttribute("data-host") || "list", "file");
          return;
        }

        var fileOpen = event.target.closest(".mini-after-sale-file-open");
        if (fileOpen) {
          event.preventDefault();
          openFileInBrowser(getOrderById(afterSaleRuntime.currentOrderId));
          return;
        }

        var abandonClose = event.target.closest(".mini-after-sale-abandon-close");
        if (abandonClose) {
          event.preventDefault();
          closeHostModal(abandonClose.getAttribute("data-host") || "detail", "abandon");
          return;
        }

        var abandonSubmit = event.target.closest(".mini-after-sale-abandon-submit");
        if (abandonSubmit) {
          event.preventDefault();
          submitAbandon(abandonSubmit.getAttribute("data-host") || "detail");
        }
      },
      true
    );
  }

  function bootMiniPrototype() {
    ensureMiniProgramPages();
    renderHallBrandOptions();
    applyHallFilter();
    renderAfterSaleLists();
    renderDetailPage();
  }

  if (!window.__MINI_SUPPLIER_BINDING__) {
    bindMiniHallEvents();
    bindMiniAfterSaleEvents();
    window.__MINI_SUPPLIER_BINDING__ = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootMiniPrototype);
  } else {
    bootMiniPrototype();
  }
  window.addEventListener("load", bootMiniPrototype);
  window.addEventListener("pageshow", bootMiniPrototype);
  setTimeout(bootMiniPrototype, 0);
  setTimeout(bootMiniPrototype, 200);
})();
