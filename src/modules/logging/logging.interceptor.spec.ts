import { ConsoleLogger } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  it('should be defined', () => {
    expect(new LoggingInterceptor(new ConsoleLogger())).toBeDefined();
  });
});
