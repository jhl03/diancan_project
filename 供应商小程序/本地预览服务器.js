const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { URL } = require('node:url')

const root = __dirname
const port = Number(process.env.PORT || 8776)

function demoDeadline(days, hour, minute) {
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + days)
  deadline.setHours(hour, minute, 0, 0)
  return deadline.toISOString().slice(0, 19).replace('T', ' ')
}

const state = {
  quotation: [
    {
      id: 1001,
      quotName: '瑞幸咖啡常规报价',
      switchStatus: 1,
      brandCode: 'LK',
      brandCodeStr: '瑞幸咖啡',
      goodsNameStr: '生椰拿铁、厚乳拿铁、丝绒拿铁',
      cityName: '北京、上海、厦门',
      createTime: '2026-09-08 10:20:00',
      updateTime: '2026-09-12 16:45:00',
      quotAmount: 18.5,
      readyFoodType: 0,
      company: '惠生活供应链有限公司',
    },
    {
      id: 1002,
      quotName: '瑞幸咖啡节日套餐',
      switchStatus: 0,
      brandCode: 'LK',
      brandCodeStr: '瑞幸咖啡',
      goodsNameStr: '9.9 元早餐套餐、双杯套餐',
      cityName: '全国可出餐',
      createTime: '2026-09-02 14:10:00',
      updateTime: '2026-09-10 11:25:00',
      quotAmount: 9.9,
      readyFoodType: 2,
      company: '惠生活供应链有限公司',
    },
    {
      id: 1003,
      quotName: '品牌券自动发货规则',
      switchStatus: 1,
      brandCode: 'LK',
      brandCodeStr: '瑞幸咖啡',
      goodsNameStr: '咖啡兑换券、早餐券',
      cityName: '-',
      createTime: '2026-08-28 09:05:00',
      updateTime: '-',
      quotAmount: 12,
      readyFoodType: 3,
      company: '惠生活供应链有限公司',
    },
  ],
  orders: [
    {
      id: 3001,
      brandName: '瑞幸咖啡',
      city: '厦门市',
      store: '厦门集美银江路店',
      supplierStatusStr: '待出餐',
      supplierStatus: 0,
      productName: '生椰拿铁 1 杯',
      buyerPrice: '18.50',
      outTradeNo: 'HL202609140001',
      createTime: '2026-09-14 09:18:22',
      latestReadyTime: '2026-09-14 09:28:22',
      readyFoodType: 0,
    },
    {
      id: 3002,
      brandName: '瑞幸咖啡',
      city: '北京市',
      store: '北京望京SOHO店',
      supplierStatusStr: '人工出餐',
      supplierStatus: 15,
      productName: '厚乳拿铁 2 杯',
      buyerPrice: '36.00',
      outTradeNo: 'HL202609140002',
      createTime: '2026-09-14 08:52:10',
      latestReadyTime: '2026-09-14 09:02:10',
      readyFoodType: 0,
    },
    {
      id: 3003,
      brandName: '瑞幸咖啡',
      city: '上海市',
      store: '上海陆家嘴中心店',
      supplierStatusStr: '已完成',
      supplierStatus: 30,
      productName: '丝绒拿铁 1 杯',
      buyerPrice: '16.80',
      outTradeNo: 'HL202609130018',
      createTime: '2026-09-13 18:33:08',
      latestReadyTime: '',
      readyFoodType: 0,
    },
  ],
  accounts: [
    {
      id: 5001,
      mobile: '138****8666',
      brandName: '瑞幸咖啡',
      status: 1,
      statusStr: '已启用',
      cityName: '北京、上海、厦门',
      dailyNumLimit: 80,
      couponNum: 1268,
    },
    {
      id: 5002,
      mobile: '139****5221',
      brandName: '瑞幸咖啡',
      status: 0,
      statusStr: '已禁用',
      cityName: '厦门市',
      dailyNumLimit: 50,
      couponNum: 624,
    },
  ],
  withdrawRecords: [
    {
      id: 8001,
      amount: '1280.00',
      status: 1,
      statusStr: '提现成功',
      createTime: '2026-09-12 15:20:00',
      accountName: '招商银行',
    },
    {
      id: 8002,
      amount: '860.00',
      status: 0,
      statusStr: '审核中',
      createTime: '2026-09-14 10:05:00',
      accountName: '招商银行',
    },
  ],
  invoice: {
    compensation: [
      {
        id: 9101,
        claimNo: 'CLM202609140001',
        subsidyNo: 'SUB202609140001',
        brandCode: 'LK',
        brandName: '瑞幸咖啡',
        storeCity: '北京',
        createTime: '2026-09-14 09:18:00',
        productName: '瑞幸咖啡 29元饮品券',
        userPayAmount: 22.8,
        subsidyAmount: 3.2,
        invoiceTitle: '瑞幸咖啡（中国）有限公司',
        taxpayerNo: '91110108MA01DEMO01',
      },
      {
        id: 9102,
        claimNo: 'CLM202609140002',
        subsidyNo: 'SUB202609140002',
        brandCode: 'KFC',
        brandName: '肯德基',
        storeCity: '厦门',
        createTime: '2026-09-14 08:42:00',
        productName: '肯德基 50元代金券',
        userPayAmount: 46.9,
        subsidyAmount: 5.6,
        invoiceTitle: '厦门肯德基有限公司',
        taxpayerNo: '91350200MA01DEMO02',
      },
      {
        id: 9103,
        claimNo: 'CLM202609140003',
        subsidyNo: 'SUB202609140003',
        brandCode: 'MCD',
        brandName: '麦当劳',
        storeCity: '上海',
        createTime: '2026-09-14 07:55:00',
        productName: '麦当劳 38元套餐券',
        userPayAmount: 34.8,
        subsidyAmount: 4.2,
        invoiceTitle: '金拱门（中国）有限公司',
        taxpayerNo: '91110000MA01DEMO03',
      },
      {
        id: 9104,
        claimNo: 'CLM202609140004',
        subsidyNo: 'SUB202609140004',
        brandCode: 'LK',
        brandName: '瑞幸咖啡',
        storeCity: '厦门',
        createTime: '2026-09-13 16:20:00',
        productName: '瑞幸咖啡 38元套餐券',
        userPayAmount: 26.6,
        subsidyAmount: 2.8,
        invoiceTitle: '瑞幸咖啡（中国）有限公司',
        taxpayerNo: '91110108MA01DEMO01',
      },
    ],
    subsidy: [
      {
        id: 9201,
        claimNo: 'CLM202609140101',
        subsidyNo: 'SUB202609140101',
        itemOrderNo: 'FO202609140101',
        brandCode: 'LK',
        brandName: '瑞幸咖啡',
        storeCity: '北京',
        productName: '生椰拿铁 1 杯',
        userPayAmount: 18.5,
        subsidyAmount: 2.6,
        invoiceTitle: '瑞幸咖啡（中国）有限公司',
        taxpayerNo: '91110108MA01DEMO01',
        deadlineAt: demoDeadline(1, 18, 0),
        orderTime: '2026-09-14 09:05:00',
        latestUploadedAt: '',
        rejectReasonMessage: '',
        invoiceFileCount: 0,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: 'PROCESSING',
      },
      {
        id: 9202,
        claimNo: 'CLM202609140102',
        subsidyNo: 'SUB202609140102',
        itemOrderNo: 'FO202609140102',
        brandCode: 'KFC',
        brandName: '肯德基',
        storeCity: '厦门',
        productName: '肯德基 50元代金券',
        userPayAmount: 42.9,
        subsidyAmount: 4.8,
        invoiceTitle: '厦门肯德基有限公司',
        taxpayerNo: '91350200MA01DEMO02',
        deadlineAt: demoDeadline(2, 12, 0),
        orderTime: '2026-09-14 08:35:00',
        latestUploadedAt: '',
        rejectReasonMessage: '',
        invoiceFileCount: 0,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: 'PROCESSING',
      },
      {
        id: 9207,
        claimNo: 'CLM202609150103',
        subsidyNo: 'SUB202609150103',
        itemOrderNo: 'FO202609150103',
        brandCode: 'LK',
        brandName: '瑞幸咖啡',
        storeCity: '上海',
        productName: '瑞幸咖啡 厚乳拿铁 2 杯',
        userPayAmount: 35.8,
        subsidyAmount: 4.2,
        invoiceTitle: '瑞幸咖啡（中国）有限公司',
        taxpayerNo: '91110108MA01DEMO01',
        deadlineAt: demoDeadline(1, 18, 30),
        orderTime: '2026-09-15 09:15:00',
        latestUploadedAt: '',
        rejectReasonMessage: '',
        invoiceFileCount: 0,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: 'PROCESSING',
      },
      {
        id: 9208,
        claimNo: 'CLM202609150104',
        subsidyNo: 'SUB202609150104',
        itemOrderNo: 'FO202609150104',
        brandCode: 'MCD',
        brandName: '麦当劳',
        storeCity: '上海',
        productName: '麦当劳 早餐双人券',
        userPayAmount: 29.9,
        subsidyAmount: 3.5,
        invoiceTitle: '金拱门（中国）有限公司',
        taxpayerNo: '91110000MA01DEMO03',
        deadlineAt: demoDeadline(2, 10, 0),
        orderTime: '2026-09-15 10:20:00',
        latestUploadedAt: '',
        rejectReasonMessage: '',
        invoiceFileCount: 0,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: 'PROCESSING',
      },
      {
        id: 9209,
        claimNo: 'CLM202609150105',
        subsidyNo: 'SUB202609150105',
        itemOrderNo: 'FO202609150105',
        brandCode: 'KFC',
        brandName: '肯德基',
        storeCity: '北京',
        productName: '肯德基 38元套餐券',
        userPayAmount: 31.9,
        subsidyAmount: 3.9,
        invoiceTitle: '厦门肯德基有限公司',
        taxpayerNo: '91350200MA01DEMO02',
        deadlineAt: demoDeadline(2, 15, 20),
        orderTime: '2026-09-15 11:05:00',
        latestUploadedAt: '',
        rejectReasonMessage: '',
        invoiceFileCount: 0,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: 'PROCESSING',
      },
      {
        id: 9203,
        claimNo: 'CLM202609130201',
        subsidyNo: 'SUB202609130201',
        itemOrderNo: 'FO202609130201',
        brandCode: 'MCD',
        brandName: '麦当劳',
        storeCity: '上海',
        productName: '麦当劳 38元套餐券',
        userPayAmount: 34.8,
        subsidyAmount: 4.1,
        invoiceTitle: '金拱门（中国）有限公司',
        taxpayerNo: '91110000MA01DEMO03',
        deadlineAt: '',
        orderTime: '2026-09-13 17:20:00',
        latestUploadedAt: '2026-09-14 10:15:00',
        rejectReasonMessage: '发票金额与申请开票金额不一致，请重新上传。',
        invoiceFileCount: 1,
        currentUploadBatchNo: null,
        subsidyStatus: 0,
        tab: 'REJECTED',
      },
      {
        id: 9204,
        claimNo: 'CLM202609130202',
        subsidyNo: 'SUB202609130202',
        itemOrderNo: 'FO202609130202',
        brandCode: 'LK',
        brandName: '瑞幸咖啡',
        storeCity: '厦门',
        productName: '厚乳拿铁 2 杯',
        userPayAmount: 36,
        subsidyAmount: 3.8,
        invoiceTitle: '瑞幸咖啡（中国）有限公司',
        taxpayerNo: '91110108MA01DEMO01',
        deadlineAt: '',
        orderTime: '2026-09-13 15:42:00',
        latestUploadedAt: '2026-09-14 09:32:00',
        rejectReasonMessage: '请使用品牌官方开票主体重新上传。',
        invoiceFileCount: 1,
        currentUploadBatchNo: 'UP202609140204',
        subsidyStatus: 0,
        tab: 'REJECTED',
      },
      {
        id: 9205,
        claimNo: 'CLM202609120301',
        subsidyNo: 'SUB202609120301',
        itemOrderNo: 'FO202609120301',
        brandCode: 'KFC',
        brandName: '肯德基',
        storeCity: '北京',
        productName: '肯德基早餐套餐',
        userPayAmount: 25.9,
        subsidyAmount: 2.9,
        invoiceTitle: '厦门肯德基有限公司',
        taxpayerNo: '91350200MA01DEMO02',
        deadlineAt: '',
        orderTime: '2026-09-12 09:12:00',
        latestUploadedAt: '2026-09-12 11:08:00',
        rejectReasonMessage: '',
        invoiceFileCount: 1,
        currentUploadBatchNo: null,
        subsidyStatus: 2,
        tab: 'UPLOADED',
      },
      {
        id: 9206,
        claimNo: 'CLM202609120302',
        subsidyNo: 'SUB202609120302',
        itemOrderNo: 'FO202609120302',
        brandCode: 'MCD',
        brandName: '麦当劳',
        storeCity: '上海',
        productName: '麦当劳 双人套餐',
        userPayAmount: 49.9,
        subsidyAmount: 5.2,
        invoiceTitle: '金拱门（中国）有限公司',
        taxpayerNo: '91110000MA01DEMO03',
        deadlineAt: '',
        orderTime: '2026-09-12 12:26:00',
        latestUploadedAt: '2026-09-12 13:40:00',
        rejectReasonMessage: '',
        invoiceFileCount: 2,
        currentUploadBatchNo: null,
        subsidyStatus: 1,
        tab: 'UPLOADED',
      },
    ],
  },
}

const ok = (data = null, msg = 'success') => ({ code: 200, msg, data })
const page = (records, total = records.length) => ({ records, total })

function bodyOf(req) {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 1024 * 1024) req.destroy()
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        resolve({})
      }
    })
  })
}

function filterRecords(records, query, keys) {
  return records.filter((item) =>
    keys.every((key) => {
      const value = query[key]
      return !value || String(item[key] || '').includes(String(value))
    }),
  )
}

function filterInvoiceRecords(records, query = {}, tab = '') {
  return records.filter((item) => {
    if (tab && item.tab !== tab) return false
    if (query.brandCode && item.brandCode !== query.brandCode) return false
    if (query.subsidyNo && !String(item.subsidyNo).includes(String(query.subsidyNo))) return false
    if (query.itemOrderNo && !String(item.itemOrderNo || '').includes(String(query.itemOrderNo))) return false
    if (query.invoiceTitle && !String(item.invoiceTitle || '').includes(String(query.invoiceTitle))) return false

    const userPayAmount = Number(item.userPayAmount)
    const subsidyAmount = Number(item.subsidyAmount)
    if (query.userPayAmountMin !== undefined && query.userPayAmountMin !== '' && userPayAmount < Number(query.userPayAmountMin)) return false
    if (query.userPayAmountMax !== undefined && query.userPayAmountMax !== '' && userPayAmount > Number(query.userPayAmountMax)) return false
    if (query.subsidyAmountMin !== undefined && query.subsidyAmountMin !== '' && subsidyAmount < Number(query.subsidyAmountMin)) return false
    if (query.subsidyAmountMax !== undefined && query.subsidyAmountMax !== '' && subsidyAmount > Number(query.subsidyAmountMax)) return false
    return true
  }).map((item) => {
    const invoiceTitle = item.invoiceTitle || '--'
    return {
      ...item,
      invoiceTitle,
      invoiceType: item.invoiceType ?? (invoiceTitle === '个人' ? 0 : 1),
      invoiceTitleTypeName: invoiceTitle === '个人' ? '个人' : '企业',
      userName: invoiceTitle,
    }
  })
}

function apiResponse(pathname, query, body) {
  if (pathname === '/nezha-base-grant/oauth/token') {
    return ok({
      accessToken: 'prototype-token',
      user: {
        id: 'supplier-demo-001',
        nickName: '演示供应商',
        phone: '13800138000',
        stUid: 'st-demo-001',
        cooperationMode: 0,
        domain: 'https://prototype.local',
      },
    })
  }
  if (pathname.endsWith('/supplierUser/cooperationMode')) {
    return ok({ cooperationMode: 0, domain: 'https://prototype.local' })
  }
  if (pathname.endsWith('/bizConfig/getSysConfig')) {
    return ok({
      withdraw_fee_referee_config: { value: '0' },
      withdraw_amount_threshold: { value: '100' },
      withdraw_fee_lower_than_threshold: { value: '0' },
      withdraw_fee_higher_than_threshold: { value: '0' },
    })
  }
  if (pathname.endsWith('/supplierUser/listBrand')) {
    return ok([
      { brandCode: 'LK', brandName: '瑞幸咖啡' },
      { brandCode: 'KFC', brandName: '肯德基' },
    ])
  }
  if (pathname.endsWith('/supplierUser/listBrandBySupplier')) {
    return ok([
      { brandCode: 'LK', brandName: '瑞幸咖啡' },
      { brandCode: 'KFC', brandName: '肯德基' },
    ])
  }
  if (pathname.endsWith('/invoice/lobby/brands')) {
    return ok([
      { brandCode: 'LK', brandName: '瑞幸咖啡' },
      { brandCode: 'KFC', brandName: '肯德基' },
      { brandCode: 'MCD', brandName: '麦当劳' },
    ])
  }
  if (pathname.endsWith('/invoice/lobby/page')) {
    return ok(page(filterInvoiceRecords(state.invoice.compensation, body)))
  }
  if (pathname.endsWith('/invoice/subsidy/page')) {
    return ok(page(filterInvoiceRecords(state.invoice.subsidy, body, body.tab)))
  }
  if (pathname.endsWith('/invoice/subsidy/detail')) {
    return ok(state.invoice.subsidy.find((item) => item.claimNo === body.claimNo) || state.invoice.subsidy[0])
  }
  if (pathname.endsWith('/invoice/subsidy/download')) {
    return ok([
      {
        fileName: `发票示例-${body.claimNo}.pdf`,
        fileUrl: `https://example.com/invoice/${body.claimNo}.pdf`,
        uploadedAt: '2026-09-14 10:15:00',
      },
    ])
  }
  if (pathname.endsWith('/invoice/subsidy/claim')) {
    return ok({ claimNo: body.claimNo, success: true, deadlineAt: '2026-09-15 18:00:00' })
  }
  if (pathname.endsWith('/invoice/subsidy/batchClaimByFilter')) {
    return ok({ requestId: 'REQ202609140001', totalCount: 2, successCount: 2, failureCount: 0 })
  }
  if (pathname.endsWith('/invoice/subsidy/extend') || pathname.endsWith('/invoice/subsidy/abandon') || pathname.endsWith('/invoice/subsidy/uploadConfirm')) {
    return ok()
  }
  if (pathname.endsWith('/supplier/order/supplier/order/page')) {
    const tab = Number(body.supplierStatusTab || 1)
    const queryText = body.orderNoItem || ''
    let records = filterRecords(state.orders, { outTradeNo: queryText }, [
      'outTradeNo',
    ])
    if (tab === 1) records = records.filter((item) => item.supplierStatus !== 30)
    if (tab === 2) records = records.filter((item) => item.supplierStatus === 30)
    return ok(page(records))
  }
  if (pathname.endsWith('/supplier/order/supplier/order/detail')) {
    return ok(state.orders.find((item) => String(item.id) === String(query.id)) || state.orders[0])
  }
  if (pathname.endsWith('/supplier/order/supplier/order/ready')) {
    const item = state.orders.find((order) => String(order.id) === String(body.id))
    if (item) {
      item.supplierStatus = 30
      item.supplierStatusStr = '已完成'
      item.latestReadyTime = ''
    }
    return ok()
  }
  if (pathname.endsWith('/supplier/order/manul/order/cancel')) return ok()
  if (pathname.endsWith('/supplierQuotation/client/supplier/quotation/page')) {
    const records = filterRecords(state.quotation, body, [
      'goodsNameStr',
      'quotName',
      'brandCodeStr',
    ])
    return ok(page(records))
  }
  if (pathname.endsWith('/supplierQuotation/client/supplier/quotation/detail')) {
    return ok({
      quotationId: query.quotationId || 1001,
      brandCode: 'LK',
      brandCodeStr: '瑞幸咖啡',
      quotName: '瑞幸咖啡常规报价',
      quotAmount: 18.5,
      readyFoodType: 0,
      comboFlag: 0,
      comboNum: '',
      goodsList: [
        { id: 6101, name: '生椰拿铁', minMarketAmount: 18, limitPrice: 18.5 },
        { id: 6102, name: '厚乳拿铁', minMarketAmount: 20, limitPrice: 19.9 },
      ],
      cityList: [],
    })
  }
  if (pathname.endsWith('/supplierQuotation/client/supplier/quotation/switchStatus')) {
    const item = state.quotation.find(
      (rule) => String(rule.id) === String(body.quotationId),
    )
    if (item) item.switchStatus = Number(body.switchStatus)
    return ok()
  }
  if (pathname.endsWith('/supplierQuotation/client/supplier/quotation/del')) {
    state.quotation = state.quotation.filter((rule) => String(rule.id) !== String(query.id))
    return ok()
  }
  if (pathname.endsWith('/supplierQuotation/client/supplier/quotation/add') || pathname.endsWith('/supplierQuotation/client/supplier/quotation/edit')) {
    const item = {
      id: body.quotationId || Date.now(),
      quotName: body.quotName || '新报价规则',
      switchStatus: 1,
      brandCode: body.brandCode || 'LK',
      brandCodeStr: body.brandCodeStr || '瑞幸咖啡',
      goodsNameStr: '演示商品',
      cityName: '北京、上海、厦门',
      createTime: '2026-09-14 14:00:00',
      updateTime: '2026-09-14 14:00:00',
      quotAmount: body.quotAmount || 10,
      readyFoodType: body.readyFoodType || 0,
      company: '惠生活供应链有限公司',
    }
    const index = state.quotation.findIndex((rule) => rule.id === item.id)
    if (index >= 0) state.quotation[index] = { ...state.quotation[index], ...item }
    else state.quotation.unshift(item)
    return ok()
  }
  if (pathname.endsWith('/supplierCoupon/getGoodsInfoList')) {
    return ok(
      page([
        { id: 6101, name: '生椰拿铁', minMarketAmount: 18, limitPrice: 18.5 },
        { id: 6102, name: '厚乳拿铁', minMarketAmount: 20, limitPrice: 19.9 },
        { id: 6103, name: '丝绒拿铁', minMarketAmount: 21, limitPrice: 20.5 },
      ]),
    )
  }
  if (pathname.endsWith('/linkProviderConfig/listCanUse')) {
    return ok([{ id: 1, apiName: '喜乐自动发货平台', name: '喜乐自动发货平台' }])
  }
  if (pathname.endsWith('/supplierCoupon/hasEnableCoupon')) return ok(true)
  if (pathname.endsWith('/supplierWithdrawRecord/getAccount')) {
    return ok({ totalAmount: '12860.00', enableAmount: '10420.00', freezeAmount: '2440.00' })
  }
  if (pathname.endsWith('/supplierWithdrawRecord/page')) return ok(page(state.withdrawRecords))
  if (pathname.endsWith('/supplierBankCardInfo/getList')) {
    return ok([{ id: 1, bankName: '招商银行', cardNo: '**** 8899', userName: '演示供应商' }])
  }
  if (pathname.endsWith('/supplierBankCardInfo/getBankList')) {
    return ok([{ value: 'CMB', label: '招商银行' }, { value: 'ICBC', label: '中国工商银行' }])
  }
  if (pathname.endsWith('/thirdPlatUser/pageUser')) return ok(page(state.accounts))
  if (pathname.endsWith('/thirdPlatUser/queryCity')) {
    return ok([{ id: '110000', name: '北京市' }, { id: '310000', name: '上海市' }, { id: '350200', name: '厦门市' }])
  }
  if (pathname.endsWith('/thirdPlatUser/login')) return ok({ url: 'https://prototype.local/login' })
  if (pathname.endsWith('/thirdPlatUser/add')) return ok()
  if (pathname.endsWith('/thirdPlatUser/updateCoupon')) return ok()
  if (pathname.endsWith('/thirdPlatUser/enableUser') || pathname.endsWith('/thirdPlatUser/disableUser')) return ok()
  if (pathname.endsWith('/thirdPlatUser/updateCity') || pathname.endsWith('/thirdPlatUser/updateDailyNumLimit')) return ok()
  if (pathname.endsWith('/supplier/config/query')) return ok({ dailyNumLimit: 80 })
  if (pathname.endsWith('/linkProviderConfig/listApiTypes')) return ok([])
  if (pathname.endsWith('/linkProviderConfig/page')) return ok(page([]))
  if (pathname.endsWith('/supplierUser/second/count')) return ok({ total: 12, enabled: 9, disabled: 3 })
  if (pathname.endsWith('/supplierUser/second/page')) return ok(page([]))
  if (pathname.endsWith('/supplierUser/second/list')) return ok([])
  if (pathname.endsWith('/supplierSettleInfo/second/settleInfo/page')) return ok(page([]))
  if (pathname.endsWith('/supplierWithdrawRecord/second/page')) return ok(page([]))
  if (pathname.endsWith('/order/orderAcceptPage')) return ok(page([]))
  if (pathname.endsWith('/linkTemplate/page') || pathname.endsWith('/linkDetail/page')) return ok(page([]))
  if (pathname.endsWith('/linkTemplate/platformList')) return ok(['喜乐平台', '瑞幸平台'])
  if (pathname.endsWith('/linkTemplate/listCanUse')) return ok([])
  if (pathname.endsWith('/supplier-admin/config/listTypes')) return ok([])
  if (pathname.endsWith('/supplier-admin/config/list')) return ok([])
  return ok({})
}

function mime(file) {
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.ico': 'image/x-icon',
  }[path.extname(file).toLowerCase()] || 'application/octet-stream'
}

function sendJson(res, data) {
  const output = JSON.stringify(data)
  res.writeHead(200, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  })
  res.end(output)
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`)
  const pathname = requestUrl.pathname
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': '*' })
    res.end()
    return
  }
  if (pathname.startsWith('/dine-') || pathname.startsWith('/nezha-') || pathname.startsWith('/ticket/')) {
    const body = req.method === 'POST' ? await bodyOf(req) : {}
    sendJson(res, apiResponse(pathname, Object.fromEntries(requestUrl.searchParams), body))
    return
  }
  let file = decodeURIComponent(pathname === '/' ? '/index.html' : pathname)
  if (file.includes('..')) {
    res.writeHead(400)
    res.end('Bad request')
    return
  }
  let filePath = path.join(root, file)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) filePath = path.join(root, 'index.html')
  res.writeHead(200, { 'content-type': mime(filePath), 'cache-control': 'no-cache' })
  fs.createReadStream(filePath).pipe(res)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`供应商小程序本地原型已启动：http://127.0.0.1:${port}/`)
})
