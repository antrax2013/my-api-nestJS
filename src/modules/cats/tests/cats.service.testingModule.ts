import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cat } from '../entities/cat.entity';
import { CatsService } from '../cats.service';

export function catsServiceTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      CatsService,
      {
        provide: getRepositoryToken(Cat),
        useValue: {
          find: jest.fn().mockResolvedValue([]),
          findBy: jest.fn().mockResolvedValue([]),
          findOneBy: jest.fn().mockResolvedValue(null),
          save: jest.fn().mockResolvedValue(null),
          delete: jest.fn().mockResolvedValue(null),
        },
      },
    ],
  }).compile();
}
