import {
  BulkRequest,
  BulkResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { ElasticLogger } from './elastic.logger';
import { Client } from '@elastic/elasticsearch';

describe('ElasticLogger', () => {
  const esClient = new Client({ node: 'http://localhost' });
  const logger = new ElasticLogger(esClient);
  const mockedBulk = jest.spyOn(esClient, 'bulk');

  it('should be defined', () => {
    expect(new ElasticLogger(esClient)).toBeDefined();
  });

  it.each`
    description                                        | inputs
    ${'A message should be logged with log level'}     | ${{ message: 'Hello world', level: 'log', levels: ['log'] }}
    ${'A message should be logged with fatal level'}   | ${{ message: 'Hello world', level: 'fatal', levels: ['fatal'] }}
    ${'A message should be logged with error level'}   | ${{ message: 'Hello world', level: 'error', levels: ['error'] }}
    ${'A message should be logged with warn level'}    | ${{ message: 'Hello world', level: 'warn', levels: ['warn'] }}
    ${'A message should be logged with debug level'}   | ${{ message: 'Hello world', level: 'debug', levels: ['debug'] }}
    ${'A message should be logged with verbose level'} | ${{ message: 'Hello world', level: 'verbose', levels: ['verbose'] }}
    ${'A message should be logged with log level'}     | ${{ message: 'Hello world', level: 'log', levels: ['log', 'verbose'] }}
  `('$description', ({ inputs }) => {
    const buffer: string[] = [];
    const message = inputs.message;
    const level = inputs.level;

    mockedBulk.mockImplementation(
      (request: BulkRequest): Promise<BulkResponse> => {
        buffer.push(JSON.stringify(request?.operations));
        return Promise.resolve({
          errors: true,
          items: [],
          took: 1,
        });
      },
    );

    logger.setLogLevels(inputs.levels);

    switch (level) {
      case 'log':
        logger.log(message);
        break;
      case 'fatal':
        logger.fatal(message);
        break;
      case 'error':
        logger.error(message);
        break;
      case 'warn':
        logger.warn(message);
        break;
      case 'debug':
        logger.debug(message);
        break;
      case 'verbose':
        logger.verbose(message);
        break;
    }

    expect(mockedBulk).toBeCalled();
    const actualLogs = buffer.map((log: string) => JSON.parse(log));

    expect(actualLogs).toHaveLength(1);

    actualLogs.forEach((elmt: any[]) => {
      const actualLog = elmt[1];

      expect(actualLog).toHaveProperty('message', message);
      expect(actualLog).toHaveProperty('type', level);
    });
    mockedBulk.mockClear();
  });

  it.each`
    description                                          | inputs
    ${'A message not should be logged with fatal level'} | ${{ message: 'Hello world', level: 'fatal', levels: [] }}
    ${'A message not should be logged with log level'}   | ${{ message: 'Hello world', level: 'log', levels: ['fatal', 'error', 'warn', 'debug', 'verbose'] }}
    ${'A message not should be logged with log level'}   | ${{ message: 'Hello world', level: 'fatal', levels: ['log', 'error', 'warn', 'debug', 'verbose'] }}
    ${'A message not should be logged with log level'}   | ${{ message: 'Hello world', level: 'error', levels: ['log', 'fatal', 'warn', 'debug', 'verbose'] }}
    ${'A message not should be logged with log level'}   | ${{ message: 'Hello world', level: 'warn', levels: ['log', 'fatal', 'error', 'debug', 'verbose'] }}
    ${'A message not should be logged with log level'}   | ${{ message: 'Hello world', level: 'debug', levels: ['log', 'fatal', 'error', 'warn', 'verbose'] }}
    ${'A message not should be logged with log level'}   | ${{ message: 'Hello world', level: 'verbose', levels: ['log', 'fatal', 'error', 'warn', 'debug'] }}
  `('$description', ({ inputs }) => {
    const buffer: string[] = [];
    const message = inputs.message;
    const level = inputs.level;

    mockedBulk.mockImplementation(
      (request: BulkRequest): Promise<BulkResponse> => {
        buffer.push(JSON.stringify(request?.operations));
        return Promise.resolve({
          errors: true,
          items: [],
          took: 1,
        });
      },
    );

    logger.setLogLevels(inputs.levels);

    switch (level) {
      case 'log':
        logger.log(message);
        break;
      case 'fatal':
        logger.fatal(message);
        break;
      case 'error':
        logger.error(message);
        break;
      case 'warn':
        logger.warn(message);
        break;
      case 'debug':
        logger.debug(message);
        break;
      case 'verbose':
        logger.verbose(message);
        break;
    }

    expect(mockedBulk).not.toBeCalled();
    expect(buffer).toHaveLength(0);
    mockedBulk.mockClear();
  });
});
