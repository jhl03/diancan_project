(function () {
  try {
    localStorage.setItem("Admin-Token", "supplier-local-token");
  } catch (error) {
    console.warn("本地原型登录态写入失败", error);
  }
})();
