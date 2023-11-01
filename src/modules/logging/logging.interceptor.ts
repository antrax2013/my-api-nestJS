import {
  CallHandler,
  ExecutionContext,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  private stringifyCircularJSON(obj: object): string {
    const seen = new WeakSet();
    return JSON.stringify(obj, (k, v) => {
      if (v !== null && typeof v === 'object') {
        if (seen.has(v)) return;
        seen.add(v);
      }
      return v;
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const result: any = {
      path: request.url,
      body: request.body,
      params: request.params,
      query: request.query,
      statusCode: response.statusCode,
      timestamp: new Date().toISOString(),
    };

    return next.handle().pipe(
      tap((data: any) => {
        this.logger.verbose(
          `Request : ${this.stringifyCircularJSON({ ...result, reponse: data })}}`,
        );
      }),
      catchError((err: any) => {
        this.logger.error(
          `Request : ${this.stringifyCircularJSON({
            ...result,
            reponse: err.response,
          })}}`,
        );
        throw err;
      }),
    );
  }
}
