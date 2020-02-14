import fs from 'fs';
import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import Crowller from './utils/crowller';
import DellAnalyzer from './utils/analyzer';
import { getResponeseData } from './utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

const router = Router();

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin: boolean = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponeseData(null, '请先登陆'));
  }
};

router.get('/', (req: BodyRequest, res: Response) => {
  const isLogin: boolean = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`
      <html>
        <body>
          <a href="/getData">爬取内容</a>
          <a href="/showData">爬取查看内容</a>
          <a href="/logout">退出</a>
        </body>
      </html>
    `);
  } else {
    res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password" />
            <button>登陆</button>
          </form>
        </body>
      </html>
    `);
  }
});

router.get('/logout', (req: BodyRequest, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.json(getResponeseData(true));
});

router.post('/login', (req: BodyRequest, res: Response) => {
  const { password } = req.body;
  const isLogin: boolean = req.session ? req.session.login : false;
  if (isLogin) {
    res.json(getResponeseData(false, '已登陆过'));
  } else {
    if (password === '123') {
      if (req.session) {
        req.session.login = true;
        res.json(getResponeseData(true));
      }
    } else {
      res.json(getResponeseData(false, '登陆失败'));
    }
  }
});

router.get('/showData', checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const position = path.resolve(__dirname, '../data/course.json');
    const result = fs.readFileSync(position, 'utf8');
    res.json(getResponeseData(JSON.parse(result)));
  } catch (e) {
    res.json(getResponeseData(false, '数据不存在'));
  }
});

router.get('/getData', checkLogin, (req: BodyRequest, res: Response) => {
  const secret = 'secretKey';
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = new DellAnalyzer();
  new Crowller(url, analyzer);
  res.json(getResponeseData(true));
});

export default router;
