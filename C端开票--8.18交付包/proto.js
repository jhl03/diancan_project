(function () {
  function getPageScope(node) {
    return (node && node.closest && node.closest(".bundle-page")) ||
      document.querySelector("#base .bundle-page.active") ||
      document.getElementById("base") ||
      document.body;
  }

  function syncOneTabGroup(pageScope, groupName) {
    if (!pageScope || !groupName) return;
    const buttons = Array.from(
      pageScope.querySelectorAll('.tab-row[data-tab-group="' + groupName + '"] [data-tab-target]')
    );
    if (!buttons.length) return;

    let activeButton = buttons.find((btn) => btn.classList.contains("active"));
    if (!activeButton) {
      activeButton = buttons.find((btn) => window.getComputedStyle(btn).display !== "none") || buttons[0];
    }
    if (!activeButton) return;

    buttons.forEach((item) => {
      item.classList.toggle("active", item === activeButton);
    });

    Array.from(pageScope.querySelectorAll('[data-tab-panel][data-tab-group="' + groupName + '"]')).forEach((panel) => {
      const isActive = panel.getAttribute("data-tab-panel") === activeButton.getAttribute("data-tab-target");
      panel.classList.toggle("active", isActive);
      panel.style.display = isActive ? "" : "none";
    });
  }

  function syncTabGroups(root) {
    const pageScope = getPageScope(root);
    if (!pageScope || !pageScope.querySelectorAll) return;
    const handled = new Set();
    Array.from(pageScope.querySelectorAll(".tab-row[data-tab-group]")).forEach((row) => {
      const groupName = row.getAttribute("data-tab-group");
      if (!groupName || handled.has(groupName)) return;
      handled.add(groupName);
      syncOneTabGroup(pageScope, groupName);
    });
    if (typeof window.__CODEX_PAGE_INIT === "function") {
      try {
        window.__CODEX_PAGE_INIT("protoSyncTabs");
      } catch (error) {}
    }
    if (typeof window.__CODEX_APPLY_TAB_VISIBILITY === "function") {
      try {
        window.__CODEX_APPLY_TAB_VISIBILITY(pageScope);
      } catch (error) {}
    }
  }

  window.__PROTO_SYNC_TABS__ = syncTabGroups;

  document.addEventListener("click", function (event) {
    const btn = event.target.closest("[data-tab-target]");
    if (!btn) return;
    const row = btn.closest("[data-tab-group]");
    if (!row) return;

    const groupName = row.getAttribute("data-tab-group");
    const pageScope = getPageScope(btn);
    if (!groupName || !pageScope) return;

    row.querySelectorAll("[data-tab-target]").forEach((item) => {
      item.classList.toggle("active", item === btn);
    });

    pageScope.querySelectorAll("[data-tab-panel]").forEach((panel) => {
      if (panel.getAttribute("data-tab-group") !== groupName) return;
      const isActive = panel.getAttribute("data-tab-panel") === btn.getAttribute("data-tab-target");
      panel.classList.toggle("active", isActive);
      panel.style.display = isActive ? "" : "none";
    });

    setTimeout(function () { syncTabGroups(pageScope); }, 0);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { syncTabGroups(); });
  } else {
    syncTabGroups();
  }
  window.addEventListener("load", function () { syncTabGroups(); });
  window.addEventListener("pageshow", function () {
    setTimeout(function () { syncTabGroups(); }, 0);
    setTimeout(function () { syncTabGroups(); }, 120);
  });
  window.addEventListener("hashchange", function () {
    setTimeout(function () { syncTabGroups(); }, 0);
  });
})();
