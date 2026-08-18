
(function () {
  function buildSupplierAfterSaleCleanPage() {
    var page = document.querySelector('.bundle-page[data-page="supplier-after-sale"]');
    if (!page) return;
    if (page.getAttribute("data-supplier-clean-built") === "v17") return;
    page.setAttribute("data-supplier-clean-built", "v17");
    try {
      localStorage.removeItem("codex_proto_edit::" + location.pathname.replace(/\//g, "::"));
    } catch (error) {}
    var supplierStateImageUrl = "./供应商端状态机.png";

    if (!document.getElementById("supplier-after-sale-clean-style")) {
      var style = document.createElement("style");
      style.id = "supplier-after-sale-clean-style";
      style.textContent = [
        ".sa-clean-shell{padding:6px 28px 40px!important;box-sizing:border-box;}",
        ".bundle-page[data-page=\"supplier-after-sale\"] .sa-clean-shell>.page-header{display:none!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;}",
        ".sa-clean-wrap{position:relative;z-index:2;background:#fff;border:1px solid #dbe5f0;border-radius:24px;box-shadow:0 10px 24px rgba(15,23,42,.06);padding:20px 24px 24px;box-sizing:border-box;}",
        ".sa-clean-tabs{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px;}",
        ".sa-clean-tab{min-width:96px;height:52px;padding:0 18px;border-radius:999px;border:1px solid #c9d5e6;background:#fff;color:#0f172a;font:700 18px/1 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;cursor:pointer;position:relative;z-index:3;pointer-events:auto;}",
        ".sa-clean-tab.is-active{background:#153d74;color:#fff;border-color:#153d74;box-shadow:0 10px 18px rgba(21,61,116,.18);}",
        ".sa-clean-panel{display:none;position:relative;z-index:2;}",
        ".sa-clean-panel.is-active{display:block;}",
        ".sa-clean-tip{border:1px solid #dbe5f0;border-radius:20px;background:#fff;padding:18px 22px;margin-bottom:18px;}",
        ".sa-clean-tip ul{margin:0;padding-left:20px;color:#1f3b6d;font:700 16px/1.9 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-filter,.sa-clean-desc{position:relative;z-index:2;border:1px solid #dbe5f0;border-radius:20px;background:#fff;padding:18px 20px;margin-bottom:18px;box-sizing:border-box;}",
        ".sa-clean-desc{position:relative;}",
        ".sa-clean-desc.has-state-image{padding-right:20px;min-height:0;}",
        ".sa-clean-section-title{margin:0 0 14px;color:#173058;font:800 22px/1.2 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;}",
        ".sa-clean-field{border:1px solid #dbe5f0;border-radius:16px;background:#f8fbff;padding:14px 16px;min-height:86px;box-sizing:border-box;}",
        ".sa-clean-label{margin:0 0 12px;color:#4b607d;font:600 15px/1.2 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-input{height:48px;border:1px solid #d9e3f1;border-radius:14px;background:#fff;}",
        ".sa-clean-actions{display:flex;gap:12px;justify-content:flex-end;margin-top:14px;}",
        ".sa-clean-btn{min-width:108px;height:40px;padding:0 16px;border-radius:999px;border:1px solid #bfd3ff;background:#fff;color:#1d4ed8;font:700 14px/1 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;cursor:pointer;position:relative;z-index:3;pointer-events:auto;}",
        ".sa-clean-btn.is-primary{background:#1d4ed8;border-color:#1d4ed8;color:#fff;}",
        ".sa-clean-table-card{position:relative;z-index:2;border:1px solid #dbe5f0;border-radius:20px;background:#fff;padding:18px 20px;box-sizing:border-box;overflow:hidden;}",
        ".sa-clean-table-wrap{overflow-x:auto;}",
        ".sa-clean-table{width:100%;min-width:1550px;border-collapse:collapse;}",
        ".sa-clean-table th,.sa-clean-table td{border:1px solid #dbe5f0;padding:14px 12px;vertical-align:top;text-align:left;background:#fff;color:#0f172a;font:600 14px/1.5 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-table th{background:#f8fbff;color:#173058;font-size:15px;}",
        ".sa-clean-table tr.sa-clean-desc-row td{color:#d92d20;font-weight:500;line-height:1.55;}",
        ".sa-clean-op{color:#1d4ed8;font-weight:700;}",
        ".sa-clean-op-group{display:flex;gap:10px;flex-wrap:wrap;}",
        ".sa-clean-op-group.is-vertical{flex-direction:column;align-items:flex-start;}",
        ".sa-clean-op-btn{min-width:76px;height:34px;padding:0 14px;border-radius:999px;border:1px solid #bfd3ff;background:#fff;color:#1d4ed8;font:700 14px/1 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;cursor:pointer;position:relative;z-index:3;pointer-events:auto;}",
        ".sa-clean-op-btn.is-primary{background:#1d4ed8;border-color:#1d4ed8;color:#fff;}",
        ".sa-clean-op-btn.is-danger{background:#fff5f5;border-color:#f3c7c7;color:#dc2626;}",
        ".sa-clean-sync{display:grid;gap:4px;min-width:150px;}",
        ".sa-clean-sync-status{color:#dc2626;font-weight:700;}",
        ".sa-clean-sync-status.is-success{color:#039855;}",
        ".sa-clean-sync-reason{display:block;max-width:150px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#dc2626;font-size:12px;line-height:1.4;}",
        ".sa-clean-desc ul{margin:0;padding-left:18px;color:#44526b;font:500 14px/1.8 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-desc h4{margin:0 0 10px;color:#28508c;font:700 18px/1.2 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-desc h4 + h4{margin-top:16px;}",
        ".sa-clean-state-link{display:none!important;}",
        ".sa-clean-state-image{display:none!important;}",
        ".sa-clean-state-text{display:none!important;}",
        ".sa-clean-flow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px;}",
        ".sa-clean-flow-node{display:flex;align-items:center;justify-content:center;min-height:42px;padding:0 16px;border-radius:999px;background:#f8fbff;border:1px solid #bfd3ff;color:#173058;font:700 14px/1.3 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-flow-node.is-accent{background:#153d74;border-color:#153d74;color:#fff;}",
        ".sa-clean-flow-arrow{color:#98a2b3;font:700 18px/1 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-modal{position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:2147483000;pointer-events:none;}",
        ".sa-clean-modal.is-show{display:flex;pointer-events:auto;}",
        ".sa-clean-modal-mask{position:absolute;inset:0;background:rgba(15,23,42,.38);}",
        ".sa-clean-modal-card{position:relative;width:min(640px,calc(100vw - 32px));max-height:calc(100vh - 48px);overflow:auto;border-radius:24px;background:#fff;box-shadow:0 24px 60px rgba(15,23,42,.22);padding:22px 24px 20px;box-sizing:border-box;}",
        ".sa-clean-modal-title{margin:0 0 14px;color:#173058;font:800 24px/1.2 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-modal-body{color:#344054;font:500 15px/1.8 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-modal-body p{margin:0 0 10px;}",
        ".sa-clean-modal-body ul{margin:0;padding-left:18px;}",
        ".sa-clean-modal-upload{display:grid;gap:16px;}",
        ".sa-clean-modal-line{display:flex;align-items:flex-start;gap:8px;color:#0f172a;font:600 16px/1.5 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-modal-line-key{min-width:92px;color:#344054;font-weight:500;}",
        ".sa-clean-modal-line-value{font-weight:700;}",
        ".sa-clean-modal-upload-row{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}",
        ".sa-clean-modal-upload-required{color:#0f172a;font:700 18px/1.3 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-modal-upload-note{color:#667085;font:600 13px/1.3 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;}",
        ".sa-clean-modal-file{display:none;color:#475467;font:500 14px/1.6 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;word-break:break-all;}",
        ".sa-clean-modal-file.is-show{display:block;}",
        ".sa-clean-modal-file-input{display:none;}",
        ".sa-clean-modal-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:18px;}",
        ".sa-clean-toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);background:#ffffff;color:#1d4ed8;padding:10px 16px;border-radius:999px;border:1px solid #bfd3ff;box-shadow:0 12px 30px rgba(15,23,42,.12);font:600 14px/1 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;z-index:2147483200;display:none;}",
        ".sa-clean-toast.is-show{display:block;}",
        "@media (max-width: 1200px){.sa-clean-desc.has-state-image{padding-right:20px;min-height:0;}.sa-clean-state-link{position:static;width:100%;max-width:320px;margin:0 0 18px auto;}}",
        "@media (max-width: 1100px){.sa-clean-fields{grid-template-columns:1fr;}}"
      ].join("");
      document.head.appendChild(style);
    }

    function replaceTextInScopeLocal(scope, fromText, toText) {
      if (!scope) return;
      var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
      var textNode;
      while ((textNode = walker.nextNode())) {
        if (!textNode.nodeValue || textNode.nodeValue.indexOf(fromText) === -1) continue;
        textNode.nodeValue = textNode.nodeValue.split(fromText).join(toText);
      }
    }

    page.innerHTML = `
<main class="main-shell sa-clean-shell">
  <header class="page-header ax_default">
    <h1 class="text" spellcheck="false">订单管理--售后补贴单</h1>
    <p class="text" spellcheck="false">供应商售后补贴单页面，采用单一 Tab 结构重建，彻底隔离旧版处理中内容串页签问题。</p>
  </header>
  <section class="sa-clean-wrap">
    <div class="sa-clean-tabs">
      <button type="button" class="sa-clean-tab is-active" data-clean-tab-target="processing" onclick="return window.__SUPPLIER_CLEAN_SWITCH_TAB__&&window.__SUPPLIER_CLEAN_SWITCH_TAB__('processing');">处理中</button>
      <button type="button" class="sa-clean-tab" data-clean-tab-target="reviewing" onclick="return window.__SUPPLIER_CLEAN_SWITCH_TAB__&&window.__SUPPLIER_CLEAN_SWITCH_TAB__('reviewing');">审核中</button>
      <button type="button" class="sa-clean-tab" data-clean-tab-target="timeout" onclick="return window.__SUPPLIER_CLEAN_SWITCH_TAB__&&window.__SUPPLIER_CLEAN_SWITCH_TAB__('timeout');">超时未上传</button>
      <button type="button" class="sa-clean-tab" data-clean-tab-target="rejected" onclick="return window.__SUPPLIER_CLEAN_SWITCH_TAB__&&window.__SUPPLIER_CLEAN_SWITCH_TAB__('rejected');">已驳回</button>
      <button type="button" class="sa-clean-tab" data-clean-tab-target="uploaded" onclick="return window.__SUPPLIER_CLEAN_SWITCH_TAB__&&window.__SUPPLIER_CLEAN_SWITCH_TAB__('uploaded');">已上传</button>
    </div>

    <div class="sa-clean-panel is-active" data-clean-panel="processing">
      <div class="sa-clean-tip">
        <ul>
          <li>开票主体需官方主体，如“瑞幸咖啡（中国）有限公司”</li>
          <li>列表的用户支付即“申请开票金额”</li>
          <li>申请开票金额≤发票金额≤申请开票金额*2</li>
        </ul>
      </div>
      <section class="sa-clean-filter">
        <h3 class="sa-clean-section-title">筛选项</h3>
        <div class="sa-clean-fields">
          <div class="sa-clean-field"><div class="sa-clean-label">券订单号</div><div class="sa-clean-input"></div></div>
          <div class="sa-clean-field"><div class="sa-clean-label">发票抬头</div><div class="sa-clean-input"></div></div>
          <div class="sa-clean-field"><div class="sa-clean-label">商品品牌</div><div class="sa-clean-input"></div></div>
        </div>
        <div class="sa-clean-actions">
          <button type="button" class="sa-clean-btn">搜索</button>
          <button type="button" class="sa-clean-btn">重置</button>
        </div>
      </section>
      <section class="sa-clean-table-card">
        <h3 class="sa-clean-section-title">处理中列表</h3>
        <div class="sa-clean-table-wrap">
          <table class="sa-clean-table">
            <thead>
              <tr>
                <th>订单号</th><th>处理倒计时</th><th>下单时间</th><th>状态</th><th>发票抬头/税号</th><th>用户支付</th><th>商品名称</th><th>门店地址</th><th>商品品牌</th><th>赔付金额</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr class="sa-clean-desc-row">
                <td>数据源：客服同步的出餐订单号；显示逻辑：若没有渠道单号，显示“-”</td>
                <td>超时未上传状态的处理倒计时字段 倒计时结束</td>
                <td>数据源：该订单对应的下单时间</td>
                <td>订单状态见“状态机”</td>
                <td>数据源：客服创建发票订单时填写的抬头；企业显示企业名称+税号</td>
                <td>数据源：客服上传的该订单申请金额</td>
                <td>数据源：该订单对应的商品名称</td>
                <td>数据源：该订单对应的门店地址；门店地址只显示城市</td>
                <td>数据源：该订单对应的商品品牌</td>
                <td>数据源：后台系统配置项配置的“赔付金额”</td>
                <td>点击按钮，弹出弹窗</td>
              </tr>
              <tr>
                <td>6928014816062569567</td><td>1天23小时59分59秒</td><td>2026-07-17 15:14:49</td><td>处理中</td><td>井井井</td><td>9.99</td><td>椰青冰萃美式</td><td>瑞幸-广州</td><td>瑞幸</td><td>1.5</td><td><div class="sa-clean-op-group"><button type="button" class="sa-clean-op-btn is-primary" data-clean-action="upload" onclick="return window.__SUPPLIER_CLEAN_OPEN_ACTION__&&window.__SUPPLIER_CLEAN_OPEN_ACTION__('upload',this);">上传</button><button type="button" class="sa-clean-op-btn is-danger" data-clean-action="abandon" onclick="return window.__SUPPLIER_CLEAN_OPEN_ACTION__&&window.__SUPPLIER_CLEAN_OPEN_ACTION__('abandon',this);">放弃</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="sa-clean-desc has-state-image">
        <a class="sa-clean-state-link" href="${supplierStateImageUrl}" target="_blank" rel="noopener noreferrer">
          <img class="sa-clean-state-image" src="${supplierStateImageUrl}" alt="供应商端状态机">
          <span class="sa-clean-state-text">点击图片可在浏览器新窗口查看</span>
        </a>
        <h4>筛选项说明</h4>
        <ul>
          <li>券订单号：精准搜索</li>
          <li>发票抬头：模糊搜索</li>
          <li>商品品牌筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致</li>
        </ul>
        <h4>上传弹窗说明</h4>
        <ul>
          <li>发票抬头、税号、开票金额：表格回显</li>
          <li>开票金额即表格的“用户支付”</li>
          <li>“上传PDF/zip格式文件”按钮：点击弹出电脑桌面文件</li>
          <li>上传文件：校验文件类型与大小，上传的文件类型可以为PDF、zip，大小不超过20MB；上传数量不限制</li>
          <li>若文件类型不对，提示“请上传PDF/zip格式文件”</li>
          <li>若文件大小不对，提示“单个文件大小不能超过20MB”</li>
          <li>点击确定时，若未上传文件，提示<strong>“请先上传发票文件”</strong></li>
          <li>点击确定后，提示“上传成功”；进行系统自动审核，审核通过同步上传本地生活工作台对应工单且，到达结算时间给供应商进行结算</li>
          <li><strong>文件上传成功后，系统自动识别：</strong></li>
          <li>先识别上传的全部文件的发票抬头和税号是否与列表的完全一致，若不一致的话，驳回工单，<span style="color:#d92d20;font-weight:700;">驳回原因为：“请检查上传的文件发票抬头/税号”</span></li>
          <li>若发票抬头/税号一致的话，识别上传文件的发票金额【若多个发票金额就相加】是否大于等于申请金额【用户支付字段】小于申请金额的2倍，若不符合的话，驳回工单，<span style="color:#d92d20;font-weight:700;">驳回原因为：“发票金额不符合“申请开票金额≤发票金额≤申请开票金额*2”规则 ”</span></li>
          <li><span style="color:#d92d20;font-weight:700;">若一笔系统自动审核工单，超过10分钟没有审核结果，进行微信群提醒，@相关人员【技术】</span></li>
        </ul>
        <h4>放弃开票弹窗说明</h4>
        <ul>
          <li>点击确定的时候，继续随机分配给候选者</li>
          <li>若无候选者，则回到接单大厅，倒计时显示设置的倒计时减去流转时占用的时间</li>
          <li>点击按钮，提示“操作成功”</li>
        </ul>
      </section>
    </div>

    <div class="sa-clean-panel" data-clean-panel="reviewing">
      <section class="sa-clean-filter">
        <h3 class="sa-clean-section-title">筛选项</h3>
        <div class="sa-clean-fields">
          <div class="sa-clean-field"><div class="sa-clean-label">券订单号</div><div class="sa-clean-input"></div></div>
          <div class="sa-clean-field"><div class="sa-clean-label">发票抬头</div><div class="sa-clean-input"></div></div>
          <div class="sa-clean-field"><div class="sa-clean-label">商品品牌</div><div class="sa-clean-input"></div></div>
        </div>
        <div class="sa-clean-actions">
          <button type="button" class="sa-clean-btn">搜索</button>
          <button type="button" class="sa-clean-btn">重置</button>
        </div>
      </section>
      <section class="sa-clean-table-card">
        <h3 class="sa-clean-section-title">审核中列表</h3>
        <div class="sa-clean-table-wrap">
          <table class="sa-clean-table">
            <thead>
              <tr>
                <th>订单号</th><th>下单时间</th><th>状态</th><th>发票抬头/税号</th><th>用户支付</th><th>商品名称</th><th>门店地址</th><th>商品品牌</th><th>赔付金额</th>
              </tr>
            </thead>
            <tbody>
              <tr class="sa-clean-desc-row">
                <td>数据源：客服同步的出餐订单号；显示逻辑：若没有渠道单号，显示“-”</td>
                <td>数据源：该订单对应的下单时间</td>
                <td>订单状态见“状态机”</td>
                <td>数据源：客服创建发票订单时填写的抬头；企业显示企业名称+税号</td>
                <td>数据源：客服上传的该订单申请金额</td>
                <td>数据源：该订单对应的商品名称</td>
                <td>数据源：该订单对应的门店地址；门店地址只显示城市</td>
                <td>数据源：该订单对应的商品品牌</td>
                <td>数据源：后台系统配置项配置的“赔付金额”</td>
              </tr>
              <tr>
                <td>6928014816062569567</td><td>2026-07-17 15:14:49</td><td>审核中</td><td>井井井</td><td>9.99</td><td>椰青冰萃美式</td><td>瑞幸-广州</td><td>瑞幸</td><td>1.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div class="sa-clean-panel" data-clean-panel="timeout">
      <div class="sa-clean-tip">
        <ul>
          <li>开票主体需官方主体，如“瑞幸咖啡（中国）有限公司”</li>
          <li>列表的用户支付即“申请开票金额”</li>
          <li>申请开票金额≤发票金额≤申请开票金额*2</li>
        </ul>
      </div>
      <section class="sa-clean-filter">
        <h3 class="sa-clean-section-title">筛选项</h3>
        <div class="sa-clean-fields">
          <div class="sa-clean-field"><div class="sa-clean-label">券订单号</div><div class="sa-clean-input"></div></div>
          <div class="sa-clean-field"><div class="sa-clean-label">发票抬头</div><div class="sa-clean-input"></div></div>
          <div class="sa-clean-field"><div class="sa-clean-label">商品品牌</div><div class="sa-clean-input"></div></div>
        </div>
        <div class="sa-clean-actions">
          <button type="button" class="sa-clean-btn">搜索</button>
          <button type="button" class="sa-clean-btn">重置</button>
        </div>
      </section>
      <section class="sa-clean-table-card">
        <h3 class="sa-clean-section-title">超时未上传列表</h3>
        <div class="sa-clean-table-wrap">
          <table class="sa-clean-table">
            <thead>
              <tr>
                <th>订单号</th><th>处理倒计时</th><th>下单时间</th><th>状态</th><th>发票抬头/税号</th><th>用户支付</th><th>商品名称</th><th>门店地址</th><th>商品品牌</th><th>赔付金额</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr class="sa-clean-desc-row">
                <td>数据源：客服同步的出餐订单号；显示逻辑：若没有渠道单号，显示“-”</td>
                <td>超时未上传状态的处理倒计时字段 倒计时结束</td>
                <td>数据源：该订单对应的下单时间</td>
                <td>订单状态见“状态机”</td>
                <td>数据源：客服创建发票订单时填写的抬头；企业显示企业名称+税号</td>
                <td>数据源：客服上传的该订单申请金额</td>
                <td>数据源：该订单对应的商品名称</td>
                <td>数据源：该订单对应的门店地址；门店地址只显示城市</td>
                <td>数据源：该订单对应的商品品牌</td>
                <td>数据源：后台系统配置项配置的“赔付金额”</td>
                <td>弹窗内容与处理中页面一致</td>
              </tr>
              <tr>
                <td>6928014816062569567</td><td>倒计时结束</td><td>2026-07-17 15:14:49</td><td>超时未上传</td><td>井井井</td><td>9.99</td><td>椰青冰萃美式</td><td>瑞幸-广州</td><td>瑞幸</td><td>1.5</td><td><div class="sa-clean-op-group"><button type="button" class="sa-clean-op-btn is-primary" data-clean-action="upload" onclick="return window.__SUPPLIER_CLEAN_OPEN_ACTION__&&window.__SUPPLIER_CLEAN_OPEN_ACTION__('upload',this);">上传</button><button type="button" class="sa-clean-op-btn is-danger" data-clean-action="abandon" onclick="return window.__SUPPLIER_CLEAN_OPEN_ACTION__&&window.__SUPPLIER_CLEAN_OPEN_ACTION__('abandon',this);">放弃</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="sa-clean-desc">
        <h4>筛选项说明</h4>
        <ul>
          <li>券订单号：精准搜索</li>
          <li>发票抬头：模糊搜索</li>
          <li>商品品牌筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致</li>
        </ul>
      </section>
    </div>

    <div class="sa-clean-panel" data-clean-panel="rejected">
      <div class="sa-clean-tip">
        <ul>
          <li>开票主体需官方主体，如“瑞幸咖啡（中国）有限公司”</li>
          <li>列表的用户支付即“申请开票金额”</li>
          <li>申请开票金额≤发票金额≤申请开票金额*2</li>
        </ul>
      </div>
      <section class="sa-clean-filter">
        <h3 class="sa-clean-section-title">筛选项</h3>
        <div class="sa-clean-fields">
          <div class="sa-clean-field"><div class="sa-clean-label">券订单号</div><div class="sa-clean-input"></div></div>
          <div class="sa-clean-field"><div class="sa-clean-label">发票抬头</div><div class="sa-clean-input"></div></div>
          <div class="sa-clean-field"><div class="sa-clean-label">商品品牌</div><div class="sa-clean-input"></div></div>
        </div>
        <div class="sa-clean-actions">
          <button type="button" class="sa-clean-btn">搜索</button>
          <button type="button" class="sa-clean-btn">重置</button>
        </div>
      </section>
      <section class="sa-clean-table-card">
        <h3 class="sa-clean-section-title">已驳回列表</h3>
        <div class="sa-clean-table-wrap">
          <table class="sa-clean-table">
            <thead>
              <tr>
                <th>订单号</th><th>下单时间</th><th>状态</th><th>发票抬头/税号</th><th>用户支付</th><th>商品名称</th><th>门店地址</th><th>商品品牌</th><th>驳回原因</th><th>上传时间</th><th>赔付金额</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr class="sa-clean-desc-row">
                <td>数据源：客服同步的出餐订单号</td>
                <td>数据源：该订单对应的下单时间</td>
                <td>订单状态见“状态机”</td>
                <td>数据源：客服创建发票订单时填写的抬头；企业显示企业名称+税号</td>
                <td>数据源：客服上传的该订单申请金额</td>
                <td>数据源：该订单对应的商品名称</td>
                <td>数据源：该订单对应的门店地址；只显示城市</td>
                <td>数据源：该订单对应的商品品牌</td>
                <td>数据源：后台驳回原因</td>
                <td>数据源：最近一次上传时间</td>
                <td>数据源：后台系统配置项配置的“赔付金额”</td>
                <td>点击按钮，弹出弹窗</td>
              </tr>
              <tr>
                <td>6928014816062569567</td><td>2026-07-17 15:14:49</td><td>已驳回</td><td>井井井</td><td>9.99</td><td>椰青冰萃美式</td><td>瑞幸-广州</td><td>瑞幸</td><td>抬头不合规</td><td>2026-07-18 10:01:49</td><td>1.5</td><td><div class="sa-clean-op-group is-vertical"><button type="button" class="sa-clean-op-btn is-primary" data-clean-action="reupload" onclick="return window.__SUPPLIER_CLEAN_OPEN_ACTION__&&window.__SUPPLIER_CLEAN_OPEN_ACTION__('reupload',this);">重新上传</button><button type="button" class="sa-clean-op-btn" data-clean-action="download" onclick="return window.__SUPPLIER_CLEAN_OPEN_ACTION__&&window.__SUPPLIER_CLEAN_OPEN_ACTION__('download',this);">下载</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="sa-clean-desc">
        <h4>筛选项说明</h4>
        <ul>
          <li>券订单号：精准搜索</li>
          <li>发票抬头：模糊搜索</li>
          <li>商品品牌筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致</li>
        </ul>
        <h4>重新上传弹窗说明</h4>
        <ul>
          <li>发票抬头、税号、开票金额：表格回显</li>
          <li>开票金额即表格的“用户支付”</li>
          <li>“上传PDF/zip格式文件”按钮：点击弹出电脑桌面文件</li>
          <li>上传文件：校验文件类型与大小，上传的文件类型可以为PDF、zip，大小不超过20MB；上传数量不限制</li>
          <li>若文件类型不对，提示“请上传PDF/zip格式文件”</li>
          <li>若文件大小不对，提示“单个文件大小不能超过20MB”</li>
          <li>点击确定时，若未上传文件，提示<strong>“请先上传发票文件”</strong></li>
          <li>点击确定后，提示“上传成功”；进行系统自动审核，审核通过同步上传本地生活工作台对应工单且，到达结算时间给供应商进行结算</li>
          <li><strong>文件上传成功后，系统自动识别：</strong></li>
          <li>先识别上传的全部文件的发票抬头和税号是否与列表的完全一致，若不一致的话，驳回工单，<span style="color:#d92d20;font-weight:700;">驳回原因为：“请检查上传的文件发票抬头/税号”</span></li>
          <li>若发票抬头/税号一致的话，识别上传文件的发票金额【若多个发票金额就相加】是否大于等于申请金额【用户支付字段】小于申请金额的2倍，若不符合的话，驳回工单，<span style="color:#d92d20;font-weight:700;">驳回原因为：“发票金额不符合“申请开票金额≤发票金额≤申请开票金额*2”规则 ”</span></li>
          <li><span style="color:#d92d20;font-weight:700;">若一笔系统自动审核工单，超过10分钟没有审核结果，进行微信群提醒，@相关人员【技术】</span></li>
        </ul>
      </section>
    </div>

    <div class="sa-clean-panel" data-clean-panel="uploaded">
      <div class="sa-clean-tip">
        <ul>
          <li>开票主体需官方主体，如“瑞幸咖啡（中国）有限公司”</li>
          <li>列表的用户支付即“申请开票金额”</li>
          <li>申请开票金额≤发票金额≤申请开票金额*2</li>
        </ul>
      </div>
      <section class="sa-clean-filter">
        <h3 class="sa-clean-section-title">筛选项</h3>
        <div class="sa-clean-fields">
          <div class="sa-clean-field"><div class="sa-clean-label">券订单号</div><div class="sa-clean-input"></div></div>
          <div class="sa-clean-field"><div class="sa-clean-label">发票抬头</div><div class="sa-clean-input"></div></div>
          <div class="sa-clean-field"><div class="sa-clean-label">商品品牌</div><div class="sa-clean-input"></div></div>
        </div>
        <div class="sa-clean-actions">
          <button type="button" class="sa-clean-btn">搜索</button>
          <button type="button" class="sa-clean-btn">重置</button>
        </div>
      </section>
      <section class="sa-clean-table-card">
        <h3 class="sa-clean-section-title">已上传列表</h3>
        <div class="sa-clean-table-wrap">
          <table class="sa-clean-table">
            <thead>
              <tr>
                <th>订单号</th><th>下单时间</th><th>状态</th><th>发票抬头/税号</th><th>用户支付</th><th>商品名称</th><th>门店地址</th><th>商品品牌</th><th>上传时间</th><th>赔付金额</th><th>赔付状态</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr class="sa-clean-desc-row">
                <td>数据源：客服同步的出餐订单号</td>
                <td>数据源：该订单对应的下单时间</td>
                <td>订单状态见“状态机”</td>
                <td>数据源：客服创建发票订单时填写的抬头；企业显示企业名称+税号</td>
                <td>数据源：客服上传的该订单申请金额</td>
                <td>数据源：该订单对应的商品名称</td>
                <td>数据源：该订单对应的门店地址；只显示城市</td>
                <td>数据源：该订单对应的商品品牌</td>
                <td>数据源：发票文件上传成功时间</td>
                <td>数据源：后台系统配置项配置的“赔付金额”</td>
                <td>打款成功：“已赔付” / 没有打款：“未赔付”</td>
                <td>下载按钮：点击后在浏览器下载上一次上传的发票文件【下载的是最新的文件】</td>
              </tr>
              <tr>
                <td>6928014816062569567</td><td>2026-07-17 15:14:49</td><td>已上传</td><td>井井井</td><td>9.99</td><td>椰青冰萃美式</td><td>瑞幸-广州</td><td>瑞幸</td><td>2026-07-18 15:14:49</td><td>1.5</td><td>已赔付</td><td><div class="sa-clean-op-group"><button type="button" class="sa-clean-op-btn" data-clean-action="download" onclick="return window.__SUPPLIER_CLEAN_OPEN_ACTION__&&window.__SUPPLIER_CLEAN_OPEN_ACTION__('download',this);">下载</button></div></td>
              </tr>
              <tr>
                <td>6928014816062569588</td><td>2026-07-18 11:26:08</td><td>已上传</td><td>井井井</td><td>19.90</td><td>生椰拿铁</td><td>瑞幸-深圳</td><td>瑞幸</td><td>2026-07-18 16:03:21</td><td>1.5</td><td>已赔付</td><td><div class="sa-clean-op-group"><button type="button" class="sa-clean-op-btn" data-clean-action="download" onclick="return window.__SUPPLIER_CLEAN_OPEN_ACTION__&&window.__SUPPLIER_CLEAN_OPEN_ACTION__('download',this);">下载</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="sa-clean-desc">
        <h4>筛选项说明</h4>
        <ul>
          <li>券订单号：精准搜索</li>
          <li>发票抬头：模糊搜索</li>
          <li>商品品牌筛选项：枚举值跟点餐后台销售订单列表的相同筛选项一致</li>
        </ul>
      </section>
    </div>
    <div class="sa-clean-modal" data-clean-modal>
      <div class="sa-clean-modal-mask" data-clean-close></div>
      <div class="sa-clean-modal-card">
        <h3 class="sa-clean-modal-title" data-clean-modal-title>操作弹窗</h3>
        <div class="sa-clean-modal-body" data-clean-modal-body></div>
        <input type="file" class="sa-clean-modal-file-input" data-clean-file-input accept=".pdf,.zip,application/pdf,application/zip,application/x-zip-compressed" multiple>
        <div class="sa-clean-modal-actions">
          <button type="button" class="sa-clean-btn" data-clean-close>取消</button>
          <button type="button" class="sa-clean-btn is-primary" data-clean-confirm>确定</button>
        </div>
      </div>
    </div>
    <div class="sa-clean-toast" data-clean-toast>操作成功</div>
  </section>
</main>`;
    replaceTextInScopeLocal(page, "券订单号", "订单号");

    var modal = page.querySelector("[data-clean-modal]");
    var modalTitle = page.querySelector("[data-clean-modal-title]");
    var modalBody = page.querySelector("[data-clean-modal-body]");
    var confirmBtn = page.querySelector("[data-clean-confirm]");
    var fileInput = page.querySelector("[data-clean-file-input]");
    var toast = page.querySelector("[data-clean-toast]");
    var modalAction = "";
    var modalRow = null;
    var modalSelectedFile = "";
    var modalSelectedTime = "";

    function showToast(message) {
      if (!toast) return;
      toast.textContent = message || "操作成功";
      toast.classList.add("is-show");
      clearTimeout(showToast._timer);
      showToast._timer = window.setTimeout(function () {
        toast.classList.remove("is-show");
      }, 1600);
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove("is-show");
      modalAction = "";
      modalRow = null;
      modalSelectedFile = "";
      modalSelectedTime = "";
      if (fileInput) fileInput.value = "";
    }

    function syncModalFileName() {
      var line = page.querySelector("[data-clean-selected-file]");
      if (!line) return;
      if (modalSelectedFile) {
        line.textContent = "已选择文件：" + modalSelectedFile + (modalSelectedTime ? "（" + modalSelectedTime + "）" : "");
        line.classList.add("is-show");
        return;
      }
      line.textContent = "";
      line.classList.remove("is-show");
    }

    function formatNow() {
      var now = new Date();
      var pad = function (value) { return String(value).padStart(2, "0"); };
      return now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + " " + pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
    }

    function buildUploadModalHtml(titleText, taxNoText, amountText) {
      return '' +
        '<div class="sa-clean-modal-upload">' +
        '  <div class="sa-clean-modal-line"><span class="sa-clean-modal-line-key">发票抬头：</span><span class="sa-clean-modal-line-value">' + titleText + '</span></div>' +
        '  <div class="sa-clean-modal-line"><span class="sa-clean-modal-line-key">税号：</span><span class="sa-clean-modal-line-value">' + taxNoText + '</span></div>' +
        '  <div class="sa-clean-modal-line"><span class="sa-clean-modal-line-key">开票金额：</span><span class="sa-clean-modal-line-value">' + amountText + '</span></div>' +
        '  <div class="sa-clean-modal-upload-row">' +
        '    <div class="sa-clean-modal-upload-required">* 上传发票</div>' +
        '    <button type="button" class="sa-clean-op-btn" data-clean-upload-trigger>上传PDF/zip格式文件</button>' +
        '    <div class="sa-clean-modal-upload-note">（支持 PDF、zip，单个文件不超过20MB）</div>' +
        '  </div>' +
        '  <div class="sa-clean-modal-file" data-clean-selected-file></div>' +
        '</div>';
    }

    function switchCleanSupplierTab(target) {
      Array.prototype.forEach.call(page.querySelectorAll("[data-clean-tab-target]"), function (button) {
        var active = button.getAttribute("data-clean-tab-target") === target;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      Array.prototype.forEach.call(page.querySelectorAll("[data-clean-panel]"), function (panel) {
        var active = panel.getAttribute("data-clean-panel") === target;
        panel.classList.toggle("is-active", active);
        panel.style.setProperty("display", active ? "block" : "none", "important");
        panel.setAttribute("aria-hidden", active ? "false" : "true");
      });
    }

    window.__SUPPLIER_CLEAN_SWITCH_TAB__ = function (target) {
      switchCleanSupplierTab(target);
      return false;
    };

    window.__SUPPLIER_CLEAN_OPEN_ACTION__ = function (action, trigger) {
      if (action === "download") {
        showToast("文件下载，在浏览器查看");
        return false;
      }
      openModal(action, trigger && trigger.closest ? trigger.closest("tr") : null);
      return false;
    };

    Array.prototype.forEach.call(page.querySelectorAll("[data-clean-tab-target]"), function (button) {
      button.setAttribute("onclick", "return window.__SUPPLIER_CLEAN_SWITCH_TAB__&&window.__SUPPLIER_CLEAN_SWITCH_TAB__('" + button.getAttribute("data-clean-tab-target") + "');");
      button.onclick = function (event) {
        if (event) event.preventDefault();
        return window.__SUPPLIER_CLEAN_SWITCH_TAB__ && window.__SUPPLIER_CLEAN_SWITCH_TAB__(button.getAttribute("data-clean-tab-target"));
      };
    });
    Array.prototype.forEach.call(page.querySelectorAll("[data-clean-action]"), function (button) {
      button.setAttribute("onclick", "return window.__SUPPLIER_CLEAN_OPEN_ACTION__&&window.__SUPPLIER_CLEAN_OPEN_ACTION__('" + button.getAttribute("data-clean-action") + "',this);");
      button.onclick = function (event) {
        if (event) event.preventDefault();
        return window.__SUPPLIER_CLEAN_OPEN_ACTION__ && window.__SUPPLIER_CLEAN_OPEN_ACTION__(button.getAttribute("data-clean-action"), button);
      };
    });

    Array.prototype.forEach.call(page.querySelectorAll("[data-clean-tab-target]"), function (button) {
      button.setAttribute("onclick", "return window.__SUPPLIER_CLEAN_SWITCH_TAB__&&window.__SUPPLIER_CLEAN_SWITCH_TAB__('" + button.getAttribute("data-clean-tab-target") + "');");
    });
    Array.prototype.forEach.call(page.querySelectorAll("[data-clean-action]"), function (button) {
      button.setAttribute("onclick", "return window.__SUPPLIER_CLEAN_OPEN_ACTION__&&window.__SUPPLIER_CLEAN_OPEN_ACTION__('" + button.getAttribute("data-clean-action") + "',this);");
    });

    function openModal(action, row) {
      if (!modal || !modalTitle || !modalBody || !confirmBtn) return;
      modalAction = action || "";
      modalRow = row || null;
      modalSelectedFile = "";
      modalSelectedTime = "";
      if (fileInput) fileInput.value = "";
      if (action === "upload") {
        var uploadCells = row ? row.querySelectorAll("td") : [];
        var uploadTitle = uploadCells[4] ? uploadCells[4].textContent.trim() : "井井井";
        var uploadAmount = uploadCells[5] ? uploadCells[5].textContent.trim() : "9.99";
        modalTitle.textContent = "上传发票";
        modalBody.innerHTML = buildUploadModalHtml(uploadTitle, "-", uploadAmount);
        confirmBtn.textContent = "确定";
      } else if (action === "abandon") {
        modalTitle.textContent = "放弃开票";
        modalBody.innerHTML = "<p>确定放弃对该订单开票吗？</p><p>放弃后，该订单将在该列表消失。</p>";
        confirmBtn.textContent = "确定";
      } else if (action === "reupload") {
        var reuploadCells = row ? row.querySelectorAll("td") : [];
        var reuploadTitle = reuploadCells[3] ? reuploadCells[3].textContent.trim() : "井井井";
        var reuploadAmount = reuploadCells[4] ? reuploadCells[4].textContent.trim() : "9.99";
        modalTitle.textContent = "重新上传";
        modalBody.innerHTML = buildUploadModalHtml(reuploadTitle, "-", reuploadAmount);
        confirmBtn.textContent = "确定";
      } else if (action === "download") {
        modalTitle.textContent = "下载发票";
        modalBody.innerHTML = "<p>将下载最近一次上传成功的发票文件。</p><p>文件名示例：invoice_20260718_151449.pdf</p><p>上传时间：2026-07-18 15:14:49</p>";
        confirmBtn.textContent = "下载";
      }
      syncModalFileName();
      modal.classList.add("is-show");
    }

    function handleCleanPageClick(event) {
      if (event && event.__supplierCleanHandled) return;
      var tab = event.target.closest && event.target.closest("[data-clean-tab-target]");
      if (tab) {
        event.__supplierCleanHandled = true;
        if (typeof event.preventDefault === "function") event.preventDefault();
        if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
        if (typeof event.stopPropagation === "function") event.stopPropagation();
        var target = tab.getAttribute("data-clean-tab-target");
        switchCleanSupplierTab(target);
        return;
      }
      var actionBtn = event.target.closest && event.target.closest("[data-clean-action]");
      if (actionBtn) {
        event.__supplierCleanHandled = true;
        if (typeof event.preventDefault === "function") event.preventDefault();
        if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
        if (typeof event.stopPropagation === "function") event.stopPropagation();
        var action = actionBtn.getAttribute("data-clean-action");
        if (action === "download") {
          showToast("文件下载，在浏览器查看");
          return;
        }
        if (action === "resync") {
          var row = actionBtn.closest("tr");
          var result = row && row.getAttribute("data-clean-sync-result") === "failure" ? "failure" : "success";
          if (row && result === "success") {
            var syncCell = row.children[11];
            var opCell = row.children[12];
            if (syncCell) {
              syncCell.innerHTML = '<div class="sa-clean-sync"><div class="sa-clean-sync-status is-success">同步成功</div></div>';
            }
            if (opCell) {
              opCell.innerHTML = '<div class="sa-clean-op-group"><button type="button" class="sa-clean-op-btn" data-clean-action="download">下载</button></div>';
            }
            row.setAttribute("data-clean-sync-result", "success");
          }
          showToast(result === "success" ? "同步成功" : "同步失败");
          return;
        }
        openModal(action, actionBtn.closest("tr"));
        return;
      }
      if (event.target.closest && event.target.closest("[data-clean-upload-trigger]")) {
        event.__supplierCleanHandled = true;
        if (typeof event.preventDefault === "function") event.preventDefault();
        if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
        if (typeof event.stopPropagation === "function") event.stopPropagation();
        if (fileInput) fileInput.click();
        return;
      }
      if (event.target.closest && event.target.closest("[data-clean-close]")) {
        event.__supplierCleanHandled = true;
        if (typeof event.preventDefault === "function") event.preventDefault();
        if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
        if (typeof event.stopPropagation === "function") event.stopPropagation();
        closeModal();
        return;
      }
      if (event.target.closest && event.target.closest("[data-clean-confirm]")) {
        event.__supplierCleanHandled = true;
        if (typeof event.preventDefault === "function") event.preventDefault();
        if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
        if (typeof event.stopPropagation === "function") event.stopPropagation();
        if (modalAction === "download") {
          showToast("开始下载");
        } else if (modalAction === "upload" || modalAction === "reupload") {
          if (!modalSelectedFile) {
            showToast("请先上传发票文件");
            return;
          }
          showToast("上传成功");
        } else if (modalAction === "abandon") {
          showToast("已确认放弃");
        }
        closeModal();
      }
    }

    page.addEventListener("click", handleCleanPageClick, true);
    if (!window.__SUPPLIER_CLEAN_PAGE_CAPTURE_BOUND__) {
      window.__SUPPLIER_CLEAN_PAGE_CAPTURE_BOUND__ = true;
      window.addEventListener("click", function (event) {
        var activePage = document.querySelector('.bundle-page[data-page="supplier-after-sale"][data-supplier-clean-built="v16"]');
        if (!activePage) return;
        var trigger = event.target.closest && event.target.closest('.bundle-page[data-page="supplier-after-sale"] [data-clean-tab-target], .bundle-page[data-page="supplier-after-sale"] [data-clean-action], .bundle-page[data-page="supplier-after-sale"] [data-clean-upload-trigger], .bundle-page[data-page="supplier-after-sale"] [data-clean-close], .bundle-page[data-page="supplier-after-sale"] [data-clean-confirm]');
        if (!trigger) return;
        handleCleanPageClick(event);
      }, true);
    }

    if (fileInput) {
      fileInput.addEventListener("change", function () {
        var files = Array.prototype.slice.call(fileInput.files || []);
        if (!files.length) {
          modalSelectedFile = "";
          modalSelectedTime = "";
          syncModalFileName();
          return;
        }
        if (files.some(function (file) { return !/\.pdf$|\.zip$/i.test(file.name || ""); })) {
          modalSelectedFile = "";
          modalSelectedTime = "";
          fileInput.value = "";
          syncModalFileName();
          showToast("请上传PDF/zip格式文件");
          return;
        }
        if (files.some(function (file) { return Number(file.size || 0) > 20 * 1024 * 1024; })) {
          modalSelectedFile = "";
          modalSelectedTime = "";
          fileInput.value = "";
          syncModalFileName();
          showToast("单个文件大小不能超过20MB");
          return;
        }
        modalSelectedFile = files.map(function (file) {
          return file.name || "未命名文件";
        }).join("、");
        modalSelectedTime = formatNow();
        syncModalFileName();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildSupplierAfterSaleCleanPage, { once: true });
  } else {
    buildSupplierAfterSaleCleanPage();
  }
  window.addEventListener("pageshow", buildSupplierAfterSaleCleanPage);
})();
