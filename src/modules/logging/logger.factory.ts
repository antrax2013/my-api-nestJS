import { ConsoleLogger } from '@nestjs/common';
import {
  LogLevel,
  LoggerService,
} from '@nestjs/common/services/logger.service';
import { ElasticLogger } from './elastic.logger';
import { Client } from '@elastic/elasticsearch';

export enum LoggerFactoryType {
  Console = 'console',
  ElasticSearch = 'elasticSearch',
}

export class LoggerFactory {
  private static mapLoggerFactoryType(
    loggerFactoryType: string,
  ): LoggerFactoryType {
    return LoggerFactoryType[
      loggerFactoryType as keyof typeof LoggerFactoryType
    ];
  }

  private static mapLogLevels(LogLevels: string[]): LogLevel[] {
    return LogLevels.map((lvl) => lvl as LogLevel);
  }

  public static getLogger(
    esclient: Client,
    loggerFactoryType: string,
    logLevels: string[],
  ): LoggerService {
    let logger: LoggerService;
    const loggerType = LoggerFactory.mapLoggerFactoryType(loggerFactoryType);
    const levels = LoggerFactory.mapLogLevels(logLevels);

    switch (loggerType) {
      case LoggerFactoryType.ElasticSearch:
        logger = new ElasticLogger(esclient);
        break;
      case LoggerFactoryType.Console:
      default:
        logger = new ConsoleLogger();
    }

    logger.setLogLevels(levels);

    return logger;
  }
}
