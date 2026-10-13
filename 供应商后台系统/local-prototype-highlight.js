(function () {
  function markSecondSupplierMenu() {
    document
      .querySelectorAll(".el-menu a[href^='/supplier/'] .menu-title")
      .forEach(function (item) {
        item.classList.add("second-supplier-menu-highlight");
      });

    document
      .querySelectorAll(".el-menu .el-sub-menu__title .menu-title")
      .forEach(function (item) {
        if (item.textContent.trim() === "二级供应商管理") {
          item.classList.add("second-supplier-group-highlight");
        }
      });
  }

  function observeMenu() {
    markSecondSupplierMenu();
    new MutationObserver(markSecondSupplierMenu).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeMenu);
  } else {
    observeMenu();
  }
})();
