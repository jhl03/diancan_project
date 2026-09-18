(function () {
  (function openRequestedRoute() {
    const params = new URLSearchParams(window.location.search);
    const routeMap = {
      afterSalesList: "/order/after-sales-list",
      invoiceList: "/order/invoice-list",
    };
    const requested = routeMap[params.get("prototypeRoute")];
    const base = document.querySelector("base")?.getAttribute("href") || "/";
    if (!requested || window.location.pathname.includes(requested)) return;
    const routeQuery = new URLSearchParams(params);
    routeQuery.delete("prototypeRoute");
    const next = `${base.replace(/\/?$/, "/")}${requested.replace(/^\//, "")}${routeQuery.toString() ? `?${routeQuery}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", next);
  })();

  const RED = "#f56c6c";
  const MARK = "data-prototype-review-key";

  function textOf(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureStyle() {
    if (document.getElementById("prototype-review-style")) return;
    const style = document.createElement("style");
    style.id = "prototype-review-style";
    style.textContent = `
      .prototype-review-red,
      .prototype-review-red .cell {
        color: ${RED} !important;
        font-weight: 600;
      }
      th[data-prototype-review-key] .cell,
      td[data-prototype-review-key] .cell {
        white-space: nowrap !important;
        overflow: visible !important;
      }
      .prototype-review-return {
        margin-left: 10px;
        color: ${RED} !important;
        cursor: pointer;
        white-space: nowrap;
      }
      .prototype-after-sales-filter-item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-right: 14px;
        margin-bottom: 18px;
        vertical-align: top;
      }
      .prototype-after-sales-filter-label {
        color: ${RED} !important;
        font-weight: 600;
        white-space: nowrap;
      }
      .prototype-after-sales-filter-select {
        width: 150px;
        height: 32px;
        padding: 0 10px;
        border: 1px solid ${RED};
        border-radius: 4px;
        background: #fff;
        color: #606266;
        outline: none;
      }
      .prototype-change-badge {
        display: inline-flex;
        align-items: center;
        margin-left: 6px;
        padding: 1px 6px;
        border-radius: 999px;
        background: #fff1f0;
        color: ${RED};
        border: 1px solid #ffccc7;
        font-size: 12px;
        font-weight: 700;
        line-height: 18px;
        white-space: nowrap;
      }
      .prototype-change-guide {
        margin: 12px 0 14px;
        padding: 12px 14px;
        border: 1px solid #ffccc7;
        border-left: 4px solid ${RED};
        border-radius: 6px;
        background: #fff7f6;
        color: #344054;
        font-size: 13px;
        line-height: 1.7;
        box-sizing: border-box;
        max-width: 100%;
      }
      .mobile.openSidebar .app-main .prototype-change-guide,
      .openSidebar.mobile .app-main .prototype-change-guide {
        margin-left: 208px;
        max-width: calc(100% - 208px);
      }
      .prototype-change-guide-title {
        color: ${RED};
        font-size: 15px;
        font-weight: 800;
        margin-bottom: 6px;
      }
      .prototype-change-guide-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .prototype-change-guide-item {
        padding-bottom: 8px;
        border-bottom: 1px dashed #ffd6d1;
      }
      .prototype-change-guide-item strong {
        display: block;
        color: ${RED};
        margin-bottom: 2px;
      }
      .prototype-change-guide-desc {
        display: block;
        color: #344054;
      }
      .prototype-review-note {
        position: relative;
        display: inline-flex;
        align-items: center;
        margin-left: 8px;
        padding: 0 8px;
        height: 20px;
        border-radius: 10px;
        border: 1px solid ${RED};
        color: ${RED};
        background: #fff;
        font-size: 12px;
        font-weight: 700;
        cursor: help;
      }
      .prototype-review-note::before {
        content: "→";
        margin-right: 4px;
      }
      .prototype-review-note:hover::after {
        content: attr(data-note);
        position: absolute;
        left: 100%;
        top: 24px;
        z-index: 100001;
        width: 280px;
        padding: 10px 12px;
        border-radius: 6px;
        background: rgba(30, 41, 59, 0.96);
        color: #fff;
        white-space: normal;
        line-height: 1.6;
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.22);
      }
      .prototype-review-mask {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.42);
      }
      .prototype-review-dialog {
        width: 380px;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 16px 48px rgba(15, 35, 70, 0.2);
        overflow: hidden;
        font-family: inherit;
      }
      .prototype-review-dialog-title {
        padding: 20px 24px 8px;
        color: #1f2d3d;
        font-size: 18px;
        font-weight: 600;
      }
      .prototype-review-dialog-body {
        padding: 8px 24px 22px;
        color: #4e5969;
        line-height: 1.8;
        white-space: pre-line;
      }
      .prototype-review-dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 12px 24px 18px;
        border-top: 1px solid #edf0f5;
      }
      .prototype-review-dialog-footer button {
        min-width: 74px;
        height: 34px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        background: #fff;
        color: #606266;
        cursor: pointer;
      }
      .prototype-review-dialog-footer .confirm {
        border-color: ${RED};
        background: ${RED};
        color: #fff;
      }
      .prototype-review-toast {
        position: fixed;
        left: 50%;
        top: 88px;
        z-index: 100000;
        transform: translateX(-50%);
        padding: 10px 18px;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.78);
        color: #fff;
        font-size: 14px;
      }
      .prototype-hide-invoice-source {
        display: none !important;
      }
      .prototype-invoice-table-shell {
        width: 100%;
        max-width: 100%;
        overflow: hidden;
      }
      .prototype-invoice-table-wrap {
        margin-top: 12px;
        width: 100%;
        max-width: 100%;
        overflow-x: auto !important;
        overflow-y: hidden;
        border: 1px solid #ebeef5;
        background: #fff;
        box-sizing: border-box;
        scrollbar-gutter: stable;
        padding-bottom: 10px;
      }
      .prototype-invoice-table-wrap::-webkit-scrollbar {
        height: 12px;
      }
      .prototype-invoice-table-wrap::-webkit-scrollbar-track {
        border-radius: 999px;
        background: #eef2f7;
      }
      .prototype-invoice-table-wrap::-webkit-scrollbar-thumb {
        border-radius: 999px;
        background: #9aa7b8;
      }
      .prototype-invoice-scroll-hint {
        margin-top: 8px;
        color: #7b8798;
        font-size: 12px;
      }
      .prototype-invoice-table {
        min-width: 1720px;
        width: max-content;
        border-collapse: collapse;
        table-layout: fixed;
        color: #344054;
        font-size: 14px;
      }
      .prototype-invoice-table th,
      .prototype-invoice-table td {
        height: 48px;
        padding: 0 14px;
        border-right: 1px solid #ebeef5;
        border-bottom: 1px solid #ebeef5;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
      }
      .prototype-invoice-table th {
        background: #f8f9fb;
        color: #24324b;
        font-weight: 700;
      }
      .prototype-invoice-table tr:nth-child(even) td {
        background: #fafcff;
      }
      .prototype-invoice-status {
        display: inline-flex;
        align-items: center;
        height: 24px;
        padding: 0 9px;
        border-radius: 4px;
        font-size: 12px;
      }
      .prototype-invoice-status.rejected {
        color: #f56c6c;
        background: #fef0f0;
      }
      .prototype-invoice-status.uploaded {
        color: #67c23a;
        background: #f0f9eb;
      }
      .prototype-invoice-status.pending {
        color: #e6a23c;
        background: #fdf6ec;
      }
      .prototype-invoice-status.processing {
        color: #409eff;
        background: #ecf5ff;
      }
      .prototype-invoice-action {
        color: #409eff;
        cursor: pointer;
        font-weight: 600;
      }
      .prototype-invoice-pagination {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 14px;
        margin-top: 18px;
        color: #606266;
      }
      .prototype-invoice-page-current {
        min-width: 34px;
        height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        background: #409eff;
        color: #fff;
        font-weight: 700;
      }
    `;
    document.head.appendChild(style);
  }

  function guessTitleType(text) {
    return /个人/.test(text || "") ? "个人" : "企业";
  }

  const reviewGuides = {
    "/supplier/list": {
      title: "本页改动说明：供应商列表",
      items: [
        ["合作状态 Tab", "停止合作页面：在未关闭接开票单开关时，操作停止合作要同步关闭接开票单开关；恢复合作后，接开票单开关保持关闭。"],
        ["是否接开票单", "鼠标悬停展示开启接开票单时勾选的商品品牌；开启时展示品牌清单，未开启时展示未开启提示。"],
      ],
      notes: [
        ["是否接开票单", "显示逻辑：悬停开关时展示供应商已勾选的开票商品品牌；数据源：供应商开票配置中的品牌授权结果。"],
      ],
    },
    "/order/invoice-list": {
      title: "本页改动说明：开票订单",
      items: [
        ["抬头类型", "新增红字字段；显示在发票抬头/税号左侧；数据源：客服本地生活工作台接口传入。"],
      ],
      notes: [
        ["抬头类型", "显示逻辑：四个 Tab 均展示；数据源：客服本地生活工作台接口的发票抬头类型。"],
        ["发票抬头/税号", "字段值需与抬头类型、供应商编号按列匹配；不同 Tab 不共用错位字段。"],
        ["供应商编号", "修复逻辑：供应商编号不再与抬头类型串位，按当前 Tab 独立字段配置展示。"],
        ["状态", "状态只取当前 Tab 对应枚举：已驳回/已上传/待处理/处理中。"],
        ["驳回原因", "仅已驳回 Tab 展示，用于说明本次新增的驳回流转字段。"],
      ],
    },
    "/order/after-sales-list": {
      title: "本页改动说明：售后补贴单",
      items: [
        ["接单状态筛选", "新增红色筛选项；枚举：已接单、待接单；支持与补贴状态组合筛选。"],
        ["补贴状态筛选", "新增红色筛选项；枚举：已补贴、未补贴；点击重置恢复全部。"],
        ["退回客服工作台", "当接单状态为待接单时展示；点击后二次确认，确认后退回客服工作台；提示“退回成功”；退回的工单，不会根据定时任务同步"],
      ],
      notes: [],
    },
  };

  function currentGuideConfig() {
    const path = window.location.pathname;
    return Object.keys(reviewGuides).find((key) => path.includes(key));
  }

  const changedRoutes = [
    { path: "/supplier/list", text: "供应商列表" },
    { path: "/order/invoice-list", text: "开票订单" },
    { path: "/order/after-sales-list", text: "售后补贴单" },
  ];

  function clearDuplicateBadges() {
    document.querySelectorAll(".prototype-change-badge").forEach((badge) => badge.remove());
    document.querySelectorAll("[data-prototype-change-marked]").forEach((node) => delete node.dataset.prototypeChangeMarked);
  }

  function addChangeBadge(node) {
    if (!node || node.dataset.prototypeChangeMarked === "true") return;
      const badge = document.createElement("span");
      badge.className = "prototype-change-badge";
      badge.textContent = "本期有改动";
      node.dataset.prototypeChangeMarked = "true";
      node.appendChild(badge);
  }

  function findMenuLink(route) {
    const links = Array.from(document.querySelectorAll(".sidebar-container a"));
    return links.find((link) => link.getAttribute("href") === route.path || link.getAttribute("href")?.endsWith(route.path));
  }

  function findTagLink(route) {
    const links = Array.from(document.querySelectorAll(".tags-view-container a, .tags-view-wrapper a"));
    return links.find((link) => link.getAttribute("href") === route.path || link.getAttribute("href")?.endsWith(route.path));
  }

  function ensureReviewGuide() {
    const key = currentGuideConfig();
    if (!key) {
      document.querySelectorAll(".prototype-change-guide").forEach((guide) => guide.remove());
      return;
    }
    const config = reviewGuides[key];
    const host = document.querySelector(".app-main .app-container") || document.querySelector(".app-main") || document.querySelector(".main-container") || document.body;
    if (!host) return;
    const guides = Array.from(document.querySelectorAll(".prototype-change-guide"));
    const currentGuide = guides.find((guide) => guide.parentElement === host && guide.dataset.prototypeGuideKey === key);
    guides.forEach((guide) => {
      if (guide !== currentGuide) guide.remove();
    });
    if (currentGuide) return;
    const guide = document.createElement("div");
    guide.className = "prototype-change-guide";
    guide.dataset.prototypeGuideKey = key;
    guide.innerHTML = `
      <div class="prototype-change-guide-title">${escapeHtml(config.title)}</div>
      <div class="prototype-change-guide-list">
        ${config.items.map(([title, desc]) => `<div class="prototype-change-guide-item"><strong>${escapeHtml(title)}</strong><span class="prototype-change-guide-desc">${escapeHtml(desc)}</span></div>`).join("")}
      </div>
    `;
    host.prepend(guide);
  }

  function ensureInlineNotes() {
    const key = currentGuideConfig();
    document.querySelectorAll(".prototype-review-note").forEach((note) => note.remove());
    document.querySelectorAll("[data-prototype-review-note-marked]").forEach((node) => delete node.dataset.prototypeReviewNoteMarked);
    if (!key) return;
    reviewGuides[key].notes.forEach(([target, note]) => {
      Array.from(document.querySelectorAll("th .cell, td .cell, button, .el-form-item__label")).forEach((node) => {
        if (!textOf(node).includes(target) || node.dataset.prototypeReviewNoteMarked === "true") return;
        const tag = document.createElement("span");
        tag.className = "prototype-review-note";
        tag.textContent = "说明";
        tag.setAttribute("data-note", note);
        node.dataset.prototypeReviewNoteMarked = "true";
        node.appendChild(tag);
      });
    });
  }

  function markChangedMenus() {
    changedRoutes.forEach((route) => {
      const hasBadgeForRoute = Array.from(document.querySelectorAll(".prototype-change-badge")).some((badge) => {
        const parent = badge.parentElement;
        return parent && (parent.getAttribute("href") === route.path || parent.getAttribute("href")?.endsWith(route.path));
      });
      if (hasBadgeForRoute) return;
      addChangeBadge(findMenuLink(route) || findTagLink(route));
    });
    if (document.querySelectorAll(".prototype-change-badge").length > changedRoutes.length) {
      clearDuplicateBadges();
      changedRoutes.forEach((route) => addChangeBadge(findMenuLink(route) || findTagLink(route)));
    }
  }

  function looksLikeSupplierId(text) {
    return /^SUP[-\w]+$/i.test(String(text || "").trim());
  }

  function looksLikeTitleType(text) {
    return /^(企业|个人)$/.test(String(text || "").trim());
  }

  function columnWidth(key) {
    return key === "invoice-title-type" ? 120 : 140;
  }

  function getTableContext(headerTable) {
    const inner = headerTable.closest(".el-table__inner-wrapper") || headerTable.closest(".el-table");
    const directBodyWrapper = inner
      ? Array.from(inner.children || []).find((item) => item.classList && item.classList.contains("el-table__body-wrapper"))
      : null;
    const bodyWrapper = directBodyWrapper || (inner ? inner.querySelector(".el-table__body-wrapper") : null);
    const bodyTables = bodyWrapper
      ? Array.from(bodyWrapper.querySelectorAll("table.el-table__body"))
      : Array.from((inner || document).querySelectorAll("table.el-table__body"));
    return { root: inner || document, bodyTables };
  }

  function ensureCol(table, key, insertIndex) {
    const colgroup = table && table.querySelector("colgroup");
    if (!colgroup || colgroup.querySelector(`col[${MARK}="${key}"]`)) return;
    const cols = Array.from(colgroup.children);
    const col = document.createElement("col");
    const width = columnWidth(key);
    col.setAttribute(MARK, key);
    col.setAttribute("width", String(width));
    col.style.width = `${width}px`;
    colgroup.insertBefore(col, cols[insertIndex] || null);
  }

  function styleNewCell(cell, key) {
    const width = columnWidth(key);
    cell.style.width = `${width}px`;
    cell.style.minWidth = `${width}px`;
    cell.style.maxWidth = `${width}px`;
  }

  function syncHeaderScroll() {
    document.querySelectorAll(".el-table").forEach((table) => {
      const headerWrapper = table.querySelector(".el-table__header-wrapper");
      const scrollWrap = table.querySelector(".el-scrollbar__wrap");
      if (!headerWrapper || !scrollWrap || scrollWrap.dataset.prototypeHeaderScrollSync === "true") return;
      scrollWrap.dataset.prototypeHeaderScrollSync = "true";
      const sync = () => {
        headerWrapper.scrollLeft = scrollWrap.scrollLeft;
      };
      scrollWrap.addEventListener("scroll", sync, { passive: true });
      sync();
    });
  }

  function patchBodyRows(bodyTables, key, insertIndex, targetIndex, placement, valueGetter) {
    bodyTables.forEach((bodyTable) => {
      bodyTable.querySelectorAll("tbody tr").forEach((row) => {
        if (row.querySelector(`td[${MARK}="${key}"]`)) return;
        const cells = Array.from(row.children);
        if (!cells.length) return;
        const safeTargetIndex = Math.max(0, Math.min(targetIndex, cells.length - 1));
        const referenceCell = cells[safeTargetIndex];
        const td = document.createElement("td");
        td.className = referenceCell ? referenceCell.className : "el-table__cell";
        td.setAttribute(MARK, key);
        td.classList.add("prototype-review-red");
        styleNewCell(td, key);
        td.innerHTML = `<div class="cell">${escapeHtml(valueGetter(row, referenceCell, cells))}</div>`;

        if (placement === "before") {
          (cells[insertIndex] || referenceCell).before(td);
        } else if (cells[insertIndex - 1]) {
          cells[insertIndex - 1].after(td);
        } else {
          row.appendChild(td);
        }
      });
    });
  }

  function patchColumnByHeader(targetText, label, key, placement, valueGetter) {
    document.querySelectorAll("table.el-table__header").forEach((headerTable) => {
      const row = headerTable.querySelector("thead tr");
      if (!row) return;
      const { bodyTables } = getTableContext(headerTable);
      let headers = Array.from(row.children);
      let targetIndex = headers.findIndex((cell) => textOf(cell).includes(targetText));
      if (targetIndex < 0) return;

      const existingIndex = headers.findIndex((cell) => cell.getAttribute(MARK) === key);
      if (existingIndex < 0) {
        const target = headers[targetIndex];
        const th = document.createElement("th");
        th.className = target.className;
        th.setAttribute(MARK, key);
        th.classList.add("prototype-review-red");
        styleNewCell(th, key);
        th.innerHTML = `<div class="cell">${escapeHtml(label)}</div>`;
        if (placement === "before") target.before(th);
        else target.after(th);
      }

      headers = Array.from(row.children);
      targetIndex = headers.findIndex((cell) => textOf(cell).includes(targetText));
      const newIndex = headers.findIndex((cell) => cell.getAttribute(MARK) === key);
      if (targetIndex < 0 || newIndex < 0) return;
      const bodyTargetIndex = placement === "before" ? Math.max(0, targetIndex - 1) : targetIndex;
      ensureCol(headerTable, key, newIndex);
      bodyTables.forEach((bodyTable) => ensureCol(bodyTable, key, newIndex));
      patchBodyRows(bodyTables, key, newIndex, bodyTargetIndex, placement, valueGetter);
    });
  }

  function patchInvoiceList() {
    renderPrototypeInvoiceTable();
  }

  const invoiceTabs = {
    "已驳回": {
      statusClass: "rejected",
      columns: ["出餐单号", "开票单号", "添加时间", "状态", "商品名称", "商品品牌", "用户实际支付", "供应商编号", "抬头类型", "发票抬头/税号", "驳回原因", "上传时间", "操作"],
      rows: [
        {
          itemOrderNo: "FO202609110005",
          requirementNo: "KP202609110005",
          createTime: "2026-09-11 18:12:00",
          status: "已驳回",
          productName: "肯德基 50元代金券",
          brandName: "肯德基",
          userPayAmount: "46.90",
          supplierId: "SUP-10001",
          titleType: "企业",
          invoiceTitle: "深圳市南山星河科技有限公司 税号：91440300MA9DEMO007",
          rejectReason: "发票文件模糊，无法识别金额",
          uploadTime: "2026-09-12 13:50:00",
        },
        {
          itemOrderNo: "FO202609110004",
          requirementNo: "KP202609110004",
          createTime: "2026-09-11 16:30:00",
          status: "已驳回",
          productName: "瑞幸咖啡 29元饮品券",
          brandName: "瑞幸咖啡",
          userPayAmount: "22.80",
          supplierId: "SUP-10001",
          titleType: "企业",
          invoiceTitle: "南京青禾网络科技有限公司 税号：91320104MA9DEMO006",
          rejectReason: "发票抬头与申请信息不一致",
          uploadTime: "2026-09-12 10:05:00",
        },
      ],
    },
    "已上传": {
      statusClass: "uploaded",
      columns: ["出餐单号", "开票单号", "添加时间", "状态", "商品名称", "商品品牌", "用户实际支付", "供应商编号", "抬头类型", "发票抬头/税号", "上传时间", "操作"],
      rows: [
        {
          itemOrderNo: "FO202609120004",
          requirementNo: "KP202609120004",
          createTime: "2026-09-12 14:35:00",
          status: "已上传",
          productName: "肯德基 50元代金券",
          brandName: "肯德基",
          userPayAmount: "46.90",
          supplierId: "SUP-10001",
          titleType: "企业",
          invoiceTitle: "杭州新橙餐饮管理有限公司 税号：91330106MA9DEMO005",
          uploadTime: "2026-09-13 12:10:00",
        },
        {
          itemOrderNo: "FO202609120003",
          requirementNo: "KP202609120003",
          createTime: "2026-09-12 11:06:00",
          status: "已上传",
          productName: "瑞幸咖啡 29元饮品券",
          brandName: "瑞幸咖啡",
          userPayAmount: "22.80",
          supplierId: "SUP-10001",
          titleType: "企业",
          invoiceTitle: "厦门海岸线文化传媒有限公司 税号：91350203MA9DEMO004",
          uploadTime: "2026-09-13 09:22:00",
        },
      ],
    },
    "待处理（供）": {
      statusClass: "pending",
      columns: ["出餐单号", "开票单号", "已创建时长", "添加时间", "状态", "商品名称", "商品品牌", "用户实际支付", "抬头类型", "发票抬头/税号"],
      rows: [
        {
          itemOrderNo: "FO202609140001",
          requirementNo: "KP202609140001",
          createdDuration: "1天2小时",
          createTime: "2026-09-14 09:12:00",
          status: "待处理",
          productName: "瑞幸咖啡 29元饮品券",
          brandName: "瑞幸咖啡",
          userPayAmount: "22.80",
          titleType: "企业",
          invoiceTitle: "厦门晨星信息科技有限公司 税号：91350200MA9DEMO001",
        },
        {
          itemOrderNo: "FO202609140002",
          requirementNo: "KP202609140002",
          createdDuration: "1天1小时",
          createTime: "2026-09-14 10:28:00",
          status: "待处理",
          productName: "肯德基 50元代金券",
          brandName: "肯德基",
          userPayAmount: "46.90",
          titleType: "个人",
          invoiceTitle: "个人",
        },
      ],
    },
    "处理中（供）": {
      statusClass: "processing",
      columns: ["出餐单号", "开票单号", "处理倒计时", "添加时间", "状态", "商品名称", "商品品牌", "用户实际支付", "供应商编号", "抬头类型", "发票抬头/税号"],
      rows: [
        {
          itemOrderNo: "FO202609130006",
          requirementNo: "KP202609130006",
          deadline: "0天4小时",
          createTime: "2026-09-13 15:40:00",
          status: "处理中",
          productName: "瑞幸咖啡 29元饮品券",
          brandName: "瑞幸咖啡",
          userPayAmount: "22.80",
          supplierId: "SUP-10001",
          titleType: "企业",
          invoiceTitle: "上海云朵互动科技有限公司 税号：91310100MA9DEMO002",
        },
        {
          itemOrderNo: "FO202609130007",
          requirementNo: "KP202609130007",
          deadline: "0天5小时",
          createTime: "2026-09-13 17:18:00",
          status: "处理中",
          productName: "肯德基 50元代金券",
          brandName: "肯德基",
          userPayAmount: "46.90",
          supplierId: "SUP-10001",
          titleType: "企业",
          invoiceTitle: "北京蓝鲸企业管理有限公司 税号：91110105MA9DEMO003",
        },
      ],
    },
  };

  const invoiceColumnKey = {
    "出餐单号": "itemOrderNo",
    "开票单号": "requirementNo",
    "已创建时长": "createdDuration",
    "处理倒计时": "deadline",
    "添加时间": "createTime",
    "状态": "status",
    "商品名称": "productName",
    "商品品牌": "brandName",
    "用户实际支付": "userPayAmount",
    "供应商编号": "supplierId",
    "抬头类型": "titleType",
    "发票抬头/税号": "invoiceTitle",
    "驳回原因": "rejectReason",
    "上传时间": "uploadTime",
    "操作": "action",
  };

  const invoiceColumnWidths = {
    "出餐单号": 160,
    "开票单号": 160,
    "已创建时长": 140,
    "处理倒计时": 140,
    "添加时间": 180,
    "状态": 120,
    "商品名称": 210,
    "商品品牌": 140,
    "用户实际支付": 140,
    "供应商编号": 140,
    "抬头类型": 120,
    "发票抬头/税号": 280,
    "驳回原因": 220,
    "上传时间": 180,
    "操作": 100,
  };

  function getActiveInvoiceTabName() {
    const active = document.querySelector(".el-tabs__item.is-active");
    return textOf(active) || "已上传";
  }

  function renderInvoiceCell(column, row, statusClass) {
    if (column === "状态") {
      return `<span class="prototype-invoice-status ${statusClass}">${escapeHtml(row.status)}</span>`;
    }
    if (column === "抬头类型") {
      return `<span class="prototype-review-red">${escapeHtml(row.titleType || "--")}</span>`;
    }
    if (column === "操作") {
      return `<span class="prototype-invoice-action">详情</span>`;
    }
    const key = invoiceColumnKey[column];
    return escapeHtml(row[key] || "--");
  }

  function renderPrototypeInvoiceTable() {
    const table = document.querySelector(".el-table");
    if (!table) return;
    const tabName = getActiveInvoiceTabName();
    const config = invoiceTabs[tabName] || invoiceTabs["已上传"];

    table.classList.add("prototype-hide-invoice-source");
    const pagination = table.parentElement?.querySelector(".pagination-container, .el-pagination");
    if (pagination) pagination.classList.add("prototype-hide-invoice-source");

    let wrap = document.querySelector(".prototype-invoice-table-shell");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "prototype-invoice-table-shell";
      table.after(wrap);
    }
    if (wrap.dataset.prototypeInvoiceTab === tabName) return;
    wrap.dataset.prototypeInvoiceTab = tabName;
    wrap.innerHTML = `
      <div class="prototype-invoice-table-wrap">
        <table class="prototype-invoice-table">
          <colgroup>
            ${config.columns.map((column) => `<col style="width:${invoiceColumnWidths[column] || 140}px" />`).join("")}
          </colgroup>
          <thead>
            <tr>
              ${config.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${config.rows.map((row) => `
              <tr>
                ${config.columns.map((column) => `<td>${renderInvoiceCell(column, row, config.statusClass)}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="prototype-invoice-scroll-hint">左右拖动表格底部滚动条查看全部字段</div>
      <div class="prototype-invoice-pagination">
        <span>共 ${config.rows.length} 条</span>
        <span class="prototype-invoice-page-current">1</span>
      </div>
    `;
  }

  function createInvoiceTitleTypeHeader(invoiceHeader) {
    const header = document.createElement("th");
    header.className = invoiceHeader.className;
    header.classList.add("prototype-invoice-title-type-column");
    header.setAttribute(MARK, "invoice-title-type");
    header.innerHTML = `<div class="cell">${escapeHtml("抬头类型")}</div>`;
    styleNewCell(header, "invoice-title-type");
    return header;
  }

  function createInvoiceTitleTypeCell(invoiceCell) {
    const cell = document.createElement("td");
    cell.className = invoiceCell.className;
    cell.classList.add("prototype-invoice-title-type-column");
    cell.setAttribute(MARK, "invoice-title-type");
    cell.innerHTML = `<div class="cell"></div>`;
    markTitleTypeCell(cell);
    return cell;
  }

  function insertInvoiceTitleTypeColumn(headerTable, invoiceIndex) {
    const headerRow = headerTable.querySelector("thead tr");
    const invoiceHeader = headerRow?.children[invoiceIndex];
    if (!invoiceHeader) return;
    if (!headerRow.querySelector(`[${MARK}="invoice-title-type"]`)) {
      invoiceHeader.before(createInvoiceTitleTypeHeader(invoiceHeader));
    }

    const headerColgroup = headerTable.querySelector("colgroup");
    if (headerColgroup && !headerColgroup.querySelector(`[${MARK}="invoice-title-type"]`)) {
      const col = document.createElement("col");
      col.setAttribute(MARK, "invoice-title-type");
      col.setAttribute("width", "120");
      col.style.width = "120px";
      col.style.minWidth = "120px";
      headerColgroup.children[invoiceIndex]?.before(col);
    }

    const { bodyTables } = getTableContext(headerTable);
    bodyTables.forEach((bodyTable) => {
      const bodyColgroup = bodyTable.querySelector("colgroup");
      if (bodyColgroup && !bodyColgroup.querySelector(`[${MARK}="invoice-title-type"]`)) {
        const col = document.createElement("col");
        col.setAttribute(MARK, "invoice-title-type");
        col.setAttribute("width", "120");
        col.style.width = "120px";
        col.style.minWidth = "120px";
        bodyColgroup.children[invoiceIndex]?.before(col);
      }
      bodyTable.querySelectorAll("tbody tr").forEach((row) => {
        if (row.querySelector(`[${MARK}="invoice-title-type"]`)) return;
        const invoiceCell = row.children[invoiceIndex];
        if (invoiceCell) invoiceCell.before(createInvoiceTitleTypeCell(invoiceCell));
      });
    });
  }

  function setInvoiceColumnValue(row, headers, label, value) {
    const index = headers.findIndex((header) => header.includes(label));
    if (index < 0 || !row.children[index]) return;
    setCellText(row.children[index], value);
  }

  function repairInvoiceRowValues(row, headers) {
    const orderNo = textOf(row.children[0]);
    const record = invoiceRecordMap[orderNo];
    if (!record) return;
    setInvoiceColumnValue(row, headers, "添加时间", record.createTime);
    setInvoiceColumnValue(row, headers, "状态", record.status);
    setInvoiceColumnValue(row, headers, "商品名称", record.productName);
    setInvoiceColumnValue(row, headers, "商品品牌", record.brandName);
    setInvoiceColumnValue(row, headers, "用户实际支付", record.userPayAmount);
    setInvoiceColumnValue(row, headers, "供应商编号", record.supplierId);
    setInvoiceColumnValue(row, headers, "抬头类型", record.titleType);
    setInvoiceColumnValue(row, headers, "发票抬头/税号", invoiceTitleText(record));
    setInvoiceColumnValue(row, headers, "驳回原因", record.rejectReason || "");
    setInvoiceColumnValue(row, headers, "上传时间", record.uploadTime || "");
    const titleTypeIndex = headers.findIndex((header) => header.includes("抬头类型"));
    if (titleTypeIndex >= 0 && row.children[titleTypeIndex]) markTitleTypeCell(row.children[titleTypeIndex]);
  }

  function rebuildInvoiceListTable() {
    document.querySelectorAll("table.el-table__header").forEach((headerTable) => {
      const headerRow = headerTable.querySelector("thead tr");
      if (!headerRow) return;
      let headers = Array.from(headerRow.children);
      const invoiceIndex = headers.findIndex((cell) => textOf(cell).includes("发票抬头/税号"));
      if (invoiceIndex < 0) return;
      insertInvoiceTitleTypeColumn(headerTable, invoiceIndex);
      headers = Array.from(headerRow.children).map(textOf);
      const { bodyTables } = getTableContext(headerTable);
      bodyTables.forEach((bodyTable) => {
        bodyTable.querySelectorAll("tbody tr").forEach((row) => repairInvoiceRowValues(row, headers));
      });
    });
  }

  function setCellText(cell, value) {
    if (!cell) return;
    const content = cell.querySelector(".cell") || cell;
    content.textContent = value;
  }

  function guessUserPayAmountFromCells(cells, headers) {
    const orderIndex = headers.findIndex((cell) => cell.includes("出餐单号"));
    const productIndex = headers.findIndex((cell) => cell.includes("商品名称"));
    const orderNo = orderIndex >= 0 ? textOf(cells[orderIndex]) : "";
    const productName = productIndex >= 0 ? textOf(cells[productIndex]) : "";
    const byOrder = {
      FO202609140001: "22.80",
      FO202609140002: "46.90",
      FO202609130006: "22.80",
      FO202609130007: "46.90",
      FO202609120003: "22.80",
      FO202609120004: "46.90",
      FO202609110004: "22.80",
      FO202609110005: "46.90",
    };
    if (byOrder[orderNo]) return byOrder[orderNo];
    if (productName.includes("肯德基")) return "46.90";
    if (productName.includes("麦当劳")) return "34.80";
    if (productName.includes("38元")) return "26.60";
    if (productName.includes("瑞幸")) return "22.80";
    return "--";
  }

  const invoiceRecordMap = {
    FO202609140001: {
      createdDuration: "1天2小时",
      createTime: "2026-09-14 09:12:00",
      status: "待处理",
      productName: "瑞幸咖啡 29元饮品券",
      userPayAmount: "22.80",
      brandName: "瑞幸咖啡",
      supplierId: "--",
      titleType: "企业",
      invoiceTitle: "厦门晨星信息科技有限公司",
      taxpayerNo: "91350200MA9DEMO001",
    },
    FO202609140002: {
      createdDuration: "1天1小时",
      createTime: "2026-09-14 10:28:00",
      status: "待处理",
      productName: "肯德基 50元代金券",
      userPayAmount: "46.90",
      brandName: "肯德基",
      supplierId: "--",
      titleType: "个人",
      invoiceTitle: "个人",
      taxpayerNo: "",
    },
    FO202609130006: {
      createTime: "2026-09-13 15:40:00",
      status: "处理中",
      productName: "瑞幸咖啡 29元饮品券",
      userPayAmount: "22.80",
      brandName: "瑞幸咖啡",
      supplierId: "SUP-10001",
      titleType: "企业",
      invoiceTitle: "上海云朵互动科技有限公司",
      taxpayerNo: "91310100MA9DEMO002",
    },
    FO202609130007: {
      createTime: "2026-09-13 17:18:00",
      status: "处理中",
      productName: "肯德基 50元代金券",
      userPayAmount: "46.90",
      brandName: "肯德基",
      supplierId: "SUP-10001",
      titleType: "企业",
      invoiceTitle: "北京蓝鲸企业管理有限公司",
      taxpayerNo: "91110105MA9DEMO003",
    },
    FO202609120003: {
      createTime: "2026-09-12 11:06:00",
      status: "已上传",
      productName: "瑞幸咖啡 29元饮品券",
      userPayAmount: "22.80",
      brandName: "瑞幸咖啡",
      supplierId: "SUP-10001",
      titleType: "企业",
      invoiceTitle: "厦门海岸线文化传媒有限公司",
      taxpayerNo: "91350203MA9DEMO004",
      uploadTime: "2026-09-13 09:22:00",
    },
    FO202609120004: {
      createTime: "2026-09-12 14:35:00",
      status: "已上传",
      productName: "肯德基 50元代金券",
      userPayAmount: "46.90",
      brandName: "肯德基",
      supplierId: "SUP-10001",
      titleType: "企业",
      invoiceTitle: "杭州新橙餐饮管理有限公司",
      taxpayerNo: "91330106MA9DEMO005",
      uploadTime: "2026-09-13 12:10:00",
    },
    FO202609110004: {
      createTime: "2026-09-11 16:30:00",
      status: "已驳回",
      productName: "瑞幸咖啡 29元饮品券",
      userPayAmount: "22.80",
      brandName: "瑞幸咖啡",
      supplierId: "SUP-10001",
      titleType: "企业",
      invoiceTitle: "南京青禾网络科技有限公司",
      taxpayerNo: "91320104MA9DEMO006",
      rejectReason: "发票抬头与申请信息不一致",
      uploadTime: "2026-09-12 10:05:00",
    },
    FO202609110005: {
      createTime: "2026-09-11 18:12:00",
      status: "已驳回",
      productName: "肯德基 50元代金券",
      userPayAmount: "46.90",
      brandName: "肯德基",
      supplierId: "SUP-10001",
      titleType: "企业",
      invoiceTitle: "深圳市南山星河科技有限公司",
      taxpayerNo: "91440300MA9DEMO007",
      rejectReason: "发票文件模糊，无法识别金额",
      uploadTime: "2026-09-12 13:50:00",
    },
  };

  function invoiceTitleText(record) {
    return record.taxpayerNo ? `${record.invoiceTitle} 税号：${record.taxpayerNo}` : record.invoiceTitle;
  }

  function cleanCellState(cell) {
    if (!cell) return;
    cell.classList.remove("prototype-review-red");
    cell.removeAttribute(MARK);
    cell.style.width = "";
    cell.style.minWidth = "";
    cell.style.maxWidth = "";
  }

  function markTitleTypeCell(cell) {
    if (!cell) return;
    cell.classList.add("prototype-review-red");
    cell.setAttribute(MARK, "invoice-title-type");
    styleNewCell(cell, "invoice-title-type");
  }

  function setHeaderLabel(cell, label, isNew) {
    if (!cell) return;
    const content = cell.querySelector(".cell") || cell;
    content.textContent = label;
    cleanCellState(cell);
    if (isNew) markTitleTypeCell(cell);
  }

  function trimExtraCells(row, expectedLength) {
    Array.from(row.children).forEach((cell, index) => {
      if (index >= expectedLength) cell.style.display = "none";
      else cell.style.display = "";
    });
  }

  function trimExtraCols(table, expectedLength) {
    const cols = Array.from(table.querySelectorAll("colgroup col"));
    cols.forEach((col, index) => {
      if (index >= expectedLength) col.remove();
    });
  }

  function columnClassKey(cell) {
    return Array.from(cell?.classList || []).find((name) => /^el-table_\d+_column_\d+$/.test(name)) || "";
  }

  function semanticWidth(label) {
    if (label.includes("供应商编号")) return 200;
    if (label.includes("抬头类型")) return 120;
    if (label.includes("发票抬头/税号")) return 220;
    return null;
  }

  function applySemanticWidth(table, index, label) {
    const width = semanticWidth(label);
    if (!table || !Number.isFinite(width)) return;
    const cells = Array.from(table.querySelectorAll("tr")).flatMap((row) => Array.from(row.children)).filter((cell) => {
      const cellIndex = Array.from(cell.parentElement?.children || []).indexOf(cell);
      return cellIndex === index;
    });
    cells.forEach((cell) => styleNewCell(cell, label.includes("抬头类型") ? "invoice-title-type" : "invoice-semantic"));
    const col = table.querySelectorAll("colgroup col")[index];
    if (col) {
      col.style.width = `${width}px`;
      col.setAttribute("width", String(width));
    }
  }

  function chooseBodyCell(headerCell, candidates, record, label) {
    if (!candidates.length) return null;
    if (headerCell.getAttribute(MARK) === "invoice-title-type") {
      return candidates.find((cell) => cell.getAttribute(MARK) === "invoice-title-type") || candidates.find((cell) => looksLikeTitleType(textOf(cell))) || candidates[0];
    }
    if (label.includes("发票抬头/税号")) {
      return candidates.find((cell) => {
        const text = textOf(cell);
        return text.includes(record.invoiceTitle) || text.includes(record.taxpayerNo) || text === "个人";
      }) || candidates[candidates.length - 1];
    }
    return candidates[0];
  }

  function rebuildInvoiceBodyRow(row, headerCells, record) {
    const originalCells = Array.from(row.children);
    const used = new Set();
    const orderedCells = headerCells.map((headerCell) => {
      const label = textOf(headerCell);
      const key = columnClassKey(headerCell);
      const candidates = originalCells.filter((cell) => !used.has(cell) && columnClassKey(cell) === key);
      const selected = chooseBodyCell(headerCell, candidates, record, label);
      if (selected) used.add(selected);
      return selected;
    });
    if (orderedCells.some((cell) => !cell)) return;

    row.replaceChildren(...orderedCells);
    const headers = headerCells.map(textOf);
    const createdDurationIndex = headers.findIndex((label) => label.includes("已创建时长"));
    const createTimeIndex = headers.findIndex((label) => label.includes("添加时间"));
    const statusIndex = headers.findIndex((label) => label === "状态");
    const productIndex = headers.findIndex((label) => label.includes("商品名称"));
    const brandIndex = headers.findIndex((label) => label.includes("商品品牌"));
    const userPayIndex = headers.findIndex((label) => label.includes("用户实际支付"));
    const supplierIndex = headers.findIndex((label) => label.includes("供应商编号"));
    const titleTypeIndex = headers.findIndex((label) => label.includes("抬头类型"));
    const invoiceIndex = headers.findIndex((label) => label.includes("发票抬头/税号"));
    const rejectIndex = headers.findIndex((label) => label.includes("驳回原因"));
    const uploadIndex = headers.findIndex((label) => label.includes("上传时间"));

    if (createdDurationIndex >= 0 && record.createdDuration) setCellText(orderedCells[createdDurationIndex], record.createdDuration);
    if (createTimeIndex >= 0) setCellText(orderedCells[createTimeIndex], record.createTime);
    if (statusIndex >= 0) setCellText(orderedCells[statusIndex], record.status);
    if (productIndex >= 0) setCellText(orderedCells[productIndex], record.productName);
    if (brandIndex >= 0) setCellText(orderedCells[brandIndex], record.brandName);
    if (userPayIndex >= 0) setCellText(orderedCells[userPayIndex], record.userPayAmount);
    if (supplierIndex >= 0) setCellText(orderedCells[supplierIndex], record.supplierId);
    if (titleTypeIndex >= 0) {
      setCellText(orderedCells[titleTypeIndex], record.titleType);
      markTitleTypeCell(orderedCells[titleTypeIndex]);
    }
    if (invoiceIndex >= 0) setCellText(orderedCells[invoiceIndex], invoiceTitleText(record));
    if (rejectIndex >= 0 && record.rejectReason) setCellText(orderedCells[rejectIndex], record.rejectReason);
    if (uploadIndex >= 0 && record.uploadTime) setCellText(orderedCells[uploadIndex], record.uploadTime);

    orderedCells.forEach((cell, index) => {
      const label = headers[index];
      if (!label.includes("抬头类型")) cleanCellState(cell);
      if (label.includes("抬头类型")) markTitleTypeCell(cell);
      const width = semanticWidth(label);
      if (Number.isFinite(width)) styleNewCell(cell, label.includes("抬头类型") ? "invoice-title-type" : "invoice-semantic");
    });
  }

  function normalizeInvoiceListSemanticColumns() {
    document.querySelectorAll("table.el-table__header").forEach((headerTable) => {
      const headerRow = headerTable.querySelector("thead tr");
      if (!headerRow) return;
      const headerCells = Array.from(headerRow.children);
      const invoiceIndex = headerCells.findIndex((cell) => textOf(cell).includes("发票抬头/税号"));
      const userPayIndex = headerCells.findIndex((cell) => textOf(cell).includes("用户实际支付"));
      if (invoiceIndex < 0 || userPayIndex < 0) return;

      const hasSupplier = headerCells.some((cell) => textOf(cell).includes("供应商编号"));
      const titleTypeIndex = invoiceIndex - 1;
      const supplierIndex = hasSupplier ? invoiceIndex - 2 : -1;
      if (titleTypeIndex < 0 || (hasSupplier && supplierIndex < 0)) return;

      if (hasSupplier) setHeaderLabel(headerCells[supplierIndex], "供应商编号", false);
      setHeaderLabel(headerCells[titleTypeIndex], "抬头类型", true);
      setHeaderLabel(headerCells[invoiceIndex], "发票抬头/税号", false);

      const expectedLength = headerCells.length;
      trimExtraCols(headerTable, expectedLength);
      headerCells.forEach((cell, index) => applySemanticWidth(headerTable, index, textOf(cell)));

      const { bodyTables } = getTableContext(headerTable);
      bodyTables.forEach((bodyTable) => {
        trimExtraCols(bodyTable, expectedLength);
        bodyTable.querySelectorAll("tbody tr").forEach((row) => {
          const cells = Array.from(row.children);
          const orderNo = textOf(cells[0]);
          const record = invoiceRecordMap[orderNo];
          if (!record) return;
          rebuildInvoiceBodyRow(row, headerCells, record);
          headerCells.forEach((cell, index) => applySemanticWidth(bodyTable, index, textOf(cell)));
        });
      });
    });
  }

  function normalizeInvoiceListIdentityColumns() {
    document.querySelectorAll("table.el-table__header").forEach((headerTable) => {
      const headerRow = headerTable.querySelector("thead tr");
      if (!headerRow) return;
      const headers = Array.from(headerRow.children);
      const supplierIndex = headers.findIndex((cell) => textOf(cell).includes("供应商编号"));
      const userPayIndex = headers.findIndex((cell) => textOf(cell).includes("用户实际支付"));
      const titleTypeIndex = headers.findIndex((cell) => textOf(cell).includes("抬头类型"));
      const invoiceTitleIndex = headers.findIndex((cell) => textOf(cell).includes("发票抬头/税号"));
      if (titleTypeIndex < 0 || invoiceTitleIndex < 0) return;

      const { bodyTables } = getTableContext(headerTable);
      bodyTables.forEach((bodyTable) => {
        bodyTable.querySelectorAll("tbody tr").forEach((row) => {
          const cells = Array.from(row.children);
          const titleTypeCell = cells[titleTypeIndex];
          const invoiceTitleCell = cells[invoiceTitleIndex];
          if (!titleTypeCell || !invoiceTitleCell) return;

          const expectedTitleType = guessTitleType(textOf(invoiceTitleCell));
          const titleTypeText = textOf(titleTypeCell);
          const supplierCell = supplierIndex >= 0 ? cells[supplierIndex] : null;
          const supplierText = textOf(supplierCell);

          if (!supplierCell && userPayIndex >= 0) {
            const userPayCell = cells[userPayIndex];
            if (userPayCell && (looksLikeSupplierId(textOf(userPayCell)) || looksLikeTitleType(textOf(userPayCell)))) {
              userPayCell.classList.remove("prototype-review-red");
              userPayCell.removeAttribute(MARK);
              setCellText(userPayCell, guessUserPayAmountFromCells(cells, headers.map(textOf)));
              titleTypeCell.classList.add("prototype-review-red");
              titleTypeCell.setAttribute(MARK, "invoice-title-type");
              styleNewCell(titleTypeCell, "invoice-title-type");
            }
          }
          if (supplierCell && looksLikeTitleType(supplierText) && looksLikeSupplierId(titleTypeText)) {
            setCellText(supplierCell, titleTypeText);
          }
          if (!looksLikeTitleType(titleTypeText) || looksLikeSupplierId(titleTypeText)) {
            setCellText(titleTypeCell, expectedTitleType);
          }
        });
      });
    });
  }

  function normalizeSubsidyStatus() {
    document.querySelectorAll("table.el-table__header").forEach((headerTable) => {
      const headerRow = headerTable.querySelector("thead tr");
      if (!headerRow) return;
      const headers = Array.from(headerRow.children);
      const statusIndex = headers.findIndex((cell) => textOf(cell).includes("补贴状态"));
      if (statusIndex < 0) return;
      const root = headerTable.closest(".el-table") || document;
      root.querySelectorAll("table.el-table__body tbody tr").forEach((row) => {
        const cells = Array.from(row.children);
        const cell = cells[statusIndex];
        if (!cell) return;
        const label = cell.querySelector(".el-tag, span, div") || cell;
        const normalized = textOf(cell).includes("已补贴") ? "已补贴" : "未补贴";
        label.textContent = normalized;
        label.style.color = normalized === "已补贴" ? "#67c23a" : "#e6a23c";
        label.style.background = normalized === "已补贴" ? "#f0f9eb" : "#fdf6ec";
        label.style.borderColor = normalized === "已补贴" ? "#e1f3d8" : "#faecd8";
      });
    });
  }

  function getAfterSalesFilterState() {
    return {
      acceptStatus: document.querySelector('[data-prototype-after-sales-filter="acceptStatus"]')?.value || "",
      subsidyStatus: document.querySelector('[data-prototype-after-sales-filter="subsidyStatus"]')?.value || "",
    };
  }

  function getAfterSalesTableIndexes() {
    const headerTable = document.querySelector("table.el-table__header");
    const headers = headerTable
      ? Array.from(headerTable.querySelectorAll("thead tr:first-child > th")).map(textOf)
      : [];
    return {
      headers,
      acceptStatus: headers.findIndex((label) => label.includes("接单状态")),
      subsidyStatus: headers.findIndex((label) => label.includes("补贴状态")),
    };
  }

  function applyAfterSalesStatusFilters() {
    const state = getAfterSalesFilterState();
    const indexes = getAfterSalesTableIndexes();
    if (indexes.acceptStatus < 0 && indexes.subsidyStatus < 0) return;
    document.querySelectorAll("table.el-table__body tbody tr").forEach((row) => {
      const cells = Array.from(row.children);
      const acceptText = textOf(cells[indexes.acceptStatus]);
      const subsidyText = textOf(cells[indexes.subsidyStatus]);
      const acceptMatch = !state.acceptStatus || acceptText === state.acceptStatus;
      const subsidyMatch = !state.subsidyStatus || subsidyText === state.subsidyStatus;
      row.style.display = acceptMatch && subsidyMatch ? "" : "none";
    });
  }

  function closeInvoiceSwitchInRow(row) {
    const switchNode = row?.querySelector(".el-switch");
    if (!switchNode) return;
    switchNode.classList.remove("is-checked");
    switchNode.setAttribute("aria-checked", "false");
    const input = switchNode.querySelector("input");
    if (input) input.checked = false;
  }

  function patchSupplierCooperationSwitch() {
    document.querySelectorAll("table.el-table__body tbody tr").forEach((row) => {
      Array.from(row.querySelectorAll("button, span, a")).forEach((node) => {
        const text = textOf(node);
        if (!text.includes("停止合作") || node.dataset.prototypeStopCoopBound === "true") return;
        node.dataset.prototypeStopCoopBound = "true";
        node.addEventListener("click", () => {
          closeInvoiceSwitchInRow(row);
          setTimeout(() => closeInvoiceSwitchInRow(row), 80);
        }, true);
      });
    });
  }

  function patchAfterSalesFilters() {
    const form = document.querySelector(".el-form.el-form--inline");
    if (!form) return;

    let container = form.querySelector(".prototype-after-sales-filter-group");
    if (!container) {
      container = document.createElement("div");
      container.className = "prototype-after-sales-filter-group";
      container.innerHTML = `
        <div class="prototype-after-sales-filter-item">
          <label class="prototype-after-sales-filter-label" for="prototype-accept-status-filter">接单状态</label>
          <select id="prototype-accept-status-filter" class="prototype-after-sales-filter-select" data-prototype-after-sales-filter="acceptStatus">
            <option value="">全部</option>
            <option value="已接单">已接单</option>
            <option value="待接单">待接单</option>
          </select>
        </div>
        <div class="prototype-after-sales-filter-item">
          <label class="prototype-after-sales-filter-label" for="prototype-subsidy-status-filter">补贴状态</label>
          <select id="prototype-subsidy-status-filter" class="prototype-after-sales-filter-select" data-prototype-after-sales-filter="subsidyStatus">
            <option value="">全部</option>
            <option value="已补贴">已补贴</option>
            <option value="未补贴">未补贴</option>
          </select>
        </div>
      `;
      const firstDateRange = form.querySelector(".el-date-editor");
      if (firstDateRange?.parentElement?.parentElement) {
        firstDateRange.parentElement.parentElement.after(container);
      } else {
        form.appendChild(container);
      }
    }

    container.querySelectorAll("select").forEach((select) => {
      if (select.dataset.prototypeBound === "true") return;
      select.dataset.prototypeBound = "true";
      select.addEventListener("change", applyAfterSalesStatusFilters);
    });

    const resetButton = Array.from(form.querySelectorAll("button")).find((button) => textOf(button) === "重置");
    if (resetButton && resetButton.dataset.prototypeAfterSalesReset !== "true") {
      resetButton.dataset.prototypeAfterSalesReset = "true";
      resetButton.addEventListener("click", () => {
        container.querySelectorAll("select").forEach((select) => {
          select.value = "";
        });
        setTimeout(applyAfterSalesStatusFilters, 80);
      }, true);
    }

    applyAfterSalesStatusFilters();
  }

  function showToast(message) {
    const old = document.querySelector(".prototype-review-toast");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.className = "prototype-review-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  }

  function showReturnDialog() {
    if (document.querySelector(".prototype-review-mask")) return;
    const mask = document.createElement("div");
    mask.className = "prototype-review-mask";
    mask.innerHTML = `
      <div class="prototype-review-dialog" role="dialog" aria-modal="true">
        <div class="prototype-review-dialog-title">退回客服工作台</div>
        <div class="prototype-review-dialog-body">确定把该工单退回客服工作台吗？\n退回后，该工单将不会出现在点餐后台和供应商端</div>
        <div class="prototype-review-dialog-footer">
          <button type="button" class="cancel">取消</button>
          <button type="button" class="confirm">确定退回</button>
        </div>
      </div>
    `;
    mask.querySelector(".cancel").addEventListener("click", () => mask.remove());
    mask.querySelector(".confirm").addEventListener("click", () => {
      mask.remove();
      showToast("退回成功");
    });
    mask.addEventListener("click", (event) => {
      if (event.target === mask) mask.remove();
    });
    document.body.appendChild(mask);
  }

  function patchReturnCustomerButton() {
    document.querySelectorAll("table.el-table__header").forEach((headerTable) => {
      const headerRow = headerTable.querySelector("thead tr");
      if (!headerRow) return;
      const headers = Array.from(headerRow.children);
      const acceptIndex = headers.findIndex((cell) => textOf(cell).includes("接单状态"));
      const actionIndex = headers.findIndex((cell) => textOf(cell).includes("操作"));
      if (acceptIndex < 0 || actionIndex < 0) return;
      const root = headerTable.closest(".el-table") || document;
      root.querySelectorAll("table.el-table__body tbody tr").forEach((row) => {
        const cells = Array.from(row.children);
        const acceptCell = cells[acceptIndex];
        const actionCell = cells[actionIndex];
        if (!acceptCell || !actionCell || !textOf(acceptCell).includes("待接单")) return;
        if (actionCell.querySelector("[data-prototype-return-customer]")) return;
        const button = document.createElement("span");
        button.setAttribute("data-prototype-return-customer", "true");
        button.className = "prototype-review-return";
        button.textContent = "退回客服工作台";
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          showReturnDialog();
        });
        const cell = actionCell.querySelector(".cell") || actionCell;
        cell.appendChild(button);
      });
    });
  }

  function patchAfterSalesList() {
    patchAfterSalesFilters();
    normalizeSubsidyStatus();
    patchReturnCustomerButton();
  }

  let timer = 0;
  function run() {
    ensureStyle();
    markChangedMenus();
    ensureReviewGuide();
    ensureInlineNotes();
    const path = window.location.pathname;
    if (path.includes("/supplier/list")) patchSupplierCooperationSwitch();
    if (path.includes("/order/invoice-list")) patchInvoiceList();
    if (path.includes("/order/after-sales-list")) patchAfterSalesList();
    syncHeaderScroll();
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(run, 1200);
})();
