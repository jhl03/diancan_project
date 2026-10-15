const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 8775;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function sendJson(res, data) {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  });
  res.end(JSON.stringify(data));
}

function ok(data) {
  return { code: 200, msg: "success", data };
}

function page(records) {
  return ok({ records, rows: records, list: records, total: records.length, current: 1, size: 20 });
}

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
  { id: 70003, brandCode: "MCD", brandCodeStr: "麦当劳", quotName: "麦当劳套餐暂停售卖", goodsNameStr: "麦当劳 38元套餐券", cityName: "上海", createTime: "2026-10-10 09:45:00", quotAmount: "26.60", readyFoodType: 2, switchStatus: 0, company: "杭州二级供应商", disabled: false },
];

const bidding = [
  { quotationCode: "BJ202610120001", brandName: "瑞幸咖啡", goodsName: "瑞幸咖啡 29元饮品券", skuName: "默认规格", biddingEndTime: "2026-10-12 23:59:59", storeName: "杭州西湖银泰店", storeAddress: "杭州市西湖区示例路88号", marketAmount: "29.00", limitPrice: "18.00", quotationAmount: "", itemOrderNo: "FO202610120001", readyFoodType: 0, quotationSource: "ORDER" },
  { quotationCode: "BJ202610120002", brandName: "肯德基", goodsName: "肯德基 50元代金券", skuName: "电子券", biddingEndTime: "2026-10-12 23:59:59", storeName: "杭州滨江宝龙店", storeAddress: "杭州市滨江区示例路66号", marketAmount: "50.00", limitPrice: "42.00", quotationAmount: "39.80", quotationRule: "肯德基代金券自动出餐", itemOrderNo: "FO202610120002", readyFoodType: 1, quotationSource: "RULE" },
];

const orders = [
  { id: 80001, outTradeNo: "DD202610120001", acceptTime: "2026-10-12 09:18:00", remainReadyTime: 420, readyFoodTime: "", settleTime: "", supplierStatus: 15, readyFoodType: 0, productName: "瑞幸咖啡 29元饮品券", specStr: "中杯/大杯通用", thirdPlatUserMobile: "139****0001", buyerPrice: "16.50", settleStatus: 0, brandName: "瑞幸咖啡", city: "杭州", store: "西湖银泰店", storeAddress: "示例路88号", company: "杭州二级供应商", marketAmount: "29.00", foodCode: "A-018", qrCode: "demo", qrCodeList: [], orderRemark: "少冰" },
  { id: 80002, outTradeNo: "DD202610120002", acceptTime: "2026-10-12 08:42:00", remainReadyTime: 0, readyFoodTime: "2026-10-12 08:51:00", settleTime: "2026-10-12 09:02:00", supplierStatus: 20, readyFoodType: 1, productName: "肯德基 50元代金券", specStr: "电子券", thirdPlatUserMobile: "136****6208", buyerPrice: "39.80", settleStatus: 2, brandName: "肯德基", city: "杭州", store: "滨江宝龙店", storeAddress: "示例路66号", company: "杭州二级供应商", marketAmount: "50.00", foodCode: "B-206", qrCode: "", qrCodeList: [] },
];

const bankCards = [
  { id: 1, accountType: 1, bankName: "招商银行", accountName: "杭州二级供应商", recipientName: "杭州二级供应商", bankCardNum: "6222 **** 0088", recipientAccount: "6222 **** 0088", receiverBankChannelNo: "308584000013", status: 1 },
  { id: 2, accountType: 0, bankName: "支付宝", accountName: "杭州二级供应商", recipientName: "杭州二级供应商", bankCardNum: "alipay****1024", recipientAccount: "alipay****1024", receiverBankChannelNo: "", status: 0 },
];

const withdrawRecords = [
  { withdrawNo: "TX202610120006", status: 0, failRemark: "", requestTime: "2026-10-12 15:00:00", completeTime: "", withdrawAmount: "500.00", serviceFee: "2.00", actualAmount: "498.00", accountType: 1, bankName: "招商银行", recipientName: "杭州二级供应商", recipientAccount: "6222 **** 0088" },
  { withdrawNo: "TX202610080003", status: 1, failRemark: "", requestTime: "2026-10-08 11:30:00", completeTime: "2026-10-08 11:32:00", withdrawAmount: "1200.00", serviceFee: "2.00", actualAmount: "1198.00", accountType: 1, bankName: "招商银行", recipientName: "杭州二级供应商", recipientAccount: "6222 **** 0088" },
];

const settleRecords = [
  { settleNo: "JS202610120001", settleTime: "2026-10-12 09:02:00", settleTypeStr: "订单完成结算", balanceType: 1, amount: "39.80", settleBizNo: "FO202610120002", company: "杭州二级供应商" },
  { settleNo: "JS202610110008", settleTime: "2026-10-11 22:10:00", settleTypeStr: "订单完成结算", balanceType: 1, amount: "16.50", settleBizNo: "FO202610110008", company: "杭州二级供应商" },
];

function recordsFor(pathname) {
  if (pathname.includes("thirdPlatUser/pageUser")) return accounts;
  if (pathname.includes("supplierQuotation/client/supplier/quotation/page")) return quotations;
  if (pathname.includes("supplier/order/bidding/record/page")) return bidding.map((row, index) => ({ ...row, id: index + 1, createTime: "2026-10-12 09:30:00", statusStr: "已报价" }));
  if (pathname.includes("supplier/order/bidding/page")) return bidding;
  if (pathname.includes("supplier/order/supplier/order/page")) return orders;
  if (pathname.includes("supplierWithdrawRecord/page")) return withdrawRecords;
  if (pathname.includes("supplierBankCardInfo/page")) return bankCards;
  if (pathname.includes("supplierSettleInfo/settleInfo/page")) return settleRecords;
  if (pathname.includes("export-list")) return [
    { fileName: "订单列表.xlsx", methodStr: "订单导出", status: 1, statusStr: "已完成", extraMsg: "", operator: "admin", createTime: "2026-10-12 09:22:00", fileUrl: "#" },
    { fileName: "结算记录.xlsx", methodStr: "结算导出", status: 0, statusStr: "处理中", extraMsg: "", operator: "admin", createTime: "2026-10-12 10:02:00" },
  ];
  return [{ id: 1, name: "演示记录", createTime: "2026-10-12 10:00:00" }];
}

function handleApi(req, res, pathname) {
  if (pathname === "/nezha-base-grant/oauth/token") return sendJson(res, ok({ accessToken: "supplier-second-local-token", refreshToken: "supplier-second-local-refresh", expiresIn: 86400 }));
  if (pathname === "/nezha-base-grant/oauth/logout") return sendJson(res, ok(true));
  if (pathname === "/dine-admin-service/getInfo") {
    return sendJson(res, ok({
      user: { userId: 1, userName: "admin", nickName: "二级供应商管理员", avatar: "", detail: { supplierName: "杭州二级供应商" } },
      roles: ["admin"],
      permissions: ["*:*:*"],
    }));
  }
  if (pathname.includes("getSysConfig")) return sendJson(res, ok({ supplier_quotation_decimal_places: { value: 2 } }));
  if (pathname.includes("listBrandBySupplier") || pathname.includes("listBrand")) return sendJson(res, ok(brands));
  if (pathname.includes("platform-agent/list")) return sendJson(res, ok([{ tenantId: "demo", supplierName: "杭州一级供应商", company: "杭州一级供应商", label: "杭州一级供应商", value: "demo" }]));
  if (pathname.includes("supplier/config/query")) return sendJson(res, ok({ supplierReadyConfigVos: [{ readyFoodType: 0, readyFoodTypeStr: "人工", autoQuotation: 0, brandCode: "LK" }, { readyFoodType: 1, readyFoodTypeStr: "自动", autoQuotation: 0, brandCode: "KFC", supplierApiType: "soto" }] }));
  if (pathname.includes("hasEnableCoupon")) return sendJson(res, ok(true));
  if (pathname.includes("goods/goodsPage") || pathname.includes("getGoodsInfoList")) return sendJson(res, page(quoteProducts));
  if (pathname.includes("supplierQuotation/client/supplier/quotation/detail")) return sendJson(res, ok({ quotationVo: { comboNum: "", isCombo: 0, quoteAmount: "16.50", cityList: [{ gbCityCode: "330100", cityName: "杭州" }] }, goodsVoList: quoteProducts.slice(0, 1), itemVoList: quoteProducts[0].goodsSkuRespVos.map((sku) => ({ ...sku, goodsCode: "G-LK-001" })) }));
  if (pathname.includes("queryCity")) return sendJson(res, ok([{ gbCityCode: "330100", cityName: "杭州" }, { gbCityCode: "310100", cityName: "上海" }, { gbCityCode: "350200", cityName: "厦门" }]));
  if (pathname.includes("supplierUser/detail")) return sendJson(res, ok({ type: 1, company: "杭州二级供应商", mobile: "13900000001", businessLicense: "", supplierBrandRela: brands }));
  if (pathname.includes("getAccount")) return sendJson(res, ok({ enableAmount: 12680.5, freezeAmount: 500, totalAmount: 13180.5 }));
  if (pathname.includes("supplierBankCardInfo/getList")) return sendJson(res, ok(bankCards));
  if (pathname.includes("getBankList")) return sendJson(res, ok([{ bankName: "招商银行" }, { bankName: "中国工商银行" }, { bankName: "支付宝" }]));
  if (pathname.includes("/detail")) return sendJson(res, ok(orders[0]));
  if (pathname.includes("/page") || pathname.includes("/list") || pathname.includes("pageUser") || pathname.includes("export-list")) return sendJson(res, page(recordsFor(pathname)));
  return sendJson(res, ok({ success: true }));
}

function serveFile(res, pathname) {
  const safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(root, safePath === "/" ? "index.html" : safePath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) filePath = path.join(root, "index.html");
  res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  if (req.method === "OPTIONS") return sendJson(res, ok(true));
  if (url.pathname.startsWith("/dine-") || url.pathname.startsWith("/nezha-")) return handleApi(req, res, url.pathname);
  return serveFile(res, url.pathname);
}).listen(port, "127.0.0.1", () => {
  console.log(`二级供应商后台真实仓库版本地原型：http://127.0.0.1:${port}/`);
});
