(function () {
  function routeCompensationDemo() {
    const route = new URLSearchParams(window.location.search).get("prototypeRoute");
    const marker = "/供应商小程序/";
    if (route !== "compensation" || !window.location.pathname.includes(marker) || window.location.pathname.includes("/subpkg-invoice/compensation")) return;
    const target = `${window.location.pathname.slice(0, window.location.pathname.indexOf(marker) + marker.length)}subpkg-invoice/compensation`;
    window.history.replaceState(window.history.state, "", target);
  }

  routeCompensationDemo();

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
      .prototype-review-red {
        color: ${RED} !important;
        font-weight: 600 !important;
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
        font-size: 11px;
        font-weight: 700;
        line-height: 18px;
        white-space: nowrap;
      }
      .prototype-change-guide {
        margin: 8px 14px 10px;
        padding: 10px 12px;
        border: 1px solid #ffccc7;
        border-left: 4px solid ${RED};
        border-radius: 8px;
        background: #fff7f6;
        color: #344054;
        font-size: 12px;
        line-height: 1.6;
      }
      .prototype-change-guide-title {
        color: ${RED};
        font-size: 14px;
        font-weight: 800;
        margin-bottom: 4px;
      }
      .prototype-change-guide-item strong {
        display: block;
        color: ${RED};
        margin-top: 6px;
        margin-bottom: 2px;
      }
      .prototype-change-guide-desc {
        display: block;
        color: #344054;
      }
      .prototype-pending-order-mark {
        display: inline-flex;
        margin-left: 8px;
        color: ${RED};
        font-size: 12px;
        font-weight: 700;
        vertical-align: middle;
      }
      uni-page-head,
      .uni-page-head {
        position: relative !important;
        top: auto !important;
        left: auto !important;
        right: auto !important;
        z-index: auto !important;
      }
      .prototype-review-note {
        display: inline-flex;
        align-items: center;
        margin-left: 6px;
        padding: 0 6px;
        height: 18px;
        border-radius: 9px;
        border: 1px solid ${RED};
        color: ${RED};
        background: #fff;
        font-size: 11px;
        font-weight: 700;
      }
      .prototype-review-note::before {
        content: "→";
        margin-right: 3px;
      }
      uni-view.prototype-review-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      uni-view.prototype-user-name-inline {
        justify-content: flex-start !important;
        gap: 0 !important;
        white-space: normal !important;
      }
      .prototype-select-check {
        position: absolute;
        top: 17px;
        left: 12px;
        z-index: 5;
        width: 19px;
        height: 19px;
        border-radius: 4px;
        border: 2px solid #c5d7ff;
        background: #fff;
        box-sizing: border-box;
        display: flex !important;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        font-weight: 800;
      }
      .prototype-after-sale-select-check {
        position: absolute;
        top: 16px;
        left: 12px;
        z-index: 5;
        width: 19px;
        height: 19px;
        border-radius: 4px;
        border: 2px solid #c5d7ff;
        background: #fff;
        box-sizing: border-box;
        display: flex !important;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        font-weight: 800;
      }
      .subsidy-card.prototype-after-sale-selectable {
        position: relative !important;
        padding-left: 39px !important;
        border: 2px solid transparent;
      }
      .subsidy-card.prototype-after-sale-selected {
        border-color: #2f73ff !important;
        box-shadow: 0 6px 16px rgba(47, 115, 255, 0.18) !important;
      }
      .subsidy-card.prototype-after-sale-selected .prototype-after-sale-select-check {
        border-color: #2f73ff;
        background: #2f73ff;
      }
      .subsidy-card.prototype-after-sale-disabled {
        opacity: 0.72;
      }
      .subsidy-card.prototype-after-sale-disabled .prototype-after-sale-select-check {
        border-color: #d4deef;
        background: #eef3fa;
        color: transparent;
      }
      .prototype-after-sale-merge-btn {
        position: fixed;
        right: 0.75rem;
        bottom: calc(1rem + env(safe-area-inset-bottom));
        left: 0.75rem;
        z-index: 1;
        height: 2.625rem;
        border: none;
        border-radius: 1.25rem;
        background: linear-gradient(270deg, #47c2ff, #478bff);
        color: #fff;
        font-size: 0.875rem;
        line-height: 2.625rem;
        font-weight: 600;
        box-shadow: 0 0.25rem 0.875rem rgba(71, 139, 255, 0.24);
      }
      .prototype-after-sale-merge-mask {
        position: fixed;
        inset: 0;
        z-index: 99998;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.58);
      }
      .prototype-after-sale-merge-dialog {
        width: 336px;
        max-width: calc(100vw - 48px);
        border-radius: 16px;
        background: #fff;
        overflow: hidden;
        box-shadow: 0 18px 48px rgba(15, 23, 42, 0.28);
      }
      .prototype-after-sale-merge-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 18px 12px;
      }
      .prototype-after-sale-merge-title {
        color: #12204a;
        font-size: 18px;
        font-weight: 800;
      }
      .prototype-after-sale-merge-close {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #f1f5fb;
        color: #8a96aa;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        line-height: 1;
      }
      .prototype-after-sale-merge-body {
        padding: 0 16px 16px;
      }
      .prototype-after-sale-merge-info {
        padding: 12px;
        border-radius: 10px;
        background: #f6f9fe;
      }
      .prototype-after-sale-merge-row {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 10px;
        color: #4b5b78;
        font-size: 13px;
      }
      .prototype-after-sale-merge-row:last-child {
        margin-bottom: 0;
      }
      .prototype-after-sale-merge-label {
        flex: 0 0 72px;
        color: #8a96aa;
      }
      .prototype-after-sale-merge-value {
        flex: 1;
        text-align: right;
        color: #26364f;
        font-weight: 600;
      }
      .prototype-after-sale-merge-upload {
        margin-top: 12px;
        padding: 12px;
        border-radius: 10px;
        background: #f6f9fe;
      }
      .prototype-after-sale-merge-upload-title {
        color: #26364f;
        font-weight: 800;
        margin-bottom: 10px;
      }
      .prototype-after-sale-merge-file {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 34px;
        padding: 0 16px;
        border-radius: 999px;
        background: linear-gradient(90deg, #4f8dff, #25bdf2);
        color: #fff;
        font-size: 13px;
        font-weight: 800;
      }
      .prototype-after-sale-merge-tip {
        display: block;
        margin-top: 8px;
        color: #8a96aa;
        font-size: 12px;
        line-height: 1.6;
      }
      .prototype-after-sale-merge-footer {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 0 16px 16px;
      }
      .prototype-after-sale-merge-footer button {
        height: 38px;
        border: none;
        border-radius: 999px;
        font-weight: 800;
      }
      .prototype-after-sale-merge-cancel {
        background: #f2f5fa;
        color: #34425b;
      }
      .prototype-after-sale-merge-confirm {
        background: linear-gradient(90deg, #4f8dff, #25bdf2);
        color: #fff;
      }
      .compensation-card.prototype-selectable-card {
        position: relative !important;
        padding-left: 39px !important;
        padding-right: 12px !important;
        border: 2px solid transparent;
      }
      .compensation-card.prototype-card-selected {
        border-color: #2f73ff !important;
        box-shadow: 0 6px 16px rgba(47, 115, 255, 0.18) !important;
      }
      .compensation-card.prototype-card-selected .prototype-select-check {
        border-color: #2f73ff;
        background: #2f73ff;
      }
      .prototype-hidden-claim-btn {
        display: none !important;
      }
      .claim-btn {
        display: none !important;
      }
      .prototype-filter-entry {
        position: absolute;
        top: 55px;
        right: 24px;
        z-index: 9998;
        width: 44px;
        height: 44px;
        padding: 0;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 8px 24px rgba(31, 78, 160, 0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2f73ff;
      }
      .prototype-filter-entry::before {
        content: "";
        width: 22px;
        height: 22px;
        background: linear-gradient(180deg, currentColor 0 0) center top / 18px 3px no-repeat,
          linear-gradient(180deg, currentColor 0 0) center 8px / 13px 3px no-repeat,
          linear-gradient(180deg, currentColor 0 0) center 16px / 7px 3px no-repeat;
        border-radius: 2px;
        box-sizing: border-box;
      }
      .prototype-select-all-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 18px 10px;
        color: ${RED};
        font-size: 14px;
        font-weight: 700;
      }
      .prototype-select-all-check {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 2px solid #c5d7ff;
        background: #fff;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 13px;
        font-weight: 800;
      }
      .prototype-select-all-row.prototype-select-all-selected .prototype-select-all-check {
        border-color: #2f73ff;
        background: #2f73ff;
      }
      .prototype-claim-toast {
        position: fixed;
        left: 50%;
        bottom: 118px;
        z-index: 99999;
        width: calc(100vw - 48px);
        max-width: 560px;
        transform: translateX(-50%);
        border-radius: 14px;
        background: rgba(18, 32, 56, 0.94);
        color: #fff;
        box-shadow: 0 14px 36px rgba(15, 23, 42, 0.24);
        padding: 14px 16px;
        box-sizing: border-box;
        line-height: 1.7;
        font-size: 14px;
        animation: prototypeToastIn 0.18s ease-out;
      }
      .prototype-claim-toast-title {
        font-size: 15px;
        font-weight: 800;
        margin-bottom: 4px;
      }
      .prototype-claim-toast-line {
        opacity: 0.96;
      }
      @keyframes prototypeToastIn {
        from {
          opacity: 0;
          transform: translate(-50%, 12px);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }
      .sticky-top-wrap {
        position: sticky;
      }
      .prototype-filter-mask {
        position: fixed;
        inset: 0;
        z-index: 99998;
        background: rgba(15, 23, 42, 0.45);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 0;
        box-sizing: border-box;
      }
      .prototype-filter-dialog {
        width: 100%;
        max-height: 86vh;
        border-radius: 16px 16px 0 0;
        background: #fff;
        overflow: hidden;
        box-shadow: 0 -14px 40px rgba(15, 35, 70, 0.24);
        animation: prototypeSlideUp 0.22s ease-out;
      }
      @keyframes prototypeSlideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      .prototype-filter-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 17px 17px 10px;
      }
      .prototype-filter-title {
        font-size: 17px;
        font-weight: 800;
        color: #14213d;
      }
      .prototype-filter-close {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #f3f6fb;
        color: #8a96aa;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17px;
        line-height: 1;
      }
      .prototype-filter-body {
        padding: 0 17px 14px;
      }
      .prototype-filter-item {
        margin-top: 12px;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      .prototype-filter-item[data-prototype-filter-brand="true"] {
        display: block !important;
        min-height: 67px !important;
      }
      .prototype-filter-label {
        margin-bottom: 7px;
        color: #26364f;
        font-size: 13px;
        font-weight: 700;
      }
      .prototype-filter-segment {
        display: flex;
        gap: 7px;
      }
      .prototype-filter-chip {
        flex: 1;
        height: 31px;
        border-radius: 7px;
        border: 1px solid #d8e2f5;
        color: #40516d;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        background: #fff;
      }
      .prototype-filter-chip.active {
        border-color: #2f73ff;
        color: #2f73ff;
        background: #eef5ff;
        font-weight: 800;
      }
      .prototype-filter-select,
      .prototype-filter-input {
        height: 33px;
        border-radius: 7px;
        border: 1px solid #d8e2f5;
        background: #f8fbff;
        color: #26364f;
        font-size: 13px;
        padding: 0 10px;
        box-sizing: border-box;
      }
      .prototype-filter-select {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .prototype-filter-select-native {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100%;
        height: 33px;
        border-radius: 7px;
        border: 1px solid #d8e2f5;
        background: #f8fbff;
        color: #26364f;
        font-size: 13px;
        padding: 0 10px;
        box-sizing: border-box;
        outline: none;
      }
      .prototype-filter-item[data-prototype-filter-brand="true"] .prototype-filter-label,
      .prototype-filter-item[data-prototype-filter-brand="true"] .prototype-filter-select-native {
        display: block !important;
        visibility: visible !important;
      }
      .prototype-filter-range {
        display: grid;
        grid-template-columns: 1fr 17px 1fr;
        align-items: center;
        gap: 6px;
      }
      .prototype-filter-dash {
        color: #8a96aa;
        text-align: center;
      }
      .prototype-filter-footer {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 9px;
        padding: 11px 17px 17px;
      }
      .prototype-filter-btn {
        height: 38px;
        border-radius: 999px;
        border: none;
        font-size: 14px;
        font-weight: 800;
      }
      .prototype-filter-reset {
        background: #f2f5fa;
        color: #34425b;
      }
      .prototype-filter-confirm {
        background: linear-gradient(90deg, #4f8dff, #2459df);
        color: #fff;
      }
    `;
    document.head.appendChild(style);
  }

  function guessTitleType(text) {
    return /个人/.test(text || "") ? "个人" : "企业";
  }

  const reviewGuides = {
    "/subpkg-invoice/after-sale-subsidy": {
      title: "本页改动说明：售后补贴单",
      items: [
        ["抬头类型", "上传发票、重新上传发票弹窗均展示；数据源为客服本地生活工作台接口。"],
        ["上传交互", "供应商选择发票文件后提交；弹窗中的抬头类型用于提交前核对开票主体。"],
        ["合并上传", "处理中列表支持勾选多张未结束工单后点击底部“合并上传”；已驳回列表每张卡片前展示可勾选方块，支持勾选工单后点击底部“重新合并上传”。处理中已结束工单不可选，已驳回工单均可选。未勾选时提示“请选择要合并上传发票的工单”；先校验发票抬头/税号，不一致提示“选择的发票抬头/税号不一样”；再校验发票类型，不一致提示“所选发票类型不一样”；校验通过后弹出与上传弹窗内容一致的合并上传发票弹窗，开票金额=所选工单用户支付价合计。"],
      ],
      notes: [],
    },
    "/subpkg-invoice/compensation": {
      title: "本页改动说明：补偿单列表",
      items: [
        ["用户名称", "显示在商品信息下方，格式为“用户名称：用户实际名称”；数据源取该工单发票抬头，并与供应商后台补偿单列表保持同一组演示数据。"],
        ["卡片选择", "每个卡片支持单选；每个 Tab 有全选框，可选中当前 Tab 下全部可见卡片。"],
        ["筛选图标", "点击右上角筛选图标，从底部弹出筛选表单；金额区间最小值不能大于最大值。"],
        ["一键抢单", "点击后直接展示提示，不再弹出筛选弹窗；提示沿用批量接单信息。"],
      ],
      notes: [
        ["全选", "交互逻辑：只选中当前 Tab 下可见卡片；再次点击取消当前 Tab 的选择。"],
        ["筛选", "显示逻辑：筛选项从底部上滑弹出；全部 Tab 有商品品牌，品牌 Tab 隐藏商品品牌。"],
      ],
    },
  };

  function currentGuideConfig() {
    const path = window.location.pathname;
    return Object.keys(reviewGuides).find((key) => path.includes(key));
  }

  function ensureReviewGuide() {
    const key = currentGuideConfig();
    if (!key) {
      document.querySelectorAll(".prototype-change-guide").forEach((guide) => guide.remove());
      return;
    }
    const config = reviewGuides[key];
    const host = document.querySelector(".page, .page-container, #app") || document.body;
    if (!host) return;
    const guides = Array.from(document.querySelectorAll(".prototype-change-guide"));
    const currentGuide = guides.find((guide) => guide.parentElement === host && guide.dataset.prototypeGuideKey === key);
    guides.forEach((guide) => {
      if (guide !== currentGuide) guide.remove();
    });
    const expectedItems = config.items.flat();
    if (currentGuide && expectedItems.every((item) => textOf(currentGuide).includes(item))) return;
    if (currentGuide) currentGuide.remove();
    const guide = document.createElement("uni-view");
    guide.className = "prototype-change-guide";
    guide.dataset.prototypeGuideKey = key;
    guide.innerHTML = `
      <uni-view class="prototype-change-guide-title">${escapeHtml(config.title)}</uni-view>
      ${config.items.map(([title, desc]) => `<uni-view class="prototype-change-guide-item"><strong>${escapeHtml(title)}</strong><uni-text class="prototype-change-guide-desc">${escapeHtml(desc)}</uni-text></uni-view>`).join("")}
    `;
    host.prepend(guide);
  }

  function ensureInlineNotes() {
    const key = currentGuideConfig();
    document.querySelectorAll(".prototype-review-note").forEach((note) => note.remove());
    document.querySelectorAll("[data-prototype-review-note-marked]").forEach((node) => delete node.dataset.prototypeReviewNoteMarked);
    if (!key) return;
    reviewGuides[key].notes.forEach(([target, note]) => {
      const candidates = Array.from(document.querySelectorAll(
        '[data-prototype-review-key], .prototype-select-all-row, .prototype-filter-entry, .batch-btn, uni-text.info-label, uni-text.prototype-review-red',
      ));
      const node = candidates.find((item) =>
        !item.closest(".prototype-change-guide") &&
        !item.closest(".prototype-review-note") &&
        textOf(item).includes(target) &&
        item.dataset.prototypeReviewNoteMarked !== "true"
      );
      if (node) {
        const tag = document.createElement("uni-text");
        tag.className = "prototype-review-note";
        tag.textContent = "说明";
        tag.setAttribute("title", note);
        node.dataset.prototypeReviewNoteMarked = "true";
        node.appendChild(tag);
      }
    });
  }

  function markChangedMiniEntries() {
    document.querySelectorAll(".prototype-change-badge").forEach((badge) => badge.remove());
    document.querySelectorAll("[data-prototype-change-marked]").forEach((node) => delete node.dataset.prototypeChangeMarked);
  }

  function markWorkbenchPendingOrders() {
    if (!location.pathname.includes("/pages/workbench/index")) return;
    Array.from(document.querySelectorAll("uni-view, uni-text")).forEach((node) => {
      if (textOf(node) !== "待处理订单" || node.dataset.prototypePendingOrderMarked === "true") return;
      const mark = document.createElement("uni-text");
      mark.className = "prototype-pending-order-mark";
      mark.textContent = "本期有更改";
      node.dataset.prototypePendingOrderMarked = "true";
      node.appendChild(mark);
    });
  }

  function guessUserName(text) {
    const value = text || "";
    if (value.includes("肯德基")) return "厦门肯德基有限公司";
    if (value.includes("麦当劳")) return "金拱门（中国）有限公司";
    if (value.includes("瑞幸")) return "瑞幸咖啡（中国）有限公司";
    return "该工单发票抬头";
  }

  const demoAfterSaleDeadlines = new Map();

  function createInfoRow(baseRow, label, value, key) {
    const row = document.createElement("uni-view");
    row.className = `${baseRow.className || "info-row"} prototype-review-row`;
    row.setAttribute(MARK, key);
    row.innerHTML = `
      <uni-text class="info-label prototype-review-red"><span>${escapeHtml(label)}</span></uni-text>
      <uni-text class="info-value prototype-review-red"><span>${escapeHtml(value)}</span></uni-text>
    `;
    return row;
  }

  function createInlineInfoRow(baseRow, label, value, key) {
    const row = document.createElement("uni-view");
    row.className = `${baseRow.className || "info-row"} prototype-review-row prototype-user-name-inline`;
    row.setAttribute(MARK, key);
    row.innerHTML = `
      <uni-text class="prototype-review-red"><span>${escapeHtml(label)}：${escapeHtml(value)}</span></uni-text>
    `;
    return row;
  }

  function createAfterSaleInvoiceRow(baseRow, label, value) {
    const row = document.createElement("uni-view");
    row.className = baseRow.className || "info-row";
    row.setAttribute(MARK, "after-sale-invoice-field");
    row.innerHTML = `
      <uni-text class="info-label"><span>${escapeHtml(label)}：</span></uni-text>
      <uni-text class="info-value"><span>${escapeHtml(value)}</span></uni-text>
    `;
    return row;
  }

  function findValueInRow(row) {
    const valueNode = row.querySelector(".info-value");
    if (valueNode) return textOf(valueNode);
    return textOf(row).replace(/^发票抬头[:：]?/, "").replace(/^商品[:：]?/, "").trim();
  }

  function createAfterSaleInvoiceRows(card) {
    const productNameRow = Array.from(card.querySelectorAll(".info-row")).find((row) =>
      textOf(row.querySelector(".info-label") || row).includes("商品名称")
    );
    if (!productNameRow || productNameRow.getAttribute(MARK) === "after-sale-invoice-fields") return;
    const record = getAfterSaleMergeRecord(card);
    const fragment = document.createDocumentFragment();
    [
      ["抬头类型", record.titleType],
      ["发票抬头", record.invoiceTitle],
      ["税号", record.taxpayerNo],
    ].forEach(([label, value]) => {
      const row = createAfterSaleInvoiceRow(productNameRow, label, value);
      fragment.appendChild(row);
    });
    productNameRow.after(fragment);
    productNameRow.setAttribute(MARK, "after-sale-invoice-fields");
  }

  function patchAfterSaleSubsidy() {
    document.querySelectorAll(".info-row").forEach((row) => {
      const label = textOf(row.querySelector(".info-label") || row);
      if (!label.includes("发票抬头")) return;
      if (row.closest(".subsidy-card")) return;
      if (row.previousElementSibling && row.previousElementSibling.getAttribute(MARK) === "invoice-title-type") return;
      const value = guessTitleType(findValueInRow(row));
      row.before(createInfoRow(row, "抬头类型", value, "invoice-title-type"));
    });
    document.querySelectorAll(".subsidy-card").forEach(createAfterSaleInvoiceRows);
    refreshAfterSaleCountdowns();
    patchAfterSaleMergeUpload();
  }

  const selectedAfterSaleCards = new Set();

  function isAfterSaleProcessingTab() {
    const active = document.querySelector(".tab-item.active");
    return textOf(active) === "处理中";
  }

  function isAfterSaleSelectionTab() {
    const active = document.querySelector(".tab-item.active");
    const text = textOf(active);
    return text === "处理中" || text === "已驳回";
  }

  function isAfterSaleRejectedTab() {
    const active = document.querySelector(".tab-item.active");
    return textOf(active) === "已驳回";
  }

  function getAfterSaleCardId(card, index) {
    const noText = textOf(card.querySelector(".subsidy-no-content") || card);
    const no = noText.match(/补贴单号[:：]\s*([A-Z0-9-]+)/i)?.[1];
    if (no) return no;
    const fallback = textOf(card.querySelector(".store-name") || card).replace(/\s+/g, "");
    return `${fallback || "after-sale"}-${index}`;
  }

  function formatAfterSaleCountdown(milliseconds) {
    const seconds = Math.max(1, Math.floor(milliseconds / 1000));
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const rest = seconds % 60;
    return `${days}天${hours}时${minutes}分${rest}秒`;
  }

  function refreshAfterSaleCountdowns() {
    if (!isAfterSaleProcessingTab()) return;
    document.querySelectorAll(".subsidy-card").forEach((card, index) => {
      const id = getAfterSaleCardId(card, index);
      if (!demoAfterSaleDeadlines.has(id)) {
        demoAfterSaleDeadlines.set(id, Date.now() + (index + 1) * 24 * 60 * 60 * 1000);
      }
      const countdown = card.querySelector(".countdown");
      if (countdown) {
        countdown.textContent = `上传倒计时：${formatAfterSaleCountdown(demoAfterSaleDeadlines.get(id) - Date.now())}`;
      }
    });
  }

  function isExpiredAfterSaleCard(card) {
    return !isAfterSaleProcessingTab() && textOf(card).includes("已结束");
  }

  function normalizeAmount(value) {
    const matched = String(value || "").match(/\d+(?:\.\d+)?/);
    return matched ? Number(matched[0]) : 0;
  }

  function getInfoValue(card, label) {
    const row = Array.from(card.querySelectorAll(".info-row")).find((item) => textOf(item).includes(label));
    return row ? textOf(row.querySelector(".info-value") || row).replace(label, "").replace(/^[:：]/, "").trim() : "";
  }

  function getAfterSaleMergeRecord(card) {
    const brandName = getInfoValue(card, "商品品牌") || textOf(card.querySelector(".store-name") || card);
    const invoiceTitle = brandName.includes("肯德基")
      ? "厦门肯德基有限公司"
      : brandName.includes("麦当劳")
        ? "金拱门（中国）有限公司"
        : "瑞幸咖啡（中国）有限公司";
    return {
      titleType: guessTitleType(invoiceTitle),
      invoiceTitle,
      taxpayerNo: invoiceTitle.includes("肯德基") ? "91350200MA01DEMO02" : invoiceTitle.includes("金拱门") ? "91110000MA01DEMO03" : "91110108MA01DEMO01",
      userPayAmount: normalizeAmount(getInfoValue(card, "用户支付")),
    };
  }

  function validateAfterSaleMergeRecords(records) {
    if (!records.length) return "请选择要合并上传发票的工单";
    const first = records[0];
    const differentInvoice = records.some((item) =>
      item.invoiceTitle !== first.invoiceTitle || item.taxpayerNo !== first.taxpayerNo
    );
    if (differentInvoice) return "选择的发票抬头/税号不一样";
    if (records.some((item) => item.titleType !== first.titleType)) return "所选发票类型不一样";
    return "";
  }

  function showAfterSaleMergeUploadDialog(records, retry = false) {
    document.querySelector(".prototype-after-sale-merge-mask")?.remove();
    const first = records[0];
    const amount = records.reduce((sum, item) => sum + item.userPayAmount, 0).toFixed(2);
    const mask = document.createElement("uni-view");
    mask.className = "prototype-after-sale-merge-mask";
    mask.innerHTML = `
      <uni-view class="prototype-after-sale-merge-dialog">
        <uni-view class="prototype-after-sale-merge-header">
          <uni-text class="prototype-after-sale-merge-title"><span>${retry ? "重新上传发票" : "上传发票"}</span></uni-text>
          <uni-view class="prototype-after-sale-merge-close">×</uni-view>
        </uni-view>
        <uni-view class="prototype-after-sale-merge-body">
          <uni-view class="prototype-after-sale-merge-info">
            ${[
              ["抬头类型", first.titleType],
              ["发票抬头", first.invoiceTitle],
              ["税号", first.taxpayerNo || "-"],
              ["用户支付", amount],
            ].map(([label, value]) => `<uni-view class="prototype-after-sale-merge-row"><uni-text class="prototype-after-sale-merge-label"><span>${escapeHtml(label)}</span></uni-text><uni-text class="prototype-after-sale-merge-value"><span>${escapeHtml(value)}</span></uni-text></uni-view>`).join("")}
          </uni-view>
          <uni-view class="prototype-after-sale-merge-upload">
            <uni-view class="prototype-after-sale-merge-upload-title">* 上传发票</uni-view>
            <uni-view class="prototype-after-sale-merge-file">选择微信对话文件</uni-view>
            <uni-text class="prototype-after-sale-merge-tip"><span>仅支持 PDF 格式文件，单文件不超过6MB，最多上传5个文件</span></uni-text>
          </uni-view>
        </uni-view>
        <uni-view class="prototype-after-sale-merge-footer">
          <button type="button" class="prototype-after-sale-merge-cancel">取消</button>
          <button type="button" class="prototype-after-sale-merge-confirm">提交</button>
        </uni-view>
      </uni-view>
    `;
    const close = () => mask.remove();
    mask.querySelector(".prototype-after-sale-merge-close").addEventListener("click", close);
    mask.querySelector(".prototype-after-sale-merge-cancel").addEventListener("click", close);
    mask.addEventListener("click", (event) => {
      if (event.target === mask) close();
    });
    document.body.appendChild(mask);
  }

  function showMiniToast(message) {
    const old = document.querySelector(".prototype-claim-toast");
    if (old) old.remove();
    const toast = document.createElement("uni-view");
    toast.className = "prototype-claim-toast prototype-claim-empty-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    clearTimeout(showMiniToast.timer);
    showMiniToast.timer = setTimeout(() => toast.remove(), 2200);
  }

  function syncAfterSaleCard(card, selected) {
    const id = card.dataset.prototypeAfterSaleCardId;
    if (!id) return;
    if (selected) selectedAfterSaleCards.add(id);
    else selectedAfterSaleCards.delete(id);
    card.classList.toggle("prototype-after-sale-selected", selected);
    const check = card.querySelector(".prototype-after-sale-select-check");
    if (check) check.textContent = selected ? "✓" : "";
  }

  function hideAfterSaleMergeUploadButton() {
    const button = document.querySelector(".prototype-after-sale-merge-btn");
    if (button) button.style.display = "none";
  }

  function getSelectableAfterSaleCards() {
    const rejected = isAfterSaleRejectedTab();
    return Array.from(document.querySelectorAll(".subsidy-card")).filter((card) => {
      const style = window.getComputedStyle(card);
      const visible = style.display !== "none" && style.visibility !== "hidden" && card.getClientRects().length > 0;
      return visible && (rejected || !isExpiredAfterSaleCard(card));
    });
  }

  function syncAfterSaleSelectAllControl() {
    const control = document.querySelector(".prototype-after-sale-select-all-row");
    if (!control) return;
    const cards = getSelectableAfterSaleCards();
    const allSelected = cards.length > 0 && cards.every((card) => selectedAfterSaleCards.has(card.dataset.prototypeAfterSaleCardId));
    control.classList.toggle("prototype-select-all-selected", allSelected);
    const check = control.querySelector(".prototype-select-all-check");
    if (check) check.textContent = allSelected ? "✓" : "";
    const label = control.querySelector(".prototype-select-all-label");
    if (label) label.textContent = `全选（${cards.length}张）`;
  }

  function patchAfterSaleSelectAllControl(selectionTab) {
    document.querySelectorAll(".prototype-select-all-row:not(.prototype-after-sale-select-all-row)").forEach((row) => {
      if (location.pathname.includes("/subpkg-invoice/after-sale-subsidy")) row.remove();
    });
    const old = document.querySelector(".prototype-after-sale-select-all-row");
    if (!selectionTab) {
      old?.remove();
      return;
    }
    const tabContainer = document.querySelector(".tab-container");
    if (!tabContainer) return;
    let row = old;
    if (!row) {
      row = document.createElement("uni-view");
      row.className = "prototype-select-all-row prototype-after-sale-select-all-row prototype-review-red";
      row.innerHTML = `
        <uni-view class="prototype-select-all-check"></uni-view>
        <uni-text class="prototype-select-all-label"><span>全选当前页</span></uni-text>
      `;
      row.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const cards = getSelectableAfterSaleCards();
        const shouldSelect = !(cards.length > 0 && cards.every((card) => selectedAfterSaleCards.has(card.dataset.prototypeAfterSaleCardId)));
        cards.forEach((card) => syncAfterSaleCard(card, shouldSelect));
        syncAfterSaleSelectAllControl();
      });
      tabContainer.after(row);
    }
    syncAfterSaleSelectAllControl();
  }

  function patchAfterSaleMergeUpload() {
    const selectionTab = isAfterSaleSelectionTab();
    const rejected = isAfterSaleRejectedTab();
    const cards = Array.from(document.querySelectorAll(".subsidy-card"));
    cards.forEach((card, index) => {
      const id = getAfterSaleCardId(card, index);
      const expired = isExpiredAfterSaleCard(card);
      card.dataset.prototypeAfterSaleCardId = id;
      card.classList.toggle("prototype-after-sale-selectable", selectionTab);
      card.classList.toggle("prototype-after-sale-disabled", selectionTab && !rejected && expired);
      if (!selectionTab) {
        card.classList.remove("prototype-after-sale-selected");
        card.classList.remove("prototype-after-sale-disabled");
        card.querySelector(".prototype-after-sale-select-check")?.remove();
        return;
      }
      if (!card.querySelector(".prototype-after-sale-select-check")) {
        const check = document.createElement("uni-view");
        check.className = "prototype-after-sale-select-check";
        check.textContent = selectedAfterSaleCards.has(id) ? "✓" : "";
        card.appendChild(check);
      }
      syncAfterSaleCard(card, (rejected || !expired) && selectedAfterSaleCards.has(id));
      if (card.dataset.prototypeAfterSaleSelectableBound === "true") return;
      card.dataset.prototypeAfterSaleSelectableBound = "true";
      card.addEventListener("click", (event) => {
        if (!isAfterSaleSelectionTab()) return;
        if (!isAfterSaleRejectedTab() && isExpiredAfterSaleCard(card)) return;
        if (event.target.closest(".action-row, button, uni-button")) return;
        const cardId = card.dataset.prototypeAfterSaleCardId || id;
        syncAfterSaleCard(card, !selectedAfterSaleCards.has(cardId));
        syncAfterSaleSelectAllControl();
      });
    });

    let button = document.querySelector(".prototype-after-sale-merge-btn");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "batch-btn prototype-after-sale-merge-btn";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const records = Array.from(document.querySelectorAll(".subsidy-card.prototype-after-sale-selected:not(.prototype-after-sale-disabled)"))
          .map(getAfterSaleMergeRecord);
        const message = validateAfterSaleMergeRecords(records);
        if (message) {
          showMiniToast(message);
          return;
        }
        showAfterSaleMergeUploadDialog(records, isAfterSaleRejectedTab());
      }, true);
      document.body.appendChild(button);
    }
    button.textContent = rejected ? "重新合并上传" : "合并上传";
    button.style.display = selectionTab ? "" : "none";
    patchAfterSaleSelectAllControl(selectionTab);
  }

  function patchCompensation() {
    document.querySelectorAll(".info-row").forEach((row) => {
      const label = textOf(row.querySelector(".info-label") || row);
      if (!label.includes("商品")) return;
      if (row.nextElementSibling && row.nextElementSibling.getAttribute(MARK) === "compensation-user-name") return;
      const value = guessUserName(findValueInRow(row));
      row.after(createInlineInfoRow(row, "用户名称", value, "compensation-user-name"));
    });
    patchCompensationCards();
    patchCompensationFilter();
    patchSelectAllControl();
    patchOneKeyClaimButton();
    applyCompensationFilter();
    syncSelectAllControl();
  }

  const selectedCards = new Set();
  const filterState = {
    count: "5",
    brand: "全部品牌",
    subsidyMin: "",
    subsidyMax: "",
    userPayMin: "",
    userPayMax: "",
  };

  function normalizeNumber(value) {
    const matched = String(value || "").match(/\d+(?:\.\d+)?/);
    return matched ? Number(matched[0]) : Number.NaN;
  }

  function getCardId(card, index) {
    const title = textOf(card.querySelector(".store-name") || card).slice(0, 32);
    const product = textOf(card.querySelector(".product-info") || card).slice(0, 80);
    return `${index}-${title}-${product}`;
  }

  function getAmountFromCard(card, label) {
    const rows = Array.from(card.querySelectorAll(".info-row"));
    const row = rows.find((item) => textOf(item.querySelector(".info-label") || item).includes(label));
    return normalizeNumber(row ? textOf(row.querySelector(".info-value") || row) : "");
  }

  function getBrandFromCard(card) {
    const title = textOf(card.querySelector(".store-name") || card);
    if (title.includes("瑞幸")) return "瑞幸咖啡";
    if (title.includes("肯德基")) return "肯德基";
    if (title.includes("麦当劳")) return "麦当劳";
    return "全部品牌";
  }

  function hideImmediateClaimButtons(card) {
    Array.from(card.querySelectorAll("uni-button, button, uni-view, uni-text")).forEach((node) => {
      if (textOf(node) === "立即抢单") {
        node.classList.add("prototype-hidden-claim-btn");
        node.setAttribute("aria-hidden", "true");
        node.style.display = "none";
        node.textContent = "";
      }
    });
  }

  function patchCompensationCards() {
    const cards = Array.from(document.querySelectorAll(".compensation-card"));
    cards.forEach((card, index) => {
      const id = getCardId(card, index);
      card.dataset.prototypeCardId = id;
      card.classList.add("prototype-selectable-card");
      hideImmediateClaimButtons(card);
      if (!card.querySelector(".prototype-select-check")) {
        const check = document.createElement("uni-view");
        check.className = "prototype-select-check";
        check.textContent = selectedCards.has(id) ? "✓" : "";
        card.appendChild(check);
      }
      card.classList.toggle("prototype-card-selected", selectedCards.has(id));
      const check = card.querySelector(".prototype-select-check");
      if (check) check.textContent = selectedCards.has(id) ? "✓" : "";
      if (card.dataset.prototypeSelectableBound === "true") return;
      card.dataset.prototypeSelectableBound = "true";
      card.addEventListener("click", () => {
        const cardId = card.dataset.prototypeCardId || id;
        if (selectedCards.has(cardId)) selectedCards.delete(cardId);
        else selectedCards.add(cardId);
        card.classList.toggle("prototype-card-selected", selectedCards.has(cardId));
        const currentCheck = card.querySelector(".prototype-select-check");
        if (currentCheck) currentCheck.textContent = selectedCards.has(cardId) ? "✓" : "";
        syncSelectAllControl();
      });
    });

    Array.from(document.querySelectorAll(".batch-btn")).forEach((button) => {
      if (textOf(button).includes("批量抢单")) button.textContent = "一键抢单";
    });
  }

  function getVisibleCompensationCards() {
    return Array.from(document.querySelectorAll(".compensation-card")).filter((card) => {
      const style = window.getComputedStyle(card);
      return style.display !== "none" && style.visibility !== "hidden" && card.getClientRects().length > 0;
    });
  }

  function setCardSelected(card, selected) {
    const id = card.dataset.prototypeCardId;
    if (!id) return;
    if (selected) selectedCards.add(id);
    else selectedCards.delete(id);
    card.classList.toggle("prototype-card-selected", selected);
    const check = card.querySelector(".prototype-select-check");
    if (check) check.textContent = selected ? "✓" : "";
  }

  function getActiveTabName() {
    const active = document.querySelector(".tab-item.active");
    return textOf(active) || "当前Tab";
  }

  function isAllCompensationTab() {
    return getActiveTabName() === "全部";
  }

  function syncSelectAllControl() {
    const control = document.querySelector(".prototype-select-all-row");
    if (!control) return;
    const cards = getVisibleCompensationCards();
    const allSelected = cards.length > 0 && cards.every((card) => selectedCards.has(card.dataset.prototypeCardId));
    control.classList.toggle("prototype-select-all-selected", allSelected);
    const check = control.querySelector(".prototype-select-all-check");
    if (check) check.textContent = allSelected ? "✓" : "";
    const label = control.querySelector(".prototype-select-all-label");
    if (label) label.textContent = `全选（${cards.length}张）`;
  }

  function patchSelectAllControl() {
    const tabContainer = document.querySelector(".tab-container");
    if (!tabContainer || document.querySelector(".prototype-select-all-row")) return;
    const row = document.createElement("uni-view");
    row.className = "prototype-select-all-row prototype-review-red";
    row.innerHTML = `
      <uni-view class="prototype-select-all-check"></uni-view>
      <uni-text class="prototype-select-all-label"><span>全选当前Tab</span></uni-text>
    `;
    row.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const cards = getVisibleCompensationCards();
      const shouldSelect = !(cards.length > 0 && cards.every((card) => selectedCards.has(card.dataset.prototypeCardId)));
      cards.forEach((card) => setCardSelected(card, shouldSelect));
      syncSelectAllControl();
    });
    tabContainer.after(row);
    syncSelectAllControl();
  }

  function patchCompensationFilter() {
    const sticky = document.querySelector(".sticky-top-wrap");
    if (!sticky || sticky.querySelector(".prototype-filter-entry")) return;
    const entry = document.createElement("uni-view");
    entry.className = "prototype-filter-entry";
    entry.setAttribute("aria-label", "筛选");
    entry.setAttribute("title", "筛选");
    entry.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showFilterDialog();
    });
    sticky.appendChild(entry);
  }

  function showFilterDialog() {
    const old = document.querySelector(".prototype-filter-mask");
    if (old) old.remove();
    const shouldShowBrand = isAllCompensationTab();
    if (!shouldShowBrand) filterState.brand = "全部品牌";
    const mask = document.createElement("uni-view");
    mask.className = "prototype-filter-mask";
    mask.innerHTML = `
      <uni-view class="prototype-filter-dialog">
        <uni-view class="prototype-filter-header">
          <uni-text class="prototype-filter-title"><span>筛选条件</span></uni-text>
          <uni-view class="prototype-filter-close">×</uni-view>
        </uni-view>
        <uni-view class="prototype-filter-body">
          <uni-view class="prototype-filter-item">
            <uni-view class="prototype-filter-label">批量接单数量</uni-view>
            <select class="prototype-filter-select-native" data-field="count" aria-label="批量接单数量">
              ${["5", "10", "15"].map((item) => `<option value="${item}" ${filterState.count === item ? "selected" : ""}>${item}单</option>`).join("")}
            </select>
          </uni-view>
          ${shouldShowBrand ? `<uni-view class="prototype-filter-item" data-prototype-filter-brand="true" aria-label="商品品牌筛选项">
            <uni-view class="prototype-filter-label">商品品牌</uni-view>
            <select class="prototype-filter-select-native" data-field="brand" aria-label="商品品牌">
              ${["全部品牌", "瑞幸咖啡", "肯德基", "麦当劳"].map((item) => `<option value="${item}" ${filterState.brand === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
            </select>
          </uni-view>` : ""}
          <uni-view class="prototype-filter-item">
            <uni-view class="prototype-filter-label">补贴金额区间</uni-view>
            <uni-view class="prototype-filter-range">
              <input class="prototype-filter-input" data-field="subsidyMin" value="${escapeHtml(filterState.subsidyMin)}" placeholder="最小值" inputmode="decimal" />
              <uni-view class="prototype-filter-dash">-</uni-view>
              <input class="prototype-filter-input" data-field="subsidyMax" value="${escapeHtml(filterState.subsidyMax)}" placeholder="最大值" inputmode="decimal" />
            </uni-view>
          </uni-view>
          <uni-view class="prototype-filter-item">
            <uni-view class="prototype-filter-label">用户支付金额区间</uni-view>
            <uni-view class="prototype-filter-range">
              <input class="prototype-filter-input" data-field="userPayMin" value="${escapeHtml(filterState.userPayMin)}" placeholder="最小值" inputmode="decimal" />
              <uni-view class="prototype-filter-dash">-</uni-view>
              <input class="prototype-filter-input" data-field="userPayMax" value="${escapeHtml(filterState.userPayMax)}" placeholder="最大值" inputmode="decimal" />
            </uni-view>
          </uni-view>
        </uni-view>
        <uni-view class="prototype-filter-footer">
          <button class="prototype-filter-btn prototype-filter-reset" type="button">重置</button>
          <button class="prototype-filter-btn prototype-filter-confirm" type="button">确认筛选</button>
        </uni-view>
      </uni-view>
    `;

    mask.querySelector(".prototype-filter-close").addEventListener("click", () => mask.remove());
    mask.querySelector(".prototype-filter-reset").addEventListener("click", () => {
      filterState.count = "5";
      filterState.brand = "全部品牌";
      filterState.subsidyMin = "";
      filterState.subsidyMax = "";
      filterState.userPayMin = "";
      filterState.userPayMax = "";
      mask.remove();
      applyCompensationFilter();
    });
    mask.querySelector(".prototype-filter-confirm").addEventListener("click", () => {
      const countSelect = mask.querySelector('[data-field="count"]');
      const brandSelect = mask.querySelector('[data-field="brand"]');
      filterState.count = countSelect ? countSelect.value : "5";
      filterState.brand = brandSelect ? brandSelect.value : "全部品牌";
      ["subsidyMin", "subsidyMax", "userPayMin", "userPayMax"].forEach((field) => {
        const input = mask.querySelector(`[data-field="${field}"]`);
        filterState[field] = input ? input.value.replace(/[^\d.]/g, "") : "";
      });
      const ranges = [
        ["补贴金额", filterState.subsidyMin, filterState.subsidyMax],
        ["用户支付金额", filterState.userPayMin, filterState.userPayMax],
      ];
      const invalidRange = ranges.find(([, minText, maxText]) => {
        const min = normalizeNumber(minText);
        const max = normalizeNumber(maxText);
        return Number.isFinite(min) && Number.isFinite(max) && min > max;
      });
      if (invalidRange) {
        window.alert(`${invalidRange[0]}区间的最小值不能大于最大值`);
        return;
      }
      mask.remove();
      applyCompensationFilter();
    });
    mask.addEventListener("click", (event) => {
      if (event.target === mask) mask.remove();
    });
    document.body.appendChild(mask);
  }

  function rangeText(minValue, maxValue) {
    const min = minValue || "不限";
    const max = maxValue || "不限";
    return `${min} - ${max}`;
  }

  function showOneKeyClaimTip() {
    const old = document.querySelector(".prototype-claim-toast");
    if (old) old.remove();
    const selectedCount = getVisibleCompensationCards().filter((card) => selectedCards.has(card.dataset.prototypeCardId)).length;
    if (selectedCount === 0) {
      showMiniToast("选择抢单订单");
      return;
    }
    const toast = document.createElement("uni-view");
    toast.className = "prototype-claim-toast";
    toast.innerHTML = `
      <uni-view class="prototype-claim-toast-title">一键抢单提示</uni-view>
      <uni-view class="prototype-claim-toast-line">批量接单数量：${escapeHtml(filterState.count)}单</uni-view>
      <uni-view class="prototype-claim-toast-line">商品品牌：${escapeHtml(filterState.brand)}</uni-view>
      <uni-view class="prototype-claim-toast-line">补贴金额区间：${escapeHtml(rangeText(filterState.subsidyMin, filterState.subsidyMax))}</uni-view>
      <uni-view class="prototype-claim-toast-line">用户支付金额区间：${escapeHtml(rangeText(filterState.userPayMin, filterState.userPayMax))}</uni-view>
      <uni-view class="prototype-claim-toast-line">当前已选择：${selectedCount}张卡片</uni-view>
    `;
    document.body.appendChild(toast);
    clearTimeout(showOneKeyClaimTip.timer);
    showOneKeyClaimTip.timer = setTimeout(() => toast.remove(), 3200);
  }

  function patchOneKeyClaimButton() {
    Array.from(document.querySelectorAll(".batch-btn")).forEach((button) => {
      if (!textOf(button).includes("一键抢单") && !textOf(button).includes("批量抢单")) return;
      button.textContent = "一键抢单";
      if (button.dataset.prototypeOneKeyBound === "true") return;
      button.dataset.prototypeOneKeyBound = "true";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showOneKeyClaimTip();
      }, true);
    });
  }

  function inRange(value, minText, maxText) {
    const min = normalizeNumber(minText);
    const max = normalizeNumber(maxText);
    if (Number.isFinite(min) && value < min) return false;
    if (Number.isFinite(max) && value > max) return false;
    return true;
  }

  function applyCompensationFilter() {
    const cards = Array.from(document.querySelectorAll(".compensation-card"));
    cards.forEach((card) => {
      const brandMatch = filterState.brand === "全部品牌" || getBrandFromCard(card) === filterState.brand;
      const subsidy = getAmountFromCard(card, "补贴金额");
      const userPay = getAmountFromCard(card, "用户支付");
      const amountMatch = inRange(subsidy, filterState.subsidyMin, filterState.subsidyMax) &&
        inRange(userPay, filterState.userPayMin, filterState.userPayMax);
      card.style.display = brandMatch && amountMatch ? "" : "none";
    });
    syncSelectAllControl();
  }

  let timer = 0;
  function run() {
    ensureStyle();
    markChangedMiniEntries();
    ensureReviewGuide();
    ensureInlineNotes();
    markWorkbenchPendingOrders();
    const path = window.location.pathname;
    if (path.includes("/subpkg-invoice/after-sale-subsidy")) patchAfterSaleSubsidy();
    else hideAfterSaleMergeUploadButton();
    if (path.includes("/subpkg-invoice/compensation")) patchCompensation();
  }

  document.addEventListener("click", (event) => {
    const oneKeyButton = event.target.closest(".batch-btn");
    if (oneKeyButton && location.pathname.includes("/subpkg-invoice/compensation")) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      showOneKeyClaimTip();
      return;
    }
    if (!event.target.closest(".tab-item")) return;
    const mask = document.querySelector(".prototype-filter-mask");
    if (mask) mask.remove();
    setTimeout(() => {
      patchCompensationFilter();
      patchSelectAllControl();
      patchCompensationCards();
      applyCompensationFilter();
    }, 80);
  }, true);

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 16);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  document.addEventListener("click", () => {
    run();
    schedule();
  }, true);
  document.addEventListener("touchend", () => {
    run();
    schedule();
  }, true);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(run, 1200);
})();
