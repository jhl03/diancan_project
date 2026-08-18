
(function(){
  function activePageName(){
    var active = document.querySelector('#base .bundle-page.active');
    return active ? active.getAttribute('data-page') : '';
  }
  function showBundlePage(name, push){
    if (name === "mini-workbench" && typeof window.__ENSURE_MINI_WORKBENCH_PAGE__ === "function") {
      try { window.__ENSURE_MINI_WORKBENCH_PAGE__(); } catch (error) {}
    }
    if (name === "hall" && typeof window.__HALL_REBUILD__ === "function") {
      try { window.__HALL_REBUILD__(); } catch (error) {}
    }
    var base = document.getElementById('base');
    if (!base) return;
    var pages = Array.prototype.slice.call(base.querySelectorAll('.bundle-page'));
    var target = pages.find(function(page){ return page.getAttribute('data-page') === name; }) || pages[0];
    if (!target) return;
    pages.forEach(function(page){ page.classList.toggle('active', page === target); });
    Array.prototype.forEach.call(document.querySelectorAll('.bundle-catalog-link'), function(link){
      link.classList.toggle('active', link.getAttribute('data-page') === target.getAttribute('data-page'));
    });
    if (push) history.replaceState(null, '', '#' + target.getAttribute('data-page'));
    window.scrollTo({top:0,left:0,behavior:'auto'});
    if (typeof window.__PROTO_SYNC_TABS__ === 'function') {
      setTimeout(function(){ window.__PROTO_SYNC_TABS__(target); }, 0);
      setTimeout(function(){ window.__PROTO_SYNC_TABS__(target); }, 120);
    }
    if (typeof window.__CODEX_PAGE_INIT === 'function') {
      setTimeout(function(){
        try { window.__CODEX_PAGE_INIT('bundlePageChange'); } catch (error) {}
      }, 0);
    }
    if (typeof window.__CODEX_APPLY_TAB_VISIBILITY === 'function') {
      setTimeout(function(){
        try { window.__CODEX_APPLY_TAB_VISIBILITY(target); } catch (error) {}
      }, 0);
      setTimeout(function(){
        try { window.__CODEX_APPLY_TAB_VISIBILITY(target); } catch (error) {}
      }, 120);
    }
  }
  window.__CODEx_BUNDLE_SHOW_PAGE = showBundlePage;
  document.addEventListener('click', function(event){
    var link = event.target.closest && event.target.closest('.bundle-catalog-link[data-page]');
    if (!link) return;
    event.preventDefault();
    event.stopPropagation();
    showBundlePage(link.getAttribute('data-page'), true);
  }, true);
  document.addEventListener('click', function(event){
    var toggle = event.target.closest && event.target.closest('#bundle-catalog-toggle');
    if (!toggle) return;
    event.preventDefault();
    event.stopPropagation();
    var collapsed = document.body.classList.toggle('bundle-catalog-collapsed');
    toggle.textContent = collapsed ? '展开目录' : '收起目录';
    toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }, true);
  var initial = (location.hash || '').replace('#','') || 'bg';
  showBundlePage(initial, false);
})();
