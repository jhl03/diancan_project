(function () {
  if (window.__supplierPrototypeOnlineMockInstalled) return;
  window.__supplierPrototypeOnlineMockInstalled = true;

  const brands = [
    { brandCode: "LK", brandName: "瑞幸咖啡", label: "瑞幸咖啡", value: "LK" },
    { brandCode: "KFC", brandName: "肯德基", label: "肯德基", value: "KFC" },
    { brandCode: "MCD", brandName: "麦当劳", label: "麦当劳", value: "MCD" },
  ];
  const suppliers = {
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
  const subsidyRows = [
    { id: 9201, claimNo: "CLM202609140101", subsidyNo: "SUB202609140101", itemOrderNo: "FO202609140101", brandCode: "LK", brandName: "瑞幸咖啡", storeCity: "北京", productName: "生椰拿铁 1 杯", userPayAmount: 18.5, subsidyAmount: 2.6, invoiceTitle: "瑞幸咖啡（中国）有限公司", tab: "PROCESSING" },
    { id: 9202, claimNo: "CLM202609140102", subsidyNo: "SUB202609140102", itemOrderNo: "FO202609140102", brandCode: "KFC", brandName: "肯德基", storeCity: "厦门", productName: "肯德基 50元代金券", userPayAmount: 42.9, subsidyAmount: 4.8, invoiceTitle: "厦门肯德基有限公司", tab: "PROCESSING" },
    { id: 9207, claimNo: "CLM202609150103", subsidyNo: "SUB202609150103", itemOrderNo: "FO202609150103", brandCode: "LK", brandName: "瑞幸咖啡", storeCity: "上海", productName: "瑞幸咖啡 厚乳拿铁 2 杯", userPayAmount: 35.8, subsidyAmount: 4.2, invoiceTitle: "瑞幸咖啡（中国）有限公司", tab: "PROCESSING" },
    { id: 9203, claimNo: "CLM202609130201", subsidyNo: "SUB202609130201", itemOrderNo: "FO202609130201", brandCode: "MCD", brandName: "麦当劳", storeCity: "上海", productName: "麦当劳 38元套餐券", userPayAmount: 34.8, subsidyAmount: 4.1, invoiceTitle: "金拱门（中国）有限公司", tab: "REJECTED" },
    { id: 9204, claimNo: "CLM202609130202", subsidyNo: "SUB202609130202", itemOrderNo: "FO202609130202", brandCode: "LK", brandName: "瑞幸咖啡", storeCity: "厦门", productName: "厚乳拿铁 2 杯", userPayAmount: 36, subsidyAmount: 3.8, invoiceTitle: "瑞幸咖啡（中国）有限公司", tab: "REJECTED" },
    { id: 9205, claimNo: "CLM202609120301", subsidyNo: "SUB202609120301", itemOrderNo: "FO202609120301", brandCode: "KFC", brandName: "肯德基", storeCity: "北京", productName: "肯德基早餐套餐", userPayAmount: 25.9, subsidyAmount: 2.9, invoiceTitle: "厦门肯德基有限公司", tab: "UPLOADED" },
    { id: 9206, claimNo: "CLM202609120302", subsidyNo: "SUB202609120302", itemOrderNo: "FO202609120302", brandCode: "MCD", brandName: "麦当劳", storeCity: "上海", productName: "麦当劳 双人套餐", userPayAmount: 49.9, subsidyAmount: 5.2, invoiceTitle: "金拱门（中国）有限公司", tab: "UPLOADED" },
  ];
  const secondSuppliers = [
    { id: 2001, supplierNo: "SUP202609080001", company: "厦门惠生活供应链有限公司", supplierName: "厦门惠生活供应链有限公司", supplierBrandRelaStr: "瑞幸咖啡、肯德基", mobile: "139****6208", status: 1, createTime: "2026-09-08 10:20:00", updateTime: "2026-09-11 09:30:00" },
    { id: 2002, supplierNo: "SUP202609070002", company: "北京优选数字科技有限公司", supplierName: "北京优选数字科技有限公司", supplierBrandRelaStr: "瑞幸咖啡", mobile: "136****5118", status: 1, createTime: "2026-09-07 15:40:00", updateTime: "2026-09-10 14:18:00" },
    { id: 2003, supplierNo: "SUP202609050003", company: "上海快取服务中心", supplierName: "上海快取服务中心", supplierBrandRelaStr: "麦当劳", mobile: "137****7821", status: 0, createTime: "2026-09-05 11:15:00", updateTime: "2026-09-09 16:05:00" },
  ];
  const secondSettlement = [
    { id: 2901, settleFlowNo: "JS2-202609110001", tradeTime: "2026-09-11 03:00:00", tradeType: "订单结算", changeAmount: "16.50", relationBillNo: "DD202609110001", supplierName: "厦门惠生活供应链有限公司" },
    { id: 2902, settleFlowNo: "JS2-202609100002", tradeTime: "2026-09-10 03:00:00", tradeType: "订单结算", changeAmount: "42.90", relationBillNo: "DD202609100002", supplierName: "北京优选数字科技有限公司" },
    { id: 2903, settleFlowNo: "JS2-202609140003", tradeTime: "2026-09-14 10:05:29", tradeType: "售后补贴单", changeAmount: "2.10", relationBillNo: "SUB202609140101", supplierName: "厦门惠生活供应链有限公司", actualSubsidyAmount: "2.60", firstSupplierSubsidyCommission: "0.50" },
    { id: 2904, settleFlowNo: "JS2-202609140004", tradeTime: "2026-09-14 10:02:17", tradeType: "售后补贴单", changeAmount: "4.10", relationBillNo: "SUB202609140102", supplierName: "北京优选数字科技有限公司", actualSubsidyAmount: "4.80", firstSupplierSubsidyCommission: "0.70" },
  ];
  const orders = [
    { id: 900001, thirdOrderNo: "SF202609110001", outTradeNo: "DD202609110001", acceptTime: "2026-09-11 09:42:00", remainReadyTime: 1800, supplierStatus: 0, readyFoodType: 0, productName: "瑞幸咖啡 29元饮品券", thirdPlatDomain: "惠生活", thirdPlatUserMobile: "139****0001", voucherCode: "LK20260911", buyerPrice: 18.8, marketAmount: "29.00", settleStatus: 0, city: "北京", store: "国贸店", brandName: "瑞幸咖啡", company: "惠生活本地演示供应商" },
    { id: 900002, thirdOrderNo: "SF202609110002", outTradeNo: "DD202609110002", acceptTime: "2026-09-11 10:05:00", remainReadyTime: 2400, supplierStatus: 15, readyFoodType: 2, productName: "肯德基 50元代金券", thirdPlatDomain: "惠生活", thirdPlatUserMobile: "136****6208", voucherCode: "KFC20260911", buyerPrice: 42.9, marketAmount: "50.00", settleStatus: 0, city: "厦门", store: "湖滨店", brandName: "肯德基", company: "惠生活本地演示供应商" },
  ];

  const ok = (data) => ({ code: 200, msg: "success", data });
  const page = (records) => ok({ records, rows: records, list: records, total: records.length, current: 1, size: 20 });
  const success = () => ok({ success: true, message: "操作成功" });
  const bodyOf = (body) => {
    if (!body || typeof body !== "string") return body || {};
    try { return JSON.parse(body); } catch { return {}; }
  };
  const pathOf = (input) => {
    try {
      const url = new URL(typeof input === "string" ? input : input.url, location.href);
      return decodeURIComponent(url.pathname);
    } catch { return ""; }
  };
  const invoiceRows = (query) => subsidyRows
    .filter((item) => (!query.tab || item.tab === query.tab)
      && (!query.brandCode || item.brandCode === query.brandCode)
      && (!query.subsidyNo || item.subsidyNo.includes(query.subsidyNo))
      && (!query.itemOrderNo || item.itemOrderNo.includes(query.itemOrderNo))
      && (!query.invoiceTitle || item.invoiceTitle.includes(query.invoiceTitle))
      && (!query.supplierName || (suppliers[item.subsidyNo] || "").includes(query.supplierName)))
    .map((item) => ({ ...item, supplierName: suppliers[item.subsidyNo] || "待补充供应商", invoiceType: 1, invoiceTitleTypeName: "企业", userName: item.invoiceTitle }));

  function responseFor(path, rawBody) {
    const body = bodyOf(rawBody);
    if (path.includes("/oauth/token")) return ok({ accessToken: "supplier-local-token", refreshToken: "supplier-local-refresh-token", expiresIn: 86400 });
    if (path.includes("/oauth/logout")) return ok(true);
    if (path.includes("/dine-admin-service/getInfo")) return ok({ user: { userId: 1, userName: "supplier_admin", nickName: "供应商管理员", avatar: "", detail: { supplierName: "惠生活一级供应商平台", cooperationMode: 1 } }, roles: ["admin"], permissions: ["*:*:*"] });
    if (path.includes("/supplierUser/cooperationMode")) return ok({ cooperationMode: 1, domain: "github.pages.prototype" });
    if (path.includes("/bizConfig/getSysConfig")) return ok({ supplierName: "惠生活本地演示供应商", domain: "github.pages.prototype", customerServicePhone: "400-000-0000" });
    if (path.includes("/supplier/invoice/lobby/brands")) return ok(brands);
    if (path.includes("/supplier/invoice/lobby/page")) return page([]);
    if (path.includes("/supplier/invoice/subsidy/page")) return page(invoiceRows(body));
    if (path.includes("/supplier/invoice/subsidy/detail")) return ok(invoiceRows({})[0] || {});
    if (path.includes("/supplier/invoice/subsidy/")) return success();
    if (path.includes("/supplier/order/supplier/order/detail")) return ok(orders[0]);
    if (path.includes("/supplier/order/supplier/order/page")) return page(orders);
    if (path.includes("/supplier/order/supplier/order/")) return success();
    if (path.includes("/supplierQuotation/client/supplier/quotation/page")) return page([{ id: 1001, brandCodeStr: "瑞幸咖啡", quotName: "瑞幸咖啡饮品券报价", goodsNameStr: "瑞幸咖啡 29元饮品券", cityName: "北京、上海、厦门", quotAmount: "16.50", switchStatus: 1 }]);
    if (path.includes("/supplierQuotation/client/supplier/quotation/")) return success();
    if (path.includes("/supplierUser/second/count")) return ok({ wait: 1, doing: 2, stop: 1, total: secondSuppliers.length });
    if (path.includes("/supplierUser/second/page")) return page(secondSuppliers);
    if (path.includes("/supplierUser/second/detail")) return ok(secondSuppliers[0]);
    if (path.includes("/supplierUser/second/")) return success();
    if (path.includes("/supplierSettleInfo/second/settleInfo/page")) return page(secondSettlement);
    if (path.includes("/supplierSettleInfo/second/settleInfo/")) return success();
    if (path.includes("/supplierSettleInfo/settleInfo/page") || path.includes("/supplierFinanceTradeRecord/finance/tradeRecord/page")) return page([{ id: 7001, settleNo: "JS202609110001", outTradeNo: "DD202609110001", productName: "瑞幸咖啡 29元饮品券", settleAmount: "16.50", settleStatus: 1, createTime: "2026-09-11 03:00:00" }]);
    if (path.includes("/supplierMarkupConfig/query")) return ok({ defaultMarkupRatio: 0.02, markupRatio: 0.02 });
    if (path.includes("/supplierMarkupConfig/save/config")) return success();
    if (path.includes("/supplierSubsidyConfig/query")) return ok({ subsidyCommissionAmount: 0.5 });
    if (path.includes("/supplierSubsidyConfig/save/config")) return success();
    if (path.includes("/supplier/config/list")) return ok([{ id: 3101, company: "厦门惠生活供应链有限公司", supplierName: "厦门惠生活供应链有限公司", brandName: "瑞幸咖啡", timeoutMinutes: 30, supplierApiType: "SOTO自动出餐", apiAction: "接单、出餐、核销" }]);
    if (path.includes("/supplier/config/")) return success();
    if (path.includes("/supplierUser/listBrand") || path.includes("listBrand")) return ok(brands);
    if (path.includes("/supplierBankCardInfo/page")) return page([{ id: 701, bankCardNum: "622588******6208", bankName: "招商银行", receiverName: "厦门惠生活供应商", status: 1 }]);
    if (path.includes("/supplierWithdrawRecord/second/page")) return page([{ id: 2801, withdrawNo: "TX2-202609110001", status: 1, withdrawAmount: "1200.00", serviceFee: "2.00", actualAmount: "1198.00", bankName: "招商银行厦门分行", recipientName: "厦门惠生活供应链有限公司" }]);
    if (path.includes("/supplierWithdrawRecord/page")) return page([{ id: 801, withdrawNo: "TX202609110001", amount: "500.00", fee: "0.00", bankCardNum: "招商银行 尾号6208", status: 0, createTime: "2026-09-11 09:30:00" }]);
    if (path.includes("/supplierWithdrawRecord/")) return success();
    if (path.includes("getBankList")) return ok([{ bankName: "招商银行", shortName: "CMB" }, { bankName: "中国工商银行", shortName: "ICBC" }]);
    if (path.includes("export")) return ok([]);
    return page([]);
  }

  const isApi = (path) => /\/(nezha-|dine-|supplier|thirdPlatUser|link|supplierCoupon|getBankList)/.test(path);

  function installFetch() {
    if (!window.fetch) return;
    const nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      const path = pathOf(input);
      if (!isApi(path)) return nativeFetch(input, init);
      return Promise.resolve(new Response(JSON.stringify(responseFor(path, init && init.body)), { status: 200, headers: { "Content-Type": "application/json" } }));
    };
  }

  function installXhr() {
    const NativeXHR = window.XMLHttpRequest;
    function MockXHR() {
      this._native = null;
      this._listeners = {};
      this.readyState = 0;
      this.status = 0;
      this.statusText = "";
      this.responseText = "";
      this.response = "";
      this.responseType = "";
      this.upload = { addEventListener: function () {} };
    }
    MockXHR.prototype.addEventListener = function (type, handler) { (this._listeners[type] || (this._listeners[type] = [])).push(handler); };
    MockXHR.prototype._emit = function (type) {
      (this._listeners[type] || []).forEach((handler) => handler.call(this, { type, target: this }));
      if (typeof this["on" + type] === "function") this["on" + type].call(this, { type, target: this });
    };
    MockXHR.prototype.open = function (method, url, async) {
      this._method = method;
      this._path = pathOf(url);
      if (!isApi(this._path)) {
        this._native = new NativeXHR();
        this._native.open(method, url, async !== false);
      }
      this.readyState = 1;
      this._emit("readystatechange");
    };
    MockXHR.prototype.setRequestHeader = function (name, value) {
      if (this._native) this._native.setRequestHeader(name, value);
    };
    MockXHR.prototype.getResponseHeader = function (name) {
      if (this._native) return this._native.getResponseHeader(name);
      return name.toLowerCase() === "content-type" ? "application/json" : null;
    };
    MockXHR.prototype.getAllResponseHeaders = function () {
      return this._native ? this._native.getAllResponseHeaders() : "content-type: application/json\r\n";
    };
    MockXHR.prototype.send = function (body) {
      if (this._native) {
        ["readystatechange", "load", "error", "abort", "loadend"].forEach((eventName) => {
          this._native.addEventListener(eventName, () => {
            this.readyState = this._native.readyState;
            this.status = this._native.status;
            this.statusText = this._native.statusText;
            this.responseText = this._native.responseText;
            this.response = this._native.response;
            this._emit(eventName);
          });
        });
        return this._native.send(body);
      }
      setTimeout(() => {
        const data = responseFor(this._path, body);
        this.readyState = 4;
        this.status = 200;
        this.statusText = "OK";
        this.responseText = JSON.stringify(data);
        this.response = this.responseType === "json" ? data : this.responseText;
        this._emit("readystatechange");
        this._emit("load");
        this._emit("loadend");
      }, 20);
    };
    MockXHR.prototype.abort = function () { if (this._native) this._native.abort(); else this._emit("abort"); };
    window.XMLHttpRequest = MockXHR;
  }

  installFetch();
  installXhr();
})();
