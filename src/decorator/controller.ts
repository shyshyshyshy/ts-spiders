import router from '../router';
import { RequestHandler } from 'express';
import { Methods } from './request';

export function controller(root: string) {
  return function(target: new (...args: any[]) => any): void {
    for (let key in target.prototype) {
      const path = Reflect.getMetadata('path', target.prototype, key);
      const method: Methods = Reflect.getMetadata('method', target.prototype, key);
      const middlewares: RequestHandler[] = Reflect.getMetadata('middlewares', target.prototype, key);
      const handler = target.prototype[key];
      if (path && method) {
        const fullPath = root === '/' ? path : `${root}${path}`;
        if (middlewares && middlewares.length) {
          router[method](path, ...middlewares, handler);
        } else {
          router[method](path, handler);
        }
      }
    }
  };
}
