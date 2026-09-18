(function () {
  const menu = [
    {
      path: "/supplier",
      component: "Layout",
      alwaysShow: true,
      meta: { title: "供应商管理", icon: "peoples" },
      children: [
        { path: "list", component: "supplier/list/index", name: "SupplierList", meta: { title: "供应商列表" } },
        { path: "guarantee", component: "supplier/guarantee/index", name: "SupplierGuarantee", meta: { title: "兜底供应商" } },
        { path: "invite", component: "supplier/invite/index", name: "SupplierInvite", meta: { title: "供应商推荐人" } },
        { path: "api", component: "supplier/api/index", name: "SupplierApi", meta: { title: "供应商API配置" } },
        { path: "reason", component: "supplier/reason/index", name: "SupplierReason", meta: { title: "失败原因配置" } },
      ],
    },
    {
      path: "/goods",
      component: "Layout",
      alwaysShow: true,
      meta: { title: "商品管理", icon: "shopping" },
      children: [
        { path: "list", component: "goods/list/index", name: "GoodsList", meta: { title: "商品列表" } },
        { path: "category", component: "goods/category/index", name: "GoodsCategory", meta: { title: "商品分类" } },
        { path: "quotation", component: "goods/quotation/index", name: "GoodsQuotation", meta: { title: "供应商报价" } },
      ],
    },
    {
      path: "/order",
      component: "Layout",
      alwaysShow: true,
      meta: { title: "订单管理", icon: "list" },
      children: [
        { path: "list", component: "order/list/index", name: "OrderList", meta: { title: "销售订单" } },
        { path: "d-list", component: "order/d-list/index", name: "DouyinOrder", meta: { title: "抖店订单" } },
        { path: "tb-list", component: "order/tb-list/index", name: "TaobaoOrder", meta: { title: "淘宝订单" } },
        { path: "serve-the-dish-list", component: "order/serve-the-dish-list/index", name: "ServeTheDish", meta: { title: "出餐订单" } },
        { path: "record", component: "order/record/index", name: "OrderRecord", meta: { title: "接单记录" } },
        { path: "after-sales-list", component: "order/after-sales-list/index", name: "AfterSales", meta: { title: "售后补贴单" } },
        { path: "invoice-list", component: "order/invoice-list/index", name: "InvoiceList", meta: { title: "开票订单" } },
      ],
    },
    {
      path: "/ops",
      component: "Layout",
      alwaysShow: true,
      meta: { title: "运营管理", icon: "chart" },
      children: [
        { path: "store", component: "ops/store/index", name: "OpsStore", meta: { title: "门店管理" } },
        { path: "sold-out", component: "ops/sold-out/index", name: "SoldOut", meta: { title: "商品售罄" } },
        { path: "auto", component: "ops/auto/index", name: "AutoShip", meta: { title: "自动发货" } },
      ],
    },
    {
      path: "/finance",
      component: "Layout",
      alwaysShow: true,
      meta: { title: "财务管理", icon: "money" },
      children: [
        { path: "transaction-history", component: "finance/transaction-history/index", name: "TransactionHistory", meta: { title: "交易流水" } },
        { path: "settlement-record", component: "finance/settlement-record/index", name: "SettlementRecord", meta: { title: "结算流水" } },
      ],
    },
  ];

  const brands = [
    { brandCode: "LK", brandName: "瑞幸咖啡", name: "瑞幸咖啡", label: "瑞幸咖啡", value: "LK" },
    { brandCode: "KFC", brandName: "肯德基", name: "肯德基", label: "肯德基", value: "KFC" },
    { brandCode: "MCD", brandName: "麦当劳", name: "麦当劳", label: "麦当劳", value: "MCD" },
  ];

  const requirementRows = [
    {
      id: 51001,
      itemOrderNo: "FO202609140001",
      requirementNo: "KP202609140001",
      requirementStatus: 0,
      createTime: "2026-09-14 09:12:00",
      productName: "瑞幸咖啡 29元饮品券",
      brandName: "瑞幸咖啡",
      userPayAmount: 22.8,
      invoiceTitle: "厦门晨星信息科技有限公司",
      invoiceType: 1,
      taxpayerNo: "91350200MA9DEMO001",
    },
    {
      id: 51002,
      itemOrderNo: "FO202609140002",
      requirementNo: "KP202609140002",
      requirementStatus: 0,
      createTime: "2026-09-14 10:28:00",
      productName: "肯德基 50元代金券",
      brandName: "肯德基",
      userPayAmount: 46.9,
      invoiceTitle: "个人",
      invoiceType: 0,
      taxpayerNo: "",
    },
    {
      id: 51003,
      itemOrderNo: "FO202609130006",
      requirementNo: "KP202609130006",
      requirementStatus: 1,
      createTime: "2026-09-13 15:40:00",
      currentDeadlineAt: "2026-09-15 15:40:00",
      productName: "瑞幸咖啡 29元饮品券",
      brandName: "瑞幸咖啡",
      userPayAmount: 22.8,
      invoiceTitle: "上海云朵互动科技有限公司",
      invoiceType: 1,
      taxpayerNo: "91310100MA9DEMO002",
    },
    {
      id: 51004,
      itemOrderNo: "FO202609130007",
      requirementNo: "KP202609130007",
      requirementStatus: 1,
      createTime: "2026-09-13 17:18:00",
      currentDeadlineAt: "2026-09-15 17:18:00",
      productName: "肯德基 50元代金券",
      brandName: "肯德基",
      userPayAmount: 46.9,
      invoiceTitle: "北京蓝鲸企业管理有限公司",
      invoiceType: 1,
      taxpayerNo: "91110105MA9DEMO003",
    },
    {
      id: 51005,
      itemOrderNo: "FO202609120003",
      requirementNo: "KP202609120003",
      requirementStatus: 2,
      createTime: "2026-09-12 11:06:00",
      productName: "瑞幸咖啡 29元饮品券",
      brandName: "瑞幸咖啡",
      userPayAmount: 22.8,
      invoiceTitle: "厦门海岸线文化传媒有限公司",
      invoiceType: 1,
      taxpayerNo: "91350203MA9DEMO004",
    },
    {
      id: 51006,
      itemOrderNo: "FO202609120004",
      requirementNo: "KP202609120004",
      requirementStatus: 2,
      createTime: "2026-09-12 14:35:00",
      productName: "肯德基 50元代金券",
      brandName: "肯德基",
      userPayAmount: 46.9,
      invoiceTitle: "杭州新橙餐饮管理有限公司",
      invoiceType: 1,
      taxpayerNo: "91330106MA9DEMO005",
    },
    {
      id: 51007,
      itemOrderNo: "FO202609110004",
      requirementNo: "KP202609110004",
      requirementStatus: 3,
      createTime: "2026-09-11 16:30:00",
      productName: "瑞幸咖啡 29元饮品券",
      brandName: "瑞幸咖啡",
      userPayAmount: 22.8,
      invoiceTitle: "南京青禾网络科技有限公司",
      invoiceType: 1,
      taxpayerNo: "91320104MA9DEMO006",
      currentRejectReason: "发票抬头与申请信息不一致",
    },
    {
      id: 51008,
      itemOrderNo: "FO202609110005",
      requirementNo: "KP202609110005",
      requirementStatus: 3,
      createTime: "2026-09-11 18:12:00",
      productName: "肯德基 50元代金券",
      brandName: "肯德基",
      userPayAmount: 46.9,
      invoiceTitle: "深圳市南山星河科技有限公司",
      invoiceType: 1,
      taxpayerNo: "91440300MA9DEMO007",
      currentRejectReason: "发票文件模糊，无法识别金额",
    },
  ];

  const subsidyRows = [
    {
      id: 52001,
      subsidyNo: "BT202609140001",
      claimNo: "QD202609140001",
      thirdOrderNo: "HL202609140001",
      itemOrderNo: "FO202609140001",
      requirementCreatedAt: "2026-09-14 09:12:00",
      claimStatus: 0,
      claimStatusName: "待接单",
      orderTime: "2026-09-14 08:58:00",
      invoiceOrderName: "是",
      productName: "瑞幸咖啡 29元饮品券",
      storeCity: "北京",
      brandName: "瑞幸咖啡",
      userPayAmount: 22.8,
      supplierName: "",
      settleAmount: 16.5,
      subsidyAmount: 2.5,
      subsidyStatus: 0,
      subsidyStatusName: "未补贴",
      recognitionStatus: 0,
    },
    {
      id: 52002,
      subsidyNo: "BT202609130006",
      claimNo: "QD202609130006",
      thirdOrderNo: "HL202609130006",
      itemOrderNo: "FO202609130006",
      requirementCreatedAt: "2026-09-13 15:40:00",
      claimStatus: 1,
      claimStatusName: "已接单",
      orderTime: "2026-09-13 15:08:00",
      invoiceOrderName: "是",
      productName: "瑞幸咖啡 29元饮品券",
      storeCity: "上海",
      brandName: "瑞幸咖啡",
      userPayAmount: 22.8,
      supplierName: "厦门惠生活供应链有限公司",
      settleAmount: 16.5,
      subsidyAmount: 2.5,
      subsidyStatus: 1,
      subsidyStatusName: "补贴中",
      recognitionStatus: 0,
    },
    {
      id: 52003,
      subsidyNo: "BT202609120003",
      claimNo: "QD202609120003",
      thirdOrderNo: "HL202609120003",
      itemOrderNo: "FO202609120003",
      requirementCreatedAt: "2026-09-12 11:06:00",
      claimStatus: 1,
      claimStatusName: "已接单",
      orderTime: "2026-09-12 10:50:00",
      invoiceOrderName: "是",
      productName: "瑞幸咖啡 29元饮品券",
      storeCity: "厦门",
      brandName: "瑞幸咖啡",
      userPayAmount: 22.8,
      supplierName: "厦门惠生活供应链有限公司",
      settleAmount: 16.5,
      subsidyAmount: 2.5,
      subsidyStatus: 2,
      subsidyStatusName: "已补贴",
      settledAt: "2026-09-13 21:22:00",
      recognitionStatus: 1,
    },
    {
      id: 52004,
      subsidyNo: "BT202609110004",
      claimNo: "QD202609110004",
      thirdOrderNo: "DY202609110004",
      itemOrderNo: "FO202609110004",
      requirementCreatedAt: "2026-09-11 16:30:00",
      claimStatus: 1,
      claimStatusName: "已接单",
      orderTime: "2026-09-11 16:02:00",
      invoiceOrderName: "是",
      productName: "肯德基 50元代金券",
      storeCity: "厦门",
      brandName: "肯德基",
      userPayAmount: 46.9,
      supplierName: "厦门惠生活供应链有限公司",
      settleAmount: 39.8,
      subsidyAmount: 3,
      subsidyStatus: 3,
      subsidyStatusName: "补贴失败",
      recognitionStatus: 0,
    },
  ];

  const ok = (data) => JSON.stringify({ code: 200, msg: "success", data });
  const page = (records) => ok({
    records,
    rows: records,
    list: records,
    total: records.length,
    current: 1,
    size: 20,
  });
  const text = (value, keyword) => !keyword || String(value || "").includes(String(keyword));
  const parseBody = (value) => {
    if (!value) return {};
    if (typeof value === "object") return value;
    try { return JSON.parse(value); } catch {}
    return Object.fromEntries(new URLSearchParams(value));
  };
  const responseFor = (method, rawUrl, rawBody) => {
    const url = new URL(rawUrl, window.location.href);
    const path = url.pathname;
    const query = Object.fromEntries(url.searchParams.entries());
    const body = { ...query, ...parseBody(rawBody) };

    if (path.endsWith("/oauth/token")) {
      return ok({ accessToken: "soto-local-token", refreshToken: "soto-local-refresh-token", expiresIn: 86400 });
    }
    if (path.endsWith("/oauth/logout")) return ok(true);
    if (path.endsWith("/dine-admin-service/getInfo")) {
      return ok({
        user: {
          userId: 1,
          userName: "admin",
          nickName: "一级供应商运营管理员",
          avatar: "",
          detail: { supplierName: "平台供应链中心", cooperationMode: 0 },
        },
        roles: ["admin"],
        permissions: ["*:*:*"],
      });
    }
    if (path.endsWith("/dine-admin-service/getRouters")) return ok(menu);
    if (path.includes("/brand/brandList") || path.includes("listBrand")) return ok(brands);
    if (path.includes("/dine-invoice-service/admin/invoice/requirement/page")) {
      const rows = requirementRows.filter((item) =>
        text(item.itemOrderNo, body.itemOrderNo)
        && text(item.requirementNo, body.requirementNo)
        && text(item.invoiceTitle, body.invoiceTitle)
        && (body.requirementStatus === undefined || body.requirementStatus === "" || Number(item.requirementStatus) === Number(body.requirementStatus))
      ).map((item) => ({
        ...item,
        invoiceTitleTypeName: item.invoiceType === 0 ? "个人" : "企业",
      }));
      return page(rows);
    }
    if (path.includes("/dine-invoice-service/admin/invoice/requirement/detail")) {
      return ok({ files: [] });
    }
    if (path.includes("/dine-invoice-service/admin/invoice/subsidy/page")) {
      const rows = subsidyRows.filter((item) =>
        text(item.subsidyNo, body.subsidyNo)
        && text(item.thirdOrderNo, body.thirdOrderNo)
        && text(item.itemOrderNo, body.itemOrderNo)
        && text(item.supplierName, body.supplierName)
      );
      return page(rows);
    }
    if (path.includes("/dine-invoice-service/admin/invoice/subsidy/operationTimeline")) return ok([]);
    if (path.includes("/dine-invoice-service/") || path.includes("/dine-admin-service/") || path.includes("/dine-channel-service/") || path.includes("/nezha-") || path.includes("/system/")) {
      return page([]);
    }
    return ok({ success: true, message: "操作成功" });
  };

  try {
    localStorage.setItem("Admin-Token", "soto-local-token");
  } catch (error) {
    console.warn("本地原型登录态写入失败", error);
  }

  const NativeXHR = window.XMLHttpRequest;
  function MockXHR() {
    this._headers = {};
    this.readyState = 0;
    this.status = 0;
    this.statusText = "";
    this.responseText = "";
    this.response = "";
    this.responseURL = "";
    this.timeout = 0;
  }
  MockXHR.prototype.open = function (method, url) {
    this._method = method;
    this._url = url;
    this.readyState = 1;
    this.responseURL = new URL(url, window.location.href).href;
  };
  MockXHR.prototype.setRequestHeader = function (name, value) {
    this._headers[name] = value;
  };
  MockXHR.prototype.getAllResponseHeaders = function () {
    return "content-type: application/json;charset=utf-8\r\n";
  };
  MockXHR.prototype.getResponseHeader = function (name) {
    return String(name).toLowerCase() === "content-type" ? "application/json;charset=utf-8" : null;
  };
  MockXHR.prototype.send = function (body) {
    const finish = () => {
      try {
        const data = responseFor(this._method, this._url, body);
        this.status = 200;
        this.statusText = "OK";
        this.responseText = data;
        this.response = data;
        this.readyState = 4;
        if (typeof this.onreadystatechange === "function") this.onreadystatechange();
        if (typeof this.onload === "function") this.onload();
        if (typeof this.onloadend === "function") this.onloadend();
      } catch (error) {
        this.status = 500;
        this.statusText = "Mock Error";
        this.readyState = 4;
        if (typeof this.onerror === "function") this.onerror(error);
        if (typeof this.onloadend === "function") this.onloadend();
      }
    };
    window.setTimeout(finish, 0);
  };
  MockXHR.prototype.abort = function () {
    this.readyState = 0;
    if (typeof this.onabort === "function") this.onabort();
  };
  MockXHR.prototype.addEventListener = function (name, handler) {
    this[`on${name}`] = handler;
  };
  MockXHR.prototype.removeEventListener = function () {};

  window.XMLHttpRequest = MockXHR;
  window.__prototypeNativeXHR = NativeXHR;
})();
