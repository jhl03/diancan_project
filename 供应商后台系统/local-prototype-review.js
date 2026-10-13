(function () {
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
      .prototype-merge-upload-bar {
        margin: 8px 0 12px;
      }
      .prototype-merge-upload-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        padding: 0 16px;
        border: none;
        border-radius: 4px;
        background: #409eff;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }
      .prototype-merge-upload-check {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      .prototype-merge-upload-check:disabled {
        cursor: not-allowed;
        opacity: 0.45;
      }
      .prototype-merge-select-all {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
      }
      .prototype-merge-select-all input {
        width: 16px;
        height: 16px;
        margin: 0;
        cursor: pointer;
      }
      .prototype-merge-select-all input:disabled {
        cursor: not-allowed;
        opacity: 0.45;
      }
      .prototype-review-toast {
        position: fixed;
        left: 50%;
        top: 96px;
        z-index: 100001;
        transform: translateX(-50%);
        padding: 10px 18px;
        border-radius: 6px;
        background: rgba(30, 41, 59, 0.94);
        color: #fff;
        font-size: 14px;
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.22);
      }
      .prototype-new-filter-item {
        position: relative;
      }
      .prototype-new-filter-item .el-input__inner {
        border-color: ${RED} !important;
      }
      .prototype-new-filter-item .el-input__inner::placeholder {
        color: ${RED} !important;
        opacity: 0.78;
      }
      .prototype-new-config-card {
        border: 1px solid #ffccc7 !important;
        box-shadow: 0 2px 8px rgba(245, 108, 108, 0.08);
      }
      .prototype-new-config-card h3,
      .prototype-new-config-card .description,
      .prototype-new-config-card .prototype-config-label {
        color: ${RED} !important;
      }
      .prototype-new-config-card .el-input__inner {
        border-color: ${RED} !important;
      }
      .prototype-new-config-card .prototype-config-unit {
        color: ${RED} !important;
      }
      .prototype-settlement-derived {
        color: ${RED} !important;
        font-weight: 700 !important;
      }
      .prototype-merge-dialog-mask {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.45);
      }
      .prototype-merge-dialog {
        width: 620px;
        max-width: calc(100vw - 48px);
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 18px 48px rgba(15, 23, 42, 0.22);
        overflow: hidden;
      }
      .prototype-merge-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px 12px;
        color: #303133;
        font-size: 18px;
        font-weight: 500;
      }
      .prototype-merge-dialog-close {
        border: none;
        background: transparent;
        color: #909399;
        cursor: pointer;
        font-size: 22px;
        line-height: 1;
      }
      .prototype-merge-dialog-body {
        padding: 0 20px 18px;
      }
      .prototype-merge-info {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #ebeef5;
        margin-bottom: 18px;
      }
      .prototype-merge-info td {
        border: 1px solid #ebeef5;
        padding: 12px;
        color: #303133;
      }
      .prototype-merge-info-label {
        width: 150px;
        background: #f5f7fa;
        color: #606266;
        font-weight: 700;
      }
      .prototype-merge-upload-row {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #909399;
        font-size: 13px;
      }
      .prototype-merge-upload-row strong {
        color: #303133;
        font-size: 14px;
      }
      .prototype-merge-upload-file {
        height: 32px;
        padding: 0 16px;
        border: 1px solid #a0cfff;
        border-radius: 4px;
        background: #ecf5ff;
        color: #409eff;
        font-weight: 600;
      }
      .prototype-merge-dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 12px 20px 18px;
      }
      .prototype-merge-dialog-footer button {
        height: 32px;
        padding: 0 16px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        background: #fff;
        color: #606266;
        cursor: pointer;
      }
      .prototype-merge-dialog-footer .primary {
        border-color: #409eff;
        background: #409eff;
        color: #fff;
      }
    `;
    document.head.appendChild(style);
  }

  function guessTitleType(text) {
    return /个人/.test(text || "") ? "个人" : "企业";
  }

  const reviewGuides = {
    "/order/after-sale-subsidy": {
      title: "本页改动说明：售后补贴单",
      items: [
        ["抬头类型", "新增红字字段，显示在发票抬头/税号左侧；数据源为客服本地生活工作台接口。"],
        ["供应商名称", "三个 Tab 的筛选区新增“供应商名称”；列表在商品品牌后新增“供应商名称”，数据源取真实接补贴单的供应商名称。"],
        ["发票上传/重传", "上传发票与重新上传发票弹窗同步展示抬头类型，用于校验发票主体。"],
        ["合并上传", "处理中列表支持勾选多张未结束工单后点击“合并上传”；已驳回列表每条工单前展示可勾选方块，支持勾选工单后点击“重新合并上传”。处理中已结束工单不可选，已驳回工单均可选。未勾选时提示“请选择要合并上传发票的工单”；先校验发票抬头/税号，不一致提示“选择的发票抬头/税号不一样”；再校验发票类型，不一致提示“所选发票类型不一样”；校验通过后弹出与上传弹窗内容一致的合并上传发票弹窗，开票金额=所选工单用户支付价合计。"],
      ],
      notes: [],
    },
    "/order/compensation": {
      title: "本页改动说明：补偿单列表",
      items: [
        ["用户名称", "新增红字字段，显示在商品名称右侧；数据源取该工单的发票抬头。"],
      ],
      notes: [],
    },
    "/supplier/settlement-record": {
      title: "本页改动说明：二级供应商结算",
      items: [
        ["售后补贴单", "新增交易类型“售后补贴单”；关联单号取补贴单号；变动金额=实际补贴金额-一级供应商设置的补贴抽成金额。"],
      ],
      notes: [],
    },
    "/supplier/setting": {
      title: "本页改动说明：二级供应商配置",
      items: [
        ["二级供应商补贴单抽成", "新增配置卡片，卡片样式与“二级供应商加价比例”一致；说明文字为“二级供应商补贴金额为实际补贴金额- 配置的抽成金额”。"],
      ],
      notes: [],
    },
  };

  function currentGuideConfig() {
    const path = window.location.pathname;
    return Object.keys(reviewGuides).find((key) => path.includes(key));
  }

  const changedRoutes = [
    { path: "/order/after-sale-subsidy", text: "售后补贴单" },
    { path: "/order/compensation", text: "补偿单列表" },
    { path: "/supplier/setting", text: "二级供应商配置" },
    { path: "/supplier/settlement-record", text: "二级供应商结算" },
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
    const expectedItems = config.items.flat();
    if (currentGuide && expectedItems.every((item) => textOf(currentGuide).includes(item))) return;
    if (currentGuide) currentGuide.remove();
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
      Array.from(document.querySelectorAll("th .cell, td .cell, button, label")).forEach((node) => {
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

  function guessUserName(text) {
    const value = text || "";
    if (value.includes("肯德基")) return "厦门肯德基有限公司";
    if (value.includes("麦当劳")) return "金拱门（中国）有限公司";
    if (value.includes("38元") || value.includes("厦门")) return "上海云朵互动科技有限公司";
    if (value.includes("瑞幸")) return "厦门晨星信息科技有限公司";
    return "该工单发票抬头";
  }

  function columnWidth(key) {
    if (key === "compensation-user-name") return 170;
    if (key === "after-sale-supplier-name") return 210;
    if (key === "invoice-title-type") return 120;
    return 140;
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

  function showToast(message) {
    const old = document.querySelector(".prototype-review-toast");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.className = "prototype-review-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
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

  function patchAfterSaleSubsidy() {
    patchColumnByHeader("发票抬头/税号", "抬头类型", "invoice-title-type", "before", (_row, titleCell) =>
      guessTitleType(textOf(titleCell)),
    );
    patchColumnByHeader("商品品牌", "供应商名称", "after-sale-supplier-name", "after", (row) => {
      const subsidyNo = textOf(row).match(/SUB\d+/)?.[0] || "";
      return supplierNameBySubsidyNo[subsidyNo] || "待补充供应商";
    });
    patchSupplierNameFilter();
    patchInvoiceUploadDialogs();
    patchAfterSaleMergeUpload();
  }

  const supplierNameBySubsidyNo = {
    SUB202609140001: "厦门晨星信息科技有限公司",
    SUB202609140002: "厦门肯德基有限公司",
    SUB202609140003: "金拱门（中国）有限公司",
    SUB202609140004: "上海云朵互动科技有限公司",
    SUB202609140101: "厦门惠生活供应链有限公司",
    SUB202609140102: "厦门肯德基有限公司",
    SUB202609150103: "北京优选数字科技有限公司",
    SUB202609150104: "金拱门（中国）有限公司",
    SUB202609150105: "厦门肯德基有限公司",
    SUB202609130201: "金拱门（中国）有限公司",
    SUB202609130202: "厦门晨星信息科技有限公司",
    SUB202609120301: "厦门肯德基有限公司",
    SUB202609120302: "金拱门（中国）有限公司",
  };

  function applySupplierNameFilter() {
    const filter = String(window.__prototypeSupplierNameFilter || "").trim();
    document.querySelectorAll("table.el-table__body tbody tr").forEach((row) => {
      const supplierCell = row.querySelector(`td[${MARK}="after-sale-supplier-name"]`);
      if (!supplierCell) return;
      row.style.display = !filter || textOf(supplierCell).includes(filter) ? "" : "none";
    });
  }

  function patchSupplierNameFilter() {
    if (!window.location.pathname.includes("/order/after-sale-subsidy")) return;
    const form = document.querySelector(".app-main .app-container .el-form") || document.querySelector(".el-form");
    if (!form) return;
    let item = form.querySelector(`div[${MARK}="after-sale-supplier-filter"]`);
    if (!item) {
      item = document.createElement("div");
      item.className = "el-form-item prototype-new-filter-item";
      item.setAttribute(MARK, "after-sale-supplier-filter");
      item.innerHTML = `
        <div class="el-form-item__content">
          <div class="el-input">
            <input class="el-input__inner" type="text" placeholder="请输入供应商名称" aria-label="供应商名称" />
          </div>
        </div>
      `;
      form.appendChild(item);
    }
    const input = item.querySelector("input");
    if (!input) return;
    input.value = window.__prototypeSupplierNameFilter || "";
    if (input.dataset.prototypeSupplierFilterBound !== "true") {
      input.dataset.prototypeSupplierFilterBound = "true";
      input.addEventListener("input", () => {
        window.__prototypeSupplierNameFilter = input.value;
        applySupplierNameFilter();
      });
      input.addEventListener("change", applySupplierNameFilter);
    }
    applySupplierNameFilter();
  }

  function isProcessingTabActive() {
    const active = document.querySelector(".el-tabs__item.is-active, .el-tabs__item[aria-selected='true']");
    return textOf(active).includes("处理中");
  }

  function isAfterSaleSelectionTabActive() {
    const active = document.querySelector(".el-tabs__item.is-active, .el-tabs__item[aria-selected='true']");
    const text = textOf(active);
    return text.includes("处理中") || text.includes("已驳回");
  }

  function isRejectedTabActive() {
    const active = document.querySelector(".el-tabs__item.is-active, .el-tabs__item[aria-selected='true']");
    return textOf(active).includes("已驳回");
  }

  function getRowKey(row, index) {
    return textOf(row.children[1] || row.children[0] || row).slice(0, 80) || `row-${index}`;
  }

  function isExpiredAfterSaleRow(row) {
    return textOf(row).includes("已结束");
  }

  function normalizeAmount(value) {
    const matched = String(value || "").match(/\d+(?:\.\d+)?/);
    return matched ? Number(matched[0]) : 0;
  }

  function invoicePartsFromCell(cell) {
    const content = cell?.querySelector(".cell") || cell;
    const children = Array.from(content?.children || []).map(textOf).filter(Boolean);
    if (children.length >= 2) return { invoiceTitle: children[0], taxpayerNo: children[1] };
    const raw = textOf(cell);
    const tax = raw.match(/[0-9][0-9A-Z]{14,}/)?.[0] || "";
    return {
      invoiceTitle: tax ? raw.replace(tax, "").trim() : raw,
      taxpayerNo: tax,
    };
  }

  function mergeRecordFromRow(row) {
    const cells = Array.from(row.children);
    const titleTypeIndex = cells.findIndex((cell) => cell.getAttribute(MARK) === "invoice-title-type");
    const invoiceIndex = [titleTypeIndex - 1, titleTypeIndex + 1].find((index) =>
      index >= 0 && /[0-9][0-9A-Z]{14,}/.test(textOf(cells[index]))
    );
    const invoice = invoicePartsFromCell(cells[invoiceIndex]);
    const amountIndex = Math.max(titleTypeIndex, invoiceIndex || 0) + 1;
    return {
      titleType: textOf(cells[titleTypeIndex]) || guessTitleType(invoice.invoiceTitle),
      invoiceTitle: invoice.invoiceTitle,
      taxpayerNo: invoice.taxpayerNo,
      userPayAmount: normalizeAmount(textOf(cells[amountIndex])),
    };
  }

  function syncInvoiceTitleTypeCells() {
    document.querySelectorAll("table.el-table__body tbody tr").forEach((row) => {
      const markedCell = row.querySelector(`td[${MARK}="invoice-title-type"]`);
      if (!markedCell) return;
      const cells = Array.from(row.children);
      const invoiceCell = cells.find((cell) => /[0-9][0-9A-Z]{14,}/.test(textOf(cell)));
      if (!invoiceCell) return;
      if (invoiceCell.previousElementSibling !== markedCell) invoiceCell.before(markedCell);
      const typeContent = markedCell.querySelector(".cell") || markedCell;
      typeContent.textContent = guessTitleType(textOf(invoiceCell));
    });
  }

  function removeMergeSelectionColumn() {
    document.querySelectorAll(`th[${MARK}="merge-upload-select"], td[${MARK}="merge-upload-select"], col[${MARK}="merge-upload-select"]`)
      .forEach((node) => node.remove());
    document.querySelectorAll(".prototype-merge-upload-bar").forEach((bar) => {
      bar.style.display = "none";
    });
  }

  function syncMergeSelectAllState() {
    const selectAll = document.querySelector(".prototype-merge-select-all-input");
    if (!selectAll) return;
    const checks = Array.from(document.querySelectorAll(".prototype-merge-upload-check"));
    const available = checks.filter((check) => !check.disabled);
    const selectedCount = available.filter((check) => check.checked).length;
    selectAll.disabled = available.length === 0;
    selectAll.checked = available.length > 0 && selectedCount === available.length;
    selectAll.indeterminate = selectedCount > 0 && selectedCount < available.length;
  }

  function validateMergeRecords(records) {
    if (!records.length) return "请选择要合并上传发票的工单";
    const first = records[0];
    const differentInvoice = records.some((item) =>
      item.invoiceTitle !== first.invoiceTitle || item.taxpayerNo !== first.taxpayerNo
    );
    if (differentInvoice) return "选择的发票抬头/税号不一样";
    if (records.some((item) => item.titleType !== first.titleType)) return "所选发票类型不一样";
    return "";
  }

  function showMergeUploadDialog(records, retry = false) {
    document.querySelector(".prototype-merge-dialog-mask")?.remove();
    const first = records[0];
    const amount = records.reduce((sum, item) => sum + item.userPayAmount, 0).toFixed(2);
    const mask = document.createElement("div");
    mask.className = "prototype-merge-dialog-mask";
    mask.innerHTML = `
      <div class="prototype-merge-dialog" role="dialog" aria-label="合并上传发票">
        <div class="prototype-merge-dialog-header">
          <span>${retry ? "重新合并上传发票" : "合并上传发票"}</span>
          <button type="button" class="prototype-merge-dialog-close" aria-label="关闭">×</button>
        </div>
        <div class="prototype-merge-dialog-body">
          <table class="prototype-merge-info">
            <tbody>
              <tr><td class="prototype-merge-info-label">抬头类型</td><td>${escapeHtml(first.titleType)}</td></tr>
              <tr><td class="prototype-merge-info-label">发票抬头</td><td>${escapeHtml(first.invoiceTitle)}</td></tr>
              <tr><td class="prototype-merge-info-label">税号</td><td>${escapeHtml(first.taxpayerNo || "-")}</td></tr>
              <tr><td class="prototype-merge-info-label">开票金额</td><td>${escapeHtml(amount)}</td></tr>
            </tbody>
          </table>
          <div class="prototype-merge-upload-row">
            <strong>* 上传发票</strong>
            <button type="button" class="prototype-merge-upload-file">上传PDF格式文件</button>
            <span>仅支持 PDF 格式文件，单文件大小不超过 6MB，最多上传 5 个文件</span>
          </div>
        </div>
        <div class="prototype-merge-dialog-footer">
          <button type="button" class="cancel">取消</button>
          <button type="button" class="primary">确定</button>
        </div>
      </div>
    `;
    const close = () => mask.remove();
    mask.querySelector(".prototype-merge-dialog-close").addEventListener("click", close);
    mask.querySelector(".cancel").addEventListener("click", close);
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    document.body.appendChild(mask);
  }

  function patchAfterSaleMergeUpload() {
    const activeSelectionTab = isAfterSaleSelectionTabActive();
    const activeRejected = isRejectedTabActive();
    syncInvoiceTitleTypeCells();
    document.querySelectorAll(".prototype-merge-upload-bar").forEach((bar) => {
      bar.style.display = activeSelectionTab ? "" : "none";
      const button = bar.querySelector(".prototype-merge-upload-btn");
      if (button) button.textContent = activeRejected ? "重新合并上传" : "合并上传";
    });
    if (!activeSelectionTab) {
      removeMergeSelectionColumn();
      return;
    }
    document.querySelectorAll("table.el-table__header").forEach((headerTable) => {
      const headerRow = headerTable.querySelector("thead tr");
      if (!headerRow) return;
      const { bodyTables } = getTableContext(headerTable);
      let selectHeader = headerRow.querySelector(`th[${MARK}="merge-upload-select"]`);
      if (!selectHeader) {
        const first = headerRow.children[0];
        selectHeader = document.createElement("th");
        selectHeader.className = first ? first.className : "el-table__cell";
        selectHeader.setAttribute(MARK, "merge-upload-select");
        headerRow.insertBefore(selectHeader, first || null);
      }
      selectHeader.style.width = "82px";
      selectHeader.style.minWidth = "82px";
      selectHeader.style.maxWidth = "82px";
      if (!selectHeader.querySelector(".prototype-merge-select-all-input")) {
        selectHeader.innerHTML = '<div class="cell"><label class="prototype-merge-select-all"><input class="prototype-merge-select-all-input" type="checkbox" /><span>全选</span></label></div>';
        selectHeader.querySelector("input").addEventListener("change", (event) => {
          Array.from(document.querySelectorAll(".prototype-merge-upload-check"))
            .filter((check) => !check.disabled)
            .forEach((check) => {
              check.checked = event.target.checked;
            });
          syncMergeSelectAllState();
        });
      }
      ensureCol(headerTable, "merge-upload-select", 0);
      bodyTables.forEach((bodyTable) => {
        ensureCol(bodyTable, "merge-upload-select", 0);
        bodyTable.querySelectorAll("tbody tr").forEach((row, index) => {
          const expired = isExpiredAfterSaleRow(row);
          const existingCheck = row.querySelector(".prototype-merge-upload-check");
          if (existingCheck) {
            existingCheck.disabled = !activeRejected && expired;
            if (existingCheck.disabled) existingCheck.checked = false;
            const record = mergeRecordFromRow(row);
            existingCheck.dataset.invoiceTitle = record.invoiceTitle;
            existingCheck.dataset.taxpayerNo = record.taxpayerNo;
            existingCheck.dataset.titleType = record.titleType;
            existingCheck.dataset.userPayAmount = String(record.userPayAmount);
            if (existingCheck.dataset.prototypeSelectBound !== "true") {
              existingCheck.dataset.prototypeSelectBound = "true";
              existingCheck.addEventListener("change", syncMergeSelectAllState);
            }
            return;
          }
          const first = row.children[0];
          const td = document.createElement("td");
          td.className = first ? first.className : "el-table__cell";
          td.setAttribute(MARK, "merge-upload-select");
          td.style.width = "56px";
          td.style.minWidth = "56px";
          td.style.maxWidth = "56px";
          const key = getRowKey(row, index);
          const disabled = !activeRejected && expired;
          td.innerHTML = `<div class="cell"><input class="prototype-merge-upload-check" type="checkbox" data-merge-upload-key="${escapeHtml(key)}" ${disabled ? "disabled" : ""} /></div>`;
          row.insertBefore(td, first || null);
          const record = mergeRecordFromRow(row);
          const check = td.querySelector(".prototype-merge-upload-check");
          check.dataset.invoiceTitle = record.invoiceTitle;
          check.dataset.taxpayerNo = record.taxpayerNo;
          check.dataset.titleType = record.titleType;
          check.dataset.userPayAmount = String(record.userPayAmount);
          check.dataset.prototypeSelectBound = "true";
          check.addEventListener("change", syncMergeSelectAllState);
        });
      });
    });
    syncMergeSelectAllState();

    const form = document.querySelector(".app-main .app-container .el-form") || document.querySelector(".el-form");
    if (!form || document.querySelector(".prototype-merge-upload-bar")) return;
    const bar = document.createElement("div");
    bar.className = "prototype-merge-upload-bar";
    bar.innerHTML = '<button type="button" class="prototype-merge-upload-btn">合并上传</button>';
    bar.querySelector("button").addEventListener("click", () => {
      const records = Array.from(document.querySelectorAll(".prototype-merge-upload-check"))
        .filter((item) => item.checked && !item.disabled)
        .map((item) => ({
          invoiceTitle: item.dataset.invoiceTitle || "",
          taxpayerNo: item.dataset.taxpayerNo || "",
          titleType: item.dataset.titleType || "",
          userPayAmount: normalizeAmount(item.dataset.userPayAmount),
        }));
      const message = validateMergeRecords(records);
      if (message) {
        showToast(message);
        return;
      }
      showMergeUploadDialog(records, isRejectedTabActive());
    });
    form.after(bar);
  }

  function patchInvoiceUploadDialogs() {
    document.querySelectorAll(".el-dialog, .el-overlay-dialog").forEach((dialog) => {
      if (!textOf(dialog).includes("上传发票") && !textOf(dialog).includes("重新上传")) return;
      dialog.querySelectorAll("table.el-descriptions__table").forEach((table) => {
        const rows = Array.from(table.querySelectorAll("tbody > tr"));
        const invoiceRow = rows.find((row) => textOf(row).includes("发票抬头"));
        if (!invoiceRow || invoiceRow.previousElementSibling?.getAttribute(MARK) === "invoice-dialog-title-type") return;
        const valueCell = invoiceRow.children[1];
        const titleTypeRow = invoiceRow.cloneNode(false);
        titleTypeRow.setAttribute(MARK, "invoice-dialog-title-type");
        titleTypeRow.classList.add("prototype-review-red");
        const labelCell = invoiceRow.children[0]?.cloneNode(true) || document.createElement("td");
        const typeValueCell = valueCell?.cloneNode(true) || document.createElement("td");
        labelCell.textContent = "抬头类型";
        typeValueCell.textContent = guessTitleType(textOf(valueCell));
        titleTypeRow.append(labelCell, typeValueCell);
        invoiceRow.before(titleTypeRow);
      });
    });
  }

  function patchCompensation() {
    patchColumnByHeader("商品名称", "用户名称", "compensation-user-name", "after", (_row, productCell) =>
      guessUserName(textOf(productCell)),
    );
  }

  const secondSettlementDisplayRows = [
    ["JS2-202609110001", "2026-09-11 03:00:00", "订单结算", "+16.50", "DD202609110001", "厦门惠生活供应链有限公司"],
    ["JS2-202609100002", "2026-09-10 03:00:00", "订单结算", "+42.90", "DD202609100002", "北京优选数字科技有限公司"],
    ["JS2-202609140003", "2026-09-14 10:05:29", "售后补贴单", "+2.10", "SUB202609140101", "厦门惠生活供应链有限公司"],
    ["JS2-202609140004", "2026-09-14 10:02:17", "售后补贴单", "+4.10", "SUB202609140102", "北京优选数字科技有限公司"],
  ];

  function setCellText(cell, value) {
    if (!cell) return;
    const content = cell.querySelector(".cell") || cell;
    content.textContent = value;
  }

  function patchSecondSupplierSettlement() {
    document.querySelectorAll("table.el-table__header").forEach((headerTable) => {
      const headerRow = headerTable.querySelector("thead tr");
      if (!headerRow) return;
      const typeIndex = Array.from(headerRow.children).findIndex((cell) => textOf(cell).includes("交易类型"));
      const amountIndex = Array.from(headerRow.children).findIndex((cell) => textOf(cell).includes("变动金额"));
      const relationIndex = Array.from(headerRow.children).findIndex((cell) => textOf(cell).includes("关联单据号"));
      if (typeIndex < 0) return;
      const { bodyTables } = getTableContext(headerTable);
      bodyTables.forEach((bodyTable) => {
        bodyTable.querySelectorAll("tbody tr").forEach((row, rowIndex) => {
          if (window.location.pathname.includes("/supplier/settlement-record")) {
            const displayRow = secondSettlementDisplayRows[rowIndex];
            if (displayRow && textOf(row).replace(/\+/g, "").trim() === "") {
              displayRow.forEach((value, cellIndex) => setCellText(row.children[cellIndex], value));
            }
          }
          if (!textOf(row).includes("售后补贴单")) return;
          [typeIndex, amountIndex, relationIndex].forEach((index) => {
            if (index >= 0 && row.children[index]) row.children[index].classList.add("prototype-settlement-derived");
          });
        });
      });
    });
  }

  function patchSecondSupplierSetting() {
    if (!window.location.pathname.includes("/supplier/setting")) return;
    const original = document.querySelector(".supplier-markup-setting");
    const host = original?.parentElement;
    if (!original || !host || host.querySelector(".prototype-new-config-card")) return;

    const card = original.cloneNode(true);
    card.classList.add("prototype-new-config-card");
    card.setAttribute(MARK, "second-supplier-subsidy-commission");
    const title = card.querySelector("h3");
    if (title) title.textContent = "二级供应商补贴单抽成";
    const valueDisplay = card.querySelector(".value-display");
    if (valueDisplay) {
      valueDisplay.textContent = "0.50 元";
      valueDisplay.classList.add("prototype-config-unit");
    }
    const description = card.querySelector(".description");
    if (description) {
      description.textContent = "二级供应商补贴金额为实际补贴金额- 配置的抽成金额";
      description.classList.add("prototype-config-label");
    }
    let currentValue = "0.50";
    const renderView = () => {
      if (valueDisplay) valueDisplay.textContent = `${currentValue} 元`;
      if (actions) actions.innerHTML = '<button type="button" class="el-button el-button--primary"><span>编辑</span></button>';
      actions?.querySelector("button")?.addEventListener("click", renderEdit);
    };
    const renderEdit = () => {
      if (valueDisplay) {
        valueDisplay.innerHTML = `
          <div class="el-input" style="max-width: 180px;">
            <input class="el-input__inner" type="number" min="0" step="0.01" value="${escapeHtml(currentValue)}" aria-label="二级供应商补贴单抽成" />
          </div>
          <span class="prototype-config-unit" style="margin-left: 8px;">元</span>
        `;
      }
      if (actions) {
        actions.innerHTML = `
          <button type="button" class="el-button el-button--primary"><span>保存</span></button>
          <button type="button" class="el-button"><span>取消</span></button>
        `;
        actions.children[0].addEventListener("click", () => {
          const input = valueDisplay?.querySelector("input");
          const value = Number(input?.value);
          if (!Number.isFinite(value) || value < 0) {
            showToast("请输入有效的补贴单抽成金额");
            return;
          }
          currentValue = value.toFixed(2);
          renderView();
          showToast("保存成功");
        });
        actions.children[1].addEventListener("click", renderView);
      }
    };
    const actions = card.querySelector(".action-buttons");
    renderView();
    host.appendChild(card);
  }

  let timer = 0;
  function run() {
    ensureStyle();
    markChangedMenus();
    ensureReviewGuide();
    ensureInlineNotes();
    const path = window.location.pathname;
    if (path.includes("/order/after-sale-subsidy")) patchAfterSaleSubsidy();
    if (path.includes("/order/compensation")) patchCompensation();
    if (path.includes("/supplier/settlement-record")) patchSecondSupplierSettlement();
    if (path.includes("/supplier/setting")) patchSecondSupplierSetting();
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
