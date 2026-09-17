const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 8773;

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
  return ok({
    records,
    rows: records,
    list: records,
    total: records.length,
    current: 1,
    size: 10,
  });
}

function successMessage(message = "操作成功") {
  return ok({ success: true, message });
}

const brandOptions = [
  { brandCode: "LK", brandName: "瑞幸咖啡", label: "瑞幸咖啡", value: "LK" },
  { brandCode: "KFC", brandName: "肯德基", label: "肯德基", value: "KFC" },
  { brandCode: "MCD", brandName: "麦当劳", label: "麦当劳", value: "MCD" },
];

const cityOptions = [
  { gbCityCode: "110100", cityName: "北京", label: "北京", value: "110100" },
  { gbCityCode: "310100", cityName: "上海", label: "上海", value: "310100" },
  { gbCityCode: "350200", cityName: "厦门", label: "厦门", value: "350200" },
];

const goodsOptions = [
  { goodsCode: "LK-29", name: "瑞幸咖啡 29元饮品券", goodsName: "瑞幸咖啡 29元饮品券", minMarketAmount: "29.00", limitPrice: "18.80" },
  { goodsCode: "KFC-50", name: "肯德基 50元代金券", goodsName: "肯德基 50元代金券", minMarketAmount: "50.00", limitPrice: "42.90" },
  { goodsCode: "LK-38", name: "瑞幸咖啡 38元套餐券", goodsName: "瑞幸咖啡 38元套餐券", minMarketAmount: "38.00", limitPrice: "26.60" },
];

function sendExport(res) {
  res.writeHead(200, {
    "Content-Type": "application/vnd.ms-excel; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  });
  res.end("本地原型导出演示");
}

const rows = {
  quotation: [
    {
      id: 1001,
      brandCode: "LK",
      brandCodeStr: "瑞幸咖啡",
      quotName: "瑞幸咖啡饮品券报价",
      goodsNameStr: "瑞幸咖啡 29元饮品券",
      cityName: "北京、上海、厦门",
      createTime: "2026-09-11 09:30:00",
      updateTime: "2026-09-11 10:20:00",
      quotAmount: "16.50",
      readyFoodType: 0,
      company: "惠生活本地演示供应商",
      switchStatus: 1,
      comboFlag: false,
      comboNum: "",
      cityList: ["110100", "310100", "350200"],
      productList: [
        { goodsCode: "LK-29", name: "瑞幸咖啡 29元饮品券", minMarketAmount: "29.00", limitPrice: "18.80" },
      ],
    },
    {
      id: 1002,
      brandCode: "KFC",
      brandCodeStr: "肯德基",
      quotName: "肯德基代金券报价",
      goodsNameStr: "肯德基 50元代金券",
      cityName: "全国",
      createTime: "2026-09-11 09:40:00",
      updateTime: "2026-09-11 10:18:00",
      quotAmount: "39.80",
      readyFoodType: 2,
      company: "惠生活本地演示供应商",
      switchStatus: 1,
      comboFlag: false,
      comboNum: "",
      cityList: [],
      productList: [
        { goodsCode: "KFC-50", name: "肯德基 50元代金券", minMarketAmount: "50.00", limitPrice: "42.90" },
      ],
    },
  ],
  order: [
    {
      id: 900001,
      thirdOrderNo: "SF202609110001",
      outTradeNo: "DD202609110001",
      acceptTime: "2026-09-11 09:42:00",
      remainReadyTime: 1800,
      readyFoodTime: "",
      settleTime: "",
      supplierStatus: 0,
      readyFoodType: 0,
      productName: "瑞幸咖啡 29元饮品券",
      thirdPlatDomain: "惠生活",
      thirdPlatUserMobile: "139****0001",
      voucherLink: "https://example.com/voucher/900001",
      voucherCode: "LK20260911",
      remark: "到店核销",
      buyerPrice: 18.8,
      marketAmount: "29.00",
      settleStatus: 0,
      city: "北京",
      store: "国贸店",
      storeAddress: "朝阳区建国门外大街1号",
      brandName: "瑞幸咖啡",
      company: "惠生活本地演示供应商",
      foodCode: "A108",
      qrCode: "LK202609110001",
      qrCodeList: ["./assets/404-cloud-CPeIbRAe.png"],
      subCompanyName: "",
    },
    {
      id: 900002,
      thirdOrderNo: "SF202609110002",
      outTradeNo: "DD202609110002",
      acceptTime: "2026-09-11 10:05:00",
      remainReadyTime: 2400,
      readyFoodTime: "",
      settleTime: "",
      supplierStatus: 15,
      readyFoodType: 2,
      productName: "肯德基 50元代金券",
      thirdPlatDomain: "惠生活",
      thirdPlatUserMobile: "136****6208",
      voucherLink: "https://example.com/voucher/900002",
      voucherCode: "KFC20260911",
      remark: "短信发送",
      buyerPrice: 42.9,
      marketAmount: "50.00",
      settleStatus: 0,
      city: "厦门",
      store: "湖滨店",
      storeAddress: "思明区湖滨南路88号",
      brandName: "肯德基",
      company: "惠生活本地演示供应商",
      foodCode: "B216",
      qrCode: "",
      qrCodeList: [],
      subCompanyName: "",
    },
    {
      id: 900003,
      thirdOrderNo: "SF202609100003",
      outTradeNo: "DD202609100003",
      acceptTime: "2026-09-10 16:08:00",
      remainReadyTime: 0,
      readyFoodTime: "2026-09-10 16:16:00",
      settleTime: "2026-09-11 03:00:00",
      supplierStatus: 20,
      readyFoodType: 1,
      productName: "瑞幸咖啡 38元套餐券",
      thirdPlatDomain: "惠生活",
      thirdPlatUserMobile: "137****9912",
      voucherCode: "LK20260910",
      buyerPrice: 26.6,
      marketAmount: "38.00",
      settleStatus: 2,
      city: "厦门",
      store: "软件园店",
      storeAddress: "软件园二期观日路",
      brandName: "瑞幸咖啡",
      company: "惠生活本地演示供应商",
      foodCode: "C306",
      qrCode: "",
      qrCodeList: [],
      subCompanyName: "",
    },
  ],
  account: [
    {
      id: 501,
      mobile: "13900000001",
      cityId: "350200",
      cityName: "厦门",
      dailyNumLimit: 120,
      loginStatus: 1,
      familyAvailable: 42,
      normalAvailable: 318,
      couponUpdateTime: "2026-09-11 10:00:00",
      status: 1,
      remark: "本地原型演示账号",
    },
    {
      id: 502,
      mobile: "13600006208",
      cityId: "110100",
      cityName: "北京",
      dailyNumLimit: 80,
      loginStatus: 0,
      familyAvailable: 8,
      normalAvailable: 96,
      couponUpdateTime: "2026-09-10 18:24:00",
      status: 0,
      remark: "待补充登录态",
    },
  ],
  withdrawAccounts: [
    {
      id: 701,
      bankCardNum: "622588******6208",
      receiverBankChannelNo: "308584000013",
      shortName: "CMB",
      bankName: "招商银行",
      receiverName: "厦门惠生活供应商",
      phone: "139****6208",
      status: 1,
      createTime: "2026-09-09 16:20:00",
    },
  ],
  withdrawRecords: [
    {
      id: 801,
      withdrawNo: "TX202609110001",
      amount: "500.00",
      fee: "0.00",
      bankCardNum: "招商银行 尾号6208",
      status: 0,
      createTime: "2026-09-11 09:30:00",
    },
  ],
  settlementRecords: [
    {
      id: 7001,
      settleNo: "JS202609110001",
      outTradeNo: "DD202609110001",
      productName: "瑞幸咖啡 29元饮品券",
      settleAmount: "16.50",
      settleStatus: 1,
      createTime: "2026-09-11 03:00:00",
    },
  ],
  auto: [
    {
      id: 3001,
      name: "瑞幸自动发货链接",
      code: "AUTO-LK-001",
      rule: "下单后自动分配一个未使用链接",
      status: 1,
      totalNum: 1000,
      remainNum: 860,
      domain: "惠生活",
      createTime: "2026-09-11 10:10:00",
      source: "供应商后台导入",
    },
    {
      id: 3002,
      name: "肯德基H5券链接",
      code: "AUTO-KFC-001",
      rule: "多个链接按导入顺序依次发货",
      status: 1,
      totalNum: 500,
      remainNum: 220,
      domain: "肯德基",
      createTime: "2026-09-10 11:20:00",
      source: "本地演示数据",
    },
  ],
  autoDetail: [
    {
      id: 4001,
      name: "瑞幸自动发货链接",
      rule: "下单后自动分配一个未使用链接",
      status: 0,
      createTime: "2026-09-11 10:12:00",
      url: "https://demo.example.com/luckin/10001",
      domain: "惠生活",
      source: "供应商后台导入",
      useTime: "",
      effectEndTime: "2026-12-31",
      outTradeNo: "",
      supplierOrderId: "",
    },
    {
      id: 4002,
      name: "瑞幸自动发货链接",
      rule: "下单后自动分配一个未使用链接",
      status: 1,
      createTime: "2026-09-11 10:13:00",
      url: "https://demo.example.com/luckin/10002",
      domain: "惠生活",
      source: "供应商后台导入",
      useTime: "2026-09-11 10:30:00",
      effectEndTime: "2026-12-31",
      outTradeNo: "DD202609110001",
      supplierOrderId: "900001",
    },
  ],
  invoice: {
    compensation: [
      {
        id: 9101,
        claimNo: "CLM202609140001",
        subsidyNo: "SUB202609140001",
        brandCode: "LK",
        brandName: "瑞幸咖啡",
        storeCity: "北京",
        requirementCreatedAt: "2026-09-14 09:18:00",
        createTime: "2026-09-14 09:18:00",
        productName: "瑞幸咖啡 29元饮品券",
        userPayAmount: 22.8,
        subsidyAmount: 3.2,
      },
      {
        id: 9102,
        claimNo: "CLM202609140002",
        subsidyNo: "SUB202609140002",
        brandCode: "KFC",
        brandName: "肯德基",
        storeCity: "厦门",
        requirementCreatedAt: "2026-09-14 08:42:00",
        createTime: "2026-09-14 08:42:00",
        productName: "肯德基 50元代金券",
        userPayAmount: 46.9,
        subsidyAmount: 5.6,
      },
      {
        id: 9103,
        claimNo: "CLM202609140003",
        subsidyNo: "SUB202609140003",
        brandCode: "MCD",
        brandName: "麦当劳",
        storeCity: "上海",
        requirementCreatedAt: "2026-09-14 07:55:00",
        createTime: "2026-09-14 07:55:00",
        productName: "麦当劳 38元套餐券",
        userPayAmount: 34.8,
        subsidyAmount: 4.2,
      },
      {
        id: 9104,
        claimNo: "CLM202609140004",
        subsidyNo: "SUB202609140004",
        brandCode: "LK",
        brandName: "瑞幸咖啡",
        storeCity: "厦门",
        requirementCreatedAt: "2026-09-13 16:20:00",
        createTime: "2026-09-13 16:20:00",
        productName: "瑞幸咖啡 38元套餐券",
        userPayAmount: 26.6,
        subsidyAmount: 2.8,
      },
    ],
    subsidy: [
      {
        id: 9201,
        claimNo: "CLM202609140101",
        subsidyNo: "SUB202609140101",
        itemOrderNo: "FO202609140101",
        brandCode: "LK",
        brandName: "瑞幸咖啡",
        storeCity: "北京",
        productName: "生椰拿铁 1 杯",
        userPayAmount: 18.5,
        subsidyAmount: 2.6,
        invoiceTitle: "瑞幸咖啡（中国）有限公司",
        taxpayerNo: "91110108MA01DEMO01",
        deadlineAt: "2026-09-15 18:00:00",
        orderTime: "2026-09-14 09:05:00",
        createTime: "2026-09-14 09:05:00",
        latestUploadedAt: "",
        rejectReason: "",
        rejectReasonMessage: "",
        invoiceFileCount: 0,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: "PROCESSING",
      },
      {
        id: 9202,
        claimNo: "CLM202609140102",
        subsidyNo: "SUB202609140102",
        itemOrderNo: "FO202609140102",
        brandCode: "KFC",
        brandName: "肯德基",
        storeCity: "厦门",
        productName: "肯德基 50元代金券",
        userPayAmount: 42.9,
        subsidyAmount: 4.8,
        invoiceTitle: "厦门肯德基有限公司",
        taxpayerNo: "91350200MA01DEMO02",
        deadlineAt: "2026-09-16 12:00:00",
        orderTime: "2026-09-14 08:35:00",
        createTime: "2026-09-14 08:35:00",
        latestUploadedAt: "",
        rejectReason: "",
        rejectReasonMessage: "",
        invoiceFileCount: 0,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: "PROCESSING",
      },
      {
        id: 9207,
        claimNo: "CLM202609150103",
        subsidyNo: "SUB202609150103",
        itemOrderNo: "FO202609150103",
        brandCode: "LK",
        brandName: "瑞幸咖啡",
        storeCity: "上海",
        productName: "瑞幸咖啡 厚乳拿铁 2 杯",
        userPayAmount: 35.8,
        subsidyAmount: 4.2,
        invoiceTitle: "瑞幸咖啡（中国）有限公司",
        taxpayerNo: "91110108MA01DEMO01",
        deadlineAt: "2026-09-16 18:30:00",
        orderTime: "2026-09-15 09:15:00",
        createTime: "2026-09-15 09:15:00",
        latestUploadedAt: "",
        rejectReason: "",
        rejectReasonMessage: "",
        invoiceFileCount: 0,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: "PROCESSING",
      },
      {
        id: 9208,
        claimNo: "CLM202609150104",
        subsidyNo: "SUB202609150104",
        itemOrderNo: "FO202609150104",
        brandCode: "MCD",
        brandName: "麦当劳",
        storeCity: "上海",
        productName: "麦当劳 早餐双人券",
        userPayAmount: 29.9,
        subsidyAmount: 3.5,
        invoiceTitle: "金拱门（中国）有限公司",
        taxpayerNo: "91110000MA01DEMO03",
        deadlineAt: "2026-09-17 10:00:00",
        orderTime: "2026-09-15 10:20:00",
        createTime: "2026-09-15 10:20:00",
        latestUploadedAt: "",
        rejectReason: "",
        rejectReasonMessage: "",
        invoiceFileCount: 0,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: "PROCESSING",
      },
      {
        id: 9209,
        claimNo: "CLM202609150105",
        subsidyNo: "SUB202609150105",
        itemOrderNo: "FO202609150105",
        brandCode: "KFC",
        brandName: "肯德基",
        storeCity: "北京",
        productName: "肯德基 38元套餐券",
        userPayAmount: 31.9,
        subsidyAmount: 3.9,
        invoiceTitle: "厦门肯德基有限公司",
        taxpayerNo: "91350200MA01DEMO02",
        deadlineAt: "2026-09-17 15:20:00",
        orderTime: "2026-09-15 11:05:00",
        createTime: "2026-09-15 11:05:00",
        latestUploadedAt: "",
        rejectReason: "",
        rejectReasonMessage: "",
        invoiceFileCount: 0,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: "PROCESSING",
      },
      {
        id: 9203,
        claimNo: "CLM202609130201",
        subsidyNo: "SUB202609130201",
        itemOrderNo: "FO202609130201",
        brandCode: "MCD",
        brandName: "麦当劳",
        storeCity: "上海",
        productName: "麦当劳 38元套餐券",
        userPayAmount: 34.8,
        subsidyAmount: 4.1,
        invoiceTitle: "金拱门（中国）有限公司",
        taxpayerNo: "91110000MA01DEMO03",
        deadlineAt: "",
        orderTime: "2026-09-13 17:20:00",
        createTime: "2026-09-13 17:20:00",
        latestUploadedAt: "2026-09-14 10:15:00",
        rejectReason: "金额不一致",
        rejectReasonMessage: "发票金额与申请开票金额不一致，请重新上传。",
        invoiceFileCount: 1,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: "REJECTED",
      },
      {
        id: 9204,
        claimNo: "CLM202609130202",
        subsidyNo: "SUB202609130202",
        itemOrderNo: "FO202609130202",
        brandCode: "LK",
        brandName: "瑞幸咖啡",
        storeCity: "厦门",
        productName: "厚乳拿铁 2 杯",
        userPayAmount: 36,
        subsidyAmount: 3.8,
        invoiceTitle: "瑞幸咖啡（中国）有限公司",
        taxpayerNo: "91110108MA01DEMO01",
        deadlineAt: "",
        orderTime: "2026-09-13 15:42:00",
        createTime: "2026-09-13 15:42:00",
        latestUploadedAt: "2026-09-14 09:32:00",
        rejectReason: "抬头不规范",
        rejectReasonMessage: "请使用品牌官方开票主体重新上传。",
        invoiceFileCount: 1,
        currentUploadBatchNo: "UP202609140204",
        subsidyStatus: 0,
        tab: "REJECTED",
      },
      {
        id: 9205,
        claimNo: "CLM202609120301",
        subsidyNo: "SUB202609120301",
        itemOrderNo: "FO202609120301",
        brandCode: "KFC",
        brandName: "肯德基",
        storeCity: "北京",
        productName: "肯德基早餐套餐",
        userPayAmount: 25.9,
        subsidyAmount: 2.9,
        invoiceTitle: "厦门肯德基有限公司",
        taxpayerNo: "91350200MA01DEMO02",
        deadlineAt: "",
        orderTime: "2026-09-12 09:12:00",
        createTime: "2026-09-12 09:12:00",
        latestUploadedAt: "2026-09-12 11:08:00",
        rejectReason: "",
        rejectReasonMessage: "",
        invoiceFileCount: 1,
        currentUploadBatchNo: null,
        subsidyStatus: 2,
        tab: "UPLOADED",
      },
      {
        id: 9206,
        claimNo: "CLM202609120302",
        subsidyNo: "SUB202609120302",
        itemOrderNo: "FO202609120302",
        brandCode: "MCD",
        brandName: "麦当劳",
        storeCity: "上海",
        productName: "麦当劳 双人套餐",
        userPayAmount: 49.9,
        subsidyAmount: 5.2,
        invoiceTitle: "金拱门（中国）有限公司",
        taxpayerNo: "91110000MA01DEMO03",
        deadlineAt: "",
        orderTime: "2026-09-12 12:26:00",
        createTime: "2026-09-12 12:26:00",
        latestUploadedAt: "2026-09-12 13:40:00",
        rejectReason: "",
        rejectReasonMessage: "",
        invoiceFileCount: 2,
        currentUploadBatchNo: null,
        subsidyStatus: 1,
        tab: "UPLOADED",
      },
    ],
  },
};

function bodyOf(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function filterInvoiceRows(records, query = {}) {
  const compensationTitles = {
    9101: "厦门晨星信息科技有限公司",
    9102: "厦门肯德基有限公司",
    9103: "金拱门（中国）有限公司",
    9104: "上海云朵互动科技有限公司",
  };
  return records.filter((item) => {
    if (query.brandCode && item.brandCode !== query.brandCode) return false;
    if (query.subsidyNo && !String(item.subsidyNo).includes(String(query.subsidyNo))) return false;
    if (query.itemOrderNo && !String(item.itemOrderNo || "").includes(String(query.itemOrderNo))) return false;
    if (query.invoiceTitle && !String(item.invoiceTitle || "").includes(String(query.invoiceTitle))) return false;
    if (query.tab && item.tab !== query.tab) return false;

    const userPayAmount = Number(item.userPayAmount);
    const subsidyAmount = Number(item.subsidyAmount);
    if (query.userPayAmountMin !== undefined && query.userPayAmountMin !== "" && userPayAmount < Number(query.userPayAmountMin)) return false;
    if (query.userPayAmountMax !== undefined && query.userPayAmountMax !== "" && userPayAmount > Number(query.userPayAmountMax)) return false;
    if (query.subsidyAmountMin !== undefined && query.subsidyAmountMin !== "" && subsidyAmount < Number(query.subsidyAmountMin)) return false;
    if (query.subsidyAmountMax !== undefined && query.subsidyAmountMax !== "" && subsidyAmount > Number(query.subsidyAmountMax)) return false;
    return true;
  }).map((item) => {
    const invoiceTitle = item.invoiceTitle || compensationTitles[item.id] || "--";
    return {
      ...item,
      invoiceTitle,
      invoiceType: item.invoiceType ?? (invoiceTitle === "个人" ? 0 : 1),
      invoiceTitleTypeName: invoiceTitle === "个人" ? "个人" : "企业",
      userName: invoiceTitle,
    };
  });
}

function handleApi(req, res, pathname, body = {}) {
  if (pathname === "/nezha-base-grant/oauth/token") {
    return sendJson(res, ok({
      accessToken: "supplier-local-token",
      refreshToken: "supplier-local-refresh-token",
      expiresIn: 86400,
    }));
  }

  if (pathname === "/nezha-base-grant/oauth/logout") {
    return sendJson(res, ok(true));
  }

  if (pathname === "/dine-admin-service/getInfo") {
    return sendJson(res, ok({
      user: {
        userId: 1,
        userName: "supplier_admin",
        nickName: "供应商管理员",
        avatar: "",
        detail: {
          supplierName: "惠生活本地演示供应商",
          cooperationMode: 0,
        },
      },
      roles: ["admin"],
      permissions: ["*:*:*"],
    }));
  }

  if (pathname === "/dine-supplier-admin/supplierUser/cooperationMode") {
    return sendJson(res, ok({ cooperationMode: 0, domain: "local.prototype" }));
  }

  if (pathname === "/dine-supplier-admin/bizConfig/getSysConfig") {
    return sendJson(res, ok({
      supplierName: "惠生活本地演示供应商",
      domain: "local.prototype",
      customerServicePhone: "400-000-0000",
    }));
  }

  if (pathname.includes("/dine-invoice-service/supplier/invoice/lobby/brands")) {
    return sendJson(res, ok(brandOptions));
  }
  if (pathname.includes("/dine-invoice-service/supplier/invoice/lobby/page")) {
    return sendJson(res, page(filterInvoiceRows(rows.invoice.compensation, body)));
  }
  if (pathname.includes("/dine-invoice-service/supplier/invoice/subsidy/page")) {
    return sendJson(res, page(filterInvoiceRows(rows.invoice.subsidy, body)));
  }
  if (pathname.includes("/dine-invoice-service/supplier/invoice/subsidy/detail")) {
    const record = rows.invoice.subsidy.find((item) => item.claimNo === body.claimNo) || rows.invoice.subsidy[0];
    return sendJson(res, ok(record));
  }
  if (pathname.includes("/dine-invoice-service/supplier/invoice/subsidy/batchClaim")) {
    const claimNos = Array.isArray(body.claimNos) ? body.claimNos : [];
    return sendJson(res, ok({
      requestId: "REQ202609140001",
      totalCount: claimNos.length,
      successCount: claimNos.length,
      failureCount: 0,
      items: claimNos.map((claimNo) => ({ claimNo, success: true })),
    }));
  }
  if (pathname.includes("/dine-invoice-service/supplier/invoice/subsidy/download")) {
    return sendJson(res, ok([
      { fileName: "发票示例-" + body.claimNo + ".pdf", fileUrl: "https://example.com/invoice/" + body.claimNo + ".pdf", uploadedAt: "2026-09-14 10:15:00" },
    ]));
  }
  if (pathname.includes("/dine-invoice-service/supplier/invoice/subsidy/")) {
    return sendJson(res, successMessage());
  }

  if (pathname.includes("export")) return sendExport(res);

  if (pathname.includes("/supplier/order/supplier/order/detail")) {
    return sendJson(res, ok(rows.order[0]));
  }
  if (pathname.includes("/supplier/order/supplier/order/page")) {
    return sendJson(res, page(rows.order));
  }
  if (pathname.includes("/supplier/order/supplier/order/ready") || pathname.includes("/manul/order/cancel")) {
    return sendJson(res, successMessage());
  }

  if (pathname.includes("/supplierQuotation/client/supplier/quotation/detail")) {
    return sendJson(res, ok(rows.quotation[0]));
  }
  if (pathname.includes("/supplierQuotation/client/supplier/quotation/page")) {
    return sendJson(res, page(rows.quotation));
  }
  if (pathname.includes("/supplierQuotation/client/supplier/quotation/")) {
    return sendJson(res, successMessage());
  }
  if (pathname.includes("/linkProviderConfig/listCanUse")) {
    return sendJson(res, ok([
      { id: 1, apiName: "SOTO自动出餐", domain: "惠生活" },
      { id: 2, apiName: "H5链接平台", domain: "肯德基" },
    ]));
  }
  if (pathname.includes("/supplierCoupon/hasEnableCoupon")) {
    return sendJson(res, ok(false));
  }

  if (pathname.includes("/thirdPlatUser/pageUser")) return sendJson(res, page(rows.account));
  if (pathname.includes("/thirdPlatUser/queryCity")) return sendJson(res, ok(cityOptions));
  if (pathname.includes("/thirdPlatUser/sendCode")) return sendJson(res, successMessage("验证码已发送"));
  if (pathname.includes("/thirdPlatUser/")) return sendJson(res, successMessage());
  if (pathname.includes("/supplierCoupon/getGoodsInfoList")) return sendJson(res, page(goodsOptions));
  if (pathname.includes("/supplierCoupon/pageFamilyCoupon") || pathname.includes("/supplierCoupon/pageCoupon") || pathname.includes("/supplierCoupon/allCoupon")) {
    return sendJson(res, page([
      {
        id: 601,
        couponCode: "LK202609110001",
        couponName: "瑞幸咖啡兑换券",
        goodsNameStr: "瑞幸咖啡 29元饮品券",
        couponStatus: 0,
        settlePrice: "16.50",
        mobile: "13900000001",
        remark: "本地演示券码",
        effectTime: "2026-12-31",
      },
    ]));
  }

  if (pathname.includes("/linkTemplate/platformList")) return sendJson(res, ok(["惠生活", "瑞幸咖啡", "肯德基"]));
  if (pathname.includes("/linkTemplate/listCanUse")) return sendJson(res, ok(rows.auto));
  if (pathname.includes("/linkTemplate/page")) return sendJson(res, page(rows.auto));
  if (pathname.includes("/linkDetail/page")) return sendJson(res, page(rows.autoDetail));
  if (pathname.includes("/linkTemplate/") || pathname.includes("/linkDetail/")) return sendJson(res, successMessage());

  if (pathname.includes("/supplierBankCardInfo/page")) return sendJson(res, page(rows.withdrawAccounts));
  if (pathname.includes("/supplierBankCardInfo/getList")) return sendJson(res, ok(rows.withdrawAccounts));
  if (pathname.includes("/supplierBankCardInfo/")) return sendJson(res, successMessage());
  if (pathname.includes("/supplierWithdrawRecord/page")) return sendJson(res, page(rows.withdrawRecords));
  if (pathname.includes("/supplierWithdrawRecord/getAccount")) return sendJson(res, ok({ availableAmount: "2680.50", frozenAmount: "0.00" }));
  if (pathname.includes("/supplierWithdrawRecord/")) return sendJson(res, successMessage());
  if (pathname.includes("/supplierSettleInfo/settleInfo/page")) return sendJson(res, page(rows.settlementRecords));
  if (pathname.includes("/supplierFinanceTradeRecord/finance/tradeRecord/page")) return sendJson(res, page(rows.settlementRecords));

  if (pathname.includes("/supplierUser/listBrandBySupplier") || pathname.includes("/supplierUser/listBrand") || pathname.includes("listBrand")) {
    return sendJson(res, ok(brandOptions));
  }
  if (pathname.includes("/supplier/config/query")) {
    return sendJson(res, ok([
      { id: 1, apiName: "SOTO自动出餐", supplierApiType: "soto", brandCode: "LK" },
      { id: 2, apiName: "H5链接出餐", supplierApiType: "link", brandCode: "KFC" },
    ]));
  }
  if (pathname.includes("/supplier/config/list")) {
    return sendJson(res, page([
      { id: 1, supplierName: "惠生活本地演示供应商", apiName: "SOTO自动出餐", timeout: 30, status: 1 },
    ]));
  }
  if (pathname.includes("/supplier/config/") || pathname.includes("/supplierUser/modifyPassword")) {
    return sendJson(res, successMessage());
  }
  if (pathname.includes("getBankList")) return sendJson(res, ok([{ bankName: "招商银行", shortName: "CMB" }, { bankName: "中国工商银行", shortName: "ICBC" }]));

  return sendJson(res, page([]));
}

function serveFile(req, res, pathname) {
  const safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(root, safePath === "/" ? "index.html" : safePath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, "index.html");
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  if (req.method === "OPTIONS") {
    return sendJson(res, ok(true));
  }
  if (url.pathname.startsWith("/dine-") || url.pathname.startsWith("/nezha-") || url.pathname.startsWith("/system/")) {
    const body = req.method === "POST" ? await bodyOf(req) : {};
    return handleApi(req, res, url.pathname, body);
  }
  serveFile(req, res, url.pathname);
}).listen(port, "127.0.0.1", () => {
  console.log(`点餐供应商管理系统本地原型：http://127.0.0.1:${port}/`);
});

