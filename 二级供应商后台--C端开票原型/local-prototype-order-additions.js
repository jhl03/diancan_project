(function () {
  const BLUE = "#409eff";
  const RED = "#f56c6c";
  const ORANGE = "#e6a23c";
  const initialTargetPath =
    location.pathname.includes("/order/compensation") || location.pathname.includes("/order/after-sale-subsidy")
      ? location.pathname
      : "";

  if (initialTargetPath) {
    history.replaceState({ secondOrderTarget: initialTargetPath }, "", `/index?secondOrderTarget=${encodeURIComponent(initialTargetPath)}`);
  }

  const state = {
    route: "",
    activeTab: "处理中",
    compensationBrand: "全部",
    filters: {},
    selected: new Set(),
    marks: {},
  };

  const compensationRows = [
    { claimNo: "CLM202610120001", subsidyNo: "SUB202610120001", orderNo: "FO202610120001", brand: "瑞幸咖啡", productName: "瑞幸咖啡 29元饮品券", userName: "张三", city: "杭州-西湖区", mergeId: "6138", userPay: "18.50", subsidyAmount: "4.50", status: "待抢单" },
    { claimNo: "CLM202610120002", subsidyNo: "SUB202610120002", orderNo: "FO202610120002", brand: "肯德基", productName: "肯德基 50元代金券", userName: "李四", city: "杭州-滨江区", mergeId: "6138", userPay: "42.90", subsidyAmount: "6.00", status: "待抢单" },
    { claimNo: "CLM202610120003", subsidyNo: "SUB202610120003", orderNo: "FO202610120003", brand: "麦当劳", productName: "麦当劳 38元套餐券", userName: "王五", city: "上海-黄浦区", mergeId: "-", userPay: "29.90", subsidyAmount: "3.80", status: "待抢单" },
    { claimNo: "CLM202610120004", subsidyNo: "SUB202610120004", orderNo: "FO202610120004", brand: "瑞幸咖啡", productName: "瑞幸咖啡 38元套餐券", userName: "张三", city: "杭州-西湖区", mergeId: "6138", userPay: "35.80", subsidyAmount: "5.20", status: "待抢单" },
  ];

  const subsidyRows = [
    { id: "CLM202610120101", tab: "处理中", subsidyNo: "SUB202610120101", orderNo: "FO202610120101", brand: "瑞幸咖啡", supplierName: "惠生活北京出餐供应商", mergeId: "6138", titleType: "企业", invoiceTitle: "瑞幸咖啡（中国）有限公司", taxNo: "91110108MA01DEMO01", userPay: "18.50", productName: "生椰拿铁 1杯", userName: "瑞幸咖啡-北京", city: "杭州-西湖区", amount: "2.60", status: "待上传", mark: "待开票" },
    { id: "CLM202610120102", tab: "处理中", subsidyNo: "SUB202610120102", orderNo: "FO202610120102", brand: "肯德基", supplierName: "惠生活厦门出餐供应商", mergeId: "6138", titleType: "企业", invoiceTitle: "厦门肯德基有限公司", taxNo: "91350200MA01DEMO02", userPay: "42.90", productName: "肯德基 50元代金券", userName: "肯德基-厦门", city: "杭州-滨江区", amount: "4.80", status: "待上传", mark: "待开票" },
    { id: "CLM202610120103", tab: "处理中", subsidyNo: "SUB202610120103", orderNo: "FO202610120103", brand: "瑞幸咖啡", supplierName: "惠生活北京出餐供应商", mergeId: "6138", titleType: "企业", invoiceTitle: "瑞幸咖啡（中国）有限公司", taxNo: "91110108MA01DEMO01", userPay: "35.80", productName: "瑞幸咖啡 厚乳拿铁 2杯", userName: "瑞幸咖啡-北京", city: "杭州-西湖区", amount: "4.20", status: "待上传", mark: "待开票" },
    { id: "CLM202610120104", tab: "处理中", subsidyNo: "SUB202610120104", orderNo: "FO202610120104", brand: "麦当劳", supplierName: "惠生活上海出餐供应商", mergeId: "-", titleType: "企业", invoiceTitle: "金拱门（中国）有限公司", taxNo: "91110000MA01DEMO03", userPay: "29.90", productName: "麦当劳 早餐双人券", userName: "麦当劳-上海", city: "上海-黄浦区", amount: "3.50", status: "待上传", mark: "待开票" },
    { id: "CLM202610120105", tab: "处理中", subsidyNo: "SUB202610120105", orderNo: "FO202610120105", brand: "肯德基", supplierName: "惠生活厦门出餐供应商", mergeId: "-", titleType: "企业", invoiceTitle: "厦门肯德基有限公司", taxNo: "91350200MA01DEMO02", userPay: "31.90", productName: "肯德基 38元套餐券", userName: "肯德基-厦门", city: "杭州-滨江区", amount: "3.90", status: "待上传", mark: "待开票" },
    { id: "CLM202610120201", tab: "已驳回", subsidyNo: "SUB202610120201", orderNo: "FO202610120201", brand: "瑞幸咖啡", supplierName: "惠生活北京出餐供应商", mergeId: "8831", titleType: "企业", invoiceTitle: "瑞幸咖啡（中国）有限公司", taxNo: "91110108MA01DEMO01", userPay: "26.00", productName: "瑞幸咖啡 9.9元券", userName: "瑞幸咖啡-北京", city: "北京-朝阳区", amount: "3.10", status: "已驳回", mark: "待开票" },
    { id: "CLM202610120301", tab: "已上传", subsidyNo: "SUB202610120301", orderNo: "FO202610120301", brand: "肯德基", supplierName: "惠生活厦门出餐供应商", mergeId: "9206", titleType: "企业", invoiceTitle: "福州餐饮供应链有限公司", taxNo: "91350100MA8TEST003", userPay: "20.00", productName: "肯德基 20元代金券", userName: "肯德基-福州", city: "福州-鼓楼区", amount: "2.00", status: "已上传", mark: "已上传" },
    { id: "CLM202610120302", tab: "已上传", subsidyNo: "SUB202610120302", orderNo: "FO202610120302", brand: "麦当劳", supplierName: "惠生活上海出餐供应商", mergeId: "-", titleType: "个人", invoiceTitle: "李四", taxNo: "-", userPay: "16.80", productName: "麦当劳 15元早餐券", userName: "麦当劳-上海", city: "上海-黄浦区", amount: "1.80", status: "已上传", mark: "已上传" },
  ];

  function textOf(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function currentRoute() {
    const target = new URLSearchParams(location.search).get("secondOrderTarget") || location.pathname;
    if (target.includes("/order/compensation")) return "compensation";
    if (target.includes("/order/after-sale-subsidy")) return "afterSale";
    return "";
  }

  function restoreTargetUrl() {
    const target = new URLSearchParams(location.search).get("secondOrderTarget");
    if (target) history.replaceState(null, "", target);
  }

  function ensureStyle() {
    if (document.getElementById("second-order-additions-style")) return;
    const style = document.createElement("style");
    style.id = "second-order-additions-style";
    style.textContent = `
      .second-order-menu-wrap { display: block; margin: 0; padding: 0; background: transparent !important; }
      .second-order-menu-link { color: #bfcbd9 !important; text-decoration: none !important; display: block; height: 44px; line-height: 44px; padding-left: 42px; font-size: 14px; box-sizing: border-box; background: transparent !important; }
      .second-order-menu-link.active, .second-order-menu-link:hover { color: #409eff !important; background: #263445 !important; }
      .second-order-page { padding: 24px 20px 36px; background: #fff; min-height: calc(100vh - 110px); color: #303133; box-sizing: border-box; }
      .second-order-guide { margin: 8px 0 22px; padding: 14px 16px; border: 1px solid #ffccc7; border-left: 4px solid ${RED}; border-radius: 4px; background: #fff7f6; font-size: 13px; line-height: 1.7; }
      .second-order-guide-title { color: ${RED}; font-size: 15px; font-weight: 700; margin-bottom: 6px; }
      .second-order-guide-row { padding: 5px 0; border-top: 1px dashed #ffd6d1; }
      .second-order-guide-row:first-of-type { border-top: none; }
      .second-order-guide-row strong { color: ${RED}; margin-right: 10px; }
      .second-order-guide-notice { color: ${BLUE}; font-weight: 700; }
      .second-order-tabs { display: flex; gap: 46px; border-bottom: 1px solid #dcdfe6; margin-bottom: 26px; }
      .second-order-tab { padding: 0 0 12px; border: none; background: transparent; color: #303133; cursor: pointer; font-size: 16px; }
      .second-order-tab.active { color: ${BLUE}; border-bottom: 2px solid ${BLUE}; }
      .second-order-filter-grid { display: grid; grid-template-columns: repeat(3, 225px); gap: 18px 40px; align-items: center; margin-bottom: 18px; }
      .second-order-input, .second-order-select { width: 225px; height: 38px; border: 1px solid #dcdfe6; border-radius: 4px; padding: 0 12px; background: #fff; color: #606266; box-sizing: border-box; font-size: 14px; outline: none; }
      .second-order-range { display: flex; gap: 10px; }
      .second-order-range .second-order-input { width: 106px; }
      .second-order-toolbar, .second-order-actions { display: flex; gap: 14px; align-items: center; margin: 16px 0; flex-wrap: wrap; }
      .second-order-actions { margin-top: 28px; }
      .second-order-btn { display: inline-flex; align-items: center; justify-content: center; height: 36px; min-width: 84px; padding: 0 16px; border: 1px solid #dcdfe6; border-radius: 4px; background: #fff; color: #606266; cursor: pointer; font-size: 14px; box-sizing: border-box; }
      .second-order-btn.primary { border-color: ${BLUE}; background: ${BLUE}; color: #fff; }
      .second-order-btn.warning { border-color: ${ORANGE}; background: ${ORANGE}; color: #fff; }
      .second-order-btn.text { min-width: auto; height: auto; padding: 0 7px; border: none; background: transparent; color: ${BLUE}; }
      .second-order-btn.danger-text { color: ${RED}; }
      .second-order-btn.orange-text { color: ${ORANGE}; }
      .second-order-table-tools { float: right; display: flex; gap: 12px; margin-top: -58px; }
      .second-order-round { width: 38px; height: 38px; border: 1px solid #dcdfe6; border-radius: 50%; background: #fff; color: #606266; cursor: pointer; }
      .second-order-table-wrap { clear: both; width: 100%; overflow-x: auto; }
      .second-order-table { width: 100%; min-width: 1680px; border-collapse: collapse; border: 1px solid #ebeef5; table-layout: fixed; }
      .second-order-table th, .second-order-table td { border: 1px solid #ebeef5; padding: 13px 14px; text-align: left; vertical-align: middle; font-size: 14px; word-break: break-word; }
      .second-order-table th { background: #f5f7fa; color: #303133; font-weight: 700; }
      .second-order-table tr:nth-child(even) td { background: #fafafa; }
      .second-order-table .check-col { width: 48px; text-align: center; }
      .second-order-table input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; }
      .second-order-red { color: ${RED} !important; font-weight: 600; }
      .second-order-status { color: ${ORANGE}; font-weight: 600; }
      .second-order-pagination { display: flex; justify-content: flex-end; align-items: center; gap: 14px; margin-top: 22px; color: #606266; }
      .second-order-pagebox { min-width: 36px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 4px; background: ${BLUE}; color: #fff; }
      .second-order-toast { position: fixed; top: 84px; left: 50%; transform: translateX(-50%); z-index: 100100; padding: 10px 18px; border-radius: 4px; background: rgba(30, 41, 59, 0.94); color: #fff; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.22); font-size: 14px; }
      .second-order-dialog-mask { position: fixed; inset: 0; z-index: 100090; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.45); }
      .second-order-dialog { width: 640px; max-width: calc(100vw - 48px); background: #fff; border-radius: 6px; box-shadow: 0 16px 42px rgba(15, 23, 42, 0.24); overflow: hidden; }
      .second-order-dialog-hd { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #ebeef5; font-size: 16px; font-weight: 700; }
      .second-order-dialog-close { border: none; background: transparent; font-size: 24px; color: #909399; cursor: pointer; }
      .second-order-dialog-bd { padding: 18px 20px 8px; }
      .second-order-info { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
      .second-order-info td { border: 1px solid #ebeef5; padding: 11px 12px; color: #303133; }
      .second-order-info td:first-child { width: 138px; background: #f5f7fa; font-weight: 700; }
      .second-order-upload-row { display: flex; align-items: center; gap: 12px; color: #606266; font-size: 13px; }
      .second-order-dialog-ft { display: flex; justify-content: flex-end; gap: 12px; padding: 14px 20px 18px; }
      @media (max-width: 960px) {
        .second-order-filter-grid { grid-template-columns: repeat(2, minmax(180px, 1fr)); }
        .second-order-input, .second-order-select { width: 100%; }
      }
    `;
    document.head.appendChild(style);
  }

  function toast(message) {
    document.querySelectorAll(".second-order-toast").forEach((item) => item.remove());
    const el = document.createElement("div");
    el.className = "second-order-toast";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function getMain() {
    return document.querySelector(".app-main") ||
      document.querySelector("#app .main-container .app-main") ||
      document.querySelector("#app .main-container section");
  }

  function navigate(path) {
    if (location.pathname !== path) history.pushState(null, "", path);
    render(true);
  }

  function cleanupDuplicateMenus() {
    document.querySelectorAll("[data-second-order-menu='1']").forEach((wrap, index) => {
      if (index > 0) wrap.remove();
    });
    const seen = new Set();
    document.querySelectorAll(".second-order-menu-link").forEach((link) => {
      const name = textOf(link);
      if (seen.has(name)) link.remove();
      else seen.add(name);
    });
  }

  function updateTopTitle(title) {
    const breadcrumb = document.querySelector("#breadcrumb-container") || document.querySelector(".breadcrumb-container");
    if (breadcrumb) {
      breadcrumb.innerHTML = `<span>首页</span><span style="margin:0 8px;color:#909399;">/</span><span>订单管理</span><span style="margin:0 8px;color:#909399;">/</span><span style="color:#97a8be;">${escapeHtml(title)}</span>`;
    }
    const tagContainer = document.querySelector(".tags-view-container .tags-view-wrapper") || document.querySelector(".tags-view-container");
    if (tagContainer && !tagContainer.querySelector(`[data-second-order-tag="${title}"]`)) {
      const tag = document.createElement("span");
      tag.className = "tags-view-item active";
      tag.dataset.secondOrderTag = title;
      tag.style.cssText = "display:inline-block;margin-left:5px;padding:0 8px;height:32px;line-height:32px;border:1px solid #d8dce5;background:#409eff;color:#fff;font-size:12px;";
      tag.textContent = title + " ×";
      tagContainer.appendChild(tag);
    }
  }

  function ensureMenu() {
    const candidates = Array.from(document.querySelectorAll(".el-menu, .sidebar-container, .sidebar, aside, ul"));
    const menu = candidates.find((item) => textOf(item).includes("订单管理")) || candidates[0];
    if (!menu) return;
    document.querySelectorAll("[data-second-order-menu='1']").forEach((wrap) => wrap.remove());
    const orderNode = Array.from(menu.querySelectorAll("*")).reverse().find((node) => textOf(node) === "订单管理");
    const orderItem = orderNode ? (orderNode.closest(".el-sub-menu") || orderNode.closest("li") || orderNode.parentElement) : menu;
    const subMenu = orderItem && (orderItem.querySelector(".el-menu, ul") || orderItem.querySelector(".el-menu--inline"));
    const insertParent = subMenu || (orderItem && orderItem.parentElement ? orderItem.parentElement : menu);
    const existingNames = new Set(Array.from(insertParent.querySelectorAll("a, li, span, div")).map(textOf));
    const items = [
      { text: "新订单", href: "/order/bidding" },
      { text: "订单列表", href: "/order/list" },
      { text: "竞价记录", href: "/order/bidding-record" },
      { text: "补偿单列表", href: "/order/compensation" },
      { text: "售后补贴单", href: "/order/after-sale-subsidy" },
    ].filter((item) => !existingNames.has(item.text));
    if (items.length) {
      const wrap = document.createElement("div");
      wrap.dataset.secondOrderMenu = "1";
      wrap.className = "second-order-menu-wrap";
      wrap.innerHTML = items.map((item) => `<a class="second-order-menu-link" href="${item.href}">${item.text}</a>`).join("");
      const biddingNode = Array.from(insertParent.querySelectorAll("*")).reverse().find((node) => textOf(node) === "竞价记录");
      const biddingItem = biddingNode ? (biddingNode.closest("li") || biddingNode.closest("a") || biddingNode.parentElement) : null;
      if (biddingItem && biddingItem.parentElement === insertParent) insertParent.insertBefore(wrap, biddingItem.nextSibling);
      else insertParent.appendChild(wrap);
    }
    document.querySelectorAll(".second-order-menu-link").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === location.pathname);
      if (link.dataset.secondOrderBound === "1") return;
      link.dataset.secondOrderBound = "1";
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (href !== "/order/compensation" && href !== "/order/after-sale-subsidy") return;
        event.preventDefault();
        navigate(href);
      });
    });
    cleanupDuplicateMenus();
  }

  function field(name, key, type) {
    const value = state.filters[key] || "";
    if (type === "brand") {
      return `<select class="second-order-select" data-filter="${key}">
        <option value="">选择商品品牌</option>
        <option ${value === "瑞幸咖啡" ? "selected" : ""}>瑞幸咖啡</option>
        <option ${value === "肯德基" ? "selected" : ""}>肯德基</option>
        <option ${value === "麦当劳" ? "selected" : ""}>麦当劳</option>
      </select>`;
    }
    if (type === "mark") {
      return `<select class="second-order-select" data-filter="${key}">
        <option value="">开票标记</option>
        <option ${value === "待开票" ? "selected" : ""}>待开票</option>
        <option ${value === "开票中" ? "selected" : ""}>开票中</option>
      </select>`;
    }
    return `<input class="second-order-input" data-filter="${key}" value="${escapeHtml(value)}" placeholder="请输入${escapeHtml(name)}" />`;
  }

  function bindFilterEvents(main) {
    main.querySelectorAll("[data-filter]").forEach((input) => {
      input.addEventListener("input", () => {
        state.filters[input.dataset.filter] = input.value.trim();
      });
      input.addEventListener("change", () => {
        state.filters[input.dataset.filter] = input.value.trim();
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") render(true);
      });
    });
    const search = main.querySelector("[data-action='search']");
    if (search) search.addEventListener("click", () => render(true));
    const reset = main.querySelector("[data-action='reset']");
    if (reset) {
      reset.addEventListener("click", () => {
        state.filters = {};
        state.selected.clear();
        render(true);
      });
    }
  }

  function matchText(value, filter) {
    return !filter || String(value || "").includes(filter);
  }

  function filteredCompensationRows() {
    const f = state.filters;
    return compensationRows.filter((row) =>
      matchText(row.subsidyNo, f.subsidyNo) &&
      matchText(row.orderNo, f.orderNo) &&
      matchText(row.mergeId, f.mergeId) &&
      matchText(row.productName, f.productName) &&
      matchText(row.userName, f.userName) &&
      (!state.compensationBrand || state.compensationBrand === "全部" || row.brand === state.compensationBrand) &&
      (!f.payMin || Number(row.userPay) >= Number(f.payMin)) &&
      (!f.payMax || Number(row.userPay) <= Number(f.payMax)) &&
      (!f.subsidyMin || Number(row.subsidyAmount) >= Number(f.subsidyMin)) &&
      (!f.subsidyMax || Number(row.subsidyAmount) <= Number(f.subsidyMax))
    );
  }

  function compensationBrandTabs() {
    return `<div class="second-order-tabs second-order-brand-tabs">
      ${["全部", "瑞幸咖啡", "肯德基", "麦当劳"].map((brand) => `<button class="second-order-tab ${state.compensationBrand === brand ? "active" : ""}" data-brand-tab="${brand}">${brand}</button>`).join("")}
    </div>`;
  }

  function renderCompensation(main) {
    const rows = filteredCompensationRows();
    updateTopTitle("补偿单列表");
    main.innerHTML = `
      <div class="second-order-page" data-second-route="compensation">
        <div class="second-order-guide">
          <div class="second-order-guide-title">本页改动说明：补偿单列表</div>
          <div class="second-order-guide-row"><strong>页面位置</strong>补偿单列表已放入二级供应商后台的订单管理目录。</div>
          <div class="second-order-guide-row"><strong>页面内容</strong>筛选项、列表字段、抢单入口与点餐供应商后台补偿单列表保持一致。</div>
          <div class="second-order-guide-row"><strong>字段顺序</strong>列表补充多选框，“合并ID”放在多选框后面，并保留用户名称、商品名称、门店所在城市等字段。</div>
          <div class="second-order-guide-row"><strong>页面数据源</strong><span class="second-order-red">接开票单品牌继承对应一级供应商的品牌。</span></div>
        </div>
        <div class="second-order-filter-grid">
          ${field("合并ID", "mergeId")}
          ${field("用户名称", "userName")}
          <div class="second-order-range">
            <input class="second-order-input" data-filter="payMin" value="${escapeHtml(state.filters.payMin || "")}" placeholder="用户支付最低" />
            <input class="second-order-input" data-filter="payMax" value="${escapeHtml(state.filters.payMax || "")}" placeholder="用户支付最高" />
          </div>
          <div class="second-order-range">
            <input class="second-order-input" data-filter="subsidyMin" value="${escapeHtml(state.filters.subsidyMin || "")}" placeholder="补贴金额最低" />
            <input class="second-order-input" data-filter="subsidyMax" value="${escapeHtml(state.filters.subsidyMax || "")}" placeholder="补贴金额最高" />
          </div>
        </div>
        <div class="second-order-toolbar">
          <button class="second-order-btn primary" data-action="search">搜索</button>
          <button class="second-order-btn" data-action="reset">重置</button>
        </div>
        <div class="second-order-actions">
          <button class="second-order-btn primary" data-action="batch-claim">批量抢单</button>
        </div>
        ${compensationBrandTabs()}
        <div class="second-order-table-tools"><button class="second-order-round">⌕</button><button class="second-order-round">↻</button></div>
        <div class="second-order-table-wrap">
          <table class="second-order-table">
            <thead>
              <tr>
                <th class="check-col"><input type="checkbox" data-action="comp-select-all" /></th><th>合并ID</th><th>门店所在城市</th><th>已创建时长</th><th>商品名称</th><th>用户名称</th><th>用户支付</th><th>商品品牌</th><th>补贴金额</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => `
                <tr>
                  <td class="check-col"><input type="checkbox" data-action="comp-select-row" data-id="${escapeHtml(row.claimNo)}" ${state.selected.has(row.claimNo) ? "checked" : ""} /></td>
                  <td class="${row.mergeId !== "-" ? "second-order-red" : ""}">${escapeHtml(row.mergeId)}</td>
                  <td>${escapeHtml(row.city)}</td>
                  <td>${escapeHtml(row.createdDuration || "2小时")}</td>
                  <td>${escapeHtml(row.productName)}</td>
                  <td>${escapeHtml(row.userName)}</td>
                  <td>${escapeHtml(row.userPay)}</td>
                  <td>${escapeHtml(row.brand)}</td>
                  <td>${escapeHtml(row.subsidyAmount)}</td>
                  <td><button class="second-order-btn text" data-action="claim-row" data-id="${escapeHtml(row.claimNo)}">抢单</button></td>
                </tr>
              `).join("") || `<tr><td colspan="10" style="text-align:center;color:#909399;">暂无数据</td></tr>`}
            </tbody>
          </table>
        </div>
        <div class="second-order-pagination"><span>共 ${rows.length} 条</span><span>20条/页</span><span class="second-order-pagebox">1</span></div>
      </div>
    `;
    bindFilterEvents(main);
    const compRows = rows.map((row) => row.claimNo);
    const compSelectAll = main.querySelector("[data-action='comp-select-all']");
    if (compSelectAll) {
      compSelectAll.checked = compRows.length > 0 && compRows.every((id) => state.selected.has(id));
      compSelectAll.addEventListener("change", () => {
        compRows.forEach((id) => compSelectAll.checked ? state.selected.add(id) : state.selected.delete(id));
        render(true);
      });
    }
    main.querySelectorAll("[data-action='comp-select-row']").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        checkbox.checked ? state.selected.add(checkbox.dataset.id) : state.selected.delete(checkbox.dataset.id);
        render(true);
      });
    });
    main.querySelectorAll("[data-brand-tab]").forEach((tab) => {
      tab.addEventListener("click", () => {
        state.compensationBrand = tab.dataset.brandTab;
        state.selected.clear();
        render(true);
      });
    });
    main.querySelector("[data-action='batch-claim']").addEventListener("click", () => {
      if (!state.selected.size) return toast("至少选择一个补偿单");
      toast("批量抢单成功");
    });
    main.querySelectorAll("[data-action='claim-row']").forEach((button) => {
      button.addEventListener("click", () => toast(`${button.dataset.id} 抢单成功`));
    });
  }

  function rowMark(row) {
    return state.marks[row.id] || row.mark;
  }

  function filteredSubsidyRows() {
    const f = state.filters;
    return subsidyRows.filter((row) =>
      row.tab === state.activeTab &&
      matchText(row.subsidyNo, f.subsidyNo) &&
      matchText(row.orderNo, f.orderNo) &&
      matchText(row.invoiceTitle, f.invoiceTitle) &&
      matchText(row.mergeId, f.mergeId) &&
      matchText(row.brand, f.brand) &&
      (state.activeTab === "已上传" ? matchText(row.supplierName, f.supplierName) : true) &&
      (!f.mark || rowMark(row) === f.mark)
    );
  }

  function selectable(row) {
    return row.tab !== "已上传";
  }

  function renderTabs() {
    return `<div class="second-order-tabs">
      ${["处理中", "已驳回", "已上传"].map((tab) => `<button class="second-order-tab ${state.activeTab === tab ? "active" : ""}" data-tab="${tab}">${tab}</button>`).join("")}
    </div>`;
  }

  function renderSubsidyFilters() {
    return `<div class="second-order-filter-grid">
      ${field("合并ID", "mergeId")}
      ${state.activeTab === "已上传" ? field("供应商名称", "supplierName") : ""}
      ${state.activeTab === "已上传" ? "" : field("开票标记", "mark", "mark")}
      ${field("补贴单号", "subsidyNo")}
      ${field("订单号", "orderNo")}
      ${field("发票抬头", "invoiceTitle")}
      ${field("商品品牌", "brand", "brand")}
    </div>`;
  }

  function renderSubsidyActions() {
    if (state.activeTab === "已上传") return "";
    const uploadText = state.activeTab === "已驳回" ? "重新合并上传" : "合并上传";
    return `<div class="second-order-actions">
      <button class="second-order-btn primary" data-action="merge-upload">${uploadText}</button>
      <button class="second-order-btn" data-action="batch-mark">批量标记</button>
      <button class="second-order-btn" data-action="batch-unmark">批量取消标记</button>
    </div>`;
  }

  function selectedRows() {
    return subsidyRows.filter((row) => state.selected.has(row.id));
  }

  function validateMerge(rows) {
    if (!rows.length) return "请选择要合并上传发票的工单";
    if (rows.length < 2) return "至少勾选两个相同的合并ID";
    const mergeIds = Array.from(new Set(rows.map((row) => row.mergeId)));
    if (mergeIds.some((id) => !id || id === "-")) return "合并ID为空的不能进行合并上传";
    if (mergeIds.length > 1) return "合并ID不同，请重新选择";
    const titles = Array.from(new Set(rows.map((row) => row.invoiceTitle)));
    const taxNos = Array.from(new Set(rows.map((row) => row.taxNo)));
    const titleTypes = Array.from(new Set(rows.map((row) => row.titleType)));
    if (titles.length > 1 || taxNos.length > 1 || titleTypes.length > 1) return "所选发票抬头/税号/抬头类型不一样";
    return "";
  }

  function openMergeDialog(rows) {
    document.querySelectorAll(".second-order-dialog-mask").forEach((item) => item.remove());
    const total = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0).toFixed(2);
    const first = rows[0];
    const mask = document.createElement("div");
    mask.className = "second-order-dialog-mask";
    mask.innerHTML = `
      <div class="second-order-dialog">
        <div class="second-order-dialog-hd">
          <span>合并上传发票</span>
          <button class="second-order-dialog-close" data-action="close-dialog">×</button>
        </div>
        <div class="second-order-dialog-bd">
          <table class="second-order-info">
            <tr><td>合并ID</td><td>${escapeHtml(first.mergeId)}</td></tr>
            <tr><td>发票抬头</td><td>${escapeHtml(first.invoiceTitle)}</td></tr>
            <tr><td>税号</td><td>${escapeHtml(first.taxNo)}</td></tr>
            <tr><td>抬头类型</td><td>${escapeHtml(first.titleType)}</td></tr>
            <tr><td>开票金额</td><td class="second-order-red">${total}</td></tr>
            <tr><td>关联工单</td><td>${rows.map((row) => escapeHtml(row.id)).join("、")}</td></tr>
          </table>
          <div class="second-order-upload-row">
            <strong>发票文件</strong>
            <button class="second-order-btn">选择文件</button>
            <span>支持上传与点餐供应商后台一致的合并上传弹窗内容。</span>
          </div>
        </div>
        <div class="second-order-dialog-ft">
          <button class="second-order-btn" data-action="close-dialog">取消</button>
          <button class="second-order-btn primary" data-action="confirm-dialog">上传</button>
        </div>
      </div>
    `;
    document.body.appendChild(mask);
    mask.querySelectorAll("[data-action='close-dialog']").forEach((button) => button.addEventListener("click", () => mask.remove()));
    mask.querySelector("[data-action='confirm-dialog']").addEventListener("click", () => {
      mask.remove();
      state.selected.clear();
      toast("合并上传成功");
      render(true);
    });
  }

  function renderSubsidy(main) {
    const rows = filteredSubsidyRows();
    updateTopTitle("售后补贴单");
    const showCheckbox = state.activeTab !== "已上传";
    const subsidyColumns = {
      "处理中": [
        ["mergeId", "合并ID"],
        ["claimNo", "抢单编号"],
        ["subsidyNo", "补贴单号"],
        ["orderNo", "订单号"],
        ["countdown", "处理倒计时"],
        ["status", "状态"],
        ["mark", "开票标识"],
        ["titleType", "抬头类型"],
        ["invoice", "发票抬头/税号"],
        ["userPay", "用户支付"],
        ["productName", "商品名称"],
        ["userName", "用户名称"],
        ["city", "门店所在城市"],
        ["brand", "商品品牌"],
        ["supplierName", "供应商名称"],
        ["amount", "补贴金额"],
      ],
      "已驳回": [
        ["mergeId", "合并ID"],
        ["claimNo", "抢单编号"],
        ["subsidyNo", "补贴单号"],
        ["orderNo", "订单号"],
        ["orderTime", "下单时间"],
        ["status", "状态"],
        ["mark", "开票标识"],
        ["titleType", "抬头类型"],
        ["invoice", "发票抬头/税号"],
        ["userPay", "用户支付"],
        ["productName", "商品名称"],
        ["userName", "用户名称"],
        ["city", "门店所在城市"],
        ["brand", "商品品牌"],
        ["supplierName", "供应商名称"],
        ["rejectReason", "驳回原因"],
        ["uploadTime", "上传时间"],
        ["amount", "补贴金额"],
      ],
      "已上传": [
        ["mergeId", "合并ID"],
        ["claimNo", "抢单编号"],
        ["subsidyNo", "补贴单号"],
        ["orderNo", "订单号"],
        ["orderTime", "下单时间"],
        ["status", "状态"],
        ["titleType", "抬头类型"],
        ["invoice", "发票抬头/税号"],
        ["userPay", "用户支付"],
        ["productName", "商品名称"],
        ["userName", "用户名称"],
        ["city", "门店所在城市"],
        ["brand", "商品品牌"],
        ["supplierName", "供应商名称"],
        ["uploadTime", "上传时间"],
        ["amount", "补贴金额"],
        ["subsidyStatus", "补贴状态"],
      ],
    }[state.activeTab];
    const displayValue = (row, key) => {
      if (key === "invoice") return `${row.invoiceTitle}<br /><span style="color:#909399;">${row.taxNo}</span>`;
      if (key === "countdown") return row.countdown || "00:28:36";
      if (key === "orderTime") return row.orderTime || "2026-10-12 09:18:00";
      if (key === "rejectReason") return row.rejectReason || "发票信息不一致";
      if (key === "uploadTime") return row.uploadTime || "2026-10-12 10:35:00";
      if (key === "subsidyStatus") return row.subsidyStatus || "待结算";
      if (key === "status") return row.status || state.activeTab;
      if (key === "mark") return rowMark(row);
      if (key === "claimNo") return row.claimNo || row.id;
      return row[key] == null ? "-" : row[key];
    };
    main.innerHTML = `
      <div class="second-order-page" data-second-route="afterSale">
        <div class="second-order-guide">
          <div class="second-order-guide-title">本页改动说明：售后补贴单</div>
          <div class="second-order-guide-row"><strong>页面位置</strong>售后补贴单已放入二级供应商后台的订单管理目录。</div>
          <div class="second-order-guide-row"><strong>页签内容</strong>保留处理中、已驳回、已上传三个页签，以及点餐供应商后台对应筛选项和列表字段。</div>
          <div class="second-order-guide-row"><strong>合并上传</strong>按钮可直接点击，不合规时按点餐供应商后台规则提示；批量取消标记位于批量标记右侧。</div>
          ${state.activeTab === "处理中" ? `<div class="second-order-guide-row second-order-guide-notice">若处理倒计时到了点餐后台配置的时间，进行公众号提醒，提醒在对应的一级供应商的公众号里面</div>` : ""}
        </div>
        ${renderTabs()}
        ${renderSubsidyFilters()}
        <div class="second-order-toolbar">
          <button class="second-order-btn primary" data-action="search">搜索</button>
          <button class="second-order-btn" data-action="reset">重置</button>
        </div>
        ${renderSubsidyActions()}
        <div class="second-order-table-tools"><button class="second-order-round">⌕</button><button class="second-order-round">↻</button></div>
        <div class="second-order-table-wrap">
          <table class="second-order-table">
            <thead>
              <tr>
                ${showCheckbox ? `<th class="check-col"><input type="checkbox" data-action="select-all" /></th>` : ""}
                ${subsidyColumns.map(([, label]) => `<th>${label}</th>`).join("")}<th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => `
                <tr>
                  ${showCheckbox ? `<td class="check-col"><input type="checkbox" data-action="select-row" data-id="${escapeHtml(row.id)}" ${state.selected.has(row.id) ? "checked" : ""} ${selectable(row) ? "" : "disabled"} /></td>` : ""}
                  ${subsidyColumns.map(([key]) => `<td class="${key === "mergeId" && row.mergeId !== "-" ? "second-order-red" : ""}">${displayValue(row, key)}</td>`).join("")}
                  <td>
                    ${state.activeTab === "已上传"
                      ? `<button class="second-order-btn text">查看</button><button class="second-order-btn text">下载</button>`
                      : `<button class="second-order-btn text">上传</button><button class="second-order-btn text">延长上传时间</button><button class="second-order-btn text danger-text">放弃</button><button class="second-order-btn text orange-text" data-action="toggle-mark" data-id="${escapeHtml(row.id)}">${rowMark(row) === "开票中" ? "取消标记" : "标记开票中"}</button>`}
                  </td>
                </tr>
              `).join("") || `<tr><td colspan="${subsidyColumns.length + (showCheckbox ? 2 : 1)}" style="text-align:center;color:#909399;">暂无数据</td></tr>`}
            </tbody>
          </table>
        </div>
        <div class="second-order-pagination"><span>共 ${rows.length} 条</span><span>20条/页</span><span class="second-order-pagebox">1</span><span>前往</span><span style="border:1px solid #dcdfe6;border-radius:4px;padding:6px 18px;">1</span><span>页</span></div>
      </div>
    `;
    bindFilterEvents(main);
    main.querySelectorAll("[data-tab]").forEach((tab) => {
      tab.addEventListener("click", () => {
        state.activeTab = tab.dataset.tab;
        state.selected.clear();
        render(true);
      });
    });
    const selectAll = main.querySelector("[data-action='select-all']");
    if (selectAll) {
      const ids = rows.filter(selectable).map((row) => row.id);
      selectAll.checked = ids.length > 0 && ids.every((id) => state.selected.has(id));
      selectAll.addEventListener("change", () => {
        ids.forEach((id) => selectAll.checked ? state.selected.add(id) : state.selected.delete(id));
        render(true);
      });
    }
    main.querySelectorAll("[data-action='select-row']").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        checkbox.checked ? state.selected.add(checkbox.dataset.id) : state.selected.delete(checkbox.dataset.id);
        render(true);
      });
    });
    main.querySelectorAll("[data-action='toggle-mark']").forEach((button) => {
      button.addEventListener("click", () => {
        const row = subsidyRows.find((item) => item.id === button.dataset.id);
        state.marks[row.id] = rowMark(row) === "开票中" ? "待开票" : "开票中";
        toast(state.marks[row.id] === "开票中" ? "标记成功" : "取消标记成功");
        render(true);
      });
    });
    const merge = main.querySelector("[data-action='merge-upload']");
    if (merge) {
      merge.addEventListener("click", () => {
        const rowsToUpload = selectedRows();
        const error = validateMerge(rowsToUpload);
        if (error) {
          toast(error);
          return;
        }
        openMergeDialog(rowsToUpload);
      });
    }
    const batchMark = main.querySelector("[data-action='batch-mark']");
    if (batchMark) {
      batchMark.addEventListener("click", () => {
        const rowsToMark = selectedRows();
        if (!rowsToMark.length) return toast("至少选择一个订单");
        const unmarked = rowsToMark.filter((row) => rowMark(row) !== "开票中");
        if (!unmarked.length) return toast("已全部标记，请选择未标记的订单");
        unmarked.forEach((row) => { state.marks[row.id] = "开票中"; });
        toast("标记成功");
        render(true);
      });
    }
    const batchUnmark = main.querySelector("[data-action='batch-unmark']");
    if (batchUnmark) {
      batchUnmark.addEventListener("click", () => {
        const rowsToMark = selectedRows();
        if (!rowsToMark.length) return toast("至少选择一个订单");
        const marked = rowsToMark.filter((row) => rowMark(row) === "开票中");
        if (!marked.length) return toast("没有未标记的订单，请重新选择");
        marked.forEach((row) => { state.marks[row.id] = "待开票"; });
        toast("取消标记成功");
        render(true);
      });
    }
  }

  function render(force) {
    ensureStyle();
    ensureMenu();
    const route = currentRoute();
    if (!route) return;
    const main = getMain();
    if (!main) return;
    if (!force && state.route === route && main.querySelector(`[data-second-route="${route}"]`)) return;
    if (state.route !== route) {
      state.selected.clear();
      state.filters = {};
    }
    state.route = route;
    document.body.classList.add("loaded");
    restoreTargetUrl();
    if (route === "compensation") renderCompensation(main);
    if (route === "afterSale") renderSubsidy(main);
    ensureMenu();
  }

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest && event.target.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (href === "/order/compensation" || href === "/order/after-sale-subsidy") {
      event.preventDefault();
      navigate(href);
      return;
    }
    // 原有订单页面交给系统自身的 Vue 路由处理，避免整页刷新。
  }, true);

  window.addEventListener("popstate", () => render(true));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => render(true));
  else render(true);
  setInterval(() => {
    ensureMenu();
    render(false);
  }, 800);
})();
