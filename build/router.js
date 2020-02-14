"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var express_1 = require("express");
var crowller_1 = __importDefault(require("./utils/crowller"));
var analyzer_1 = __importDefault(require("./utils/analyzer"));
var util_1 = require("./utils/util");
var router = express_1.Router();
var checkLogin = function (req, res, next) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        next();
    }
    else {
        res.json(util_1.getResponeseData(null, '请先登陆'));
    }
};
router.get('/', function (req, res) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.send("\n      <html>\n        <body>\n          <a href=\"/getData\">\u722C\u53D6\u5185\u5BB9</a>\n          <a href=\"/showData\">\u722C\u53D6\u67E5\u770B\u5185\u5BB9</a>\n          <a href=\"/logout\">\u9000\u51FA</a>\n        </body>\n      </html>\n    ");
    }
    else {
        res.send("\n      <html>\n        <body>\n          <form method=\"post\" action=\"/login\">\n            <input type=\"password\" name=\"password\" />\n            <button>\u767B\u9646</button>\n          </form>\n        </body>\n      </html>\n    ");
    }
});
router.get('/logout', function (req, res) {
    if (req.session) {
        req.session.login = undefined;
    }
    res.json(util_1.getResponeseData(true));
});
router.post('/login', function (req, res) {
    var password = req.body.password;
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.json(util_1.getResponeseData(false, '已登陆过'));
    }
    else {
        if (password === '123') {
            if (req.session) {
                req.session.login = true;
                res.json(util_1.getResponeseData(true));
            }
        }
        else {
            res.json(util_1.getResponeseData(false, '登陆失败'));
        }
    }
});
router.get('/showData', checkLogin, function (req, res) {
    try {
        var position = path_1.default.resolve(__dirname, '../data/course.json');
        var result = fs_1.default.readFileSync(position, 'utf8');
        res.json(util_1.getResponeseData(JSON.parse(result)));
    }
    catch (e) {
        res.json(util_1.getResponeseData(false, '数据不存在'));
    }
});
router.get('/getData', checkLogin, function (req, res) {
    var secret = 'secretKey';
    var url = "http://www.dell-lee.com/typescript/demo.html?secret=" + secret;
    var analyzer = new analyzer_1.default();
    new crowller_1.default(url, analyzer);
    res.json(util_1.getResponeseData(true));
});
exports.default = router;
