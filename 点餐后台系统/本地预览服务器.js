const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 8774;

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

function sendJson(res, data, contentType = "application/json; charset=utf-8") {
  res.writeHead(200, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  });
  res.end(typeof data === "string" ? data : JSON.stringify(data));
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
    size: 20,
  });
}

function success(message = "操作成功") {
  return ok({ success: true, message });
}

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

const brands = [
  { brandCode: "LK", brandName: "瑞幸咖啡", name: "瑞幸咖啡", label: "瑞幸咖啡", value: "LK" },
  { brandCode: "KFC", brandName: "肯德基", name: "肯德基", label: "肯德基", value: "KFC" },
  { brandCode: "MCD", brandName: "麦当劳", name: "麦当劳", label: "麦当劳", value: "MCD" },
];

const cities = [
  { gbCityCode: "110100", cityName: "北京", label: "北京", value: "110100" },
  { gbCityCode: "310100", cityName: "上海", label: "上海", value: "310100" },
  { gbCityCode: "350200", cityName: "厦门", label: "厦门", value: "350200" },
];

const suppliers = [
  {
    id: 10001,
    idStr: "SUP-10001",
    company: "厦门惠生活供应链有限公司",
    tenantId: "T20240001",
    domainList: ["惠生活", "海尼商城"],
    linkDomainList: ["惠生活H5", "瑞幸兑换"],
    supplierBrandRelaStr: "瑞幸咖啡、肯德基",
    invoiceOrderBrandCodes: ["LK", "KFC"],
    invoiceOrderBrandNames: "瑞幸咖啡、肯德基",
    mobile: "13900000001",
    status: 1,
    cooperationMode: 0,
    invoiceOrderEnabled: 1,
    createTime: "2026-08-18 10:20:00",
    updateTime: "2026-09-11 09:10:00",
    registerType: 1,
    refereeNickName: "平台运营",
    refereeId: 1,
    maxPriceLimit: 28.8,
  },
  {
    id: 10002,
    idStr: "SUP-10002",
    company: "北京优选数字科技有限公司",
    tenantId: "T20240018",
    domainList: ["惠生活"],
    linkDomainList: ["肯德基H5"],
    supplierBrandRelaStr: "麦当劳",
    invoiceOrderBrandCodes: [],
    invoiceOrderBrandNames: "",
    mobile: "13600006208",
    status: 2,
    cooperationMode: 1,
    invoiceOrderEnabled: 0,
    createTime: "2026-09-02 14:30:00",
    updateTime: "2026-09-10 16:40:00",
    registerType: 2,
    refereeNickName: "张经理",
    refereeId: 2,
    maxPriceLimit: 45,
  },
  {
    id: 10003,
    idStr: "SUP-10003",
    company: "上海快取服务中心",
    tenantId: "T20240023",
    domainList: [],
    linkDomainList: [],
    supplierBrandRelaStr: "肯德基",
    invoiceOrderBrandCodes: [],
    invoiceOrderBrandNames: "",
    mobile: "13700009912",
    status: 0,
    cooperationMode: 0,
    invoiceOrderEnabled: 0,
    createTime: "2026-07-21 09:40:00",
    updateTime: "2026-09-08 11:22:00",
    registerType: 1,
    refereeNickName: "-",
    refereeId: "",
    maxPriceLimit: 42,
  },
];

const goods = [
  {
    id: 20001,
    goodsCode: "LK-29",
    officialGoodsId: "OFF-LK-2901",
    name: "瑞幸咖啡 29元饮品券",
    brandCode: "LK",
    brandName: "瑞幸咖啡",
    categoryNameStr: "饮品券",
    goodsSpec: "大杯 / 中杯任选",
    goodsType: 1,
    goodsTypeStr: "单品",
    basePrice: "16.50",
    minMarketAmount: "29.00",
    platformPrice: "22.80",
    maxPrice: "25.80",
    status: 1,
    statusStr: "已上架",
    platformStatus: 1,
    platformStatusStr: "已上架",
    saleStatus: 1,
    saleStatusStr: "正常",
    saleDateType: 0,
    saleDateTypeStr: "不限",
    saleTimeRanges: [{ start: "08:00", end: "23:00" }],
    mainImage: "./assets/welcome-VFYC1WKN.png",
    createTime: "2026-08-12 09:20:00",
  },
  {
    id: 20002,
    goodsCode: "KFC-50",
    officialGoodsId: "OFF-KFC-5001",
    name: "肯德基 50元代金券",
    brandCode: "KFC",
    brandName: "肯德基",
    categoryNameStr: "代金券",
    goodsSpec: "全国门店可用",
    goodsType: 1,
    goodsTypeStr: "单品",
    basePrice: "39.80",
    minMarketAmount: "50.00",
    platformPrice: "46.90",
    maxPrice: "48.00",
    status: 1,
    statusStr: "已上架",
    platformStatus: 1,
    platformStatusStr: "已上架",
    saleStatus: 1,
    saleStatusStr: "正常",
    saleDateType: 1,
    saleDateTypeStr: "每周",
    saleWeekdays: [1, 2, 3, 4, 5],
    saleTimeRanges: [{ start: "10:00", end: "22:00" }],
    mainImage: "./assets/welcome-VFYC1WKN.png",
    createTime: "2026-08-14 11:10:00",
  },
  {
    id: 20003,
    goodsCode: "MCD-38",
    officialGoodsId: "OFF-MCD-3801",
    name: "麦当劳 38元套餐券",
    brandCode: "MCD",
    brandName: "麦当劳",
    categoryNameStr: "套餐券",
    goodsSpec: "双人套餐",
    goodsType: 2,
    goodsTypeStr: "套餐",
    basePrice: "26.60",
    minMarketAmount: "38.00",
    platformPrice: "34.80",
    maxPrice: "35.50",
    status: 0,
    statusStr: "已下架",
    platformStatus: 0,
    platformStatusStr: "已下架",
    saleStatus: 0,
    saleStatusStr: "不可售",
    saleDateType: 0,
    saleDateTypeStr: "不限",
    saleTimeRanges: [],
    mainImage: "./assets/welcome-VFYC1WKN.png",
    createTime: "2026-08-05 15:18:00",
  },
];

const stores = [
  {
    id: 30001,
    brandCode: "LK",
    brandName: "瑞幸咖啡",
    storeCityCode: "110100",
    storeCity: "北京",
    storeName: "国贸店",
    thirdStoreCode: "LK-BJ-GM-001",
    startTime: "07:00",
    endTime: "22:00",
    storeScene: 1,
    storeStatus: 1,
    supportOrder: 1,
    storePhone: "010-65550001",
    storeAddress: "朝阳区建国门外大街1号",
    longitude: "116.458",
    latitude: "39.908",
    storeDataStatus: 1,
    remark: "核心商圈门店",
    sourceType: 1,
    updateByName: "运营管理员",
    updateTime: "2026-09-10 14:20:00",
  },
  {
    id: 30002,
    brandCode: "KFC",
    brandName: "肯德基",
    storeCityCode: "350200",
    storeCity: "厦门",
    storeName: "湖滨南路店",
    thirdStoreCode: "KFC-XM-HBN-022",
    startTime: "09:00",
    endTime: "23:00",
    storeScene: 2,
    storeStatus: 1,
    supportOrder: 1,
    storePhone: "0592-6022022",
    storeAddress: "思明区湖滨南路88号",
    longitude: "118.101",
    latitude: "24.476",
    storeDataStatus: 1,
    remark: "商圈流量店",
    sourceType: 1,
    updateByName: "运营管理员",
    updateTime: "2026-09-09 17:10:00",
  },
  {
    id: 30003,
    brandCode: "MCD",
    brandName: "麦当劳",
    storeCityCode: "310100",
    storeCity: "上海",
    storeName: "静安寺店",
    thirdStoreCode: "MCD-SH-JAS-008",
    startTime: "00:00",
    endTime: "24:00",
    storeScene: 1,
    storeStatus: 2,
    supportOrder: 0,
    storePhone: "021-62080008",
    storeAddress: "静安区南京西路1600号",
    longitude: "121.445",
    latitude: "31.223",
    storeDataStatus: 2,
    remark: "待核实门店资料",
    sourceType: 2,
    updateByName: "供应链运营",
    updateTime: "2026-09-08 10:35:00",
  },
];

const orders = [
  {
    id: 40001,
    orderNo: "DD202609110001",
    salesChannelOrderNo: "HL202609110001",
    channelOrderNo: "HL-900001",
    createTime: "2026-09-11 09:38:00",
    readyFoodTime: "",
    couponCodes: "LK202609110001",
    couponSourceStr: "惠生活",
    orderStatus: "DOING",
    orderStatusStr: "出餐中",
    orderMobile: "139****0001",
    goodsNames: "瑞幸咖啡 29元饮品券",
    storeName: "国贸店",
    brandName: "瑞幸咖啡",
    city: "北京",
    marketAmount: "29.00",
    payMethodStr: "微信支付",
    payAmount: "22.80",
    channelName: "惠生活",
    supplierCompany: "厦门惠生活供应链有限公司",
    payTime: "2026-09-11 09:38:20",
    completeTime: "",
    closeTime: "",
  },
  {
    id: 40002,
    orderNo: "DD202609110002",
    salesChannelOrderNo: "HL202609110002",
    channelOrderNo: "HL-900002",
    createTime: "2026-09-11 10:05:00",
    readyFoodTime: "2026-09-11 10:12:00",
    couponCodes: "KFC202609110002",
    couponSourceStr: "惠生活",
    orderStatus: "SUCCESS",
    orderStatusStr: "出餐成功",
    orderMobile: "136****6208",
    goodsNames: "肯德基 50元代金券",
    storeName: "湖滨南路店",
    brandName: "肯德基",
    city: "厦门",
    marketAmount: "50.00",
    payMethodStr: "微信支付",
    payAmount: "46.90",
    channelName: "惠生活",
    supplierCompany: "北京优选数字科技有限公司",
    payTime: "2026-09-11 10:05:18",
    completeTime: "2026-09-11 10:12:30",
    closeTime: "",
  },
  {
    id: 40003,
    orderNo: "DD202609100003",
    salesChannelOrderNo: "DY202609100003",
    channelOrderNo: "DY-800003",
    createTime: "2026-09-10 16:08:00",
    readyFoodTime: "",
    couponCodes: "MCD202609100003",
    couponSourceStr: "抖店",
    orderStatus: "CANCEL",
    orderStatusStr: "取消",
    orderMobile: "137****9912",
    goodsNames: "麦当劳 38元套餐券",
    storeName: "静安寺店",
    brandName: "麦当劳",
    city: "上海",
    marketAmount: "38.00",
    payMethodStr: "微信支付",
    payAmount: "34.80",
    channelName: "抖音",
    supplierCompany: "上海快取服务中心",
    payTime: "2026-09-10 16:08:19",
    completeTime: "",
    closeTime: "2026-09-10 16:20:00",
  },
];

const commonPage = [
  { id: 1, name: "演示记录", code: "DEMO-001", status: 1, statusStr: "正常", createTime: "2026-09-11 10:00:00", updateTime: "2026-09-11 10:30:00" },
  { id: 2, name: "历史记录", code: "DEMO-002", status: 0, statusStr: "停用", createTime: "2026-09-10 15:20:00", updateTime: "2026-09-10 16:00:00" },
];

const invoiceRequirements = [
  {
    id: 51001,
    itemOrderNo: "FO202609140001",
    requirementNo: "KP202609140001",
    requirementStatus: 0,
    createTime: "2026-09-14 09:12:00",
    productName: "瑞幸咖啡 29元饮品券",
    brandName: "瑞幸咖啡",
    userPayAmount: 22.8,
    originalSupplierUserId: "",
    invoiceTitle: "厦门晨星信息科技有限公司",
    invoiceType: 1,
    taxpayerNo: "91350200MA9DEMO001",
    demoFlow: "C端订单申请开票后进入待处理，等待供应商接单处理",
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
    originalSupplierUserId: "",
    invoiceTitle: "个人",
    invoiceType: 0,
    taxpayerNo: "",
    demoFlow: "待平台分发给已开启接开票单权限的供应商",
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
    originalSupplierUserId: "SUP-10001",
    invoiceTitle: "上海云朵互动科技有限公司",
    invoiceType: 1,
    taxpayerNo: "91310100MA9DEMO002",
    demoFlow: "供应商已接单，处于发票上传倒计时",
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
    originalSupplierUserId: "SUP-10001",
    invoiceTitle: "北京蓝鲸企业管理有限公司",
    invoiceType: 1,
    taxpayerNo: "91110105MA9DEMO003",
    demoFlow: "供应商处理中，可演示超时前上传",
  },
  {
    id: 51005,
    itemOrderNo: "FO202609120003",
    requirementNo: "KP202609120003",
    requirementStatus: 2,
    createTime: "2026-09-12 11:06:00",
    currentLatestUploadedAt: "2026-09-13 09:22:00",
    productName: "瑞幸咖啡 29元饮品券",
    brandName: "瑞幸咖啡",
    userPayAmount: 22.8,
    originalSupplierUserId: "SUP-10001",
    invoiceTitle: "厦门海岸线文化传媒有限公司",
    invoiceType: 1,
    taxpayerNo: "91350203MA9DEMO004",
    demoFlow: "供应商已上传发票，点击详情查看文件",
  },
  {
    id: 51006,
    itemOrderNo: "FO202609120004",
    requirementNo: "KP202609120004",
    requirementStatus: 2,
    createTime: "2026-09-12 14:35:00",
    currentLatestUploadedAt: "2026-09-13 12:10:00",
    productName: "肯德基 50元代金券",
    brandName: "肯德基",
    userPayAmount: 46.9,
    originalSupplierUserId: "SUP-10001",
    invoiceTitle: "杭州新橙餐饮管理有限公司",
    invoiceType: 1,
    taxpayerNo: "91330106MA9DEMO005",
    demoFlow: "上传完成后流转到已上传",
  },
  {
    id: 51007,
    itemOrderNo: "FO202609110004",
    requirementNo: "KP202609110004",
    requirementStatus: 3,
    createTime: "2026-09-11 16:30:00",
    currentLatestUploadedAt: "2026-09-12 10:05:00",
    currentRejectedAt: "2026-09-12 11:20:00",
    currentRejectReason: "发票抬头与申请信息不一致",
    productName: "瑞幸咖啡 29元饮品券",
    brandName: "瑞幸咖啡",
    userPayAmount: 22.8,
    originalSupplierUserId: "SUP-10001",
    invoiceTitle: "南京青禾网络科技有限公司",
    invoiceType: 1,
    taxpayerNo: "91320104MA9DEMO006",
    demoFlow: "平台驳回后回到供应商重新上传",
  },
  {
    id: 51008,
    itemOrderNo: "FO202609110005",
    requirementNo: "KP202609110005",
    requirementStatus: 3,
    createTime: "2026-09-11 18:12:00",
    currentLatestUploadedAt: "2026-09-12 13:50:00",
    currentRejectedAt: "2026-09-12 15:02:00",
    currentRejectReason: "发票文件模糊，无法识别金额",
    productName: "肯德基 50元代金券",
    brandName: "肯德基",
    userPayAmount: 46.9,
    originalSupplierUserId: "SUP-10001",
    invoiceTitle: "深圳市南山星河科技有限公司",
    invoiceType: 1,
    taxpayerNo: "91440300MA9DEMO007",
    demoFlow: "驳回原因可直接在列表查看",
  },
];

const invoiceRequirementFiles = {
  KP202609120003: [
    { id: 1, fileName: "瑞幸咖啡-电子发票-KP202609120003.pdf", fileUrl: "./assets/welcome-VFYC1WKN.png", uploadedAt: "2026-09-13 09:22:00" },
  ],
  KP202609120004: [
    { id: 2, fileName: "肯德基-电子发票-KP202609120004.pdf", fileUrl: "./assets/welcome-VFYC1WKN.png", uploadedAt: "2026-09-13 12:10:00" },
  ],
  KP202609110004: [
    { id: 3, fileName: "瑞幸咖啡-被驳回发票.pdf", fileUrl: "./assets/welcome-VFYC1WKN.png", uploadedAt: "2026-09-12 10:05:00" },
  ],
  KP202609110005: [
    { id: 4, fileName: "肯德基-模糊发票截图.png", fileUrl: "./assets/welcome-VFYC1WKN.png", uploadedAt: "2026-09-12 13:50:00" },
  ],
};

const invoiceSubsidies = [
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
    settledAt: "",
    recognitionStatus: 0,
    demoFlow: "开票需求未被供应商处理，进入售后补贴待接单池",
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
    settledAt: "",
    recognitionStatus: 0,
    demoFlow: "供应商已接单，平台可退回待接单",
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
    demoFlow: "供应商上传成功后完成补贴结算",
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
    settledAt: "2026-09-12 20:30:00",
    recognitionStatus: 0,
    demoFlow: "补贴失败，可进入详情查看失败节点",
  },
];

const invoiceSubsidyTimelines = {
  BT202609140001: [
    { claimNo: "QD202609140001", subsidyNo: "BT202609140001", productName: "瑞幸咖啡 29元饮品券", operation: "C端提交开票申请", operatorName: "用户", operationTime: "2026-09-14 09:12:00" },
    { claimNo: "QD202609140001", subsidyNo: "BT202609140001", productName: "瑞幸咖啡 29元饮品券", operation: "生成待接单补贴单", operatorName: "系统", operationTime: "2026-09-14 09:12:03" },
  ],
  BT202609130006: [
    { claimNo: "QD202609130006", subsidyNo: "BT202609130006", productName: "瑞幸咖啡 29元饮品券", operation: "供应商接单", operatorName: "厦门惠生活供应链", operationTime: "2026-09-13 16:05:00" },
    { claimNo: "QD202609130006", subsidyNo: "BT202609130006", productName: "瑞幸咖啡 29元饮品券", operation: "进入处理中倒计时", operatorName: "系统", operationTime: "2026-09-13 16:05:02" },
  ],
  BT202609120003: [
    { claimNo: "QD202609120003", subsidyNo: "BT202609120003", productName: "瑞幸咖啡 29元饮品券", operation: "供应商上传发票", operatorName: "厦门惠生活供应链", operationTime: "2026-09-13 09:22:00" },
    { claimNo: "QD202609120003", subsidyNo: "BT202609120003", productName: "瑞幸咖啡 29元饮品券", operation: "补贴结算完成", operatorName: "系统", operationTime: "2026-09-13 21:22:00" },
  ],
  BT202609110004: [
    { claimNo: "QD202609110004", subsidyNo: "BT202609110004", productName: "肯德基 50元代金券", operation: "供应商上传发票", operatorName: "厦门惠生活供应链", operationTime: "2026-09-12 10:05:00" },
    { claimNo: "QD202609110004", subsidyNo: "BT202609110004", productName: "肯德基 50元代金券", operation: "补贴结算失败", operatorName: "系统", operationTime: "2026-09-12 20:30:00" },
  ],
};

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
      { path: "sort", component: "goods/sort/index", name: "GoodsSort", meta: { title: "商品排序" } },
      { path: "quotation", component: "goods/quotation/index", name: "GoodsQuotation", meta: { title: "供应商报价" } },
      { path: "supplier-goods-mapping", component: "goods/supplier-goods-mapping/index", name: "SupplierGoodsMapping", meta: { title: "供应商商品映射" } },
      { path: "official-product", component: "goods/official-product/index", name: "OfficialProduct", meta: { title: "官方商品同步" } },
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
      { path: "domain-config", component: "ops/domain-config/index", name: "DomainConfig", meta: { title: "域名配置" } },
      { path: "system", component: "ops/system/index", name: "OpsSystem", meta: { title: "运营配置" } },
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
      { path: "account-record", component: "finance/account-record/index", name: "AccountRecord", meta: { title: "账户变动" } },
      { path: "withdrawal-records", component: "finance/withdrawal-records/index", name: "WithdrawalRecords", meta: { title: "提现记录" } },
      { path: "dine-order-report", component: "finance/dine-order-report/index", name: "DineOrderReport", meta: { title: "订单核算报表" } },
    ],
  },
  {
    path: "/coupons",
    component: "Layout",
    alwaysShow: true,
    meta: { title: "营销管理", icon: "documentation" },
    children: [
      { path: "list/ks", component: "coupons/list/ks", name: "KsCoupons", meta: { title: "快手券模板" } },
      { path: "list/dy", component: "coupons/list/dy", name: "DyCoupons", meta: { title: "抖音券模板" } },
      { path: "h5-list", component: "h5/coupons/list/index", name: "H5Coupons", meta: { title: "H5链接券" } },
      { path: "search-coupon-code", component: "h5/search-coupon-code/index", name: "SearchCouponCode", meta: { title: "券码查询" } },
    ],
  },
  {
    path: "/users",
    component: "Layout",
    alwaysShow: true,
    meta: { title: "用户管理", icon: "user" },
    children: [
      { path: "list", component: "users/list/index", name: "UsersList", meta: { title: "小程序用户" } },
      { path: "system-user", component: "system/user/index", name: "SystemUser", meta: { title: "后台用户" } },
      { path: "role", component: "system/role/index", name: "SystemRole", meta: { title: "角色管理" } },
      { path: "menu", component: "system/menu/index", name: "SystemMenu", meta: { title: "菜单管理" } },
    ],
  },
];

function getSupplierRecords(query = {}) {
  const status = Number(query.status);
  let records = suppliers;

  if ([0, 1, 2].includes(status)) {
    records = records.filter((item) => item.status === status);
  }
  if (query.supplierUserId) {
    records = records.filter((item) => String(item.id).includes(String(query.supplierUserId)));
  }
  if (query.supplierName) {
    records = records.filter((item) => item.company.includes(String(query.supplierName)));
  }
  if (query.brandCode) {
    records = records.filter((item) => item.supplierBrandRelaStr.includes(String(query.brandCode)));
  }
  return records;
}

function includeText(value, keyword) {
  if (!keyword) return true;
  return String(value || "").includes(String(keyword));
}

function invoiceTitleTypeName(item = {}) {
  return Number(item.invoiceType) === 0 || item.invoiceTitle === "个人" ? "个人" : "企业";
}

function normalizeSubsidyStatus(item = {}) {
  const settled = Number(item.subsidyStatus) === 2 || Boolean(item.settledAt);
  const invoiceTitles = {
    52001: "厦门晨星信息科技有限公司",
    52002: "上海云朵互动科技有限公司",
    52003: "厦门海岸线文化传媒有限公司",
    52004: "北京蓝鲸企业管理有限公司",
  };
  const invoiceTitle = item.invoiceTitle || invoiceTitles[item.id] || "--";
  return {
    ...item,
    invoiceTitle,
    invoiceType: item.invoiceType ?? (invoiceTitle === "个人" ? 0 : 1),
    userName: invoiceTitle,
    subsidyStatus: settled ? 2 : 0,
    subsidyStatusName: settled ? "已补贴" : "未补贴",
  };
}

function getInvoiceRequirementRecords(query = {}) {
  const status = Number(query.requirementStatus);
  return invoiceRequirements.filter((item) => {
    const statusMatched = Number.isNaN(status) ? true : item.requirementStatus === status;
    return statusMatched
      && includeText(item.itemOrderNo, query.itemOrderNo)
      && includeText(item.requirementNo, query.requirementNo)
      && includeText(item.originalSupplierUserId, query.originalSupplierUserId)
      && includeText(item.invoiceTitle, query.invoiceTitle);
  }).map((item) => ({
    ...item,
    invoiceTitleTypeName: invoiceTitleTypeName(item),
  }));
}

function getInvoiceSubsidyRecords(query = {}) {
  return invoiceSubsidies.filter((item) => {
    return includeText(item.subsidyNo, query.subsidyNo)
      && includeText(item.thirdOrderNo, query.thirdOrderNo)
      && includeText(item.itemOrderNo, query.itemOrderNo)
      && includeText(item.supplierName, query.supplierName);
  }).map(normalizeSubsidyStatus);
}

function getRecordFor(pathname, query = {}) {
  if (pathname.includes("/invoice/requirement/page")) return getInvoiceRequirementRecords(query);
  if (pathname.includes("/invoice/subsidy/page")) return getInvoiceSubsidyRecords(query);
  if (pathname.includes("/supplierUser/page")) return getSupplierRecords(query);
  if (pathname.includes("/goods/goodsPage")) return goods;
  if (pathname.includes("/goods/categoryPage")) return [
    { id: 1, name: "饮品券", brandName: "瑞幸咖啡", icon: "", status: 1, statusStr: "启用", sortNo: 1, createTime: "2026-08-01 10:00:00" },
    { id: 2, name: "代金券", brandName: "肯德基", icon: "", status: 1, statusStr: "启用", sortNo: 2, createTime: "2026-08-01 10:05:00" },
  ];
  if (pathname.includes("/store/page")) return stores;
  if (pathname.includes("/order/orderPage")) return orders;
  if (pathname.includes("/order/orderItemPage") || pathname.includes("/order/orderAcceptPage")) return orders.map((item, index) => ({
    ...item,
    itemOrderNo: `FO20260911000${index + 1}`,
    supplierName: item.supplierCompany,
    readyFoodTypeStr: index === 1 ? "自动出餐" : "人工出餐",
    settleAmount: index === 1 ? "39.80" : "16.50",
    settleStatusStr: index === 1 ? "待结算" : "未结算",
  }));
  if (pathname.includes("/supplierQuotation/page")) return goods.map((item) => ({
    id: item.id,
    brandName: item.brandName,
    goodsName: item.name,
    goodsCode: item.goodsCode,
    cityName: "北京、上海、厦门",
    quotAmount: item.basePrice,
    readyFoodType: 0,
    status: 1,
    statusStr: "启用",
    supplierName: "厦门惠生活供应链有限公司",
  }));
  if (pathname.includes("/supplierUser/backstop/page")) return [
    { id: 1, brandName: "瑞幸咖啡", supplierName: "厦门惠生活供应链有限公司", createTime: "2026-08-01 10:00:00", updateTime: "2026-09-10 11:20:00" },
    { id: 2, brandName: "肯德基", supplierName: "北京优选数字科技有限公司", createTime: "2026-08-05 16:20:00", updateTime: "2026-09-09 15:00:00" },
  ];
  if (pathname.includes("/supplierReferee/page")) return [
    { id: 1, nickName: "张经理", mobile: "138****2255", rewardRate: "1.00%", withdrawRate: "0.60%", status: 1, createTime: "2026-08-15 12:00:00", createByName: "管理员" },
    { id: 2, nickName: "平台运营", mobile: "139****6600", rewardRate: "0.80%", withdrawRate: "0.50%", status: 1, createTime: "2026-08-20 09:30:00", createByName: "管理员" },
  ];
  if (pathname.includes("/supplier/config/list")) return suppliers.map((item) => ({
    id: item.id,
    supplierName: item.company,
    apiName: "SOTO自动出餐",
    timeout: 30,
    status: 1,
  }));
  if (pathname.includes("/goodsSoldOut/page")) return [
    { id: 1, brandName: "麦当劳", cityName: "上海", thirdStoreCode: "MCD-SH-JAS-008", storeName: "静安寺店", goodsCode: "MCD-38", goodsName: "麦当劳 38元套餐券", status: 1, statusStr: "售罄", source: "供应商同步", remark: "库存暂时不足", createTime: "2026-09-10 16:30:00" },
  ];
  if (pathname.includes("/financeTradeRecord") || pathname.includes("/transactionDetails/page") || pathname.includes("/supplierSettleInfo")) return [
    { id: 1, tradeNo: "JL202609110001", transactionNo: "DD202609110002", amount: "39.80", changeAmount: "39.80", balance: "2680.50", typeName: "订单结算", direction: "收入", status: 1, createTime: "2026-09-11 03:00:00", supplierName: "北京优选数字科技有限公司", remark: "订单结算入账" },
    { id: 2, tradeNo: "TX202609100006", transactionNo: "TX202609100006", amount: "-500.00", changeAmount: "-500.00", balance: "2640.70", typeName: "供应商提现", direction: "支出", status: 1, createTime: "2026-09-10 15:00:00", supplierName: "厦门惠生活供应链有限公司", remark: "提现至招商银行" },
  ];
  if (pathname.includes("/withdrawRecord/page")) return [
    { id: 1, withdrawNo: "TX202609100006", supplierName: "厦门惠生活供应链有限公司", status: 2, statusStr: "提现成功", amount: "500.00", fee: "0.00", arriveAmount: "500.00", bankName: "招商银行", receiverName: "厦门惠生活供应链", receiverAccount: "尾号6208", createTime: "2026-09-10 15:00:00", completeTime: "2026-09-10 15:01:22" },
  ];
  if (pathname.includes("/coupon/template/page") || pathname.includes("/coupon/template/code/page") || pathname.includes("/coupon/template")) return [
    { id: 1, code: "TPL-LK-001", templateCode: "TPL-LK-001", name: "瑞幸咖啡兑换券", templateName: "瑞幸咖啡兑换券", brandName: "瑞幸咖啡", faceValue: "29.00", status: 1, statusStr: "启用", createTime: "2026-09-01 10:00:00" },
    { id: 2, code: "TPL-KFC-001", templateCode: "TPL-KFC-001", name: "肯德基代金券", templateName: "肯德基代金券", brandName: "肯德基", faceValue: "50.00", status: 1, statusStr: "启用", createTime: "2026-09-02 11:20:00" },
  ];
  if (pathname.includes("/export-task/page-list")) return page(commonPage);
  return page(commonPage);
}

function handleApi(req, res, pathname, body = {}) {
  if (pathname === "/nezha-base-grant/oauth/token") {
    return sendJson(res, ok({ accessToken: "soto-local-token", refreshToken: "soto-local-refresh-token", expiresIn: 86400 }));
  }
  if (pathname === "/nezha-base-grant/oauth/logout") return sendJson(res, ok(true));
  if (pathname === "/dine-admin-service/getInfo") {
    return sendJson(res, ok({
      user: { userId: 1, userName: "admin", nickName: "一级供应商运营管理员", avatar: "", detail: { supplierName: "平台供应链中心", cooperationMode: 0 } },
      roles: ["admin"],
      permissions: ["*:*:*"],
    }));
  }
  if (pathname === "/dine-admin-service/getRouters") return sendJson(res, ok(menu));
  if (pathname.includes("/brand/brandList") || pathname.includes("listBrand")) return sendJson(res, ok(brands));
  if (pathname.includes("queryCity") || pathname.includes("/city/search")) return sendJson(res, ok(cities));
  if (pathname.includes("/supplierUser/count")) {
    return sendJson(res, ok({
      wait: suppliers.filter((item) => item.status === 2).length,
      doing: suppliers.filter((item) => item.status === 1).length,
      stop: suppliers.filter((item) => item.status === 0).length,
      total: suppliers.length,
    }));
  }
  if (pathname.includes("/goods/") && (pathname.includes("/detail") || pathname.includes("manageDetail"))) return sendJson(res, ok(goods[0]));
  if (pathname.includes("/store/detail") || pathname.includes("/store/verify/detail")) return sendJson(res, ok(stores[0]));
  if (pathname.includes("/supplierUser/detail")) return sendJson(res, ok(suppliers[0]));
  if (pathname.includes("getSysConfig") || pathname.includes("config")) return sendJson(res, ok({ supplierName: "点餐平台供应链中心", domain: "local.soto.prototype", customerServicePhone: "400-000-0000" }));
  if (pathname.includes("getBankList")) return sendJson(res, ok([{ bankName: "招商银行", shortName: "CMB" }, { bankName: "中国工商银行", shortName: "ICBC" }]));
  if (pathname.includes("/dine-channel-service/api/channel/shop/list") || pathname.includes("shop-options")) return sendJson(res, ok([{ id: 1, shopName: "惠生活商城" }, { id: 2, shopName: "海尼商城" }]));
  if (pathname.includes("export") || pathname.includes("createExportTask")) return sendJson(res, "本地原型导出演示", "application/vnd.ms-excel; charset=utf-8");
  if (pathname.includes("/dine-invoice-service/admin/invoice/requirement/page")) {
    return sendJson(res, page(getInvoiceRequirementRecords(body)));
  }
  if (pathname.includes("/dine-invoice-service/admin/invoice/requirement/detail")) {
    return sendJson(res, ok({ files: invoiceRequirementFiles[body.requirementNo] || [] }));
  }
  if (pathname.includes("/dine-invoice-service/admin/invoice/subsidy/page")) {
    return sendJson(res, page(getInvoiceSubsidyRecords(body)));
  }
  if (pathname.includes("/dine-invoice-service/admin/invoice/subsidy/operationTimeline")) {
    return sendJson(res, ok(invoiceSubsidyTimelines[body.subsidyNo] || []));
  }
  if (pathname.includes("/dine-invoice-service/admin/invoice/subsidy/returnWaiting")) {
    return sendJson(res, success("已退回待接单"));
  }
  if (pathname.includes("/dine-invoice-service/admin/invoice/subsidy/returnCustomerWorkbench")) {
    return sendJson(res, success("已退回客服工作台"));
  }
  if (pathname.includes("/dine-invoice-service/admin/invoice/subsidy/updateAmount")) {
    return sendJson(res, success("补贴金额修改成功"));
  }
  if (pathname.includes("/dine-admin-service/")) {
    if (pathname.includes("/page") || pathname.includes("/list")) {
      const data = getRecordFor(pathname, body);
      return sendJson(res, Array.isArray(data) ? page(data) : data);
    }
    return sendJson(res, success());
  }
  if (pathname.includes("/nezha-") || pathname.includes("/system/")) return sendJson(res, page(commonPage));
  return sendJson(res, success());
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

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  if (req.method === "OPTIONS") return sendJson(res, ok(true));
  if (url.pathname.startsWith("/dine-") || url.pathname.startsWith("/nezha-") || url.pathname.startsWith("/system/")) {
    const body = req.method === "POST" ? await bodyOf(req) : {};
    return handleApi(req, res, url.pathname, body);
  }
  return serveFile(res, url.pathname);
}).listen(port, "127.0.0.1", () => {
  console.log(`一级供应商后台管理系统本地原型：http://127.0.0.1:${port}/`);
});

