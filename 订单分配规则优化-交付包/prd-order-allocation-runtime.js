(function (global) {
  const META_ORDER = [
    "文档状态",
    "当前版本",
    "基线文件",
    "上次更新时间",
    "本次变更摘要",
    "在线编辑入口",
    "协作方式",
  ];

  let mermaidApi = null;
  let mermaidLoader = null;
  let mermaidRenderSequence = 0;

  function normalizeNewlines(text) {
    return String(text == null ? "" : text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }

  function trimBlankLines(lines) {
    const next = Array.isArray(lines) ? lines.slice() : [];
    while (next.length && !String(next[0]).trim()) next.shift();
    while (next.length && !String(next[next.length - 1]).trim()) next.pop();
    return next;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function restoreAllowedTags(html) {
    let next = html;
    next = next.replace(/&lt;br\s*\/?&gt;/gi, "<br>");
    next = next.replace(/&lt;(strong|b|em|i|u|mark|del)&gt;([\s\S]*?)&lt;\/\1&gt;/gi, "<$1>$2</$1>");
    next = next.replace(/&lt;span style=&quot;([\s\S]*?)&quot;&gt;([\s\S]*?)&lt;\/span&gt;/gi, '<span style="$1">$2</span>');
    next = next.replace(/&lt;span style=&#39;([\s\S]*?)&#39;&gt;([\s\S]*?)&lt;\/span&gt;/gi, '<span style="$1">$2</span>');
    return next;
  }

  function renderInline(text) {
    let html = escapeHtml(text);
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)\{size=(small|medium|large)\}/g, function (_, alt, src, size) {
      return '<img class="prd-inline-image" data-size="' + size + '" src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '">';
    });
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, src) {
      return '<img class="prd-inline-image" data-size="medium" src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '">';
    });
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = restoreAllowedTags(html);
    return html;
  }

  function renderParagraph(text) {
    return renderInline(text).replace(/\n/g, "<br>");
  }

  function slugify(text) {
    const slug = String(text || "")
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || "section-" + Math.random().toString(36).slice(2, 8);
  }

  function parseMetaLine(line) {
    const raw = String(line || "").replace(/^>\s?/, "").trim();
    let splitIndex = raw.indexOf("：");
    if (splitIndex < 0) splitIndex = raw.indexOf(":");
    if (splitIndex < 0) return { key: raw, value: "" };
    return {
      key: raw.slice(0, splitIndex).trim(),
      value: raw.slice(splitIndex + 1).trim(),
    };
  }

  function buildMetaMap(metaList) {
    const map = {};
    (metaList || []).forEach(function (item) {
      if (!item || !item.key) return;
      map[item.key] = item.value || "";
    });
    return map;
  }

  function stripLeadingSectionNumber(title) {
    return String(title || "").replace(/^\d+[.．、]\s*/, "").trim();
  }

  function renumberSections(sections) {
    const source = Array.isArray(sections) ? sections.map(function (section) {
      return {
        id: section.id,
        title: section.title || "",
        body: section.body || "",
      };
    }) : [];
    if (!source.length) return source;

    const numberedMatches = source
      .map(function (section) {
        return String(section.title || "").match(/^(\d+)([.．、])\s*(.+)$/);
      })
      .filter(Boolean);

    if (!numberedMatches.length || numberedMatches.length < Math.ceil(source.length / 2)) {
      return source;
    }

    const delimiter = numberedMatches[0][2];
    return source.map(function (section, index) {
      const baseTitle = stripLeadingSectionNumber(section.title) || ("新增章节 " + (index + 1));
      const nextTitle = delimiter === "、"
        ? (index + 1) + "、" + baseTitle
        : (index + 1) + ". " + baseTitle;
      return {
        id: section.id || slugify(nextTitle),
        title: nextTitle,
        body: section.body || "",
      };
    });
  }

  function parseMarkdown(markdown) {
    const lines = normalizeNewlines(markdown).split("\n");
    const firstLine = lines.shift() || "";
    const title = firstLine.replace(/^#\s*/, "").trim() || "产品需求文档";
    const meta = [];

    while (lines.length && /^>\s?/.test(lines[0])) {
      meta.push(parseMetaLine(lines.shift()));
    }

    while (lines.length && !lines[0].trim()) {
      lines.shift();
    }

    const sections = [];
    const prelude = [];
    let currentSection = null;

    function pushCurrentSection() {
      if (!currentSection) return;
      const bodyLines = trimBlankLines(currentSection.lines || []);
      sections.push({
        id: slugify(currentSection.title),
        title: currentSection.title,
        body: bodyLines.join("\n"),
      });
      currentSection = null;
    }

    lines.forEach(function (line) {
      const headingMatch = line.match(/^##\s+(.+)$/);
      if (headingMatch) {
        pushCurrentSection();
        currentSection = { title: headingMatch[1].trim(), lines: [] };
        return;
      }

      if (currentSection) {
        currentSection.lines.push(line);
      } else {
        prelude.push(line);
      }
    });

    pushCurrentSection();

    return {
      title: title,
      meta: meta,
      metaMap: buildMetaMap(meta),
      extraMeta: meta.filter(function (item) {
        return META_ORDER.indexOf(item.key) === -1;
      }),
      prelude: trimBlankLines(prelude).join("\n"),
      sections: sections,
    };
  }

  function serializeDocument(doc) {
    const safeDoc = doc || {};
    const metaMap = Object.assign({}, safeDoc.metaMap || {});
    const extraMeta = Array.isArray(safeDoc.extraMeta) ? safeDoc.extraMeta.filter(function (item) {
      return item && item.key && META_ORDER.indexOf(item.key) === -1;
    }) : [];

    const lines = ["# " + (String(safeDoc.title || "产品需求文档").trim() || "产品需求文档")];

    META_ORDER.forEach(function (key) {
      const value = String(metaMap[key] || "").trim();
      if (!value) return;
      lines.push("> " + key + "：" + value);
    });

    extraMeta.forEach(function (item) {
      const key = String(item.key || "").trim();
      const value = String(item.value || "").trim();
      if (!key || !value) return;
      lines.push("> " + key + "：" + value);
    });

    lines.push("");

    const prelude = normalizeNewlines(safeDoc.prelude || "").trim();
    if (prelude) {
      lines.push(prelude);
      lines.push("");
    }

    const normalizedSections = renumberSections(safeDoc.sections || []);
    normalizedSections.forEach(function (section, index) {
      const title = String(section.title || "").trim() || ("第" + (index + 1) + "节");
      const body = normalizeNewlines(section.body || "").trim();
      lines.push("## " + title);
      if (body) lines.push(body);
      if (index !== normalizedSections.length - 1) lines.push("");
    });

    return normalizeNewlines(lines.join("\n")).replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
  }

  function isTableDivider(line) {
    return /^\|\s*[-:| ]+\|\s*$/.test(String(line || "").trim());
  }

  function renderTable(lines, startIndex) {
    const header = String(lines[startIndex] || "").trim();
    const rows = [];
    let index = startIndex + 2;

    while (index < lines.length && /^\|/.test(String(lines[index] || "").trim())) {
      rows.push(String(lines[index]).trim());
      index += 1;
    }

    function parseRow(rowLine) {
      return rowLine.split("|").slice(1, -1).map(function (cell) {
        return renderInline(cell.trim());
      });
    }

    const headerCells = parseRow(header);
    const bodyRows = rows.map(parseRow);

    let html = "<table><thead><tr>" + headerCells.map(function (cell) {
      return "<th>" + cell + "</th>";
    }).join("") + "</tr></thead><tbody>";

    html += bodyRows.map(function (row) {
      return "<tr>" + row.map(function (cell) {
        return "<td>" + cell + "</td>";
      }).join("") + "</tr>";
    }).join("");

    html += "</tbody></table>";
    return { html: html, nextIndex: index };
  }

  function renderList(lines, startIndex, type) {
    const pattern = type === "ol" ? /^(\s*)\d+\.\s+(.*)$/ : /^(\s*)-\s+(.*)$/;
    const firstMatch = String(lines[startIndex] || "").match(pattern);
    if (!firstMatch) return null;

    const baseIndent = firstMatch[1].length;
    let index = startIndex;
    let html = "<" + type + ">";

    while (index < lines.length) {
      const match = String(lines[index] || "").match(pattern);
      if (!match || match[1].length !== baseIndent) break;

      const itemLines = [match[2]];
      index += 1;

      while (index < lines.length) {
        const nextLine = String(lines[index] || "");
        const nextBullet = nextLine.match(pattern);
        if (nextBullet && nextBullet[1].length === baseIndent) break;
        if (!nextLine.trim()) {
          index += 1;
          break;
        }
        if (/^(#{2,4})\s+/.test(nextLine) || /^```/.test(nextLine.trim()) || /^> /.test(nextLine) || (/^\|/.test(nextLine.trim()) && lines[index + 1] && isTableDivider(lines[index + 1]))) {
          break;
        }
        itemLines.push(nextLine.trim());
        index += 1;
      }

      html += "<li>" + renderParagraph(itemLines.join("\n")) + "</li>";
    }

    html += "</" + type + ">";
    return { html: html, nextIndex: index };
  }

  function renderBlockquote(lines, startIndex) {
    const items = [];
    let index = startIndex;

    while (index < lines.length && /^>\s?/.test(String(lines[index] || ""))) {
      items.push(String(lines[index]).replace(/^>\s?/, ""));
      index += 1;
    }

    return {
      html: "<blockquote><p>" + renderParagraph(items.join("\n")) + "</p></blockquote>",
      nextIndex: index,
    };
  }

  function renderCodeBlock(language, content) {
    if (String(language || "").toLowerCase() === "mermaid") {
      return '<div class="mermaid-shell"><div class="mermaid-diagram" data-mermaid-source="' + escapeHtml(encodeURIComponent(content)) + '"></div></div>';
    }

    const codeTitle = language ? (language + " 代码块") : "代码块";
    return '<pre class="code-block"><span class="code-title">' + escapeHtml(codeTitle) + "</span>\n" + escapeHtml(content) + "</pre>";
  }

  function renderBlocks(lines) {
    const source = Array.isArray(lines) ? lines : [];
    let html = "";
    let index = 0;
    const toc = [];

    while (index < source.length) {
      const rawLine = String(source[index] || "");
      if (!rawLine.trim()) {
        index += 1;
        continue;
      }

      const heading = rawLine.match(/^(#{2,4})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        const text = heading[2].trim();
        const id = slugify(text);
        if (level === 2) toc.push({ id: id, text: text });
        const tag = level === 2 ? "h2" : level === 3 ? "h3" : "h4";
        html += "<" + tag + ' id="' + id + '">' + renderInline(text) + "</" + tag + ">";
        index += 1;
        continue;
      }

      if (/^```/.test(rawLine.trim())) {
        const language = rawLine.trim().slice(3).trim();
        const codeLines = [];
        index += 1;
        while (index < source.length && !/^```/.test(String(source[index] || "").trim())) {
          codeLines.push(String(source[index] || ""));
          index += 1;
        }
        if (index < source.length) index += 1;
        html += renderCodeBlock(language, codeLines.join("\n").trimEnd());
        continue;
      }

      if (/^\|/.test(rawLine.trim()) && source[index + 1] && isTableDivider(source[index + 1])) {
        const tableResult = renderTable(source, index);
        html += tableResult.html;
        index = tableResult.nextIndex;
        continue;
      }

      if (/^>\s?/.test(rawLine)) {
        const blockquote = renderBlockquote(source, index);
        html += blockquote.html;
        index = blockquote.nextIndex;
        continue;
      }

      const bulletList = renderList(source, index, "ul");
      if (bulletList) {
        html += bulletList.html;
        index = bulletList.nextIndex;
        continue;
      }

      const orderedList = renderList(source, index, "ol");
      if (orderedList) {
        html += orderedList.html;
        index = orderedList.nextIndex;
        continue;
      }

      const paragraphLines = [rawLine];
      index += 1;

      while (index < source.length) {
        const nextLine = String(source[index] || "");
        if (!nextLine.trim()) break;
        if (/^(#{2,4})\s+/.test(nextLine)) break;
        if (/^```/.test(nextLine.trim())) break;
        if (/^>\s?/.test(nextLine)) break;
        if ((/^\|/.test(nextLine.trim()) && source[index + 1] && isTableDivider(source[index + 1])) || /^(\s*)-\s+/.test(nextLine) || /^(\s*)\d+\.\s+/.test(nextLine)) break;
        paragraphLines.push(nextLine);
        index += 1;
      }

      html += "<p>" + renderParagraph(paragraphLines.join("\n")) + "</p>";
    }

    return { html: html, toc: toc };
  }

  function buildRenderLines(doc) {
    const lines = [];
    if (doc.prelude) {
      lines.push.apply(lines, normalizeNewlines(doc.prelude).split("\n"));
      lines.push("");
    }

    renumberSections(doc.sections || []).forEach(function (section, index, all) {
      lines.push("## " + section.title);
      if (section.body) {
        lines.push.apply(lines, normalizeNewlines(section.body).split("\n"));
      }
      if (index !== all.length - 1) lines.push("");
    });

    return lines;
  }

  function renderDocument(markdown) {
    const doc = parseMarkdown(markdown);
    const rendered = renderBlocks(buildRenderLines(doc));
    return {
      doc: doc,
      title: doc.title,
      meta: doc.meta,
      metaMap: doc.metaMap,
      html: rendered.html,
      toc: rendered.toc,
    };
  }

  function renderMetaGrid(meta, container) {
    if (!container) return;
    const metaMap = buildMetaMap(meta);
    const keys = META_ORDER.filter(function (key) {
      return key !== "本次变更摘要" && metaMap[key];
    });

    container.innerHTML = keys.map(function (key) {
      const wide = key === "在线编辑入口" || key === "协作方式";
      return (
        '<section class="meta-card' + (wide ? " wide" : "") + '">' +
        '<span class="meta-label">' + escapeHtml(key) + "</span>" +
        '<div class="meta-value">' + renderParagraph(metaMap[key]) + "</div>" +
        "</section>"
      );
    }).join("");
  }

  function renderTocList(toc, container) {
    if (!container) return;
    container.innerHTML = (toc || []).map(function (item) {
      return '<a class="toc-link" href="#' + item.id + '">' + escapeHtml(item.text) + "</a>";
    }).join("");
  }

  function renderMermaidError(target, message) {
    target.innerHTML =
      '<div class="mermaid-error">' +
      "<strong>流程图暂时无法显示</strong>" +
      "<div>" + escapeHtml(message || "Mermaid 图表渲染失败。") + "</div>" +
      "</div>";
  }

  async function loadMermaid() {
    if (mermaidApi) return mermaidApi;
    if (mermaidLoader) return mermaidLoader;

    mermaidLoader = new Promise(function (resolve, reject) {
      function finalize() {
        try {
          if (!global.mermaid) {
            reject(new Error("未找到 Mermaid 图表引擎"));
            return;
          }
          global.mermaid.initialize({
            startOnLoad: false,
            securityLevel: "loose",
            theme: "default",
          });
          mermaidApi = global.mermaid;
          resolve(mermaidApi);
        } catch (error) {
          reject(error);
        }
      }

      if (global.mermaid) {
        finalize();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
      script.async = true;
      script.onload = finalize;
      script.onerror = function () {
        reject(new Error("Mermaid 图表引擎加载失败"));
      };
      document.head.appendChild(script);
    });

    try {
      return await mermaidLoader;
    } catch (error) {
      mermaidLoader = null;
      throw error;
    }
  }

  async function renderMermaid(root) {
    const scope = root || document;
    const targets = Array.prototype.slice.call(scope.querySelectorAll(".mermaid-diagram"));
    if (!targets.length) return;

    let api;
    try {
      api = await loadMermaid();
    } catch (error) {
      targets.forEach(function (target) {
        renderMermaidError(target, error.message);
      });
      return;
    }

    for (const target of targets) {
      const encoded = target.dataset.mermaidSource || "";
      const source = encoded ? decodeURIComponent(encoded) : "";
      if (!source.trim()) {
        renderMermaidError(target, "Mermaid 内容为空");
        continue;
      }

      try {
        const renderId = "prd-mermaid-" + (++mermaidRenderSequence);
        const result = await api.render(renderId, source);
        target.innerHTML = result.svg;
      } catch (error) {
        renderMermaidError(target, error.message);
      }
    }
  }

  async function fetchJson(url, options) {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = controller ? setTimeout(function () {
      controller.abort();
    }, 12000) : null;

    try {
      const response = await fetch(url, Object.assign({}, options || {}, controller ? { signal: controller.signal } : {}));
      if (!response.ok) {
        throw new Error("请求失败（" + response.status + "）");
      }
      return await response.json();
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 2000);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "readonly");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  function setText(el, value) {
    if (el) el.textContent = value == null ? "" : String(value);
  }

  global.OrderAllocationPrdRuntime = {
    META_ORDER: META_ORDER,
    normalizeNewlines: normalizeNewlines,
    parseMarkdown: parseMarkdown,
    serializeDocument: serializeDocument,
    renderDocument: renderDocument,
    renderMetaGrid: renderMetaGrid,
    renderTocList: renderTocList,
    renderMermaid: renderMermaid,
    fetchJson: fetchJson,
    downloadText: downloadText,
    copyText: copyText,
    slugify: slugify,
    setText: setText,
  };
})(window);
