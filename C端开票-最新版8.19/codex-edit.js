(function () {
  var EXCLUDED = /(?:index|start|start_c_1|start_with_pages)\.html$/i;
  if (EXCLUDED.test(location.pathname)) return;

  var NAV_TREE = [
    { type: "page", label: "需求背景", file: "需求背景.html" },
    { type: "page", label: "流程图", file: "流程图.html" },
    {
      type: "group",
      label: "本地生活客服工作台",
      children: [
        { label: "发票工单", file: "发票工单.html" },
        { label: "发票工单--订单详情", file: "发票工单--订单详情.html" }
      ]
    },
    {
      type: "group",
      label: "点餐后台",
      children: [
        { label: "供应商管理--供应商列表", file: "供应商管理--供应商列表.html" },
        { label: "运营管理--系统配置项", file: "运营管理--系统配置项.html" },
        { label: "财务管理--结算记录 & 资金账户记录", file: "财务管理--结算记录___资金账户记录.html" },
        { label: "订单管理--*售后单列表", file: "订单管理--_售后单列表.html" }
      ]
    },
    {
      type: "group",
      label: "供应商端【PC】",
      children: [
        { label: "接单大厅", file: "接单大厅.html" },
        { label: "订单管理--*售后单", file: "订单管理--_售后单.html" },
        { label: "结算记录", file: "结算记录.html" }
      ]
    }
  ];

  var currentFile = decodeURIComponent(location.pathname.split("/").pop());
  var currentTemplateVersion = (document.querySelector('meta[name="codex-template-version"]') || {}).content || "";
  var preferDomState = ((document.querySelector('meta[name="codex-prefer-dom"]') || {}).content || "").toLowerCase() === "true";
  var storageKey = "codex_proto_edit::" + location.pathname.replace(/\//g, "::");
  var COPY_HIDE_EXPAND_KEY = "codex-copy-hide-toolbar-expand";

  function applyCopyToolbarExpandVisibility() {
    try {
      if (currentFile === "C端开票(副本).html") sessionStorage.setItem(COPY_HIDE_EXPAND_KEY, "1");
      if (currentFile === "C端开票.html") sessionStorage.removeItem(COPY_HIDE_EXPAND_KEY);
      document.body.classList.toggle("codex-copy-hide-toolbar-expand", sessionStorage.getItem(COPY_HIDE_EXPAND_KEY) === "1");
    } catch (error) {}
  }

  applyCopyToolbarExpandVisibility();
var editMode = false;
  var selected = null;
  var selectedCell = null;
  var selectedNoteItem = null;
  var dragState = null;
  var resizeState = null;
  var textSnapshot = null;
  var undoStack = [];
  var maxUndo = 60;
  var directFileHandle = null;
  var state = loadState();
  var lastTabContext = null;
  var controlBar = null;
  var resizeGrip = null;
  var navPanel = null;
  var navToggle = null;
  var MODULE_SELECTOR = ".ax_default, .codex-added, .codex-control-field, .section, .preview-panel, .field-card, .field-label, .field-value, .button-row, .tab-row, .table-wrap, .order-card, .hero-note, .flow-node, .stat-card, .chip, .chip-row, .ghost-btn, .modal-card, .note-list, .product-shot, .field-grid, .text";
  var MICRO_MODULE_SELECTOR = ".field-label, .field-value, .modal-title, .section-title, .note-list li, .codex-input-mock, .codex-select-mock, .codex-date-mock, .codex-select-options, .meta-line, .product-shot";
  var EDITABLE_TEXT_SELECTOR = ".text, .note-list li, .modal-title, .section-title, .meta-line, .codex-input-mock, .codex-select-mock, .codex-date-mock, .codex-select-options";
  var LEAF_MODULE_SELECTOR = ".ghost-btn, .field-card, .modal-card, .table-wrap, .order-card, .hero-note, .flow-node, .stat-card, .chip, .chip-row, .product-shot, .codex-added, .codex-control-field";
  var LAYOUT_CONTAINER_SELECTOR = ".section, .preview-panel, .button-row, .field-grid, .tab-row";

  function ensureBase() {
    return document.getElementById("base") || document.body;
  }

  function getCurrentBundlePageName() {
    var active = ensureBase().querySelector(".bundle-page.active");
    return active ? active.getAttribute("data-page") || "" : "";
  }

  function getHashBundlePageName() {
    return String(location.hash || "").replace(/^#/, "").trim();
  }

  function restoreBundleActivePage(preferredPageName) {
    var base = ensureBase();
    if (!base || !base.querySelectorAll) return;
    var pages = Array.prototype.slice.call(base.querySelectorAll(".bundle-page"));
    if (!pages.length) return;

    var pageName = getHashBundlePageName() || preferredPageName || getCurrentBundlePageName() || (pages[0].getAttribute("data-page") || "");
    var target = pages.find(function (page) {
      return (page.getAttribute("data-page") || "") === pageName;
    }) || pages[0];
    if (!target) return;

    if (typeof window.__CODEx_BUNDLE_SHOW_PAGE === "function") {
      window.__CODEx_BUNDLE_SHOW_PAGE(target.getAttribute("data-page") || pageName, false);
      return;
    }

    pages.forEach(function (page) {
      page.classList.toggle("active", page === target);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".bundle-catalog-link[data-page]"), function (link) {
      link.classList.toggle("active", link.getAttribute("data-page") === (target.getAttribute("data-page") || ""));
    });
  }

  function getActivePageScope(fromNode) {
    var base = ensureBase();
    if (fromNode && fromNode.closest) {
      var ownPage = fromNode.closest(".bundle-page");
      if (ownPage && base.contains(ownPage)) return ownPage;
    }
    return base.querySelector(".bundle-page.active") || base;
  }

  function getPreferredPageHost(scope, fromNode) {
    if (fromNode && fromNode.closest) {
      var ownShell = fromNode.closest(".main-shell");
      if (ownShell && scope && scope.contains && scope.contains(ownShell)) {
        if (fromNode === ownShell) {
          return ownShell.parentElement && scope.contains(ownShell.parentElement) ? ownShell.parentElement : scope;
        }
        return ownShell;
      }
    }
    if (scope && scope.querySelector) {
      return scope.querySelector(".main-shell") || scope;
    }
    return scope || ensureBase();
  }

  function isActuallyVisible(el) {
    if (!el || !el.ownerDocument) return false;
    var base = ensureBase();
    var node = el;
    while (node && node.nodeType === 1) {
      var style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return false;
      if (node === base) break;
      node = node.parentElement;
    }
    return true;
  }

  function createEmptyState() {
    return { snapshot: "", addedCounter: 0, templateVersion: currentTemplateVersion };
  }

  function getNodeTextSignature(node) {
    return String((node && (node.innerText || node.textContent)) || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isAbsoluteStandaloneNode(node) {
    if (!node || !node.style) return false;
    var computed = getComputedStyle(node);
    return computed.position === "absolute" || String(node.style.position || "").toLowerCase() === "absolute";
  }

  function cleanupLegacyStandaloneDuplicates(root) {
    if (!root || !root.querySelectorAll) return false;
    var changed = false;
    var containerSelector = ".modal-card, .section, .preview-panel, .tab-panel, .bundle-page, .main-shell";
    var containers = [];
    if (root.matches && root.matches(containerSelector)) containers.push(root);
    Array.prototype.push.apply(containers, Array.prototype.slice.call(root.querySelectorAll(containerSelector)));

    containers.forEach(function (container) {
      var noteSignatures = Object.create(null);
      Array.prototype.forEach.call(container.querySelectorAll(".note-list li"), function (item) {
        var signature = getNodeTextSignature(item);
        if (signature) noteSignatures[signature] = true;
      });
      Array.prototype.forEach.call(container.children, function (child) {
        if (child.tagName !== "LI") return;
        if (!isAbsoluteStandaloneNode(child)) return;
        var signature = getNodeTextSignature(child);
        if (!signature || !noteSignatures[signature]) return;
        child.remove();
        changed = true;
      });

      var buttonSignatures = Object.create(null);
      Array.prototype.forEach.call(container.querySelectorAll(".button-row .ghost-btn"), function (button) {
        var signature = getNodeTextSignature(button);
        if (signature) buttonSignatures[signature] = true;
      });
      Array.prototype.forEach.call(container.children, function (child) {
        if (!child.classList || !child.classList.contains("ghost-btn")) return;
        if (!isAbsoluteStandaloneNode(child)) return;
        var signature = getNodeTextSignature(child);
        if (!signature || !buttonSignatures[signature]) return;
        child.remove();
        changed = true;
      });

      var titleSignatures = Object.create(null);
      Array.prototype.forEach.call(container.querySelectorAll(".modal-title, .section-title"), function (title) {
        var signature = getNodeTextSignature(title);
        if (signature) titleSignatures[signature] = true;
      });
      Array.prototype.forEach.call(container.children, function (child) {
        if (!child.classList) return;
        if (!child.classList.contains("modal-title") && !child.classList.contains("section-title")) return;
        if (!isAbsoluteStandaloneNode(child)) return;
        var signature = getNodeTextSignature(child);
        if (!signature || !titleSignatures[signature]) return;
        child.remove();
        changed = true;
      });
    });

    return changed;
  }

  function cloneStateValue(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function getEmbeddedState() {
    if (!window.__CODEX_INITIAL_STATE) return null;
    var embeddedState = cloneStateValue(window.__CODEX_INITIAL_STATE);
    if (currentTemplateVersion && embeddedState.templateVersion && embeddedState.templateVersion !== currentTemplateVersion) {
      return null;
    }
    return embeddedState;
  }

  function loadState() {
    try {
      var local = localStorage.getItem(storageKey);
      var parsedLocal = null;
      if (local) {
        parsedLocal = JSON.parse(local);
        if (currentTemplateVersion && parsedLocal.templateVersion && parsedLocal.templateVersion !== currentTemplateVersion) {
          parsedLocal = null;
        }
      }
      var embeddedState = getEmbeddedState();
      if (preferDomState && embeddedState) return embeddedState;
      if (parsedLocal) return parsedLocal;
      if (embeddedState) return embeddedState;
      return createEmptyState();
    } catch (e) {
      return createEmptyState();
    }
  }

  function tryWriteStateToLocalStorage(payload) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload || {}));
      return true;
    } catch (error) {
      return false;
    }
  }

  function cleanupOtherPrototypeStorage() {
    try {
      var prefix = "codex_proto_edit::";
      var keys = [];
      for (var index = 0; index < localStorage.length; index += 1) {
        var key = localStorage.key(index);
        if (!key || key === storageKey) continue;
        if (key.indexOf(prefix) !== 0) continue;
        keys.push(key);
      }
      keys.forEach(function (key) {
        localStorage.removeItem(key);
      });
    } catch (error) {
    }
  }

  function saveState() {
    state.templateVersion = currentTemplateVersion;
    if (tryWriteStateToLocalStorage(state)) return;
    cleanupOtherPrototypeStorage();
    if (tryWriteStateToLocalStorage(state)) return;
    tryWriteStateToLocalStorage({
      snapshot: "",
      addedCounter: state.addedCounter || 0,
      templateVersion: currentTemplateVersion
    });
  }

  function fileSafeName() {
    return currentFile.replace(/\.html$/i, "").replace(/[\\/:*?"<>|]/g, "_");
  }

  function getTimestampedBaseName() {
    var base = fileSafeName()
      .replace(/-编辑副本$/i, "")
      .replace(/-\d{8}-\d{6}$/i, "")
      .replace(/\s+\(\d+\)$/i, "");
    var now = new Date();
    var pad = function (value) { return String(value).padStart(2, "0"); };
    var timestamp =
      String(now.getFullYear()) +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      "-" +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds());
    return base + "-" + timestamp;
  }

  function downloadFile(name, content, type) {
    var blob = new Blob([content], { type: type || "application/octet-stream" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
      link.remove();
    }, 1000);
  }

  function encodeBase64(text) {
    var utf8Bytes = new TextEncoder().encode(String(text || ""));
    var binary = "";
    var chunkSize = 32768;
    for (var index = 0; index < utf8Bytes.length; index += chunkSize) {
      var chunk = utf8Bytes.subarray(index, index + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }
    return btoa(binary);
  }

  function normalizeLocalFilePath(pathname) {
    var normalized = decodeURIComponent(String(pathname || ""));
    normalized = normalized.replace(/\//g, "\\");
    normalized = normalized.replace(/^\\+([A-Za-z]:\\)/, "$1");
    return normalized;
  }

  function getCurrentFilePath() {
    if (location.protocol !== "file:") return "";
    return normalizeLocalFilePath(location.pathname || "");
  }

  function uniquePaths(paths) {
    var seen = Object.create(null);
    return (paths || []).filter(function (item) {
      if (!item) return false;
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }

  function fileNameFromPath(filePath) {
    return String(filePath || "").split(/[\\/]/).pop() || "";
  }

  function filePathToDirectoryHref(filePath) {
    var normalized = String(filePath || "").replace(/\\/g, "/");
    normalized = normalized.replace(/\/[^\/]*$/, "/");
    if (!normalized) return "";
    if (/^[a-z]+:\/\//i.test(normalized)) return normalized;
    return "file:///" + normalized.replace(/^\/+/, "");
  }

  function getCurrentBaseHref() {
    var baseEl = document.querySelector("base[href]");
    if (baseEl && baseEl.href) return baseEl.href;
    return location.href.replace(/[^\/?#]+(?:[?#].*)?$/, "");
  }

  function getBaselineSavePlan() {
    var currentPath = getCurrentFilePath();
    var targetPaths = [];
    var baselinePath = currentPath;
    var label = currentFile || "当前页面";
    var packageDir = "C:\\Users\\Lenovo\\Documents\\Codex\\2026-06-18\\new-chat\\outputs\\meal_invoice_purecode_rebuild_20260722";
    var downloadsDir = "C:\\Users\\Lenovo\\Downloads";
    var packagePages = [
      "需求背景.html",
      "流程图.html",
      "发票工单.html",
      "发票工单--订单详情.html",
      "供应商管理--供应商列表.html",
      "运营管理--系统配置项.html",
      "财务管理--结算记录___资金账户记录.html",
      "订单管理--_售后单列表.html",
      "接单大厅.html",
      "订单管理--_售后单.html",
      "__售后单.html",
      "结算记录.html"
    ];

    if (currentFile === "C端开票.html" || currentFile === "C端开票(副本).html") {
      label = "C端开票";
      targetPaths = [
        currentPath,
        downloadsDir + "\\订单管理--_售后单列表.html",
        downloadsDir + "\\订单管理--_售后单列表-编辑副本 (4).html",
        packageDir + "\\订单管理--_售后单列表.html",
        "C:\\Users\\Lenovo\\Documents\\Codex\\2026-06-18\\new-chat\\outputs\\订单管理--_售后单列表-编辑副本-20260724.html",
        "C:\\Users\\Lenovo\\Documents\\Codex\\2026-06-18\\new-chat\\outputs\\订单管理--_售后单列表-编辑副本-20260723.html"
      ];
    } else if (currentFile.indexOf("订单管理--_售后单列表") === 0) {
      baselinePath = packageDir + "\\订单管理--_售后单列表.html";
      label = "后台售后单列表";
      targetPaths = [
        baselinePath,
        downloadsDir + "\\订单管理--_售后单列表.html",
        "C:\\Users\\Lenovo\\Documents\\Codex\\2026-06-18\\new-chat\\outputs\\订单管理--_售后单列表-编辑副本-20260724.html",
        "C:\\Users\\Lenovo\\Documents\\Codex\\2026-06-18\\new-chat\\outputs\\订单管理--_售后单列表-编辑副本-20260723.html"
      ];
    } else if (currentFile.indexOf("__售后单") === 0 || currentFile.indexOf("订单管理--_售后单") === 0) {
      baselinePath = packageDir + "\\订单管理--_售后单.html";
      label = "供应商售后单";
      targetPaths = [
        baselinePath,
        packageDir + "\\__售后单.html",
        downloadsDir + "\\订单管理--_售后单.html",
        downloadsDir + "\\__售后单.html",
        "C:\\Users\\Lenovo\\Documents\\Codex\\2026-06-18\\new-chat\\outputs\\__售后单-编辑副本-20260724.html",
        "C:\\Users\\Lenovo\\Downloads\\__售后单-编辑副本 (2).html"
      ];
    } else if (packagePages.indexOf(currentFile) >= 0) {
      baselinePath = packageDir + "\\" + currentFile;
      label = currentFile.replace(/\.html$/i, "");
      targetPaths = [baselinePath, downloadsDir + "\\" + currentFile];
    }

    if (currentPath) targetPaths.push(currentPath);
    if (!targetPaths.length && currentPath) targetPaths.push(currentPath);

    return {
      baselinePath: baselinePath || currentPath || "",
      targetPaths: uniquePaths(targetPaths),
      label: label
    };
  }

  function getNavigationBaseHref() {
    return location.href.replace(/[^\/]+(?:[?#].*)?$/, "");
  }

  function buildNavFileHref(fileName) {
    if (!fileName) return "#";
    try {
      return new URL(fileName, getNavigationBaseHref()).href;
    } catch (error) {
      return fileName;
    }
  }

  function getServerSaveEndpoints() {
    if (location.protocol.indexOf("http") === 0) {
      return ["/api/codex-prototype-file-save", "http://127.0.0.1:8765/api/codex-prototype-file-save"];
    }
    return ["http://127.0.0.1:8765/api/codex-prototype-file-save"];
  }

  async function fetchWithTimeout(resource, options, timeoutMs) {
    var timeout = Math.max(1000, Number(timeoutMs || 0) || 6000);
    if (typeof AbortController !== "function") {
      return await fetch(resource, options);
    }
    var controller = new AbortController();
    var timer = setTimeout(function () {
      try {
        controller.abort();
      } catch (error) {}
    }, timeout);
    try {
      var nextOptions = Object.assign({}, options || {}, { signal: controller.signal });
      return await fetch(resource, nextOptions);
    } finally {
      clearTimeout(timer);
    }
  }

  async function saveHtmlViaLocalServer(html, savePlan) {
    if (!savePlan || !savePlan.targetPaths || !savePlan.targetPaths.length || typeof fetch !== "function") return null;
    var payload = {
      htmlBase64: encodeBase64(html),
      targetPaths: savePlan.targetPaths
    };

    var endpoints = getServerSaveEndpoints();
    for (var index = 0; index < endpoints.length; index += 1) {
      var endpoint = endpoints[index];
      try {
        var response = await fetchWithTimeout(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
          },
          body: JSON.stringify(payload)
        }, 6000);
        if (!response.ok) continue;
        var responsePayload = await response.json();
        if (responsePayload && responsePayload.ok) {
          return responsePayload;
        }
      } catch (error) {
      }
    }

    return null;
  }

  async function ensureWritablePermission(handle) {
    if (!handle) return false;
    if (!handle.queryPermission || !handle.requestPermission) return true;
    var options = { mode: "readwrite" };
    if ((await handle.queryPermission(options)) === "granted") return true;
    if ((await handle.requestPermission(options)) === "granted") return true;
    return false;
  }

  async function requestWritableFileHandle(savePlan) {
    var suggestedName = fileSafeName() + ".html";
    if (savePlan && savePlan.baselinePath) {
      suggestedName = fileNameFromPath(savePlan.baselinePath) || suggestedName;
    }
    var pickerOptions = {
      suggestedName: suggestedName,
      types: [
        {
          description: "HTML 文件",
          accept: { "text/html": [".html"] }
        }
      ]
    };

    if ("showSaveFilePicker" in window) {
      return await window.showSaveFilePicker(pickerOptions);
    }

    if ("showOpenFilePicker" in window) {
      var handles = await window.showOpenFilePicker({
        multiple: false,
        types: pickerOptions.types
      });
      return handles && handles[0] ? handles[0] : null;
    }

    return null;
  }

  async function saveHtmlWithFileHandle(html, savePlan) {
    if (!("showSaveFilePicker" in window) && !("showOpenFilePicker" in window)) return null;
    if (!directFileHandle) {
      directFileHandle = await requestWritableFileHandle(savePlan);
    }
    if (!directFileHandle) return null;
    if (!(await ensureWritablePermission(directFileHandle))) {
      throw new Error("未获得文件写入权限");
    }

    var writable = await directFileHandle.createWritable();
    await writable.write(html);
    await writable.close();

    return {
      savedFiles: [directFileHandle.name || fileSafeName() + ".html"]
    };
  }

  function syncSavedBaselineState() {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
    }
    window.__CODEX_INITIAL_STATE = cloneStateValue(state);
  }

  async function persistEditablePage() {
    state.snapshot = snapshotBase();
    saveState();
    var html = buildStandaloneHtml();
    var savePlan = getBaselineSavePlan();
    var serverResult = await saveHtmlViaLocalServer(html, savePlan);
    if (serverResult) {
      syncSavedBaselineState();
      return {
        ok: true,
        mode: "baseline",
        message: "已保存到基线，并同步关联页面文件。",
        savedFiles: serverResult.savedFiles || savePlan.targetPaths
      };
    }

    try {
      var fileHandleResult = await saveHtmlWithFileHandle(html, savePlan);
      if (fileHandleResult) {
        syncSavedBaselineState();
        return {
          ok: true,
          mode: "file-handle",
          message: "本地服务不可用，已通过浏览器文件写入保存 HTML 文件。",
          savedFiles: fileHandleResult.savedFiles || []
        };
      }
    } catch (error) {
      return {
        ok: false,
        mode: "cache",
        message: "未连接本地保存服务，且文件写入失败：" + (error && error.message ? error.message : "未知错误") + "。本次仍只保存在浏览器本地缓存。"
      };
    }

    return {
      ok: false,
      mode: "cache",
      message: "未连接本地保存服务，且当前浏览器未提供文件写入权限。本次仍只保存在浏览器本地缓存。"
    };
  }

  function exportStateFile() {
    commitSnapshot();
    downloadFile(getTimestampedBaseName() + ".codex-state.json", JSON.stringify(state, null, 2), "application/json;charset=utf-8");
  }

  function buildStandaloneHtml() {
    commitSnapshot();
    var clone = document.documentElement.cloneNode(true);
    cleanupLegacyStandaloneDuplicates(clone);
    flattenPinnedArtifacts(clone);
    Array.prototype.forEach.call(clone.querySelectorAll(".codex-edit-toolbar,.codex-edit-nav,.codex-edit-nav-toggle,.codex-control-box,.codex-resize-grip"), function (el) {
      el.remove();
    });
    Array.prototype.forEach.call(clone.querySelectorAll("script"), function (el) {
      if (!el.src && /window\.__CODEX_INITIAL_STATE\s*=/.test(el.textContent || "")) {
        el.remove();
      }
    });
    Array.prototype.forEach.call(clone.querySelectorAll(".codex-selected,.codex-cell-selected,.codex-row-selected"), function (el) {
      el.classList.remove("codex-selected", "codex-cell-selected", "codex-row-selected");
    });
    Array.prototype.forEach.call(clone.querySelectorAll("[contenteditable]"), function (el) {
      el.removeAttribute("contenteditable");
    });

    var head = clone.querySelector("head");
    Array.prototype.forEach.call(head.querySelectorAll("base"), function (el) {
      el.remove();
    });
    // Keep saved HTML portable: resources and directory links stay relative to the file location.
    var preload = document.createElement("script");
    preload.textContent = "window.__CODEX_INITIAL_STATE = " + JSON.stringify(state).replace(/</g, "\\u003c") + ";";
    var codexScript = clone.querySelector('script[src*="codex-edit.js"]');
    if (codexScript && codexScript.parentNode) codexScript.parentNode.insertBefore(preload, codexScript);
    else clone.querySelector("body").appendChild(preload);

    return "<!DOCTYPE html>\n" + clone.outerHTML;
  }

  function exportEditableCopy() {
    downloadFile(getTimestampedBaseName() + ".html", buildStandaloneHtml(), "text/html;charset=utf-8");
  }

  function importStateText(text) {
    var parsed = JSON.parse(text || "{}");
    state = {
      snapshot: parsed.snapshot || "",
      addedCounter: parsed.addedCounter || 0,
      templateVersion: currentTemplateVersion
    };
    saveState();
    restoreSnapshot(state.snapshot || ensureBase().innerHTML);
  }

  function cleanSnapshotHtml(base) {
    cleanupLegacyStandaloneDuplicates(base);
    Array.prototype.forEach.call(base.querySelectorAll(".codex-selected"), function (el) {
      el.classList.remove("codex-selected");
    });
    Array.prototype.forEach.call(base.querySelectorAll(".codex-cell-selected"), function (el) {
      el.classList.remove("codex-cell-selected");
    });
    Array.prototype.forEach.call(base.querySelectorAll(".codex-row-selected"), function (el) {
      el.classList.remove("codex-row-selected");
    });
    Array.prototype.forEach.call(base.querySelectorAll("[contenteditable]"), function (el) {
      el.removeAttribute("contenteditable");
    });
    return base.innerHTML;
  }

  function snapshotBase() {
    return cleanSnapshotHtml(ensureBase().cloneNode(true));
  }

  function pushUndo() {
    undoStack.push(snapshotBase());
    if (undoStack.length > maxUndo) undoStack.shift();
  }

  function commitSnapshot() {
    state.snapshot = snapshotBase();
    saveState();
  }

  function restoreSnapshot(html) {
    var preservedPageName = getCurrentBundlePageName();
    ensureBase().innerHTML = html;
    restoreBundleActivePage(preservedPageName);
    cleanupLegacyPinnedArtifacts();
    reconcilePinnedArtifacts();
    cleanupLegacyStandaloneDuplicates(ensureBase());
    clearSelection();
    setEditable(editMode);
    applyTabScopedVisibility();
    state.snapshot = snapshotBase();
    saveState();
    if (typeof window.__CODEX_PAGE_INIT === "function") {
      try {
        window.__CODEX_PAGE_INIT("restoreSnapshot");
        applyTabScopedVisibility();
      } catch (err) {
        console.warn("codex page init failed after restoreSnapshot", err);
      }
    }
  }

  function applyState() {
    var preservedPageName = getCurrentBundlePageName();
    var base = ensureBase();
    var hasLiveBundlePages = !!(base && base.querySelector && base.querySelector(".bundle-page"));
    if (preferDomState && hasLiveBundlePages) {
      cleanupLegacyPinnedArtifacts();
      reconcilePinnedArtifacts();
      restoreBundleActivePage(preservedPageName);
      applyTabScopedVisibility();
      state.snapshot = snapshotBase();
      saveState();
      return;
    }
    if (state.snapshot) ensureBase().innerHTML = state.snapshot;
    restoreBundleActivePage(preservedPageName);
    cleanupLegacyPinnedArtifacts();
    reconcilePinnedArtifacts();
    applyTabScopedVisibility();
    if (cleanupLegacyStandaloneDuplicates(ensureBase())) {
      state.snapshot = snapshotBase();
      saveState();
    }
  }

  function clearModuleSelection() {
    Array.prototype.forEach.call(document.querySelectorAll(".codex-selected"), function (el) {
      el.classList.remove("codex-selected");
    });
    selected = null;
  }

  function clearCellSelection() {
    Array.prototype.forEach.call(document.querySelectorAll(".codex-cell-selected"), function (el) {
      el.classList.remove("codex-cell-selected");
    });
    Array.prototype.forEach.call(document.querySelectorAll(".codex-row-selected"), function (el) {
      el.classList.remove("codex-row-selected");
    });
    selectedCell = null;
  }

  function clearNoteSelection() {
    Array.prototype.forEach.call(document.querySelectorAll(".codex-note-item-selected"), function (el) {
      el.classList.remove("codex-note-item-selected");
    });
    selectedNoteItem = null;
  }

  function hideControls() {
    if (controlBar) controlBar.classList.add("hidden");
    if (resizeGrip) resizeGrip.classList.add("hidden");
  }

  function clearSelection() {
    clearModuleSelection();
    clearCellSelection();
    clearNoteSelection();
    hideControls();
  }

  function isEditingUi(target) {
    return !!(
      target &&
      (
        target.closest(".codex-edit-toolbar") ||
        target.closest(".codex-edit-nav") ||
        target.closest(".codex-edit-nav-toggle") ||
        target.closest(".codex-control-box") ||
        target.closest(".codex-resize-grip") ||
        target.closest("#subsidy-edit-trigger") ||
        target.closest(".subsidy-btn") ||
        target.closest(".subsidy-rule-input") ||
        target.closest(".timer-config-edit-trigger") ||
        target.closest(".timer-config-cancel") ||
        target.closest(".timer-config-save") ||
        target.closest(".timer-config-input") ||
        target.closest(".timer-config-select") ||
        target.closest(".mini-search-submit") ||
        target.closest(".mini-filter-trigger") ||
        target.closest(".mini-brand-option") ||
        target.closest(".mini-brand-reset") ||
        target.closest(".mini-brand-done") ||
        target.closest(".mini-my-entry") ||
        target.closest(".mini-after-sale-detail-trigger") ||
        target.closest(".mini-after-sale-open-detail") ||
        target.closest(".mini-after-sale-thumb-open") ||
        target.closest(".mini-after-sale-card-action") ||
        target.closest(".mini-after-sale-list-back") ||
        target.closest(".mini-after-sale-back") ||
        target.closest(".mini-after-sale-detail-action") ||
        target.closest(".mini-after-sale-upload-trigger") ||
        target.closest(".mini-upload-file-trigger") ||
        target.closest(".mini-after-sale-upload-close") ||
        target.closest(".mini-after-sale-upload-submit") ||
        target.closest(".mini-after-sale-abandon-close") ||
        target.closest(".mini-after-sale-abandon-submit") ||
        target.closest(".mini-after-sale-chat-close") ||
        target.closest(".mini-chat-select") ||
        target.closest(".mini-chat-file") ||
        target.closest(".mini-uploaded-file-delete") ||
        target.closest(".mini-after-sale-file-close") ||
        target.closest(".mini-after-sale-file-open") ||
        target.closest(".mini-modal-close-x") ||
        target.closest(".mini-inline-modal-mask")
      )
    );
  }

  function escapePreviewHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function getPreviewImageInfo(target) {
    if (!target || !target.closest) return null;
    var block = target.closest(".image-block");
    if (!block || !ensureBase().contains(block)) return null;
    var image = block.querySelector("img[src]");
    if (!image) return null;
    return {
      src: image.currentSrc || image.getAttribute("src") || "",
      alt: image.getAttribute("alt") || "图片预览"
    };
  }

  function openImagePreview(target) {
    var preview = getPreviewImageInfo(target);
    if (!preview || !preview.src) return false;
    var previewWindow = window.open("", "_blank");
    if (!previewWindow) return true;
    var title = escapePreviewHtml(preview.alt);
    var src = escapePreviewHtml(preview.src);
    previewWindow.document.open();
    previewWindow.document.write(
      "<!DOCTYPE html><html lang=\"zh-CN\"><head><meta charset=\"utf-8\"><title>" + title + "</title>" +
      "<style>html,body{height:100%;margin:0;background:#0f172a}body{display:flex;align-items:center;justify-content:center;overflow:hidden}" +
      "img{max-width:100vw;max-height:100vh;object-fit:contain;cursor:zoom-out}.hint{position:fixed;top:16px;left:50%;transform:translateX(-50%);" +
      "padding:8px 12px;border-radius:999px;background:rgba(15,23,42,.72);color:#fff;font:12px/1.2 'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif}</style></head>" +
      "<body><div class=\"hint\">点击图片关闭</div><img src=\"" + src + "\" alt=\"" + title + "\">" +
      "<script>document.body.addEventListener('click',function(event){if(event.target.tagName==='IMG'){window.close();}});<\/script></body></html>"
    );
    previewWindow.document.close();
    previewWindow.focus();
    return true;
  }

  function isSelectableNode(node) {
    return !!(node && node.matches && node.matches(MODULE_SELECTOR));
  }

  function getSelectedModules() {
    return Array.prototype.slice.call(document.querySelectorAll(".codex-selected"));
  }

  function pruneSelectionHierarchy(target) {
    if (!target || !target.contains) return;
    Array.prototype.forEach.call(getSelectedModules(), function (module) {
      if (module === target) return;
      if (module.contains(target) || target.contains(module)) {
        module.classList.remove("codex-selected");
      }
    });
  }

  function syncPrimarySelection() {
    if (selected && selected.classList && selected.classList.contains("codex-selected")) return;
    var modules = getSelectedModules();
    selected = modules.length ? modules[modules.length - 1] : null;
  }

  function markModuleSelected(el) {
    if (!el) return;
    el.classList.add("codex-selected");
  }

  function selectModule(el) {
    clearModuleSelection();
    selected = el;
    if (selected) {
      pruneSelectionHierarchy(selected);
      markModuleSelected(selected);
      updateControls();
    }
  }

  function toggleModuleSelection(el) {
    if (!el) return;
    if (el.classList.contains("codex-selected")) {
      el.classList.remove("codex-selected");
      syncPrimarySelection();
      updateControls();
      return;
    }
    pruneSelectionHierarchy(el);
    markModuleSelected(el);
    selected = el;
    updateControls();
  }

  function setModuleSelection(modules, primary) {
    clearModuleSelection();
    Array.prototype.forEach.call(modules || [], function (module) {
      markModuleSelected(module);
    });
    selected = primary || ((modules && modules.length) ? modules[modules.length - 1] : null);
    updateControls();
  }

  function hasMultiSelectModifier(event) {
    return !!(event && (event.ctrlKey || event.metaKey || event.shiftKey));
  }

  function resolveGroupDragTarget(module) {
    if (!module || !module.closest) return module;
    if (module.classList && (module.classList.contains("meta-line") || module.classList.contains("product-shot"))) {
      return module;
    }
    if (module.classList && module.classList.contains("text")) {
      if (module.parentElement && module.parentElement.classList.contains("order-card")) {
        return module;
      }
      if (module.parentElement && module.parentElement.classList.contains("ghost-btn")) {
        return module.parentElement;
      }
    }
    if (module.matches && module.matches(MICRO_MODULE_SELECTOR + ", .text")) {
      return module.closest(".field-card, .ghost-btn, .modal-card, .note-list, .table-wrap, .order-card, .hero-note, .flow-node, .stat-card, .chip, .chip-row, .product-shot, .codex-added, .codex-control-field") || module;
    }
    return module;
  }

  function normalizeGroupDragModules(modules) {
    var picked = [];
    (modules || []).forEach(function (module) {
      var target = resolveGroupDragTarget(module);
      if (!target) return;
      if (picked.indexOf(target) !== -1) return;
      picked.push(target);
    });
    return picked.filter(function (candidate) {
      return !picked.some(function (other) {
        return other !== candidate && other.contains && other.contains(candidate);
      });
    });
  }

  function getSelectionRect() {
    var modules = getSelectedModules();
    if (!modules.length) return null;
    var bounds = {
      left: Number.POSITIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY
    };
    Array.prototype.forEach.call(modules, function (module) {
      var rect = module.getBoundingClientRect();
      bounds.left = Math.min(bounds.left, rect.left);
      bounds.top = Math.min(bounds.top, rect.top);
      bounds.right = Math.max(bounds.right, rect.right);
      bounds.bottom = Math.max(bounds.bottom, rect.bottom);
    });
    return bounds;
  }

  function selectCell(cell) {
    clearCellSelection();
    selectedCell = cell;
    if (cell) {
      cell.classList.add("codex-cell-selected");
      if (cell.parentElement) cell.parentElement.classList.add("codex-row-selected");
    }
  }

  function selectNoteItem(item) {
    clearNoteSelection();
    selectedNoteItem = item;
    if (selectedNoteItem) {
      selectedNoteItem.classList.add("codex-note-item-selected");
    }
  }

  function getModuleTarget(target) {
    if (!target) return null;
    if (isEditingUi(target)) return null;

    var micro = target.closest(MICRO_MODULE_SELECTOR);
    if (micro && ensureBase().contains(micro)) return micro;

    var leaf = target.closest(LEAF_MODULE_SELECTOR);
    if (leaf && ensureBase().contains(leaf)) return leaf;

    var previewPanel = target.closest(".preview-panel");
    if (previewPanel && ensureBase().contains(previewPanel)) {
      var panelTitle = previewPanel.firstElementChild;
      if (panelTitle && panelTitle.classList && panelTitle.classList.contains("field-label") && panelTitle.contains(target)) {
        return previewPanel;
      }
      if (!target.closest(".modal-card")) {
        return previewPanel;
      }
    }

    var sectionContainer = target.closest(".section.ax_default");
    if (sectionContainer && ensureBase().contains(sectionContainer)) {
      return sectionContainer;
    }

    if (target.matches && target.matches(LAYOUT_CONTAINER_SELECTOR)) {
      return null;
    }

    var layoutContainer = target.closest(LAYOUT_CONTAINER_SELECTOR);
    if (layoutContainer && layoutContainer === target) {
      return null;
    }

    var generic = target.closest(".ax_default, .codex-added, .codex-control-field, .text");
    if (generic && generic !== ensureBase()) return generic;
    return target.closest(MODULE_SELECTOR);
  }

  function stripContainerVisual(el) {
    el.classList.add("codex-visual-cleared");
    el.style.background = "transparent";
    el.style.border = "0";
    el.style.boxShadow = "none";
  }

  function hasNestedEditableChildren(el) {
    if (!el || !el.querySelector) return false;
    return !!el.querySelector(".field-card, .modal-card, .button-row, .note-list, .field-grid, .table-wrap, .ghost-btn");
  }

  function isProtectedLayoutContainer(el) {
    return !!(
      el &&
      el.matches &&
      el.matches(LAYOUT_CONTAINER_SELECTOR) &&
      hasNestedEditableChildren(el)
    );
  }

  function getProtectedLayoutModules(modules) {
    return (modules || []).filter(function (module) {
      return isProtectedLayoutContainer(module);
    });
  }

  function ensureModulesOperable(modules, actionLabel) {
    var blocked = getProtectedLayoutModules(modules);
    if (!blocked.length) return true;
    window.alert("当前选中的是布局容器层。请先点中里面的小模块，再" + actionLabel + "。");
    return false;
  }

  function getPinnedSourceIdFromTarget(el) {
    if (!el || !el.dataset) return "";
    return el.dataset.codexPinnedSourceId || "";
  }

  function getDeleteTarget(el) {
    if (!el) return null;
    if (el.classList && el.classList.contains("preview-panel") && ensureBase().contains(el)) {
      return el;
    }
    var previewPanel = el.closest && el.closest(".preview-panel");
    if (previewPanel && ensureBase().contains(previewPanel) && previewPanel === el) {
      return previewPanel;
    }
    return el;
  }

  function isPinnedClone(el) {
    return !!(el && el.dataset && el.dataset.codexPinnedClone === "true");
  }

  function nextPinnedSourceId() {
    state.addedCounter = (state.addedCounter || 0) + 1;
    saveState();
    return "codex_pinned_" + state.addedCounter;
  }

  function getLayoutProxySourceId(el) {
    return el && el.dataset ? el.dataset.codexLayoutSourceId || "" : "";
  }

  function findLayoutProxyBySourceId(sourceId) {
    if (!sourceId) return null;
    return document.querySelector('[data-codex-layout-proxy="true"][data-codex-layout-source-id="' + sourceId + '"]');
  }

  function findLayoutSourceByProxyId(sourceId) {
    if (!sourceId) return null;
    return document.querySelector('[data-codex-layout-source-id="' + sourceId + '"]:not([data-codex-layout-proxy="true"])');
  }

  function rememberLayoutSourceVisual(source) {
    if (!source || !source.dataset) return;
    if (
      source.dataset.codexLayoutBg !== undefined &&
      source.dataset.codexLayoutBorder !== undefined &&
      source.dataset.codexLayoutShadow !== undefined
    ) {
      return;
    }
    var computed = getComputedStyle(source);
    source.dataset.codexLayoutBg = computed.backgroundColor || "";
    source.dataset.codexLayoutBorder = computed.border || "";
    source.dataset.codexLayoutShadow = computed.boxShadow || "";
    source.dataset.codexLayoutRadius = computed.borderRadius || "";
    source.dataset.codexLayoutOpacity = computed.opacity || "";
  }

  function syncLayoutProxyVisual(proxy, source) {
    if (!proxy || !source) return;
    rememberLayoutSourceVisual(source);
    proxy.className = source.className + " codex-layout-proxy";
    proxy.style.background = source.dataset.codexLayoutBg || "";
    proxy.style.border = source.dataset.codexLayoutBorder || "";
    proxy.style.borderRadius = source.dataset.codexLayoutRadius || "";
    proxy.style.boxShadow = source.dataset.codexLayoutShadow || "";
    proxy.style.opacity = source.dataset.codexLayoutOpacity || "";
    proxy.style.pointerEvents = "none";
  }

  function maskLayoutSourceVisual(source) {
    if (!source || !source.dataset) return;
    rememberLayoutSourceVisual(source);
    source.dataset.codexLayoutSource = "true";
    stripContainerVisual(source);
  }

  function restoreLayoutSourceVisual(source) {
    if (!source || !source.dataset) return;
    if (source.dataset.codexLayoutSource !== "true") return;
    source.style.background = source.dataset.codexLayoutBg || "";
    source.style.border = source.dataset.codexLayoutBorder || "";
    source.style.boxShadow = source.dataset.codexLayoutShadow || "";
    if (source.dataset.codexLayoutRadius !== undefined) source.style.borderRadius = source.dataset.codexLayoutRadius || "";
    if (source.dataset.codexLayoutOpacity !== undefined) source.style.opacity = source.dataset.codexLayoutOpacity || "";
    delete source.dataset.codexLayoutSource;
  }

  function createLayoutProxy(source) {
    if (!source || !isProtectedLayoutContainer(source)) return source;
    var host = ensurePositionedHost(getTabScopedHost(source));
    var relativeRect = getHostRelativeRect(source, host);
    var sourceId = getLayoutProxySourceId(source) || nextPinnedSourceId();
    if (source.dataset && source.dataset.codexLayoutDetached === "true") {
      source.dataset.codexLayerElement = "true";
      return source;
    }
    var originalParent = source.parentElement;
    var proxy = findLayoutProxyBySourceId(sourceId);
    if (!proxy) {
      proxy = document.createElement("div");
      proxy.dataset.codexLayoutProxy = "true";
      proxy.dataset.codexLayoutSourceId = sourceId;
    }
    if (originalParent && proxy.parentElement !== originalParent) {
      originalParent.insertBefore(proxy, source);
    }
    source.dataset.codexLayoutSourceId = sourceId;
    proxy.className = "codex-layout-placeholder";
    proxy.style.display = "block";
    proxy.style.width = relativeRect.width + "px";
    proxy.style.height = relativeRect.height + "px";
    proxy.style.minWidth = relativeRect.width + "px";
    proxy.style.minHeight = relativeRect.height + "px";
    proxy.style.marginTop = getComputedStyle(source).marginTop || "0px";
    proxy.style.marginRight = getComputedStyle(source).marginRight || "0px";
    proxy.style.marginBottom = getComputedStyle(source).marginBottom || "0px";
    proxy.style.marginLeft = getComputedStyle(source).marginLeft || "0px";
    proxy.style.visibility = "hidden";
    proxy.style.pointerEvents = "none";
    proxy.style.border = "0";
    proxy.style.background = "transparent";
    proxy.style.boxShadow = "none";
    proxy.style.padding = "0";
    proxy.style.flex = "0 0 auto";
    source.dataset.codexLayoutDetached = "true";
    source.dataset.codexLayerElement = "true";
    if (source.parentElement !== host) {
      host.appendChild(source);
    }
    setModuleFrameStyle(source, "position", "absolute");
    setModuleFrameStyle(source, "left", relativeRect.left + "px");
    setModuleFrameStyle(source, "top", relativeRect.top + "px");
    setModuleFrameStyle(source, "width", relativeRect.width + "px");
    setModuleFrameStyle(source, "height", relativeRect.height + "px");
    source.style.margin = "0";
    source.style.maxWidth = "none";
    source.style.minWidth = "80px";
    source.style.minHeight = "40px";
    source.style.zIndex = "2147481900";
    setEditable(editMode);
    return source;
  }

  function cleanupLegacyPinnedArtifacts() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-codex-pinned-source="true"]:not([data-codex-pinned-source-id])'), function (source) {
      source.style.visibility = "";
      source.style.display = "";
      source.style.pointerEvents = "";
      delete source.dataset.codexPinnedSource;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-codex-pinned-clone="true"]:not([data-codex-pinned-source-id])'), function (clone) {
      clone.remove();
    });
  }

  function reconcilePinnedArtifacts(root) {
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll('[data-codex-pinned-source-id]'), function (source) {
      if (!source.dataset || source.dataset.codexPinnedClone === "true") return;
      var sourceId = source.dataset.codexPinnedSourceId;
      if (!sourceId) return;
      var selector = '[data-codex-pinned-clone="true"][data-codex-pinned-source-id="' + sourceId + '"]';
      var clone = scope.querySelector(selector) || document.querySelector(selector);
      if (clone) {
        source.style.display = "";
        source.style.visibility = "hidden";
        source.style.pointerEvents = "none";
        source.dataset.codexPinnedSource = "true";
      } else {
        source.style.display = "";
        source.style.visibility = "";
        source.style.pointerEvents = "";
        delete source.dataset.codexPinnedSource;
        delete source.dataset.codexPinnedSourceId;
      }
    });
  }

  function flattenPinnedArtifacts(root) {
    if (!root || !root.querySelectorAll) return;
    Array.prototype.forEach.call(root.querySelectorAll('[data-codex-pinned-source-id]'), function (node) {
      if (node.dataset && node.dataset.codexPinnedClone === "true") {
        delete node.dataset.codexPinnedClone;
        delete node.dataset.codexPinnedSourceId;
      } else {
        var sourceId = node.dataset ? node.dataset.codexPinnedSourceId : "";
        var clone = sourceId ? root.querySelector('[data-codex-pinned-clone="true"][data-codex-pinned-source-id="' + sourceId + '"]') : null;
        if (clone) {
          node.remove();
          return;
        }
        if (node.dataset) {
          delete node.dataset.codexPinnedSource;
          delete node.dataset.codexPinnedSourceId;
        }
        node.style.display = "";
        node.style.visibility = "";
        node.style.pointerEvents = "";
      }
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-codex-layer-element]'), function (node) {
      delete node.dataset.codexLayerElement;
    });
  }

  function restorePinnedDescendants(root) {
    if (!root || !root.querySelectorAll) return;
    Array.prototype.forEach.call(root.querySelectorAll('[data-codex-pinned-source="true"][data-codex-pinned-source-id]'), function (source) {
      var sourceId = source.dataset.codexPinnedSourceId;
      if (!sourceId) return;
      var clone = document.querySelector('[data-codex-pinned-clone="true"][data-codex-pinned-source-id="' + sourceId + '"]');
      if (clone) {
        source.innerHTML = clone.innerHTML;
        clone.remove();
      }
      source.style.display = "";
      source.style.visibility = "";
      source.style.pointerEvents = "";
      delete source.dataset.codexPinnedSource;
      delete source.dataset.codexPinnedSourceId;
    });
  }

  function stripNodeIds(el) {
    if (!el || !el.querySelectorAll) return;
    el.removeAttribute("id");
    Array.prototype.forEach.call(el.querySelectorAll("[id]"), function (node) {
      node.removeAttribute("id");
    });
  }

  function getTabPanelByTarget(groupName, targetName, scopeRoot) {
    if (!targetName) return null;
    var scope = scopeRoot || getActivePageScope();
    var selector = '.tab-panel[data-tab-panel="' + targetName + '"]';
    if (groupName) {
      selector = '.tab-panel[data-tab-group="' + groupName + '"][data-tab-panel="' + targetName + '"]';
    }
    return scope.querySelector(selector);
  }

  function rememberTabContext(target) {
    if (!target || !target.closest) return;
    var tabButton = target.closest(".tab-btn[data-tab-target]");
    if (tabButton) {
      var row = tabButton.closest(".tab-row[data-tab-group]");
      lastTabContext = {
        groupName: row && row.dataset ? row.dataset.tabGroup || "" : "",
        panelName: tabButton.dataset ? tabButton.dataset.tabTarget || "" : ""
      };
      return;
    }

    var tabPanel = target.closest(".tab-panel[data-tab-panel]");
    if (!tabPanel || !ensureBase().contains(tabPanel)) return;
    lastTabContext = {
      groupName: tabPanel.dataset ? tabPanel.dataset.tabGroup || "" : "",
      panelName: tabPanel.dataset ? tabPanel.dataset.tabPanel || "" : ""
    };
  }

  function getRememberedTabPanel() {
    if (!lastTabContext || !lastTabContext.panelName) return null;
    return getTabPanelByTarget(lastTabContext.groupName || "", lastTabContext.panelName || "", getActivePageScope());
  }

  function getVisibleTabPanel() {
    var scope = getActivePageScope();
    var panels = Array.prototype.slice.call(scope.querySelectorAll(".tab-panel"));
    for (var index = 0; index < panels.length; index += 1) {
      var panel = panels[index];
      if (isActuallyVisible(panel)) {
        return panel;
      }
    }
    return null;
  }

  function getCurrentActiveTabPanelInScope(scopeRoot) {
    var scope = scopeRoot || getActivePageScope();
    var rememberedPanel = getRememberedTabPanel();
    if (rememberedPanel && ensureBase().contains(rememberedPanel) && scope.contains(rememberedPanel)) {
      return rememberedPanel;
    }

    var activeButtons = Array.prototype.slice.call(scope.querySelectorAll(".tab-btn.active[data-tab-target]"));
    for (var index = 0; index < activeButtons.length; index += 1) {
      var button = activeButtons[index];
      var row = button.closest(".tab-row[data-tab-group]");
      var panel = getTabPanelByTarget(row && row.dataset ? row.dataset.tabGroup || "" : "", button.dataset.tabTarget || "", scope);
      if (panel && isActuallyVisible(panel)) return panel;
    }

    var activePanel = scope.querySelector(".tab-panel.active");
    if (activePanel && isActuallyVisible(activePanel)) return activePanel;

    var visiblePanel = getVisibleTabPanel();
    if (visiblePanel) return visiblePanel;

    return null;
  }

  function getCurrentActiveTabPanel() {
    return getCurrentActiveTabPanelInScope(getActivePageScope());
  }

  function getTabScopedHost(el) {
    var scope = getActivePageScope(el);
    var activePanel = getCurrentActiveTabPanelInScope(scope);
    if (el && el.closest) {
      var tabButton = el.closest(".tab-btn[data-tab-target]");
      if (tabButton) {
        var row = tabButton.closest(".tab-row[data-tab-group]");
        var targetPanel = getTabPanelByTarget(row && row.dataset ? row.dataset.tabGroup || "" : "", tabButton.dataset.tabTarget || "", scope);
        if (targetPanel) return targetPanel;
      }

      var scopedPanel = el.closest(".tab-panel");
      if (scopedPanel && ensureBase().contains(scopedPanel)) {
        if (activePanel && scopedPanel.dataset && activePanel.dataset &&
          scopedPanel.dataset.tabGroup &&
          activePanel.dataset.tabGroup &&
          scopedPanel.dataset.tabGroup === activePanel.dataset.tabGroup &&
          scopedPanel !== activePanel) {
          return activePanel;
        }
        return scopedPanel;
      }
    }
    return getPreferredPageHost(scope, el);
  }

  function markElementTabScoped(el, host) {
    if (!el || !host) return;
    var tabPanel = null;
    if (host.matches && host.matches(".tab-panel[data-tab-panel]")) {
      tabPanel = host;
    } else if (host.closest) {
      tabPanel = host.closest(".tab-panel[data-tab-panel]");
    }
    if (!tabPanel || !tabPanel.dataset) return;
    el.dataset.codexTabScoped = "true";
    el.dataset.codexTabGroup = tabPanel.dataset.tabGroup || "";
    el.dataset.codexTabPanel = tabPanel.dataset.tabPanel || "";
    if (el.dataset.codexTabBaseDisplay === undefined) {
      el.dataset.codexTabBaseDisplay = el.style.display || "";
    }
  }

  function hydrateExistingTabScopedElements(root) {
    var scope = root || ensureBase();
    Array.prototype.forEach.call(scope.querySelectorAll(".codex-added, .codex-control-field"), function (el) {
      if (el.dataset && el.dataset.codexTabScoped === "true") return;
      if (!el.closest) return;
      var tabPanel = el.closest(".tab-panel[data-tab-panel]");
      if (!tabPanel) return;
      markElementTabScoped(el, tabPanel);
    });
  }

  function applyTabScopedVisibility(root) {
    var scope = root || ensureBase();
    hydrateExistingTabScopedElements(scope);
    Array.prototype.forEach.call(scope.querySelectorAll('[data-codex-tab-scoped="true"]'), function (el) {
      var pageScope = getActivePageScope(el);
      var activePanel = getCurrentActiveTabPanelInScope(pageScope);
      var defaultDisplay = el.dataset && el.dataset.codexTabBaseDisplay !== undefined ? el.dataset.codexTabBaseDisplay : "";
      if (!activePanel || !el.dataset) {
        el.style.display = defaultDisplay;
        return;
      }
      var activeGroup = activePanel.dataset ? activePanel.dataset.tabGroup || "" : "";
      var activeName = activePanel.dataset ? activePanel.dataset.tabPanel || "" : "";
      var samePanel = (el.dataset.codexTabGroup || "") === activeGroup && (el.dataset.codexTabPanel || "") === activeName;
      el.style.display = samePanel ? defaultDisplay : "none";
    });
    resetActiveTableWrapScroll(scope);
  }
  window.__CODEX_APPLY_TAB_VISIBILITY = applyTabScopedVisibility;

  function resetActiveTableWrapScroll(scopeRoot) {
    var scope = scopeRoot || getActivePageScope();
    if (!scope || !scope.querySelectorAll) return;
    var activePanel = getCurrentActiveTabPanelInScope(scope);
    var targetRoot = activePanel || scope;
    Array.prototype.forEach.call(targetRoot.querySelectorAll(".table-wrap"), function (wrap) {
      try {
        wrap.scrollLeft = 0;
      } catch (error) {}
    });
  }

  function ensurePositionedHost(host) {
    if (!host || host === ensureBase()) return host || ensureBase();
    var computed = getComputedStyle(host);
    if (computed.position === "static") {
      host.style.position = "relative";
    }
    return host;
  }

  function getHostRect(host) {
    return ensurePositionedHost(host).getBoundingClientRect();
  }

  function getHostRelativeRect(el, host) {
    var rect = el.getBoundingClientRect();
    var hostRect = getHostRect(host);
    return {
      left: rect.left - hostRect.left,
      top: rect.top - hostRect.top,
      width: rect.width,
      height: rect.height
    };
  }

  function roundRectValue(value) {
    return Math.round(Number(value || 0));
  }

  function persistElementVisualBounds(el) {
    if (!el || !el.getBoundingClientRect) return;
    var rawHost = el.parentElement && el.parentElement !== document.body ? el.parentElement : getTabScopedHost(el);
    if (rawHost === el) {
      rawHost = (el.parentElement && el.parentElement !== el) ? el.parentElement : getActivePageScope(el);
    }
    var host = ensurePositionedHost(rawHost);
    var relativeRect = getHostRelativeRect(el, host);
    if (!Number.isFinite(relativeRect.left) || !Number.isFinite(relativeRect.top)) return;
    setModuleFrameStyle(el, "position", "absolute");
    setModuleFrameStyle(el, "left", roundRectValue(relativeRect.left) + "px");
    setModuleFrameStyle(el, "top", roundRectValue(relativeRect.top) + "px");
    setModuleFrameStyle(el, "width", Math.max(80, roundRectValue(relativeRect.width)) + "px");
    setModuleFrameStyle(el, "height", Math.max(40, roundRectValue(relativeRect.height)) + "px");
    el.style.margin = "0";
    el.style.maxWidth = "none";
    if (!el.style.minWidth) el.style.minWidth = "80px";
    if (!el.style.minHeight) el.style.minHeight = "40px";
    el.dataset.codexLayerElement = "true";
    clearLegacyScaleState(el);
    ensureModuleBaseSize(el);
  }

  function materializeManagedLayout(root, explicitNodes) {
    var scope = root || ensureBase();
    var candidates = [];
    if (Array.isArray(explicitNodes) && explicitNodes.length) {
      explicitNodes.forEach(function (node) {
        if (!node) return;
        if (candidates.indexOf(node) === -1) candidates.push(node);
      });
    } else {
      Array.prototype.forEach.call(getSelectedModules(), function (node) {
        if (candidates.indexOf(node) === -1) candidates.push(node);
      });
    }
    candidates.forEach(function (node) {
      persistElementVisualBounds(node);
    });
  }

  function pinModuleToBase(el) {
    if (!el || el.classList.contains("codex-added") || isPinnedClone(el)) return el;
    var host = getTabScopedHost(el);
    if (host === el) {
      host = (el.parentElement && el.parentElement !== el) ? el.parentElement : getActivePageScope(el);
    }
    var relativeRect = getHostRelativeRect(el, host);
    var clone = el.cloneNode(true);
    var sourceId = el.dataset.codexPinnedSourceId || nextPinnedSourceId();
    stripNodeIds(clone);
    clone.dataset.codexPinnedClone = "true";
    clone.dataset.codexPinnedSourceId = sourceId;
    clone.dataset.codexLayerElement = "true";
    setModuleFrameStyle(clone, "position", "absolute");
    setModuleFrameStyle(clone, "left", relativeRect.left + "px");
    setModuleFrameStyle(clone, "top", relativeRect.top + "px");
    setModuleFrameStyle(clone, "width", relativeRect.width + "px");
    setModuleFrameStyle(clone, "height", relativeRect.height + "px");
    clone.style.margin = "0";
    clone.style.maxWidth = "none";
    clone.style.minWidth = "80px";
    clone.style.minHeight = "40px";
    clone.style.zIndex = "2147481900";

    el.dataset.codexPinnedSource = "true";
    el.dataset.codexPinnedSourceId = sourceId;
    el.style.display = "";
    el.style.visibility = "hidden";
    el.style.pointerEvents = "none";

    host.appendChild(clone);
    reconcilePinnedArtifacts();
    setEditable(editMode);
    return clone;
  }

  function normalizeAbsolute(el) {
    var host = el.parentElement && el.parentElement !== document.body ? el.parentElement : getTabScopedHost(el);
    var relativeRect = getHostRelativeRect(el, host);
    setModuleFrameStyle(el, "position", "absolute");
    if (!el.style.left) setModuleFrameStyle(el, "left", relativeRect.left + "px");
    if (!el.style.top) setModuleFrameStyle(el, "top", relativeRect.top + "px");
    if (!el.style.width) setModuleFrameStyle(el, "width", relativeRect.width + "px");
    if (!el.style.height) setModuleFrameStyle(el, "height", relativeRect.height + "px");
  }

  function normalizeMovable(el) {
    if (el.classList.contains("codex-added")) return;
    var computed = getComputedStyle(el);
    if (computed.position === "static") {
      el.style.position = "relative";
    }
    if (!el.style.left) el.style.left = "0px";
    if (!el.style.top) el.style.top = "0px";
  }

  function getModuleCurrentSize(el) {
    var rect = el.getBoundingClientRect();
    var width = parseFloat(el.style.width || rect.width);
    var height = parseFloat(el.style.height || rect.height);
    return {
      width: Number.isFinite(width) ? width : rect.width,
      height: Number.isFinite(height) ? height : rect.height
    };
  }

  function ensureModuleBaseSize(el) {
    if (!el || !el.dataset) return;
    if (!el.dataset.codexBaseWidth || !el.dataset.codexBaseHeight) {
      var currentSize = getModuleCurrentSize(el);
      el.dataset.codexBaseWidth = String(currentSize.width);
      el.dataset.codexBaseHeight = String(currentSize.height);
    }
  }

  function clearLegacyScaleState(el) {
    if (!el || !el.dataset) return;
    var rect = el.getBoundingClientRect();
    if (el.dataset.codexBaseTransform !== undefined || el.dataset.codexScale !== undefined) {
      setModuleFrameStyle(el, "width", rect.width + "px");
      setModuleFrameStyle(el, "height", rect.height + "px");
      el.style.transform = el.dataset.codexBaseTransform || "";
      el.style.transformOrigin = "";
      delete el.dataset.codexBaseTransform;
      delete el.dataset.codexScale;
    }
  }

  function shouldFitHeightToContent(el) {
    return !!(
      el &&
      !el.classList.contains("image-block") &&
      !el.classList.contains("button") &&
      (
        el.classList.contains("modal-card") ||
        el.classList.contains("field-card") ||
        el.classList.contains("order-card") ||
        !!el.querySelector(".field-grid, .button-row, .note-list, .modal-title")
      )
    );
  }

  function applyModuleSize(el, width, height) {
    if (!el || !el.style) return;
    var nextWidth = Math.max(80, Math.round(width));
    var nextHeight = Math.max(40, Math.round(height));
    setModuleFrameStyle(el, "width", nextWidth + "px");
    setModuleFrameStyle(el, "height", nextHeight + "px");
    if (shouldFitHeightToContent(el)) {
      var contentHeight = Math.ceil(el.scrollHeight);
      setModuleFrameStyle(el, "height", Math.max(nextHeight, contentHeight) + "px");
    }
  }

  function ensureIndependentModule(module) {
    if (!module) return null;
    var nextModule = module;
    if (isProtectedLayoutContainer(nextModule)) {
      nextModule = createLayoutProxy(nextModule);
      normalizeAbsolute(nextModule);
      clearLegacyScaleState(nextModule);
      ensureModuleBaseSize(nextModule);
      nextModule.dataset.codexLayerElement = "true";
      return nextModule;
    }
    if (nextModule.classList.contains("codex-added")) {
      normalizeAbsolute(nextModule);
      clearLegacyScaleState(nextModule);
      ensureModuleBaseSize(nextModule);
      nextModule.dataset.codexLayerElement = "true";
      return nextModule;
    }
    if (isPinnedClone(nextModule)) {
      normalizeAbsolute(nextModule);
      clearLegacyScaleState(nextModule);
      ensureModuleBaseSize(nextModule);
      nextModule.dataset.codexLayerElement = "true";
      return nextModule;
    }
    nextModule = pinModuleToBase(nextModule);
    normalizeAbsolute(nextModule);
    clearLegacyScaleState(nextModule);
    ensureModuleBaseSize(nextModule);
    nextModule.dataset.codexLayerElement = "true";
    return nextModule;
  }

  function ensureIndependentModules(modules) {
    return (modules || []).map(function (module) {
      return ensureIndependentModule(module);
    }).filter(Boolean);
  }

  function ensureResizableSelected() {
    if (!selected) return null;
    selected = ensureIndependentModule(selected);
    if (selected) markModuleSelected(selected);
    updateControls();
    return selected;
  }

  function beginModuleDrag(modules, event) {
    var dragTargets = normalizeGroupDragModules(modules);
    var dragModules = ensureIndependentModules(dragTargets);
    if (!dragModules.length) return false;
    setModuleSelection(dragModules, dragModules[dragModules.length - 1]);
    dragState = {
      items: dragModules.map(function (module) {
        return {
          el: module,
          left: parseFloat(module.style.left || 0),
          top: parseFloat(module.style.top || 0)
        };
      }),
      startX: event.clientX,
      startY: event.clientY,
      mode: "absolute"
    };
    return true;
  }

  function isDirectDragContainer(el) {
    return !!(
      el &&
      el.matches &&
      el.matches(".section.ax_default, .preview-panel")
    );
  }

  function getModuleFramePriority(el) {
    if (!el) return "";
    if (el.dataset && el.dataset.codexLayoutDetached === "true") return "important";
    if (el.matches && el.matches(".section.ax_default, .preview-panel")) return "important";
    return "";
  }

  function setModuleFrameStyle(el, prop, value) {
    if (!el || !el.style) return;
    el.style.setProperty(prop, value, getModuleFramePriority(el));
  }

  function isScaleRestrictedTarget(el) {
    return false;
  }

  function getScalableModules(modules) {
    return (modules || []).filter(function (module) {
      return module && !isScaleRestrictedTarget(module);
    });
  }

  function scaleSelected(step) {
    var modules = getSelectedModules();
    if (!modules.length) return;
    var scalableModules = getScalableModules(modules);
    if (!scalableModules.length) {
      window.alert("当前选中的是布局容器层。请先点中里面的小模块，再缩小或放大。");
      return;
    }
    pushUndo();
    var independentModules = ensureIndependentModules(scalableModules);
    if (!independentModules.length) return;
    setModuleSelection(independentModules, independentModules[independentModules.length - 1]);
    Array.prototype.forEach.call(independentModules, function (module) {
      if (step === "reset") {
        applyModuleSize(
          module,
          parseFloat(module.dataset.codexBaseWidth || "80"),
          parseFloat(module.dataset.codexBaseHeight || "40")
        );
        return;
      }
      var currentSize = getModuleCurrentSize(module);
      var factor = 1 + Number(step || 0);
      applyModuleSize(
        module,
        currentSize.width * factor,
        currentSize.height * factor
      );
    });
    updateControls();
    commitSnapshot();
  }

  function setEditable(enabled) {
    editMode = enabled;
    document.body.classList.toggle("codex-edit-mode", enabled);
    Array.prototype.forEach.call(document.querySelectorAll(EDITABLE_TEXT_SELECTOR + ", .codex-added"), function (el) {
      if (el.closest(".codex-edit-toolbar")) return;
      if (el.closest(".codex-edit-nav")) return;
      if (el.classList && el.classList.contains("image-block")) {
        el.contentEditable = "false";
      } else {
        el.contentEditable = enabled ? "true" : "false";
      }
      el.spellcheck = false;
    });
    var btn = document.getElementById("codex-edit-toggle");
    if (btn) btn.classList.toggle("active", enabled);
    updateControls();
  }

  function nextAddedId() {
    state.addedCounter = (state.addedCounter || 0) + 1;
    saveState();
    return "codex_added_" + state.addedCounter;
  }

  function addCustomElement(item) {
    var host = ensurePositionedHost(item.host || getTabScopedHost(document.activeElement || selected));
    var el = document.createElement("div");
    el.className = "codex-added";
    if (item.kind === "button") el.className += " button";
    if (item.kind === "image") el.className += " image-block";
    el.id = item.id || nextAddedId();
    el.dataset.codexLayerElement = "true";
    setModuleFrameStyle(el, "position", "absolute");
    setModuleFrameStyle(el, "left", item.left + "px");
    setModuleFrameStyle(el, "top", item.top + "px");
    setModuleFrameStyle(el, "width", item.width + "px");
    setModuleFrameStyle(el, "height", item.height + "px");
    if (item.kind === "image") {
      var img = document.createElement("img");
      img.src = item.src || "";
      img.alt = item.alt || "新增图片";
      el.appendChild(img);
    } else {
      el.innerHTML = item.html;
    }
    host.appendChild(el);
    markElementTabScoped(el, host);
    setEditable(editMode);
    applyTabScopedVisibility();
    return el;
  }

  function getDefaultImagePosition() {
    return { left: 140, top: 140, width: 320, height: 220 };
  }

  function addImageElement(src, options) {
    if (!src) return;
    var opts = options || {};
    var pos = getDefaultImagePosition();
    pushUndo();
    var imageModule = addCustomElement({
      kind: "image",
      left: opts.left != null ? opts.left : pos.left,
      top: opts.top != null ? opts.top : pos.top,
      width: opts.width != null ? opts.width : pos.width,
      height: opts.height != null ? opts.height : pos.height,
      src: src,
      alt: opts.alt || "新增图片"
    });
    selectModule(imageModule);
    commitSnapshot();
  }

  function loadImageFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      addImageElement(String(reader.result || ""), { alt: file.name || "新增图片" });
    };
    reader.readAsDataURL(file);
  }

  function addFieldControl(kind) {
    pushUndo();
    var host = ensurePositionedHost(getTabScopedHost(document.activeElement || selected));
    var wrapper = document.createElement("div");
    wrapper.className = "codex-added codex-control-field";
    wrapper.id = nextAddedId();
    wrapper.style.position = "absolute";
    wrapper.style.left = "120px";
    wrapper.style.top = "120px";
    wrapper.style.width = "280px";
    wrapper.style.height = "92px";
    wrapper.dataset.fieldType = kind;
    if (kind === "input") {
      wrapper.dataset.label = "输入框";
      wrapper.dataset.placeholder = "请输入内容";
    }
    if (kind === "select") {
      wrapper.dataset.label = "下拉选项";
      wrapper.dataset.options = "选项1,选项2,选项3";
      wrapper.dataset.placeholder = "请选择";
    }
    if (kind === "date") {
      wrapper.dataset.label = "时间选择器";
      wrapper.dataset.placeholder = "请选择时间";
    }
    renderFieldControl(wrapper);
    host.appendChild(wrapper);
    markElementTabScoped(wrapper, host);
    setEditable(editMode);
    applyTabScopedVisibility();
    selectModule(wrapper);
    commitSnapshot();
  }

  function renderFieldControl(wrapper) {
    var kind = wrapper.dataset.fieldType || "input";
    var label = wrapper.dataset.label || "";
    var placeholder = wrapper.dataset.placeholder || "";
    var options = (wrapper.dataset.options || "").split(",").map(function (item) { return item.trim(); }).filter(Boolean);
    if (kind === "input") {
      wrapper.innerHTML = '<div class="codex-control-label text">' + label + '</div><div class="codex-input-mock text">' + placeholder + '</div>';
    }
    if (kind === "select") {
      wrapper.innerHTML = '<div class="codex-control-label text">' + label + '</div><div class="codex-select-mock text">' + placeholder + '</div><div class="codex-select-options text">' + options.join(" / ") + '</div>';
    }
    if (kind === "date") {
      wrapper.innerHTML = '<div class="codex-control-label text">' + label + '</div><div class="codex-date-mock text">' + placeholder + '</div>';
    }
  }

  function configureFieldControl() {
    if (!selected || !selected.dataset || !selected.dataset.fieldType) return;
    pushUndo();
    var kind = selected.dataset.fieldType;
    var label = window.prompt("字段名称", selected.dataset.label || "") || selected.dataset.label || "";
    selected.dataset.label = label;
    if (kind === "input") {
      var placeholder = window.prompt("默认提示词", selected.dataset.placeholder || "") || selected.dataset.placeholder || "";
      selected.dataset.placeholder = placeholder;
    }
    if (kind === "select") {
      var selectPlaceholder = window.prompt("默认提示词", selected.dataset.placeholder || "") || selected.dataset.placeholder || "";
      var options = window.prompt("枚举值，英文逗号分隔", selected.dataset.options || "") || selected.dataset.options || "";
      selected.dataset.placeholder = selectPlaceholder;
      selected.dataset.options = options;
    }
    if (kind === "date") {
      var datePlaceholder = window.prompt("默认提示词", selected.dataset.placeholder || "") || selected.dataset.placeholder || "";
      selected.dataset.placeholder = datePlaceholder;
    }
    renderFieldControl(selected);
    commitSnapshot();
  }

  function deleteSelected() {
    var modules = getSelectedModules();
    if (!modules.length) return;
    pushUndo();
    var handledPinnedGroups = Object.create(null);
    var handledNodes = [];
    Array.prototype.forEach.call(modules, function (module) {
      var deleteTarget = getDeleteTarget(module);
      if (!deleteTarget) return;
      if (deleteTarget.dataset && deleteTarget.dataset.codexLayoutDetached === "true") {
        var detachedLayoutSourceId = deleteTarget.dataset.codexLayoutSourceId || "";
        var detachedLayoutPlaceholder = findLayoutProxyBySourceId(detachedLayoutSourceId);
        if (detachedLayoutPlaceholder) detachedLayoutPlaceholder.remove();
        deleteTarget.remove();
        return;
      }
      if (deleteTarget.dataset && deleteTarget.dataset.codexLayoutProxy === "true") {
        var layoutSourceId = deleteTarget.dataset.codexLayoutSourceId || "";
        var layoutSource = findLayoutSourceByProxyId(layoutSourceId);
        deleteTarget.remove();
        if (layoutSource) restoreLayoutSourceVisual(layoutSource);
        return;
      }
      var pinnedSourceId = getPinnedSourceIdFromTarget(deleteTarget);
      if (pinnedSourceId) {
        if (handledPinnedGroups[pinnedSourceId]) return;
        handledPinnedGroups[pinnedSourceId] = true;
        Array.prototype.forEach.call(document.querySelectorAll('[data-codex-pinned-clone="true"][data-codex-pinned-source-id="' + pinnedSourceId + '"]'), function (clone) {
          clone.remove();
        });
      Array.prototype.forEach.call(document.querySelectorAll('[data-codex-pinned-source-id="' + pinnedSourceId + '"]'), function (source) {
        if (source.dataset && source.dataset.codexPinnedClone === "true") return;
        source.remove();
      });
        return;
      }
      if (handledNodes.indexOf(deleteTarget) !== -1) return;
      handledNodes.push(deleteTarget);
      if (deleteTarget.classList.contains("codex-added")) {
        deleteTarget.remove();
      } else if (deleteTarget.classList.contains("field-card")) {
        deleteTarget.style.display = "none";
      } else if (deleteTarget.classList.contains("ghost-btn")) {
        deleteTarget.style.display = "none";
      } else if (deleteTarget.classList.contains("button-row")) {
        deleteTarget.style.display = "none";
      } else if (deleteTarget.classList.contains("modal-card")) {
        if (hasNestedEditableChildren(deleteTarget)) stripContainerVisual(deleteTarget);
        else deleteTarget.style.display = "none";
      } else if (
        deleteTarget.classList.contains("section") ||
        deleteTarget.classList.contains("preview-panel")
      ) {
        stripContainerVisual(deleteTarget);
      } else {
        deleteTarget.style.display = "none";
      }
    });
    reconcilePinnedArtifacts();
    clearSelection();
    commitSnapshot();
  }

  function duplicateSelected() {
    var modules = getSelectedModules();
    if (!modules.length) return;
    if (!ensureModulesOperable(modules, "复制")) return;
    pushUndo();
    var duplicates = [];
    Array.prototype.forEach.call(ensureIndependentModules(modules), function (module) {
      var rect = module.getBoundingClientRect();
      var host = ensurePositionedHost(getTabScopedHost(module));
      var hostRect = host.getBoundingClientRect();
      var clone;
      if (module.classList.contains("image-block")) {
        var image = module.querySelector("img");
        clone = addCustomElement({
          host: host,
          kind: "image",
          left: rect.left - hostRect.left + 24,
          top: rect.top - hostRect.top + 24,
          width: rect.width,
          height: rect.height,
          src: image ? image.getAttribute("src") : "",
          alt: image ? image.getAttribute("alt") || "新增图片" : "新增图片"
        });
      } else {
        clone = addCustomElement({
          host: host,
          kind: module.classList.contains("button") ? "button" : "box",
          left: rect.left - hostRect.left + 24,
          top: rect.top - hostRect.top + 24,
          width: rect.width,
          height: rect.height,
          html: module.innerHTML
        });
      }
      duplicates.push(clone);
    });
    setModuleSelection(duplicates, duplicates[duplicates.length - 1]);
    commitSnapshot();
  }

  function getLayerHost(el) {
    return ensurePositionedHost(el && el.parentElement ? el.parentElement : getTabScopedHost(el));
  }

  function getLayerItems(host) {
    return Array.prototype.filter.call(host.children, function (node) {
      return !!(node && node.dataset && node.dataset.codexLayerElement === "true");
    });
  }

  function getLayerValue(el) {
    var value = parseInt((el && el.style && el.style.zIndex) || "0", 10);
    if (!Number.isFinite(value)) return 0;
    return value;
  }

  function ensureLayerElementSelected() {
    var modules = ensureIndependentModules(getSelectedModules());
    if (!modules.length) return [];
    Array.prototype.forEach.call(modules, function (module) {
      module.dataset.codexLayerElement = "true";
    });
    setModuleSelection(modules, modules[modules.length - 1]);
    return modules;
  }

  function moveSelectedLayer(direction) {
    var currentModules = getSelectedModules();
    if (!currentModules.length) return;
    if (!ensureModulesOperable(currentModules, "调整层级")) return;
    pushUndo();
    var modules = ensureLayerElementSelected();
    if (!modules.length) return;
    var hosts = [];
    Array.prototype.forEach.call(modules, function (module) {
      var host = getLayerHost(module);
      if (hosts.indexOf(host) === -1) hosts.push(host);
    });
    Array.prototype.forEach.call(hosts, function (host) {
      var scopedModules = modules.filter(function (module) { return getLayerHost(module) === host; });
      var peers = getLayerItems(host);
      var layers = peers.map(getLayerValue);
      var top = layers.length ? Math.max.apply(null, layers) : 0;
      var bottom = layers.length ? Math.min.apply(null, layers) : 0;
      Array.prototype.forEach.call(scopedModules, function (module, index) {
        if (direction === "front") {
          module.style.zIndex = String(top + index + 1);
        } else {
          module.style.zIndex = String(bottom - scopedModules.length + index);
        }
      });
    });
    updateControls();
    commitSnapshot();
  }

  function selectParentModule() {
    if (!selected) return;
    moveSelectedLayer("front");
  }

  function selectChildModule() {
    if (!selected) return;
    moveSelectedLayer("back");
  }

  function undoLast() {
    if (!undoStack.length) return;
    restoreSnapshot(undoStack.pop());
  }

  function createTreeNav() {
    navToggle = document.createElement("button");
    navToggle.type = "button";
    navToggle.className = "codex-edit-nav-toggle";
    navToggle.textContent = "收起目录";

    navPanel = document.createElement("aside");
    navPanel.className = "codex-edit-nav";
    navPanel.innerHTML = '<div class="codex-nav-title">页面目录</div>';

    NAV_TREE.forEach(function (item) {
      if (item.type === "page") {
        var link = document.createElement("a");
        link.href = buildNavFileHref(item.file);
        link.className = "codex-nav-leaf" + (item.file === currentFile || link.href === location.href ? " active" : "");
        link.innerHTML = '<span class="icon">📄</span><span>' + item.label + '</span>';
        navPanel.appendChild(link);
        return;
      }
      var details = document.createElement("details");
      details.className = "codex-nav-folder";
      details.open = true;
      var summary = document.createElement("summary");
      summary.innerHTML = '<span class="folder-icon">📁</span><span>' + item.label + '</span>';
      details.appendChild(summary);
      item.children.forEach(function (child) {
        var childLink = document.createElement("a");
        childLink.href = buildNavFileHref(child.file);
        childLink.className = "codex-nav-child" + (child.file === currentFile || childLink.href === location.href ? " active" : "");
        childLink.innerHTML = '<span class="icon">📄</span><span>' + child.label + '</span>';
        details.appendChild(childLink);
      });
      navPanel.appendChild(details);
    });

    navToggle.addEventListener("click", function () {
      navPanel.classList.toggle("hidden");
      navToggle.textContent = navPanel.classList.contains("hidden") ? "展开目录" : "收起目录";
    });

    document.body.appendChild(navToggle);
    document.body.appendChild(navPanel);
  }

  function createControls() {
    controlBar = document.createElement("div");
    controlBar.className = "codex-control-box hidden";
    controlBar.innerHTML = [
      '<button type="button" data-act="move">拖拽</button>',
      '<button type="button" data-act="shrink">缩小</button>',
      '<button type="button" data-act="grow">放大</button>',
      '<button type="button" data-act="reset-scale">原始大小</button>',
      '<button type="button" data-act="parent">置于顶层</button>',
      '<button type="button" data-act="child">置于底层</button>',
      '<button type="button" data-act="copy">复制</button>',
      '<button type="button" data-act="delete" class="danger">删除</button>'
    ].join("");
    document.body.appendChild(controlBar);

    resizeGrip = document.createElement("div");
    resizeGrip.className = "codex-resize-grip hidden";
    resizeGrip.textContent = "↘";
    document.body.appendChild(resizeGrip);

    controlBar.addEventListener("click", function (event) {
      event.stopPropagation();
      var btn = event.target.closest("button[data-act]");
      if (!btn || !selected) return;
      var act = btn.getAttribute("data-act");
      if (act === "shrink") scaleSelected(-0.1);
      if (act === "grow") scaleSelected(0.1);
      if (act === "reset-scale") scaleSelected("reset");
      if (act === "parent") selectParentModule();
      if (act === "child") selectChildModule();
      if (act === "copy") duplicateSelected();
      if (act === "delete") deleteSelected();
    });

    controlBar.addEventListener("mousedown", function (event) {
      event.stopPropagation();
      var btn = event.target.closest("button[data-act='move']");
      if (!btn || !selected || !editMode) return;
      event.preventDefault();
      pushUndo();
      beginModuleDrag(getSelectedModules(), event);
    });

    resizeGrip.addEventListener("mousedown", function (event) {
      event.stopPropagation();
      if (!selected || !editMode) return;
      event.preventDefault();
      pushUndo();
      var resizable = ensureResizableSelected();
      if (!resizable) return;
      resizeState = {
        el: resizable,
        startX: event.clientX,
        startY: event.clientY,
        width: resizable.getBoundingClientRect().width,
        height: resizable.getBoundingClientRect().height
      };
    });
  }

  function clampNumber(value, min, max) {
    if (max < min) return min;
    return Math.min(Math.max(value, min), max);
  }

  function measureFloatingBox(el) {
    var wasHidden = el.classList.contains("hidden");
    var prevVisibility = el.style.visibility;
    var prevLeft = el.style.left;
    var prevTop = el.style.top;
    if (wasHidden) el.classList.remove("hidden");
    el.style.visibility = "hidden";
    el.style.left = "0px";
    el.style.top = "0px";
    var rect = el.getBoundingClientRect();
    el.style.visibility = prevVisibility;
    el.style.left = prevLeft;
    el.style.top = prevTop;
    if (wasHidden) el.classList.add("hidden");
    return rect;
  }

  function placeFloatingBox(el, anchorRect, gap) {
    var boxRect = measureFloatingBox(el);
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    var maxLeft = Math.max(8, viewportWidth - boxRect.width - 8);
    var maxTop = Math.max(8, viewportHeight - boxRect.height - 8);
    var candidates = [
      {
        fits: anchorRect.right + gap + boxRect.width <= viewportWidth - 8,
        left: anchorRect.right + gap,
        top: clampNumber(anchorRect.top, 8, maxTop)
      },
      {
        fits: anchorRect.left - gap - boxRect.width >= 8,
        left: anchorRect.left - gap - boxRect.width,
        top: clampNumber(anchorRect.top, 8, maxTop)
      },
      {
        fits: anchorRect.top - gap - boxRect.height >= 8,
        left: clampNumber(anchorRect.left, 8, maxLeft),
        top: anchorRect.top - gap - boxRect.height
      },
      {
        fits: anchorRect.bottom + gap + boxRect.height <= viewportHeight - 8,
        left: clampNumber(anchorRect.left, 8, maxLeft),
        top: anchorRect.bottom + gap
      }
    ];
    var chosen = candidates.find(function (item) { return item.fits; }) || {
      left: clampNumber(anchorRect.left, 8, maxLeft),
      top: clampNumber(anchorRect.bottom + gap, 8, maxTop)
    };
    el.style.left = clampNumber(chosen.left, 8, maxLeft) + "px";
    el.style.top = clampNumber(chosen.top, 8, maxTop) + "px";
  }

  function updateControls() {
    var modules = getSelectedModules();
    if (!modules.length || !editMode) {
      hideControls();
      return;
    }
    syncPrimarySelection();
    var rect = getSelectionRect();
    if (!rect) {
      hideControls();
      return;
    }
    placeFloatingBox(controlBar, rect, 10);
    controlBar.classList.remove("hidden");
    if (modules.length === 1) {
      resizeGrip.style.left = clampNumber(rect.right - 12, 8, Math.max(8, window.innerWidth - 30)) + "px";
      resizeGrip.style.top = clampNumber(rect.bottom - 12, 8, Math.max(8, window.innerHeight - 30)) + "px";
      resizeGrip.classList.remove("hidden");
    } else {
      resizeGrip.classList.add("hidden");
    }
  }

  function getCurrentTable() {
    if (selectedCell) return selectedCell.closest("table");
    if (selected) return selected.querySelector("table");
    return null;
  }

  function getPlaceholderText(row) {
    if (!row || !row.parentElement) return "字段值";
    if (row.parentElement.tagName === "THEAD" && row.rowIndex === 0) return "新增字段";
    if (row.parentElement.tagName === "THEAD") return "字段说明";
    return "字段值";
  }

  function resetCellContent(cell, row) {
    var text = getPlaceholderText(row);
    var textEl = cell.querySelector(".text");
    if (textEl) textEl.textContent = text;
    else cell.textContent = text;
  }

  function addColumn() {
    var table = getCurrentTable();
    if (!table || !selectedCell) return;
    pushUndo();
    var index = selectedCell.cellIndex + 1;
    Array.prototype.forEach.call(table.rows, function (row) {
      var source = row.cells[Math.max(0, Math.min(index - 1, row.cells.length - 1))];
      var tag = source ? source.tagName : (row.parentElement.tagName === "THEAD" ? "TH" : "TD");
      var cell = document.createElement(tag);
      cell.className = source ? source.className : "";
      cell.innerHTML = source ? source.innerHTML : '<div class="text"></div>';
      resetCellContent(cell, row);
      row.insertBefore(cell, row.cells[index] || null);
    });
    commitSnapshot();
  }

  function deleteColumn() {
    var table = getCurrentTable();
    if (!table || !selectedCell) return;
    if (table.rows[0].cells.length <= 1) return;
    pushUndo();
    var index = selectedCell.cellIndex;
    Array.prototype.forEach.call(table.rows, function (row) {
      if (row.cells[index]) row.deleteCell(index);
    });
    clearCellSelection();
    commitSnapshot();
  }

  function addRow() {
    var table = getCurrentTable();
    if (!table) return;
    var tbody = table.tBodies[0] || table.createTBody();
    pushUndo();
    var template = (selectedCell && selectedCell.parentElement.parentElement === tbody ? selectedCell.parentElement : null) || tbody.rows[tbody.rows.length - 1];
    if (!template) return;
    var row = template.cloneNode(true);
    Array.prototype.forEach.call(row.cells, function (cell) {
      resetCellContent(cell, row);
    });
    if (selectedCell && selectedCell.parentElement.parentElement === tbody) {
      selectedCell.parentElement.parentElement.insertBefore(row, selectedCell.parentElement.nextSibling);
    } else {
      tbody.appendChild(row);
    }
    commitSnapshot();
  }

  function deleteRow() {
    if (!selectedCell) return;
    var row = selectedCell.parentElement;
    if (!row || row.parentElement.tagName !== "TBODY") return;
    if (row.parentElement.rows.length <= 1) return;
    pushUndo();
    row.remove();
    clearCellSelection();
    commitSnapshot();
  }

  function applyTextColor(color) {
    if (!editMode) return;
    pushUndo();
    var sel = window.getSelection();
    if (sel && sel.rangeCount && !sel.isCollapsed) {
      document.execCommand("styleWithCSS", false, true);
      document.execCommand("foreColor", false, color);
    } else if (selectedCell) {
      var cellText = selectedCell.querySelector(".text") || selectedCell;
      cellText.style.color = color;
    } else if (selected) {
      if (selected.classList.contains("text")) selected.style.color = color;
      else {
        var firstText = selected.querySelector(".text");
        if (firstText) firstText.style.color = color;
      }
    }
    commitSnapshot();
  }

  function toggleCurrentNoteBullet(show) {
    if (!editMode || !selectedNoteItem) return;
    pushUndo();
    selectedNoteItem.classList.toggle("no-bullet", !show);
    commitSnapshot();
  }


  function getToolbarCollapseKey() {
    return "codex-edit-toolbar-collapsed::global-v3";
  }

  function setToolbarCollapsed(bar, button, collapsed) {
    document.body.classList.toggle("codex-toolbar-collapsed", collapsed);
    if (bar) bar.setAttribute("data-codex-toolbar-collapsed", collapsed ? "true" : "false");
    if (button) button.textContent = collapsed ? "\u5c55\u5f00\u7f16\u8f91\u533a" : "\u6536\u8d77\u7f16\u8f91\u533a";
    try {
      localStorage.setItem(getToolbarCollapseKey(), collapsed ? "1" : "0");
    } catch (e) {}
  }

  function setupToolbarCollapse(bar) {
    if (!bar || bar.getAttribute("data-codex-collapse-ready") === "true") return;
    bar.setAttribute("data-codex-collapse-ready", "true");
    var content = bar.querySelector(".codex-edit-toolbar-content");
    if (!content) {
      content = document.createElement("span");
      content.className = "codex-edit-toolbar-content";
      while (bar.firstChild) content.appendChild(bar.firstChild);
      bar.appendChild(content);
    }
    var button = bar.querySelector(".codex-edit-collapse-toggle");
    if (!button) {
      button = document.createElement("button");
      button.id = "codex-edit-collapse-toggle";
      button.type = "button";
      button.className = "codex-edit-collapse-toggle";
      button.setAttribute("aria-label", "\u6536\u8d77\u6216\u5c55\u5f00\u7f16\u8f91\u533a");
      bar.insertBefore(button, content);
      button.addEventListener("click", function () {
        setToolbarCollapsed(bar, button, !document.body.classList.contains("codex-toolbar-collapsed"));
      });
    }
    var collapsed = true;
    try {
      var savedCollapseState = localStorage.getItem(getToolbarCollapseKey());
      collapsed = savedCollapseState === null ? true : savedCollapseState === "1";
    } catch (e) {
      collapsed = true;
    }
    setToolbarCollapsed(bar, button, collapsed);
  }

  function createToolbar() {
    createTreeNav();
    createControls();

    var bar = document.createElement("div");
    bar.className = "codex-edit-toolbar";
    bar.innerHTML = [
      '<button id="codex-edit-toggle">编辑模式</button>',
      '<button id="codex-add-text">新增文本</button>',
      '<button id="codex-add-box">新增模块</button>',
      '<button id="codex-add-button">新增按钮</button>',
      '<button id="codex-add-image">新增图片</button>',
      '<button id="codex-add-input">新增输入框</button>',
      '<button id="codex-add-select">新增下拉</button>',
      '<button id="codex-add-date">新增时间</button>',
      '<button id="codex-config-field">配置控件</button>',
      '<button id="codex-add-col">新增列</button>',
      '<button id="codex-del-col" class="danger">删除列</button>',
      '<button id="codex-add-row">新增行</button>',
      '<button id="codex-del-row" class="danger">删除行</button>',
      '<button id="codex-color-black">黑字</button>',
      '<button id="codex-color-blue">蓝字</button>',
      '<button id="codex-color-red">红字</button>',
      '<button id="codex-note-bullet-show">显示当前符号</button>',
      '<button id="codex-note-bullet-hide">隐藏当前符号</button>',
      '<button id="codex-undo">返回上一步</button>',
      '<button id="codex-export-state">导出状态</button>',
      '<button id="codex-import-state">导入状态</button>',
      '<button id="codex-export-copy">导出副本</button>',
      '<button id="codex-duplicate">复制选中</button>',
      '<button id="codex-delete" class="danger">删除选中</button>',
      '<button id="codex-save">保存</button>',
      '<button id="codex-reset" class="danger">清空本页修改</button>',
      '<span class="hint">保存优先直写基线文件；导出副本仍可单独留档</span>',
      '<input id="codex-import-file" type="file" accept=".json,application/json" style="display:none"/>',
      '<input id="codex-image-file" type="file" accept="image/*" style="display:none"/>'
    ].join("");
    document.body.appendChild(bar);
    setupToolbarCollapse(bar);

    document.addEventListener("click", function (event) {
      rememberTabContext(event.target);
      if (event.target && event.target.closest && event.target.closest(".bundle-catalog-link[data-page]")) {
        setTimeout(function () {
          applyTabScopedVisibility();
          updateControls();
        }, 0);
      }
      if (event.target && event.target.closest && event.target.closest(".tab-btn[data-tab-target]")) {
        setTimeout(function () {
          applyTabScopedVisibility();
        }, 0);
      }
    });

    document.getElementById("codex-edit-toggle").addEventListener("click", function () {
      setEditable(!editMode);
    });
    document.getElementById("codex-add-text").addEventListener("click", function () {
      pushUndo();
      selectModule(addCustomElement({ kind: "text", left: 80, top: 80, width: 220, height: 50, html: "新增文本" }));
      commitSnapshot();
    });
    document.getElementById("codex-add-box").addEventListener("click", function () {
      pushUndo();
      selectModule(addCustomElement({ kind: "box", left: 90, top: 150, width: 260, height: 100, html: '<div class="text">新模块</div>' }));
      commitSnapshot();
    });
    document.getElementById("codex-add-button").addEventListener("click", function () {
      pushUndo();
      selectModule(addCustomElement({ kind: "button", left: 100, top: 270, width: 140, height: 40, html: "新增按钮" }));
      commitSnapshot();
    });
    document.getElementById("codex-add-image").addEventListener("click", function () {
      document.getElementById("codex-image-file").click();
    });
    document.getElementById("codex-add-input").addEventListener("click", function () { addFieldControl("input"); });
    document.getElementById("codex-add-select").addEventListener("click", function () { addFieldControl("select"); });
    document.getElementById("codex-add-date").addEventListener("click", function () { addFieldControl("date"); });
    document.getElementById("codex-config-field").addEventListener("click", configureFieldControl);
    document.getElementById("codex-add-col").addEventListener("click", addColumn);
    document.getElementById("codex-del-col").addEventListener("click", deleteColumn);
    document.getElementById("codex-add-row").addEventListener("click", addRow);
    document.getElementById("codex-del-row").addEventListener("click", deleteRow);
    document.getElementById("codex-color-black").addEventListener("click", function () { applyTextColor("#111827"); });
    document.getElementById("codex-color-blue").addEventListener("click", function () { applyTextColor("#1d4ed8"); });
    document.getElementById("codex-color-red").addEventListener("click", function () { applyTextColor("#d92d20"); });
    document.getElementById("codex-note-bullet-show").addEventListener("click", function () { toggleCurrentNoteBullet(true); });
    document.getElementById("codex-note-bullet-hide").addEventListener("click", function () { toggleCurrentNoteBullet(false); });
    document.getElementById("codex-undo").addEventListener("click", undoLast);
    document.getElementById("codex-export-state").addEventListener("click", exportStateFile);
    document.getElementById("codex-import-state").addEventListener("click", function () {
      document.getElementById("codex-import-file").click();
    });
    document.getElementById("codex-export-copy").addEventListener("click", exportEditableCopy);
    document.getElementById("codex-duplicate").addEventListener("click", duplicateSelected);
    document.getElementById("codex-delete").addEventListener("click", deleteSelected);
    document.getElementById("codex-import-file").addEventListener("change", function (event) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        importStateText(String(reader.result || ""));
      };
      reader.readAsText(file, "utf-8");
      event.target.value = "";
    });
    document.getElementById("codex-image-file").addEventListener("change", function (event) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      loadImageFile(file);
      event.target.value = "";
    });
    document.getElementById("codex-save").addEventListener("click", async function () {
      if (this.disabled) return;
      var self = this;
      self.disabled = true;
      self.textContent = "保存中";
      try {
        var result = await persistEditablePage();
        if (result && result.ok) {
          self.textContent = result.mode === "baseline" ? "已保存到基线" : "已保存到文件";
          setTimeout(function () {
            self.disabled = false;
            self.textContent = "保存";
          }, 1500);
          return;
        }
        self.textContent = "仅缓存已保存";
        window.alert(result && result.message ? result.message : "保存未完成，本次仅保存在浏览器本地缓存。");
        setTimeout(function () {
          self.disabled = false;
          self.textContent = "保存";
        }, 2200);
      } catch (error) {
        self.textContent = "保存失败";
        window.alert("保存异常：" + (error && error.message ? error.message : "未知错误"));
        setTimeout(function () {
          self.disabled = false;
          self.textContent = "保存";
        }, 2200);
      }
    });
    document.getElementById("codex-reset").addEventListener("click", function () {
      localStorage.removeItem(storageKey);
      location.reload();
    });
  }

  document.addEventListener("click", function (event) {
    if (!editMode && openImagePreview(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!editMode) return;
    if (isEditingUi(event.target)) return;
    var noteItem = event.target.closest(".note-list li");
    if (noteItem && ensureBase().contains(noteItem)) selectNoteItem(noteItem);
    else clearNoteSelection();
    var cell = event.target.closest("th,td");
    if (cell && ensureBase().contains(cell)) selectCell(cell);
    else clearCellSelection();

    var target = getModuleTarget(event.target);
    if (!target) {
      clearSelection();
      return;
    }
    if (hasMultiSelectModifier(event)) {
      toggleModuleSelection(target);
      return;
    }
    selectModule(target);
  }, true);

  document.addEventListener("mousedown", function (event) {
    if (!editMode) return;
    if (event.button !== 0) return;
    if (hasMultiSelectModifier(event)) return;
    if (isEditingUi(event.target)) return;
    if (event.target && event.target.closest && event.target.closest(".codex-edit-toolbar, .codex-control-box, #codex-resize-grip")) return;
    var target = getModuleTarget(event.target);
    if (!target || !isDirectDragContainer(target)) return;
    event.preventDefault();
    selectModule(target);
    pushUndo();
    beginModuleDrag([target], event);
  }, true);

  document.addEventListener("focusin", function (event) {
    if (!editMode) return;
    rememberTabContext(event.target);
    if (event.target && event.target.isContentEditable) {
      textSnapshot = snapshotBase();
    }
  }, true);

  document.addEventListener("focusout", function (event) {
    if (!editMode) return;
    if (event.target && event.target.isContentEditable && textSnapshot) {
      var after = snapshotBase();
      if (after !== textSnapshot) {
        undoStack.push(textSnapshot);
        if (undoStack.length > maxUndo) undoStack.shift();
        state.snapshot = after;
        saveState();
      }
      textSnapshot = null;
    }
  }, true);

  document.addEventListener("paste", function (event) {
    if (!editMode) return;
    var items = event.clipboardData && event.clipboardData.items;
    if (!items || !items.length) return;
    for (var i = 0; i < items.length; i += 1) {
      var item = items[i];
      if (item && item.kind === "file" && item.type && item.type.indexOf("image/") === 0) {
        var file = item.getAsFile();
        if (file) {
          event.preventDefault();
          loadImageFile(file);
          return;
        }
      }
    }
  }, true);

  document.addEventListener("mousemove", function (event) {
    if (dragState) {
      var dx = event.clientX - dragState.startX;
      var dy = event.clientY - dragState.startY;
      Array.prototype.forEach.call(dragState.items || [], function (item) {
        setModuleFrameStyle(item.el, "left", item.left + dx + "px");
        setModuleFrameStyle(item.el, "top", item.top + dy + "px");
      });
      updateControls();
    }
    if (resizeState) {
      var dw = event.clientX - resizeState.startX;
      var dh = event.clientY - resizeState.startY;
      applyModuleSize(resizeState.el, resizeState.width + dw, resizeState.height + dh);
      updateControls();
    }
  }, true);

  document.addEventListener("mouseup", function () {
    if (dragState || resizeState) {
      var changedNodes = [];
      if (dragState && Array.isArray(dragState.items)) {
        dragState.items.forEach(function (item) {
          if (item && item.el && changedNodes.indexOf(item.el) === -1) changedNodes.push(item.el);
        });
      }
      if (resizeState && resizeState.el && changedNodes.indexOf(resizeState.el) === -1) {
        changedNodes.push(resizeState.el);
      }
      materializeManagedLayout(null, changedNodes);
      commitSnapshot();
      updateControls();
    }
    dragState = null;
    resizeState = null;
  }, true);

  window.addEventListener("resize", updateControls, true);
  document.addEventListener("scroll", updateControls, true);

  createToolbar();
  applyState();
  setEditable(false);
  applyTabScopedVisibility();
  if (typeof window.__CODEX_PAGE_INIT === "function") {
    try {
      window.__CODEX_PAGE_INIT("startup");
      applyTabScopedVisibility();
    } catch (err) {
      console.warn("codex page init failed on startup", err);
    }
  }
})();












