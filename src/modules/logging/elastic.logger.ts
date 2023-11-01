import { Client } from '@elastic/elasticsearch';
import {
  LogLevel,
  LoggerService,
} from '@nestjs/common/services/logger.service';

//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-testing.html
export class ElasticLogger implements LoggerService {
  private readonly esclient: Client;
  private indexName: string = 'logs';
  public levels: LogLevel[] = [];

  constructor(esclient: Client) {
    this.esclient = esclient;
  }

  public setLogLevels(levels: LogLevel[]) {
    this.levels = levels;
  }

  /*
  await client.indices.create({
    index: 'tweets',
    body: {
      mappings: {
        properties: {
          id: { type: 'integer' },
          text: { type: 'text' },
          user: { type: 'keyword' },
          time: { type: 'date' }
        }
      }
    }
  }, { ignore: [400] })
  */

  private async writeIndex(message: any) {
    /*await this.esclient.index({
      index:  this.indexName,
      document: message
    }).catch(error => {console.log(`WriteIndex : error ${error} `)});*/

    await this.esclient
      .bulk({
        operations: [message].flatMap((doc) => [
          { index: { _index: this.indexName } },
          doc,
        ]),
        //refresh: true,
      })
      .catch((error) => {
        console.log(`WriteIndex : error ${error} `);
      });
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any) {
    console.log('log', this.levels, Array.isArray(this.levels));
    if (!!this.levels.find((elmt) => elmt === 'log')) {
      this.writeIndex({ message, type: 'log' });
    }
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any) {
    if (!!this.levels.find((elmt) => elmt === 'fatal')) {
      this.writeIndex({ message, type: 'fatal' });
    }
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any) {
    if (!!this.levels.find((elmt) => elmt === 'error')) {
      this.writeIndex({ message, type: 'error' });
    }
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any) {
    if (!!this.levels.find((elmt) => elmt === 'warn')) {
      this.writeIndex({ message, type: 'warn' });
    }
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any) {
    if (!!this.levels.find((elmt) => elmt === 'debug')) {
      this.writeIndex({ message, type: 'debug' });
    }
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any) {
    if (!!this.levels.find((elmt) => elmt === 'verbose')) {
      this.writeIndex({ message, type: 'verbose' });
    }
  }
}
