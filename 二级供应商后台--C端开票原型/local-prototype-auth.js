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
    if (path.includes("/page") || path.includes("/list") || path.includes("pageUser") || path.includes("export-list")) return page([]);
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
    if (!this.__localPrototypeMock) return originalOpen.apply(this, arguments);
    this.readyState = 1;
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
