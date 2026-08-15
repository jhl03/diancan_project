
(function () {
  if (window.__HALL_EXPLANATION_PATCH_V1__) return;
  window.__HALL_EXPLANATION_PATCH_V1__ = true;

  function normalizeText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function patchHallExplanation() {
    var page = document.querySelector('.bundle-page[data-page="hall"]');
    if (!page) return;
    Array.prototype.forEach.call(page.querySelectorAll(".note-list"), function (list) {
      var listText = normalizeText(list.textContent || "");
      if (listText.indexOf("抢单规则") === -1 || listText.indexOf("分配规则") === -1) return;
      Array.prototype.forEach.call(list.querySelectorAll("li"), function (item) {
        var text = normalizeText(item.textContent || "");
        if (text.indexOf("第一次多人抢单时") !== -1) {
          item.innerHTML =
            '&nbsp; &nbsp; 第一次多人点击抢单时，随机分配，若第一个人抢单成功的人放弃后，订单回到接单大厅；' +
            '<span style="color: rgb(217, 45, 32);">【倒计时=抢单成功的剩余时间减去在供应商售后补贴单列表的时间】</span>';
        } else if (text.indexOf("若没有候选时") !== -1) {
          item.style.setProperty("display", "none", "important");
        } else if (text.indexOf("若超时未上传状态下") !== -1) {
          item.innerHTML =
            "&nbsp; &nbsp; 若超时未上传状态下，点击 放弃按钮，订单会从该供应商后台处理中页面消失不会在进入接单大厅了，该订单在点餐后台的开票需求单的处理中（供）页面进入到待处理（供）页面";
        }
      });
    });
  }

  function scheduleHallPatch() {
    [0, 80, 220, 500].forEach(function (delay) {
      window.setTimeout(function () {
        patchHallExplanation();
      }, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleHallPatch, { once: true });
  } else {
    scheduleHallPatch();
  }
  window.addEventListener("load", scheduleHallPatch);
  window.addEventListener("pageshow", scheduleHallPatch);
  window.addEventListener("hashchange", scheduleHallPatch);
})();
