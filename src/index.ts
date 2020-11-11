import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";
import KoaLogger from "koa-logger";
import KoaServeStatic from "koa-static";
//@ts-ignore
import parse from "co-busboy";

import * as path from "path";

const cwd = process.cwd();
const root = path.resolve(cwd, "..");

const createServer = () => {
  const app = new Koa();
  const router = new Router();

  router.post("/upload.do", function* (ctx, next) {
    try {
      const parts = parse(this, {
        autoFields: true,
      });
      let part,
        files = [];
      while ((part = yield parts)) {
        files.push(part.filename);
        part.resume();
      }
      let ret = "";
      this.status = 200;
      this.set("Content-Type", "text/html");
      yield wait(2000);
      if (parts.fields[0] && parts.fields[0][0] === "_documentDomain") {
        ret += '<script>document.domain="' + parts.fields[0][1] + '";</script>';
      }
      ret += JSON.stringify(files);
      console.log(ret);
      this.body = ret;
    } catch (e) {
      this.body = e.stack;
    }
  });
  router.get("/test", function (ctx, next) {
    console.log("test", ctx.params);
    ctx.status = 200;
    ctx.body = "hello!";
    next();
  });
  router.post("/test", (ctx, next) => {
    ctx.status = 200;
    ctx.body = "<div>111</div>";
    next();
  });

  app.use(KoaLogger());
  app.use(
    KoaBody({
      formidable: { uploadDir: path.join(root, "tmp") },
      multipart: true,
    })
  );
  app.use(router.routes()).use(router.allowedMethods());
  app.use(
    KoaServeStatic(root, {
      hidden: true,
    })
  );
  return app;
};

const wait = (time: number) => {
  return function (callback: () => void) {
    setTimeout(callback, time);
  };
};

const app = createServer();

const port = 8801;
app.listen(port);
console.log("listen at " + port);

process.on("uncaughtException", (err) => {
  console.log(err.stack);
});
