(function () {
  try {
    localStorage.setItem("Admin-Token", "supplier-local-token");
  } catch (error) {
    console.warn("本地原型登录态写入失败", error);
  }

  if (window.__supplierPrototypeMockInstalled) return;
  window.__supplierPrototypeMockInstalled = true;

  const NativeXHR = window.XMLHttpRequest;
  const apiHost = "http://127.0.0.1:8773";

  const brands = [
    { brandCode: "LK", brandName: "瑞幸咖啡", label: "瑞幸咖啡", value: "LK" },
    { brandCode: "KFC", brandName: "肯德基", label: "肯德基", value: "KFC" },
    { brandCode: "MCD", brandName: "麦当劳", label: "麦当劳", value: "MCD" },
  ];

  const subsidyRows = [
    { id: 9201, claimNo: "CLM202609140101", subsidyNo: "SUB202609140101", itemOrderNo: "FO202609140101", brandCode: "LK", brandName: "瑞幸咖啡", storeCity: "北京", productName: "生椰拿铁 1 杯", userPayAmount: 18.5, subsidyAmount: 2.6, invoiceTitle: "瑞幸咖啡（中国）有限公司", taxpayerNo: "91110108MA01DEMO01", deadlineAt: "2026-09-15 18:00:00", orderTime: "2026-09-14 09:05:00", createTime: "2026-09-14 09:05:00", latestUploadedAt: "", rejectReason: "", rejectReasonMessage: "", invoiceFileCount: 0, currentUploadBatchNo: null, subsidyStatus: 0, tab: "PROCESSING" },
    { id: 9202, claimNo: "CLM202609140102", subsidyNo: "SUB202609140102", itemOrderNo: "FO202609140102", brandCode: "KFC", brandName: "肯德基", storeCity: "厦门", productName: "肯德基 50元代金券", userPayAmount: 42.9, subsidyAmount: 4.8, invoiceTitle: "厦门肯德基有限公司", taxpayerNo: "91350200MA01DEMO02", deadlineAt: "2026-09-16 12:00:00", orderTime: "2026-09-14 08:35:00", createTime: "2026-09-14 08:35:00", latestUploadedAt: "", rejectReason: "", rejectReasonMessage: "", invoiceFileCount: 0, currentUploadBatchNo: null, subsidyStatus: 0, tab: "PROCESSING" },
    { id: 9207, claimNo: "CLM202609150103", subsidyNo: "SUB202609150103", itemOrderNo: "FO202609150103", brandCode: "LK", brandName: "瑞幸咖啡", storeCity: "上海", productName: "瑞幸咖啡 厚乳拿铁 2 杯", userPayAmount: 35.8, subsidyAmount: 4.2, invoiceTitle: "瑞幸咖啡（中国）有限公司", taxpayerNo: "91110108MA01DEMO01", deadlineAt: "2026-09-16 18:30:00", orderTime: "2026-09-15 09:15:00", createTime: "2026-09-15 09:15:00", latestUploadedAt: "", rejectReason: "", rejectReasonMessage: "", invoiceFileCount: 0, currentUploadBatchNo: null, subsidyStatus: 0, tab: "PROCESSING" },
    { id: 9208, claimNo: "CLM202609150104", subsidyNo: "SUB202609150104", itemOrderNo: "FO202609150104", brandCode: "MCD", brandName: "麦当劳", storeCity: "上海", productName: "麦当劳 早餐双人券", userPayAmount: 29.9, subsidyAmount: 3.5, invoiceTitle: "金拱门（中国）有限公司", taxpayerNo: "91110000MA01DEMO03", deadlineAt: "2026-09-17 10:00:00", orderTime: "2026-09-15 10:20:00", createTime: "2026-09-15 10:20:00", latestUploadedAt: "", rejectReason: "", rejectReasonMessage: "", invoiceFileCount: 0, currentUploadBatchNo: null, subsidyStatus: 0, tab: "PROCESSING" },
    { id: 9209, claimNo: "CLM202609150105", subsidyNo: "SUB202609150105", itemOrderNo: "FO202609150105", brandCode: "KFC", brandName: "肯德基", storeCity: "北京", productName: "肯德基 38元套餐券", userPayAmount: 31.9, subsidyAmount: 3.9, invoiceTitle: "厦门肯德基有限公司", taxpayerNo: "91350200MA01DEMO02", deadlineAt: "2026-09-17 15:20:00", orderTime: "2026-09-15 11:05:00", createTime: "2026-09-15 11:05:00", latestUploadedAt: "", rejectReason: "", rejectReasonMessage: "", invoiceFileCount: 0, currentUploadBatchNo: null, subsidyStatus: 0, tab: "PROCESSING" },
    { id: 9203, claimNo: "CLM202609130201", subsidyNo: "SUB202609130201", itemOrderNo: "FO202609130201", brandCode: "MCD", brandName: "麦当劳", storeCity: "上海", productName: "麦当劳 38元套餐券", userPayAmount: 34.8, subsidyAmount: 4.1, invoiceTitle: "金拱门（中国）有限公司", taxpayerNo: "91110000MA01DEMO03", deadlineAt: "", orderTime: "2026-09-13 17:20:00", createTime: "2026-09-13 17:20:00", latestUploadedAt: "2026-09-14 10:15:00", rejectReason: "金额不一致", rejectReasonMessage: "发票金额与申请开票金额不一致，请重新上传。", invoiceFileCount: 1, currentUploadBatchNo: null, subsidyStatus: 0, tab: "REJECTED" },
    { id: 9204, claimNo: "CLM202609130202", subsidyNo: "SUB202609130202", itemOrderNo: "FO202609130202", brandCode: "LK", brandName: "瑞幸咖啡", storeCity: "厦门", productName: "厚乳拿铁 2 杯", userPayAmount: 36, subsidyAmount: 3.8, invoiceTitle: "瑞幸咖啡（中国）有限公司", taxpayerNo: "91110108MA01DEMO01", deadlineAt: "", orderTime: "2026-09-13 15:42:00", createTime: "2026-09-13 15:42:00", latestUploadedAt: "2026-09-14 09:32:00", rejectReason: "抬头不规范", rejectReasonMessage: "请使用品牌官方开票主体重新上传。", invoiceFileCount: 1, currentUploadBatchNo: "UP202609140204", subsidyStatus: 0, tab: "REJECTED" },
    { id: 9205, claimNo: "CLM202609120301", subsidyNo: "SUB202609120301", itemOrderNo: "FO202609120301", brandCode: "KFC", brandName: "肯德基", storeCity: "北京", productName: "肯德基早餐套餐", userPayAmount: 25.9, subsidyAmount: 2.9, invoiceTitle: "厦门肯德基有限公司", taxpayerNo: "91350200MA01DEMO02", deadlineAt: "", orderTime: "2026-09-12 09:12:00", createTime: "2026-09-12 09:12:00", latestUploadedAt: "2026-09-12 11:08:00", rejectReason: "", rejectReasonMessage: "", invoiceFileCount: 1, currentUploadBatchNo: null, subsidyStatus: 2, tab: "UPLOADED" },
    { id: 9206, claimNo: "CLM202609120302", subsidyNo: "SUB202609120302", itemOrderNo: "FO202609120302", brandCode: "MCD", brandName: "麦当劳", storeCity: "上海", productName: "麦当劳 双人套餐", userPayAmount: 49.9, subsidyAmount: 5.2, invoiceTitle: "金拱门（中国）有限公司", taxpayerNo: "91110000MA01DEMO03", deadlineAt: "", orderTime: "2026-09-12 12:26:00", createTime: "2026-09-12 12:26:00", latestUploadedAt: "2026-09-12 13:40:00", rejectReason: "", rejectReasonMessage: "", invoiceFileCount: 2, currentUploadBatchNo: null, subsidyStatus: 1, tab: "UPLOADED" },
  ];

  const compensationRows = [
    { id: 9101, claimNo: "CLM202609140001", subsidyNo: "SUB202609140001", brandCode: "LK", brandName: "瑞幸咖啡", storeCity: "北京", requirementCreatedAt: "2026-09-14 09:18:00", createTime: "2026-09-14 09:18:00", productName: "瑞幸咖啡 29元饮品券", userPayAmount: 22.8, subsidyAmount: 3.2 },
    { id: 9102, claimNo: "CLM202609140002", subsidyNo: "SUB202609140002", brandCode: "KFC", brandName: "肯德基", storeCity: "厦门", requirementCreatedAt: "2026-09-14 08:42:00", createTime: "2026-09-14 08:42:00", productName: "肯德基 50元代金券", userPayAmount: 46.9, subsidyAmount: 5.6 },
    { id: 9103, claimNo: "CLM202609140003", subsidyNo: "SUB202609140003", brandCode: "MCD", brandName: "麦当劳", storeCity: "上海", requirementCreatedAt: "2026-09-14 07:55:00", createTime: "2026-09-14 07:55:00", productName: "麦当劳 38元套餐券", userPayAmount: 34.8, subsidyAmount: 4.2 },
    { id: 9104, claimNo: "CLM202609140004", subsidyNo: "SUB202609140004", brandCode: "LK", brandName: "瑞幸咖啡", storeCity: "厦门", requirementCreatedAt: "2026-09-13 16:20:00", createTime: "2026-09-13 16:20:00", productName: "瑞幸咖啡 38元套餐券", userPayAmount: 26.6, subsidyAmount: 2.8 },
  ];

  function ok(data) {
    return { code: 200, msg: "success", data };
  }

  function page(records) {
    return ok({ records, rows: records, list: records, total: records.length, current: 1, size: 20 });
  }

  function parseBody(body) {
    if (!body || typeof body !== "string") return {};
    try {
      return JSON.parse(body);
    } catch (error) {
      return {};
    }
  }

  function withInvoiceMeta(item) {
    const invoiceTitle = item.invoiceTitle || "--";
    const isPersonal = invoiceTitle === "个人";
    return {
      ...item,
      invoiceTitle,
      userName: invoiceTitle,
      invoiceType: isPersonal ? 0 : 1,
      invoiceTitleType: isPersonal ? 0 : 1,
      invoiceTitleTypeName: isPersonal ? "个人" : "企业",
      titleType: isPersonal ? "个人" : "企业",
    };
  }

  function filterRows(records, query) {
    return records.filter((item) => {
      if (query.brandCode && item.brandCode !== query.brandCode) return false;
      if (query.subsidyNo && !String(item.subsidyNo || "").includes(String(query.subsidyNo))) return false;
      if (query.itemOrderNo && !String(item.itemOrderNo || "").includes(String(query.itemOrderNo))) return false;
      if (query.invoiceTitle && !String(item.invoiceTitle || "").includes(String(query.invoiceTitle))) return false;
      if (query.tab && item.tab !== query.tab) return false;
      return true;
    }).map(withInvoiceMeta);
  }

  function apiResponse(url, body) {
    const parsed = new URL(url, window.location.href);
    const pathname = parsed.pathname;
    const query = parseBody(body);

    if (pathname.includes("/oauth/token")) {
      return ok({ accessToken: "supplier-local-token", refreshToken: "supplier-local-refresh-token", expiresIn: 86400 });
    }
    if (pathname.includes("/oauth/logout")) return ok(true);
    if (pathname.includes("/getInfo")) {
      return ok({
        user: { userId: 1, userName: "supplier_admin", nickName: "供应商管理员", avatar: "", detail: { supplierName: "惠生活演示供应商", cooperationMode: 0 } },
        roles: ["admin"],
        permissions: ["*:*:*"],
      });
    }
    if (pathname.includes("/getRouters")) return ok([]);
    if (pathname.includes("/cooperationMode")) return ok({ cooperationMode: 0, domain: "github.pages" });
    if (pathname.includes("/bizConfig/getSysConfig")) return ok({ supplierName: "惠生活演示供应商", domain: "github.pages", customerServicePhone: "400-000-0000" });
    if (pathname.includes("/supplier/invoice/lobby/brands") || pathname.includes("listBrand")) return ok(brands);
    if (pathname.includes("/supplier/invoice/lobby/page")) return page(filterRows(compensationRows, query));
    if (pathname.includes("/supplier/invoice/subsidy/page")) return page(filterRows(subsidyRows, query));
    if (pathname.includes("/supplier/invoice/subsidy/detail")) return ok(withInvoiceMeta(subsidyRows.find((item) => item.claimNo === query.claimNo) || subsidyRows[0]));
    if (pathname.includes("/supplier/invoice/subsidy/download")) {
      return ok([{ fileName: "发票示例-" + (query.claimNo || "DEMO") + ".pdf", fileUrl: "#", uploadedAt: "2026-09-14 10:15:00" }]);
    }
    if (pathname.includes("/supplier/invoice/subsidy/")) return ok({ success: true, message: "操作成功" });
    return page([]);
  }

  function shouldMock(url) {
    const parsed = new URL(url, window.location.href);
    return parsed.href.indexOf(apiHost) === 0 || /^\/(dine-|nezha-|system\/)/.test(parsed.pathname);
  }

  function MockXHR() {
    this.readyState = 0;
    this.status = 0;
    this.statusText = "";
    this.responseText = "";
    this.response = null;
    this.responseURL = "";
    this.responseType = "";
    this.timeout = 0;
    this.withCredentials = false;
    this.upload = { addEventListener: function () {}, removeEventListener: function () {} };
    this._listeners = {};
    this._headers = {};
  }

  MockXHR.prototype.open = function (method, url, async, user, password) {
    this._method = method;
    this._url = url;
    this._isMock = shouldMock(url);
    if (!this._isMock) {
      this._native = new NativeXHR();
      wireNative(this);
      return this._native.open(method, url, async !== false, user, password);
    }
    this.readyState = 1;
  };

  MockXHR.prototype.setRequestHeader = function (name, value) {
    if (this._native) return this._native.setRequestHeader(name, value);
    this._headers[name] = value;
  };

  MockXHR.prototype.getAllResponseHeaders = function () {
    if (this._native) return this._native.getAllResponseHeaders();
    return "content-type: application/json; charset=utf-8\r\n";
  };

  MockXHR.prototype.addEventListener = function (type, listener) {
    if (this._native) return this._native.addEventListener(type, listener);
    (this._listeners[type] = this._listeners[type] || []).push(listener);
  };

  MockXHR.prototype.removeEventListener = function (type, listener) {
    if (this._native) return this._native.removeEventListener(type, listener);
    const listeners = this._listeners[type] || [];
    const index = listeners.indexOf(listener);
    if (index >= 0) listeners.splice(index, 1);
  };

  MockXHR.prototype.dispatchEvent = function (event) {
    const type = typeof event === "string" ? event : event.type;
    (this._listeners[type] || []).forEach((listener) => listener.call(this, event));
    const handler = this["on" + type];
    if (typeof handler === "function") handler.call(this, event);
  };

  MockXHR.prototype.send = function (body) {
    if (this._native) return this._native.send(body);
    window.setTimeout(() => {
      const data = apiResponse(this._url, body);
      this.readyState = 4;
      this.status = 200;
      this.statusText = "OK";
      this.responseURL = this._url;
      this.responseText = JSON.stringify(data);
      this.response = this.responseType === "json" ? data : this.responseText;
      this.dispatchEvent({ type: "readystatechange" });
      this.dispatchEvent({ type: "load" });
      this.dispatchEvent({ type: "loadend" });
    }, 0);
  };

  MockXHR.prototype.abort = function () {
    if (this._native) return this._native.abort();
    this.dispatchEvent({ type: "abort" });
  };

  function wireNative(xhr) {
    const native = xhr._native;
    ["onreadystatechange", "onload", "onloadend", "onerror", "onabort", "ontimeout"].forEach((eventName) => {
      native[eventName] = function (event) {
        xhr.readyState = native.readyState;
        xhr.status = native.status;
        xhr.statusText = native.statusText;
        xhr.responseText = native.responseText;
        xhr.response = native.response;
        xhr.responseURL = native.responseURL;
        if (typeof xhr[eventName] === "function") xhr[eventName](event);
      };
    });
  }

  window.XMLHttpRequest = MockXHR;
})();
