import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: unknown = 'Internal server error';
    let errorName: string | undefined;
    let stack: string | undefined;
    let details: unknown;

    if (isHttp) {
      message = exception.getResponse();
    } else if (exception && typeof exception === 'object') {
      const err = exception as Error & { cause?: unknown };
      message = err.message || message;
      errorName = err.name;
      stack = err.stack;
      details = (err as any).cause ?? undefined;
    }

    // Always log full error details to server console
    // This helps diagnosing issues that are swallowed by HTTP layer
    // eslint-disable-next-line no-console
    console.error('[Exception]', {
      url: request.url,
      method: request.method,
      status,
      errorName,
      message,
      stack,
      details,
    });

    const isProd = process.env.NODE_ENV === 'production';
    const body: Record<string, unknown> = {
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (!isProd) {
      if (errorName) body.errorName = errorName;
      if (stack) body.stack = stack;
      if (details) body.details = details;
    }

    response.status(status).json(body);
  }
}
