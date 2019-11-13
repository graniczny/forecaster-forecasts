import { Middleware, Context } from 'koa';

export default (): Middleware => {
  return async (ctx: Context, next) => {
    try {
      await next();
    } catch (e) {
      ctx.body = e;
    }
  };
};
