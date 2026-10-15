(function () {
  try {
    localStorage.setItem("Admin-Token", "supplier-second-local-token");
  } catch (error) {
    console.warn("本地原型登录态写入失败", error);
  }

  const page = (records = []) => ({
    code: 200,
    msg: "success",
    data: { records, rows: records, list: records, total: records.length, current: 1, size: 20 },
  });

  const brands = [
    { brandCode: "LK", brandName: "瑞幸咖啡", label: "瑞幸咖啡", value: "LK" },
    { brandCode: "KFC", brandName: "肯德基", label: "肯德基", value: "KFC" },
    { brandCode: "MCD", brandName: "麦当劳", label: "麦当劳", value: "MCD" },
  ];

  const accounts = [
    { id: 60001, mobile: "13900000001", cityId: "330100", cityName: "杭州", dailyNumLimit: 80, loginStatus: 1, familyAvailable: 18, normalAvailable: 126, couponUpdateTime: "2026-10-12 08:30:00", status: 1, remark: "主力出餐账号" },
    { id: 60002, mobile: "13600006208", cityId: "350200", cityName: "厦门", dailyNumLimit: 50, loginStatus: 1, familyAvailable: 9, normalAvailable: 74, couponUpdateTime: "2026-10-11 19:20:00", status: 1, remark: "肯德基专用账号" },
    { id: 60003, mobile: "13700009912", cityId: "", cityName: "", dailyNumLimit: 0, loginStatus: 0, familyAvailable: 0, normalAvailable: 32, couponUpdateTime: "2026-10-10 15:10:00", status: 0, remark: "待配置限定城市" },
  ];

  const quoteProducts = [
    { goodsCode: "G-LK-001", thirdGoodsCode: "LK-29", name: "瑞幸咖啡 29元饮品券", goodsName: "瑞幸咖啡 29元饮品券", goodsSpec: "中杯/大杯通用", minMarketAmount: "29.00", marketPrice: "29.00", limitPrice: "18.00", goodsSkuRespVos: [{ skuCode: "SKU-LK-001", skuName: "默认规格", marketPrice: "29.00" }] },
    { goodsCode: "G-KFC-001", thirdGoodsCode: "KFC-50", name: "肯德基 50元代金券", goodsName: "肯德基 50元代金券", goodsSpec: "全国通用", minMarketAmount: "50.00", marketPrice: "50.00", limitPrice: "42.00", goodsSkuRespVos: [{ skuCode: "SKU-KFC-001", skuName: "电子券", marketPrice: "50.00" }] },
  ];

  const quotations = [
    { id: 70001, brandCode: "LK", brandCodeStr: "瑞幸咖啡", quotName: "瑞幸饮品日常报价", goodsNameStr: "瑞幸咖啡 29元饮品券", cityName: "杭州、上海、厦门", createTime: "2026-10-12 10:20:00", quotAmount: "16.50", readyFoodType: 0, switchStatus: 1, company: "杭州二级供应商", disabled: false },
    { id: 70002, brandCode: "KFC", brandCodeStr: "肯德基", quotName: "肯德基代金券自动出餐", goodsNameStr: "肯德基 50元代金券", cityName: "杭州、厦门", createTime: "2026-10-11 14:10:00", quotAmount: "39.80", readyFoodType: 1, switchStatus: 1, company: "杭州二级供应商", disabled: false },
  ];

  const bidding = [
    { quotationCode: "BJ202610120001", brandName: "瑞幸咖啡", goodsName: "瑞幸咖啡 29元饮品券", skuName: "默认规格", biddingEndTime: "2026-10-12 23:59:59", storeName: "杭州西湖银泰店", storeAddress: "杭州市西湖区示例路88号", marketAmount: "29.00", limitPrice: "18.00", quotationAmount: "", itemOrderNo: "FO202610120001", readyFoodType: 0, quotationSource: "ORDER" },
    { quotationCode: "BJ202610120002", brandName: "肯德基", goodsName: "肯德基 50元代金券", skuName: "电子券", biddingEndTime: "2026-10-12 23:59:59", storeName: "杭州滨江宝龙店", storeAddress: "杭州市滨江区示例路66号", marketAmount: "50.00", limitPrice: "42.00", quotationAmount: "39.80", quotationRule: "肯德基代金券自动出餐", itemOrderNo: "FO202610120002", readyFoodType: 1, quotationSource: "RULE" },
  ];

  const orders = [
    { id: 80001, outTradeNo: "DD202610120001", acceptTime: "2026-10-12 09:18:00", remainReadyTime: 420, supplierStatus: 15, readyFoodType: 0, productName: "瑞幸咖啡 29元饮品券", specStr: "中杯/大杯通用", thirdPlatUserMobile: "139****0001", buyerPrice: "16.50", settleStatus: 0, brandName: "瑞幸咖啡", city: "杭州", store: "西湖银泰店", company: "杭州二级供应商", marketAmount: "29.00" },
    { id: 80002, outTradeNo: "DD202610120002", acceptTime: "2026-10-12 08:42:00", readyFoodTime: "2026-10-12 08:51:00", settleTime: "2026-10-12 09:02:00", supplierStatus: 20, readyFoodType: 1, productName: "肯德基 50元代金券", specStr: "电子券", thirdPlatUserMobile: "136****6208", buyerPrice: "39.80", settleStatus: 2, brandName: "肯德基", city: "杭州", store: "滨江宝龙店", company: "杭州二级供应商", marketAmount: "50.00" },
  ];

  const bankCards = [
    { id: 1, accountType: 1, bankName: "招商银行", recipientName: "杭州二级供应商", recipientAccount: "6222 **** 0088", status: 1 },
    { id: 2, accountType: 0, bankName: "支付宝", recipientName: "杭州二级供应商", recipientAccount: "alipay****1024", status: 0 },
  ];

  const withdrawRecords = [
    { withdrawNo: "TX202610120006", status: 0, requestTime: "2026-10-12 15:00:00", withdrawAmount: "500.00", serviceFee: "2.00", actualAmount: "498.00", accountType: 1, bankName: "招商银行", recipientName: "杭州二级供应商", recipientAccount: "6222 **** 0088" },
    { withdrawNo: "TX202610080003", status: 1, requestTime: "2026-10-08 11:30:00", completeTime: "2026-10-08 11:32:00", withdrawAmount: "1200.00", serviceFee: "2.00", actualAmount: "1198.00", accountType: 1, bankName: "招商银行", recipientName: "杭州二级供应商", recipientAccount: "6222 **** 0088" },
  ];

  const settleRecords = [
    { settleNo: "JS202610120001", settleTime: "2026-10-12 09:02:00", settleTypeStr: "订单完成结算", balanceType: 1, amount: "39.80", settleBizNo: "FO202610120002", company: "杭州二级供应商" },
    { settleNo: "JS202610110008", settleTime: "2026-10-11 22:10:00", settleTypeStr: "订单完成结算", balanceType: 1, amount: "16.50", settleBizNo: "FO202610110008", company: "杭州二级供应商" },
  ];

  const recordsFor = (path) => {
    if (path.includes("thirdPlatUser/pageUser")) return accounts;
    if (path.includes("supplierQuotation/client/supplier/quotation/page")) return quotations;
    if (path.includes("supplier/order/bidding/record/page")) return bidding.map((row, index) => ({ ...row, id: index + 1, createTime: "2026-10-12 09:30:00", statusStr: "已报价" }));
    if (path.includes("supplier/order/bidding/page")) return bidding;
    if (path.includes("supplier/order/supplier/order/page")) return orders;
    if (path.includes("supplierWithdrawRecord/page")) return withdrawRecords;
    if (path.includes("supplierBankCardInfo/page")) return bankCards;
    if (path.includes("supplierSettleInfo/settleInfo/page")) return settleRecords;
    if (path.includes("export-list")) return [
      { fileName: "订单列表.xlsx", methodStr: "订单导出", status: 1, statusStr: "已完成", operator: "admin", createTime: "2026-10-12 09:22:00", fileUrl: "#" },
      { fileName: "结算记录.xlsx", methodStr: "结算导出", status: 0, statusStr: "处理中", operator: "admin", createTime: "2026-10-12 10:02:00" },
    ];
    return [];
  };

  const responseFor = (url) => {
    const path = String(url || "").split("?")[0];
    if (path.includes("oauth/token")) {
      return { code: 200, msg: "success", data: { accessToken: "supplier-second-local-token", expiresIn: 86400 } };
    }
    if (path.includes("getInfo")) {
      return {
        code: 200,
        msg: "success",
        data: {
          user: { userId: 1, userName: "admin", nickName: "二级供应商管理员", avatar: "", detail: { supplierName: "杭州二级供应商" } },
          roles: ["admin"],
          permissions: ["*:*:*"],
        },
      };
    }
    if (path.includes("getSysConfig")) return { code: 200, msg: "success", data: { supplier_quotation_decimal_places: { value: 2 } } };
    if (path.includes("listBrand") || path.includes("brand")) return { code: 200, msg: "success", data: brands };
    if (path.includes("getGoodsInfoList") || path.includes("goods/goodsPage")) return page(quoteProducts);
    if (path.includes("supplier/config/query")) return { code: 200, msg: "success", data: { supplierReadyConfigVos: [{ readyFoodType: 0, readyFoodTypeStr: "人工", brandCode: "LK" }, { readyFoodType: 1, readyFoodTypeStr: "自动", brandCode: "KFC", supplierApiType: "soto" }] } };
    if (path.includes("supplierUser/detail")) return { code: 200, msg: "success", data: { type: 1, company: "杭州二级供应商", mobile: "13900000001", supplierBrandRela: brands } };
    if (path.includes("getAccount")) return { code: 200, msg: "success", data: { enableAmount: 12680.5, freezeAmount: 500, totalAmount: 13180.5 } };
    if (path.includes("supplierBankCardInfo/getList")) return { code: 200, msg: "success", data: bankCards };
    if (path.includes("getBankList")) return { code: 200, msg: "success", data: [{ bankName: "招商银行" }, { bankName: "中国工商银行" }, { bankName: "支付宝" }] };
    if (path.includes("/detail")) return { code: 200, msg: "success", data: orders[0] };
    if (path.includes("/page") || path.includes("/list") || path.includes("pageUser") || path.includes("export-list")) return page(recordsFor(path));
    return { code: 200, msg: "success", data: {} };
  };

  const shouldMock = (url) => {
    const value = String(url || "");
    return value.includes("/dine-") || value.includes("/nezha-");
  };

  const originalFetch = window.fetch;
  window.fetch = function (input) {
    const url = typeof input === "string" ? input : input && input.url;
    if (shouldMock(url)) {
      return Promise.resolve(new Response(JSON.stringify(responseFor(url)), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }));
    }
    return originalFetch.apply(this, arguments);
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__localPrototypeUrl = url;
    this.__localPrototypeMock = shouldMock(url);
    return originalOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function () {
    if (!this.__localPrototypeMock) return originalSend.apply(this, arguments);
    const xhr = this;
    const body = JSON.stringify(responseFor(xhr.__localPrototypeUrl));
    setTimeout(() => {
      Object.defineProperty(xhr, "status", { value: 200 });
      Object.defineProperty(xhr, "statusText", { value: "OK" });
      Object.defineProperty(xhr, "responseText", { value: body });
      Object.defineProperty(xhr, "response", { value: body });
      Object.defineProperty(xhr, "readyState", { value: 4 });
      if (typeof xhr.onreadystatechange === "function") xhr.onreadystatechange();
      if (typeof xhr.onload === "function") xhr.onload();
      if (typeof xhr.onloadend === "function") xhr.onloadend();
    }, 0);
  };
})();
