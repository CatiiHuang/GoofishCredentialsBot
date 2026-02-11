import type { Context, Next } from 'hono';
import { createLogger } from '../../core/logger.js';
import { createHash } from 'crypto';

const logger = createLogger('Api:Login');

/**
 * 生成MD5哈希
 */
function generateMd5(str: string): string {
  return createHash('md5').update(str).digest('hex');
}

/**
 * 登录校验中间件
 */
export function createLoginMiddleware() {
  return async (ctx: Context, next: Next) => {
    try {
      // 获取cookie
      const ticket = ctx.req.header('ticket') || '';

      const expectedTicket = generateMd5('catii:gqgq123123');

      // 校验ticket
      if (ticket !== expectedTicket) {
        logger.warn('Invalid ticket in cookie');
        return ctx.json({ error: 'Invalid ticket in cookie' }, 401);
      }

      await next();
    } catch (error) {
      logger.error(`Login middleware error: ${error?.toString?.()}`);
      return ctx.json({ error: 'Login middleware error' }, 401);
    }
  };
}

export const loginMiddleware = createLoginMiddleware();
