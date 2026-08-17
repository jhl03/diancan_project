
(function () {
  if (window.__INLINE_INVOICE_PAGE_INTERACTIVE__) return;
  window.__INLINE_INVOICE_PAGE_INTERACTIVE__ = true;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }
    fn();
  }

  function ensureStyle() {
    if (document.getElementById("inline-invoice-page-style")) return;
    var style = document.createElement("style");
    style.id = "inline-invoice-page-style";
    style.textContent =
      ".invoice-inline-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;}" +
      ".invoice-inline-btn{display:inline-flex;align-items:center;justify-content:center;min-width:92px;height:34px;padding:0 14px;border-radius:999px;border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;font:700 13px/1 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;cursor:pointer;transition:transform .14s ease,box-shadow .18s ease,filter .18s ease,opacity .18s ease;}" +
      ".invoice-inline-btn:hover{filter:brightness(1.03);}" +
      ".invoice-inline-btn:active{transform:translateY(1px);}" +
      ".invoice-inline-btn.is-disabled{opacity:.45;pointer-events:none;}" +
      ".invoice-inline-state{margin-top:6px;font-weight:700;}" +
      ".invoice-inline-state.success{color:#16a34a;}" +
      ".invoice-inline-state.fail{color:#dc2626;}" +
      "#invoice-inline-toast-root{position:fixed;top:24px;left:50%;transform:translateX(-50%);display:grid;gap:10px;z-index:2147483500;pointer-events:none;justify-items:center;}" +
      ".invoice-inline-toast{min-width:240px;max-width:420px;padding:14px 18px;border-radius:18px;background:rgba(15,23,42,.94);color:#fff;font:600 13px/1.5 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;box-shadow:0 12px 28px rgba(15,23,42,.22);text-align:center;}" +
      ".invoice-inline-toast.error{background:rgba(185,28,28,.96);}" +
      ".invoice-inline-toast.success{background:rgba(22,101,52,.95);}";
    document.head.appendChild(style);
  }

  function ensureToastRoot() {
    var root = document.getElementById("invoice-inline-toast-root");
    if (root) return root;
    root = document.createElement("div");
    root.id = "invoice-inline-toast-root";
    document.body.appendChild(root);
    return root;
  }

  function showToast(message, type) {
    var root = ensureToastRoot();
    var toast = document.createElement("div");
    toast.className = "invoice-inline-toast " + (type || "success");
    toast.textContent = message;
    root.appendChild(toast);
    window.setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2600);
  }

  function invoicePage() {
    return document.querySelector('.bundle-page[data-page="invoice"]');
  }

  function sectionByTitle(scope, title) {
    return Array.prototype.find.call(scope.querySelectorAll("section.section.ax_default"), function (section) {
      var titleNode = section.querySelector(".section-title");
      return titleNode && titleNode.textContent.indexOf(title) >= 0;
    });
  }

  function prepareInvoiceLayout(page) {
    var main = page.querySelector(".main-shell");
    if (!main) return null;
    var desc = sectionByTitle(page, "同步能力说明");
    var table = sectionByTitle(page, "发票工单列表");
    if (!desc || !table) return null;

    var header = main.querySelector(".page-header");
    if (header) header.style.display = "none";

    Array.prototype.forEach.call(main.children, function (child) {
      if (child === table || child === desc) return;
      child.style.display = "none";
      child.style.height = "0";
      child.style.margin = "0";
      child.style.padding = "0";
      child.style.minHeight = "0";
    });

    Array.prototype.forEach.call(page.querySelectorAll('[data-codex-layout-proxy="true"]'), function (proxy) {
      proxy.style.display = "none";
    });

    [table, desc].forEach(function (section, index) {
      section.style.position = "relative";
      section.style.left = "0px";
      section.style.top = "0px";
      section.style.width = "100%";
      section.style.maxWidth = "none";
      section.style.minWidth = "0";
      section.style.height = "auto";
      section.style.minHeight = "0";
      section.style.margin = index === 0 ? "0 0 24px" : "0";
      section.style.zIndex = "auto";
      section.style.background = "#ffffff";
      section.style.border = "1px solid #d7e2ef";
      section.style.borderRadius = "24px";
      section.style.boxShadow = "0 14px 32px rgba(20,42,74,.08)";
      section.style.padding = "22px 24px 18px";
      section.style.boxSizing = "border-box";
    });

    var wrap = table.querySelector(".table-wrap");
    if (wrap) {
      wrap.style.height = "auto";
      wrap.style.maxHeight = "none";
      wrap.style.overflowX = "auto";
      wrap.style.overflowY = "visible";
    }

    if (table.parentNode !== main) main.appendChild(table);
    if (desc.parentNode !== main) main.appendChild(desc);
    if (table.nextElementSibling !== desc) {
      table.insertAdjacentElement("afterend", desc);
    }

    main.style.minHeight = "auto";
    main.style.display = "grid";
    main.style.gap = "0";
    main.style.padding = "8px 24px 18px";
    page.style.minHeight = "auto";
    return { table: table, desc: desc };
  }

  function buildStateHtml(text, type) {
    if (!text) return "";
    return '<div class="invoice-inline-state ' + type + '">' + text + "</div>";
  }

  function buildRow(data) {
    var tr = document.createElement("tr");
    tr.dataset.syncMode = data.mode;
    tr.innerHTML = [
      '<td><div class="text" spellcheck="false">',
      data.baseStatus,
      buildStateHtml(data.syncText, data.syncType || ""),
      "</div></td>",
      '<td><div class="text" spellcheck="false">' + data.productType + "</div></td>",
      '<td><div class="text" spellcheck="false">' + data.amount + "</div></td>",
      '<td><div class="text" spellcheck="false">' + data.orderInfo + "</div></td>",
      '<td><div class="text" spellcheck="false">' + data.invoiceInfo + "</div></td>",
      '<td><div class="invoice-inline-actions">',
      '<button type="button" class="invoice-inline-btn" data-action="create">创建开票</button>',
      (data.showSync ? '<button type="button" class="invoice-inline-btn" data-action="sync">同步到后台</button>' : ''),
      "</div></td>"
    ].join("");
    return tr;
  }

  function replaceInvoiceTable(page) {
    var prepared = prepareInvoiceLayout(page);
    if (!prepared) return;
    var tableSection = prepared.table;
    var tbody = tableSection.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    tbody.appendChild(
      buildRow({
        baseStatus: "待财务开票",
        syncText: "同步成功",
        syncType: "success",
        productType: "点餐",
        amount: "16.80",
        orderInfo: "券单号：D20260815095024 / 店铺：霸王茶姬-深圳 / 商品：伯牙绝弦大杯 / 创建时间：2026-08-15 09:50:24 / 本次演示工单",
        invoiceInfo: "抬头：可可乐乐文化传播有限公司 / 税号：91440300MAE5XXE49N / 手机：-",
        mode: "success",
        showSync: false
      })
    );
    tbody.appendChild(
      buildRow({
        baseStatus: "待财务开票",
        syncText: "同步失败",
        syncType: "fail",
        productType: "点餐",
        amount: "28.50",
        orderInfo: "券单号：D20260815094924 / 店铺：肯德基-上海 / 商品：香辣鸡腿堡套餐 / 创建时间：2026-08-15 09:49:24",
        invoiceInfo: "抬头：肯德基企业抬头 / 税号：91310106MA1FRC9K1H / 手机：-",
        mode: "success",
        showSync: true
      })
    );
    tbody.appendChild(
      buildRow({
        baseStatus: "待财务开票",
        syncText: "同步失败",
        syncType: "fail",
        productType: "点餐",
        amount: "32.00",
        orderInfo: "券单号：D20260815094824 / 店铺：麦当劳-杭州 / 商品：巨无霸套餐 / 创建时间：2026-08-15 09:48:24",
        invoiceInfo: "抬头：个人抬头 / 税号：- / 手机：-",
        mode: "fail",
        showSync: true
      })
    );
  }

  function bindEvents(page) {
    if (page.dataset.inlineInvoiceBound === "1") return;
    page.dataset.inlineInvoiceBound = "1";
    page.addEventListener("click", function (event) {
      var button = event.target.closest(".invoice-inline-btn");
      if (!button) return;
      var row = button.closest("tr");
      if (!row) return;
      var action = button.getAttribute("data-action");
      if (action === "create") {
        showToast("已触发创建开票演示。", "success");
        return;
      }
      if (action !== "sync") return;
      var textNode = row.querySelector("td:first-child .text");
      if (!textNode) return;
      var existing = row.querySelector(".invoice-inline-state");
      if (row.dataset.syncMode === "success") {
        if (!existing) {
          textNode.insertAdjacentHTML("beforeend", buildStateHtml("同步成功", "success"));
        } else {
          existing.textContent = "同步成功";
          existing.className = "invoice-inline-state success";
        }
        button.classList.add("is-disabled");
        showToast("同步成功", "success");
        return;
      }
      if (!existing) {
        textNode.insertAdjacentHTML("beforeend", buildStateHtml("同步失败", "fail"));
      } else {
        existing.textContent = "同步失败";
        existing.className = "invoice-inline-state fail";
      }
      showToast("失败原因：XXXX", "error");
    });
  }

  function init() {
    ensureStyle();
    var page = invoicePage();
    if (!page) return;
    replaceInvoiceTable(page);
    prepareInvoiceLayout(page);
    bindEvents(page);
  }

  ready(function () {
    init();
    window.addEventListener("load", init);
    window.addEventListener("pageshow", function () {
      window.setTimeout(init, 0);
      window.setTimeout(init, 180);
    });
    window.addEventListener("hashchange", function () {
      window.setTimeout(init, 60);
    });
  });
})();
