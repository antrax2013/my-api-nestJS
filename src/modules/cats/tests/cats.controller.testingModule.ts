import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from '../cats.service';
import { CatsController } from '../cats.controller';

export function catsControllerTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    controllers: [CatsController],
    providers: [
      {
        provide: CatsService,
        useValue: {
          create: jest.fn().mockResolvedValue(null),
          findAll: jest.fn().mockResolvedValue([]),
          findOne: jest.fn().mockResolvedValue(null),
          update: jest.fn().mockResolvedValue(null),
          remove: jest.fn().mockResolvedValue(null),
        },
      },
    ],
  }).compile();
}
