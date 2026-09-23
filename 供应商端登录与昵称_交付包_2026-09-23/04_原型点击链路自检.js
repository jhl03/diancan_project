/* 原型点击链路自检（无浏览器环境）——用手写最小 DOM 驱动原型里的脚本，跑真实点击链路。
 * 用法：node 原型点击链路自检.js
 * 场景：原型被设计工具重新保存后跑一次，先看「修复后」那一组是否全绿；
 *       同时会把「修复前」的写法还原出来做对照，用来确认某个回归的确切位置。
 * 覆盖：账号密码登录 / 空值拦截 / 昵称保存 / 留空拦截 / 草稿保留 / 手机号登录 / 退出登录。
 */
const fs = require('fs');
const P = 'C:/Users/Lenovo/WorkBuddy/2026-09-14-10-40-36/供应商端-原型+关键PRD.html';
const html = fs.readFileSync(P, 'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function parseNodes(src){
  const map = new Map();
  const tagRe = /<([a-zA-Z][\w-]*)((?:\s+[^<>]*?)?)\/?>/g;
  let m;
  while((m = tagRe.exec(src))){
    const attrs = m[2] || '';
    const idm = attrs.match(/\bid="([^"]+)"/);
    if(!idm) continue;
    const clsm = attrs.match(/\bclass="([^"]*)"/);
    const classes = new Set((clsm ? clsm[1] : '').split(/\s+/).filter(Boolean));
    const am = new Map();
    for(const a of attrs.matchAll(/([\w-]+)="([^"]*)"/g)) am.set(a[1], a[2]);
    map.set(idm[1], makeNode(idm[1], classes, am));
  }
  return map;
}
function makeNode(id, classes, attrs){
  return {
    id, classes, attrs: attrs || new Map(),
    textContent:'', value:'', type:'text', disabled:false, offsetTop:0, style:{},
    classList:{
      add(...c){ c.forEach(x=>classes.add(x)); },
      remove(...c){ c.forEach(x=>classes.delete(x)); },
      toggle(c, force){ const on = force===undefined ? !classes.has(c) : !!force; on?classes.add(c):classes.delete(c); return on; },
      contains(c){ return classes.has(c); }
    },
    getAttribute(n){ return this.attrs.has(n) ? this.attrs.get(n) : null; },
    hasAttribute(n){ return this.attrs.has(n); },
    setAttribute(n,v){ this.attrs.set(n,v); },
    listeners:{},
    addEventListener(t,fn){ (this.listeners[t] = this.listeners[t] || []).push(fn); },
    focus(){}, blur(){},
    closest(){ return this.hasAttribute('data-act')||this.hasAttribute('data-scene')||this.hasAttribute('data-page') ? this : null; }
  };
}

function buildEnv(src){
  const code = src.match(/<script>([\s\S]*?)<\/script>/)[1];   // 必须取传入的这一份
  const nodes = parseNodes(src);
  const clicks = [];
  const timers = [];
  const document = {
    getElementById: id => nodes.get(id) || null,
    querySelectorAll: sel => {
      const cls = sel.replace(/^\./,'');
      return { forEach: fn => [...nodes.values()].filter(n=>n.classList.contains(cls)).forEach(fn) };
    },
    addEventListener: (type, fn) => { if(type==='click') clicks.push(fn); },
    readyState:'complete'
  };
  const win = { document, setTimeout:(fn)=>{ timers.push(fn); return timers.length; }, clearTimeout:()=>{} };
  let initErr = null;
  try { new Function('document','window','setTimeout','clearTimeout', code)(document, win, win.setTimeout, ()=>{}); }
  catch(e){ initErr = e; }
  const timerErrs = [];
  const flush = ()=>{ while(timers.length){ const f = timers.shift(); try{ f(); }catch(e){ timerErrs.push(e.message); } } };
  return { nodes, document, timerErrs, initErr, fireClick(fn, act, num){
    const attrs = new Map([['data-act', act]]);
    if(num !== undefined) attrs.set('data-num', num);
    const node = makeNode('target', new Set(), attrs);
    fn({ target: node });
  }, clicks, flush, type(id, text){
    /* 模拟真实键盘输入：写值 + 触发 input 监听（脚本内部据此记草稿） */
    const n = nodes.get(id);
    if(!n) return;
    n.value = text;
    (n.listeners.input || []).forEach(fn => fn.call(n, { target:n }));
  } };
}

/* ---------- 用例 ---------- */
const CASES = [
  { name:'点【账号密码登录】→ 半屏层弹出，右侧 PRD 切到「账号密码登录」',
    run(env){
      const h = env.clicks[0];
      env.fireClick(h,'pwdLogin');
      const s = [];
      env.nodes.get('shPwd').classList.contains('show') || s.push('半屏层没弹出');
      env.nodes.get('mask').classList.contains('show') || s.push('遮罩没出现');
      env.nodes.get('prd-pwd').classList.contains('on') || s.push('右侧 PRD 没切到 prd-pwd');
      return s;
    }},
  { name:'输入账号密码 → 点【登录】→ 关闭半屏层并进入「我的页」',
    run(env){
      const h = env.clicks[0];
      env.nodes.get('accInput').value = '13800000000';
      env.nodes.get('pwdInput').value = 'abc123';
      env.fireClick(h,'pwdSubmit');
      env.flush();
      const s = [];
      env.nodes.get('shPwd').classList.contains('show') && s.push('半屏层没关闭');
      env.nodes.get('pageMine').classList.contains('on') || s.push('没有跳到「我的页」');
      env.nodes.get('pageLogin').classList.contains('on') && s.push('「登录页」没有隐藏');
      /登录成功/.test(env.nodes.get('toast').textContent) || s.push('没有成功提示（toast 文本：'+env.nodes.get('toast').textContent+'）');
      env.nodes.get('guidebar').classList.contains('show') || s.push('昵称为空却没有出现顶部引导条');
      /请输入|未设置/.test(env.nodes.get('unick').style.display === 'none' ? '未设置' : '') || env.nodes.get('unick').style.display === 'none' || s.push('空的昵称行没有隐藏');
      env.nodes.get('prd-mine').classList.contains('on') || s.push('右侧 PRD 没切到 prd-mine');
      return s;
    }},
  { name:'空账号点【登录】→ 拦截并提示，不关层',
    run(env){
      const h = env.clicks[0];
      env.fireClick(h,'pwdLogin');
      env.nodes.get('accInput').value = ''; env.nodes.get('pwdInput').value = '';
      env.fireClick(h,'pwdSubmit');
      const s = [];
      env.nodes.get('shPwd').classList.contains('show') || s.push('半屏层被错误关闭');
      env.nodes.get('toast').textContent === '请输入账号' || s.push('提示文案不对：'+env.nodes.get('toast').textContent);
      return s;
    }},
  { name:'我的页 ✎ → 填写层 → 输入 → 保存 → 提示成功并写入',
    run(env){
      const h = env.clicks[0];
      env.fireClick(h,'pwdLogin');
      env.nodes.get('accInput').value='138'; env.nodes.get('pwdInput').value='1';
      env.fireClick(h,'pwdSubmit'); env.flush();
      env.fireClick(h,'openNick');
      const s = [];
      env.nodes.get('shNick').classList.contains('show') || s.push('填写层没弹出');
      env.nodes.get('shNickTitle').textContent === '完善微信昵称' || s.push('标题应为「完善微信昵称」，实际：'+env.nodes.get('shNickTitle').textContent);
      env.nodes.get('nickInput').value = '王姐';
      env.fireClick(h,'save');
      env.nodes.get('toast').textContent === '保存成功' || s.push('保存没有成功提示：'+env.nodes.get('toast').textContent);
      env.nodes.get('unickVal').textContent === '王姐' || s.push('昵称没写回我的页：'+env.nodes.get('unickVal').textContent);
      env.nodes.get('guidebar').classList.contains('show') && s.push('保存后引导条没消失');
      return s;
    }},
  { name:'昵称留空保存 → 拦截',
    run(env){
      const h = env.clicks[0];
      env.fireClick(h,'openNick');
      env.nodes.get('nickInput').value = '   ';
      env.fireClick(h,'save');
      const s = [];
      env.nodes.get('toast').textContent === '请输入微信昵称' || s.push('留空没被拦截：'+env.nodes.get('toast').textContent);
      env.nodes.get('shNick').classList.contains('show') || s.push('被拦截时不应关层');
      return s;
    }},
  { name:'填写层输入后点【取消】关层 → 再打开草稿还在；保存后重开显示已保存值',
    run(env){
      const h = env.clicks[0];
      env.fireClick(h,'openNick');
      env.type('nickInput','井惠琳改个名');
      const s = [];
      env.nodes.get('cnt').textContent === 6 || s.push('计数没跟上输入：'+env.nodes.get('cnt').textContent);
      env.fireClick(h,'closeSheet');
      env.fireClick(h,'openNick');
      env.nodes.get('nickInput').value === '井惠琳改个名' || s.push('取消后草稿丢了：'+env.nodes.get('nickInput').value);
      env.nodes.get('cnt').textContent === 6 || s.push('重开后计数不对：'+env.nodes.get('cnt').textContent);
      env.fireClick(h,'save');
      env.fireClick(h,'openNick');
      env.nodes.get('nickInput').value === '井惠琳改个名' || s.push('保存后重开显示的不是已保存值：'+env.nodes.get('nickInput').value);
      return s;
    }},
  { name:'账号密码登录后 圆形占位为橙色「待」态，填完昵称保存后转账号名称首字',
    run(env){
      const h = env.clicks[0];
      /* 走账号密码登录：昵称为空 → 圆形占位走橙色「待」态 */
      env.fireClick(h,'pwdLogin');
      env.nodes.get('accInput').value='138'; env.nodes.get('pwdInput').value='1';
      env.fireClick(h,'pwdSubmit'); env.flush();
      const s = [];
      env.nodes.get('avatar').classList.contains('warn') || s.push('昵称为空时圆形占位应为橙色「待」态');
      env.fireClick(h,'openNick');
      env.nodes.get('shNick').classList.contains('show') || s.push('填写层没弹出');
      env.nodes.get('nickInput').value = '王姐';
      env.fireClick(h,'save');
      env.nodes.get('unickVal').textContent === '王姐' || s.push('昵称没写回：'+env.nodes.get('unickVal').textContent);
      env.nodes.get('avatar').classList.contains('warn') && s.push('填完昵称后不该还是橙色「待」态');
      env.nodes.get('zi').textContent === '测' || s.push('圆形占位应显示账号名称首字，实际：'+env.nodes.get('zi').textContent);
      env.timerErrs.length && s.push('定时器内抛错：'+env.timerErrs[0]);
      return s;
    }},
  { name:'昵称跟原来一样 → 提示「昵称没有变化」且不关层；改成新值 → 保存成功',
    run(env){
      const h = env.clicks[0];
      env.fireClick(h,'agree'); env.fireClick(h,'phoneLogin'); env.fireClick(h,'phoneAllow'); env.flush();
      env.fireClick(h,'openNick');
      const s = [];
      /* 昵称没动 → 应提示「昵称没有变化」，且不关层 */
      env.fireClick(h,'save');
      env.nodes.get('toast').textContent === '昵称没有变化' || s.push('都没改动时应提示「昵称没有变化」，实际：'+env.nodes.get('toast').textContent);
      env.nodes.get('shNick').classList.contains('show') || s.push('「没有变化」时不应关层');
      /* 改成新值 → 必须能保存 */
      env.nodes.get('nickInput').value = '王姐';
      env.fireClick(h,'save');
      env.nodes.get('toast').textContent === '保存成功' || s.push('改名后没保存成功，提示：'+env.nodes.get('toast').textContent);
      env.nodes.get('shNick').classList.contains('show') && s.push('保存后填写层没关闭');
      return s;
    }},
  { name:'手机号登录后 圆形占位为账号名称首字（不带橙色待态）',
    run(env){
      const h = env.clicks[0];
      env.fireClick(h,'agree'); env.fireClick(h,'phoneLogin'); env.fireClick(h,'phoneAllow');
      env.flush();
      const s = [];
      env.nodes.get('avatar').classList.contains('warn') && s.push('有昵称时不该是橙色「待」态');
      env.nodes.get('zi').textContent === '测' || s.push('圆形占位应显示账号名称首字，实际：'+env.nodes.get('zi').textContent);
      return s;
    }},
  { name:'【对照】勾协议 → 手机号快捷登录 → 允许 → 进「我的页」',
    run(env){
      const h = env.clicks[0];
      env.fireClick(h,'agree');
      env.fireClick(h,'phoneLogin');
      const s = [];
      env.nodes.get('phonePanel').classList.contains('show') || s.push('手机号授权面板没弹出');
      env.fireClick(h,'phoneAllow');
      env.flush();
      env.nodes.get('pageMine').classList.contains('on') || s.push('没有进入「我的页」');
      env.nodes.get('unickVal').textContent === '井惠琳' || s.push('昵称沿用失败：'+env.nodes.get('unickVal').textContent);
      env.timerErrs.length && s.push('跳转定时器内抛错：'+env.timerErrs[0]);
      return s;
    }},
  { name:'授权面板多号码：选未注册号码 → 允许 → 提示未注册，停留登录页',
    run(env){
      const h = env.clicks[0];
      env.fireClick(h,'agree'); env.fireClick(h,'phoneLogin');
      const s = [];
      env.nodes.get('phonePanel').classList.contains('show') || s.push('手机号授权面板没弹出');
      /* 默认选中 a=193****2486；切到 b=151****9939 后允许 → 未命中 */
      env.fireClick(h,'pickPhone', 'b');
      env.fireClick(h,'phoneAllow'); env.flush();
      env.nodes.get('toast').textContent === '该手机号没有注册供应商账号' || s.push('未命中提示不对：'+env.nodes.get('toast').textContent);
      env.nodes.get('pageLogin').classList.contains('on') || s.push('未命中后应停留登录页');
      env.nodes.get('pageMine').classList.contains('on') && s.push('未命中不应进入我的页');
      env.nodes.get('phonePanel').classList.contains('show') && s.push('允许后面板未关闭');
      /* 切回 a 再允许 → 正常登录 */
      env.fireClick(h,'phoneLogin'); env.fireClick(h,'pickPhone', 'a'); env.fireClick(h,'phoneAllow'); env.flush();
      env.nodes.get('pageMine').classList.contains('on') || s.push('切回已注册号码后没进入我的页');
      env.timerErrs.length && s.push('定时器内抛错：'+env.timerErrs[0]);
      return s;
    }},
  { name:'退出登录 → 确认 → 回到登录页',
    run(env){
      const h = env.clicks[0];
      env.fireClick(h,'logout');
      env.nodes.get('dlg').classList.contains('show') || s.push('确认弹窗没出现');
      env.fireClick(h,'logoutYes');
      env.flush();
      const s = [];
      env.nodes.get('pageLogin').classList.contains('on') || s.push('没回到登录页');
      env.nodes.get('dlg').classList.contains('show') && s.push('确认弹窗没关闭');
      env.nodes.get('prd-login').classList.contains('on') || s.push('右侧 PRD 没切回 prd-login');
      return s;
    }},
];

function runAll(label, transform){
  console.log('\n══════ ' + label + ' ══════');
  let bad = 0;
  CASES.forEach(c=>{
    let env, err = null, fails = [];
    env = buildEnv(transform ? transform(html) : html);
    if(env.initErr){ console.log('  ! 页面加载时就抛错：' + env.initErr.constructor.name + ': ' + env.initErr.message); }
    try { fails = c.run(env); } catch(e){ err = e; }
    if(err){ console.log('  ✗ ' + c.name + '\n      → 脚本抛错中断：' + err.constructor.name + ': ' + err.message); bad++; }
    else if(fails.length){ console.log('  ✗ ' + c.name + '\n      → ' + fails.join('；')); bad++; }
    else console.log('  ✓ ' + c.name);
  });
  console.log('  结果：' + (bad ? bad + ' / ' + CASES.length + ' 项失败' : '全部通过'));
  return bad;
}

/* A：当前（已修复）  B：还原成修复前的三处写法（$ 不兜底 + 状态判定页优先 + 回写已删节点） */
const beforePage = (src)=> src
  .replace("return document.getElementById(id) || NULL_EL;", "return document.getElementById(id);")
  .replace(/\/\* 判定顺序：半屏层优先于所在页[\s\S]*?: 'mine';/,
    "var key = state.page === 'login' ? 'login'\n            : $('shPwd').classList.contains('show') ? 'pwd'\n            : $('shNick').classList.contains('show') ? 'nick'\n            : 'mine';")
  .replace("/* 目录条与面板都已做存在性判断：任何一个不在，也只跳过它自己 */",
           "$('syncName').textContent = String(key);");

const b1 = runAll('修复前（还原成你操作之前的写法）', beforePage);
runAll('修复后（当前文件）', null);
