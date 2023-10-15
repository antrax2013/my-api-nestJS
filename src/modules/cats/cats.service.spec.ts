import { TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { catsServiceTestingModule } from './tests/cats.service.testingModule';
import { CatHelpers } from './cats.helpers';
import {
  cartoonCats,
  newBornCat,
  sylvester,
} from './tests/cats.datas.testingModules';
import { MongoError, ObjectId } from 'mongodb';

describe('CatsService', () => {
  let service: CatsService;
  let repository: MongoRepository<Cat>;
  const mocks: jest.SpyInstance<any>[] = [];

  beforeEach(async () => {
    const module: TestingModule = await catsServiceTestingModule();

    service = module.get<CatsService>(CatsService);
    repository = module.get<MongoRepository<Cat>>(getRepositoryToken(Cat));
  });

  afterEach(async () => {
    mocks.forEach((m) => m.mockRestore());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert and return a new CreateCatDto', async () => {
      //Given
      const expectedCat = CatHelpers.catToCreateCatDto(newBornCat);

      const findOneByMocked = jest.spyOn(repository, 'findOneBy');
      findOneByMocked.mockResolvedValue(null);
      mocks.push(findOneByMocked);

      const saveMocked = jest.spyOn(repository, 'save');
      saveMocked.mockResolvedValue(newBornCat);
      mocks.push(saveMocked);

      //When
      const cat = await service.create(expectedCat);

      //Then
      expect(findOneByMocked).toBeCalledWith({ _id: newBornCat._id });
      expect(saveMocked).toBeCalledWith(newBornCat);
      expect(cat).toBeDefined();

      expect(cat).toHaveProperty('_id', expectedCat._id);
      expect(cat).toHaveProperty('name', expectedCat.name);
      expect(cat).toHaveProperty('birthDate', expectedCat.birthDate);
      expect(cat).toHaveProperty('isAlive', expectedCat.isAlive);
      expect(cat).toHaveProperty('gender', expectedCat.gender);
      expect(cat).toHaveProperty('age', expectedCat.age);
    });

    it('should return an mongoException : already exists', async () => {
      //Given
      const expectedCat = CatHelpers.catToCreateCatDto(newBornCat);

      const findOneByMocked = jest.spyOn(repository, 'findOneBy');
      findOneByMocked.mockResolvedValue(newBornCat);
      mocks.push(findOneByMocked);

      //When-Then
      await expect(service.create(expectedCat)).rejects.toThrowError(
        new MongoError(
          `Cat ${CatHelpers.getCatId(newBornCat)} already exists.`,
        ),
      );
      expect(findOneByMocked).toBeCalledWith({ _id: newBornCat._id });
    });
  });

  describe('findAll()', () => {
    it('should return an array of all cartoon cats', async () => {
      //Given
      const expectedCats = cartoonCats.map((c) =>
        CatHelpers.catToCreateCatDto(c),
      );
      const findMocked = jest.spyOn(repository, 'find');
      findMocked.mockResolvedValue(cartoonCats);
      mocks.push(findMocked);

      //When
      const res = await service.findAll();

      //Then
      expect(findMocked).toBeCalled();
      expect(res).toHaveLength(expectedCats.length);
      res.forEach((r) => {
        const expectedCat = expectedCats.find((c) => c._id === r._id);

        expect(expectedCat).toBeDefined();
        expect(r).toStrictEqual(expectedCat);
      });
    });

    it('should return an empty array', async () => {
      //Given
      const findMocked = jest.spyOn(repository, 'find');
      findMocked.mockResolvedValue([]);
      mocks.push(findMocked);

      //When
      const res = await service.findAll();

      //Then
      expect(findMocked).toBeCalled();
      expect(res).toHaveLength(0);
    });
  });

  describe('findOne()', () => {
    it('should return an the cat', async () => {
      //Given
      const expectedCat = CatHelpers.catToCreateCatDto(sylvester);
      const findOneByMocked = jest.spyOn(repository, 'findOneBy');
      findOneByMocked.mockResolvedValue(sylvester);
      mocks.push(findOneByMocked);

      //When
      const res = await service.findOne(expectedCat._id);

      //Then
      expect(findOneByMocked).toBeCalledWith({ _id: sylvester._id });
      expect(res).toStrictEqual(expectedCat);
    });

    it('should return a not found exception', async () => {
      //Given
      const findOneByMocked = jest.spyOn(repository, 'findOneBy');
      findOneByMocked.mockResolvedValue(null);
      mocks.push(findOneByMocked);
      const id = new ObjectId();

      //When
      const res = await service.findOne(CatHelpers.getId(id));

      //Then
      expect(findOneByMocked).toBeCalledWith({ _id: id });
      expect(res).toBeNull();
    });
  });

  describe('update()', () => {
    it('should return a UpdateCatDto', async () => {
      //Given
      const expectedCat = CatHelpers.catToCreateCatDto(newBornCat);

      const findByMocked = jest.spyOn(repository, 'findBy');
      findByMocked.mockResolvedValue([newBornCat]);
      mocks.push(findByMocked);

      const saveMocked = jest.spyOn(repository, 'save');
      saveMocked.mockResolvedValue(newBornCat);
      mocks.push(saveMocked);

      //When
      const cat = await service.update(expectedCat._id, expectedCat);

      //Then
      expect(saveMocked).toBeCalledWith(newBornCat);
      expect(findByMocked).toBeCalledWith({ _id: newBornCat._id });
      expect(cat).toBeDefined();

      expect(cat).toHaveProperty('_id', expectedCat._id);
      expect(cat).toHaveProperty('name', expectedCat.name);
      expect(cat).toHaveProperty('birthDate', expectedCat.birthDate);
      expect(cat).toHaveProperty('isAlive', expectedCat.isAlive);
      expect(cat).toHaveProperty('gender', expectedCat.gender);
      expect(cat).toHaveProperty('age', expectedCat.age);
    });

    it('should return MongoError : the cat not exists', async () => {
      //Given
      const expectedCat = CatHelpers.catToCreateCatDto(newBornCat);

      const findByMocked = jest.spyOn(repository, 'findBy');
      findByMocked.mockResolvedValue([]);
      mocks.push(findByMocked);

      //When-Then
      await expect(
        service.update(expectedCat._id, expectedCat),
      ).rejects.toThrowError(
        new MongoError(`Cat ${CatHelpers.getCatId(newBornCat)} not found.`),
      );
      expect(findByMocked).toBeCalledWith({ _id: newBornCat._id });
    });

    it('should return MongoError : many cats exist', async () => {
      //Given
      const expectedCat = CatHelpers.catToCreateCatDto(newBornCat);
      const manyCats = [newBornCat, newBornCat];

      const findByMocked = jest.spyOn(repository, 'findBy');
      findByMocked.mockResolvedValue(manyCats);
      mocks.push(findByMocked);

      //When-Then
      await expect(
        service.update(expectedCat._id, expectedCat),
      ).rejects.toThrowError(
        new MongoError(
          `${manyCats.length} cats found with id : ${CatHelpers.getCatId(
            newBornCat,
          )}`,
        ),
      );
      expect(findByMocked).toBeCalledWith({ _id: newBornCat._id });
    });
  });

  describe('remove()', () => {
    it('should return true, the cat is removed', async () => {
      //Given
      const expectedId = CatHelpers.getCatId(sylvester);

      const findByMocked = jest.spyOn(repository, 'findBy');
      findByMocked.mockResolvedValue([sylvester]);
      mocks.push(findByMocked);

      const deleteMocked = jest.spyOn(repository, 'delete');
      deleteMocked.mockResolvedValue({ raw: '', affected: 1 });
      mocks.push(deleteMocked);

      //When
      const res = await service.remove(expectedId);

      //Then
      expect(findByMocked).toBeCalledWith({ _id: sylvester._id });
      expect(deleteMocked).toBeCalledWith(expectedId);
      expect(res).toBeTruthy();
    });

    it('should return MongoError : the cat not exists', async () => {
      //Given
      const expectedId = CatHelpers.getCatId(newBornCat);

      const findByMocked = jest.spyOn(repository, 'findBy');
      findByMocked.mockResolvedValue([]);
      mocks.push(findByMocked);

      //When-Then
      await expect(service.remove(expectedId)).rejects.toThrowError(
        new MongoError(`Cat ${expectedId} not found.`),
      );
      expect(findByMocked).toBeCalledWith({ _id: newBornCat._id });
    });

    it('should return MongoError : many cats exist', async () => {
      //Given
      const expectedId = CatHelpers.getCatId(newBornCat);
      const manyCats = [newBornCat, newBornCat];

      const findByMocked = jest.spyOn(repository, 'findBy');
      findByMocked.mockResolvedValue(manyCats);
      mocks.push(findByMocked);

      //When-Then
      await expect(service.remove(expectedId)).rejects.toThrowError(
        new MongoError(`${manyCats.length} cats found with id : ${expectedId}`),
      );
      expect(findByMocked).toBeCalledWith({ _id: newBornCat._id });
    });
  });
});
