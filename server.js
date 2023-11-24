const fs = require("fs");
const path = require("path");
const express = require("express");
const serveStatic = require("serve-static");
const { createServer: createViteServer } = require("vite");

require('dotenv').config({ path: path.resolve(__dirname, `.env.${process.env.NODE_ENV != "pro" ? "test" : "pro"}`) })

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
// 创建一个虚拟dom
const { window } = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
  url: "https://example.org/",
  referrer: "https://example.com/",
  contentType: "text/html",
  includeNodeLocations: true,
  storageQuota: 10000000,
});
const { document } = window;

// 挂载到 node 全局
global.window = window;
global.document = document;
global.navigator = window.navigator;
global.location = document.location;
global.localStorage = window.localStorage;
global.sessionStorage = window.sessionStorage;

const isProd = process.env.NODE_ENV != "test";

async function createServer() {
  const app = express();

  let vite = await createViteServer({
    server: { middlewareMode: "ssr" },
  });
  if (isProd) {
    app.use(
      serveStatic(path.resolve(__dirname, "dist/client"), { index: false }),
    );
  } else {
    app.use(vite.middlewares);
  }

  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    let template;
    let render;

    try {
      if (isProd) {
        template = fs.readFileSync(
          path.resolve(__dirname, "dist/client/index.html"),
          "utf-8",
        );
        render = require("./dist/server/entry-server.js").render;
      } else {
        template = fs.readFileSync(
          path.resolve(__dirname, "index.html"),
          "utf-8",
        );
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.js")).render;
      }
      const appHtml = await render(url);
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(25666, () =>
    console.log(
      `server is running at ${isProd ? "线上" : "开发"
      }环境： http://localhost:25666`,
    ),
  );
}

createServer();
