"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Koa = require("koa");
var Router = require("koa-router");
var KoaBody = require("koa-body");
var KoaLogger = require("koa-logger");
var KoaServeStatic = require("koa-static");
var co_busboy_1 = require("co-busboy");
var path = require("path");
var cwd = process.cwd();
var root = path.resolve(cwd, "..");
var createServer = function () {
    var app = new Koa();
    var router = new Router();
    router.post("/upload.do", function () {
        var parts, part, files, ret, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    parts = co_busboy_1["default"](this, {
                        autoFields: true
                    });
                    part = void 0, files = [];
                    _a.label = 1;
                case 1: return [4 /*yield*/, parts];
                case 2:
                    if (!(part = _a.sent())) return [3 /*break*/, 3];
                    files.push(part.filename);
                    part.resume();
                    return [3 /*break*/, 1];
                case 3:
                    ret = "";
                    this.status = 200;
                    this.set("Content-Type", "text/html");
                    return [4 /*yield*/, wait(2000)];
                case 4:
                    _a.sent();
                    if (parts.fields[0] && parts.fields[0][0] === "_documentDomain") {
                        ret += '<script>document.domain="' + parts.fields[0][1] + '";</script>';
                    }
                    ret += JSON.stringify(files);
                    console.log(ret);
                    this.body = ret;
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    this.body = e_1.stack;
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
    router.post("/test", function () {
        var parts, part, files, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.set("Content-Type", "text/html");
                    parts = co_busboy_1["default"](this, {
                        autoFields: true
                    });
                    files = [];
                    _a.label = 1;
                case 1: return [4 /*yield*/, parts];
                case 2:
                    if (!(part = _a.sent())) return [3 /*break*/, 3];
                    files.push(part.filename);
                    part.resume();
                    return [3 /*break*/, 1];
                case 3:
                    ret = parts.fields[2];
                    if (ret[1].indexOf("success") > -1) {
                        this.status = 200;
                        this.body = ret;
                    }
                    else {
                        this.status = 400;
                        this.body = "error 400";
                    }
                    return [2 /*return*/];
            }
        });
    });
    app.use(KoaLogger());
    app.use(KoaBody({
        formidable: { uploadDir: path.join(root, "tmp") },
        multipart: true
    }));
    app.use(router.routes()).use(router.allowedMethods());
    app.use(KoaServeStatic(root, {
        hidden: true
    }));
    return app;
};
var wait = function (time) {
    return function (callback) {
        setTimeout(callback, time);
    };
};
var app = createServer();
var port = 10010;
app.listen(port);
console.log("listen at " + port);
process.on("uncaughtException", function (err) {
    console.log(err.stack);
});
