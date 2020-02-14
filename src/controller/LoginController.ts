import 'reflect-metadata';
import { Request, Response } from 'express';
import { controller, get, post } from '../decorator';
import { getResponeseData } from '../utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

@controller('/')
export class LoginController {
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false);
  }

  @get('/')
  home(req: BodyRequest, res: Response): void {
    const isLogin: boolean = LoginController.isLogin(req);
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
  }

  @get('/logout')
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponeseData(true));
  }

  @post('/login')
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body;
    const isLogin: boolean = LoginController.isLogin(req);
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
  }
}
