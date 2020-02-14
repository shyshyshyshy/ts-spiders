import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { controller, get, use } from '../decorator';
import Crowller from '../utils/crowller';
import DellAnalyzer from '../utils/analyzer';
import { getResponeseData } from '../utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin: boolean = !!(req.session ? req.session.login : false);
  console.log('checkLogin middleware');
  if (isLogin) {
    next();
  } else {
    res.json(getResponeseData(null, '请先登陆'));
  }
};
const test = (req: Request, res: Response, next: NextFunction): void => {
  console.log('test middleware');
  next();
};

@controller('/')
export class CrowllerController {
  @get('/getData')
  @use(checkLogin)
  @use(test)
  getData(req: BodyRequest, res: Response): void {
    const secret = 'secretKey';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = new DellAnalyzer();
    new Crowller(url, analyzer);
    res.json(getResponeseData(true));
  }

  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/course.json');
      const result = fs.readFileSync(position, 'utf8');
      res.json(getResponeseData(JSON.parse(result)));
    } catch (e) {
      res.json(getResponeseData(false, '数据不存在'));
    }
  }
}
