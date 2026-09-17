const http = require("http");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const root = __dirname;
const port = Number(process.env.PORT || 8798);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function safeJoin(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = decoded.replace(/^\/+/, "");
  const target = path.normalize(path.join(root, clean || "index.html"));
  return target.startsWith(root) ? target : path.join(root, "index.html");
}

function fallbackFor(urlPath) {
  if (urlPath.startsWith("/供应商后台系统/")) return path.join(root, "供应商后台系统", "index.html");
  if (urlPath.startsWith("/供应商小程序/")) return path.join(root, "供应商小程序", "index.html");
  if (urlPath.startsWith("/点餐后台系统/")) return path.join(root, "点餐后台系统", "index.html");
  return path.join(root, "index.html");
}

const server = http.createServer((req, res) => {
  let file = safeJoin(req.url || "/");
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }
  if (!fs.existsSync(file)) {
    file = fallbackFor(req.url || "/");
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("文件不存在");
      return;
    }

    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  });
});

server.listen(port, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${port}/index.html`;
  console.log(`本地预览已启动：${url}`);
  childProcess.exec(`start "" "${url}"`);
});
