import { TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { catsControllerTestingModule } from './tests/cats.controller.testingModule';
import {
  cartoonCats,
  newBornCat,
  sylvester,
} from './tests/cats.datas.testingModules';
import { CatHelpers } from './cats.helpers';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;
  const mocks: jest.SpyInstance<any>[] = [];

  beforeEach(async () => {
    const module: TestingModule = await catsControllerTestingModule();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  afterEach(async () => {
    mocks.forEach((m) => m.mockRestore());
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should return a new CreateCatDto', async () => {
      //Given
      const findOneMocked = jest.spyOn(service, 'findOne');
      const expectedCat = CatHelpers.catToCreateCatDto(newBornCat);
      findOneMocked.mockResolvedValue(null);

      const createMocked = jest.spyOn(service, 'create');
      createMocked.mockResolvedValue(expectedCat);
      mocks.push(createMocked);

      //When
      const cat = await controller.create(expectedCat);

      //Then
      expect(findOneMocked).toBeCalled();
      expect(createMocked).toBeCalled();
      expect(cat).toBeDefined();

      expect(cat).toHaveProperty('_id', expectedCat._id);
      expect(cat).toHaveProperty('name', expectedCat.name);
      expect(cat).toHaveProperty('birthDate', expectedCat.birthDate);
      expect(cat).toHaveProperty('isAlive', expectedCat.isAlive);
      expect(cat).toHaveProperty('gender', expectedCat.gender);
      expect(cat).toHaveProperty('age', expectedCat.age);
    });

    it('should return an badRequestException : already exists', async () => {
      //Given
      const findOneMocked = jest.spyOn(service, 'findOne');
      const expectedCat = CatHelpers.catToCreateCatDto(newBornCat);
      findOneMocked.mockResolvedValue(expectedCat);
      mocks.push(findOneMocked);

      //When-Then
      await expect(controller.create(expectedCat)).rejects.toThrowError(
        new BadRequestException(
          `Cat ${CatHelpers.getCatId(newBornCat)} already exists.`,
        ),
      );
      expect(findOneMocked).toBeCalled();
    });
  });

  describe('findAll()', () => {
    it('should return an array of all cartoon cats', async () => {
      //Given
      const expectedCats = cartoonCats.map((c) =>
        CatHelpers.catToCreateCatDto(c),
      );
      const findAllMocked = jest.spyOn(service, 'findAll');
      findAllMocked.mockResolvedValue(expectedCats);
      mocks.push(findAllMocked);

      //When
      const res = await controller.findAll();

      //Then
      expect(findAllMocked).toBeCalled();
      expect(res).toHaveLength(expectedCats.length);
      res.forEach((r) => {
        const expectedCat = expectedCats.find((c) => c._id === r._id);

        expect(expectedCat).toBeDefined();
        expect(r).toStrictEqual(expectedCat);
      });
    });

    it('should return an empty array', async () => {
      //Given
      const findAllMocked = jest.spyOn(service, 'findAll');
      findAllMocked.mockResolvedValue([]);
      mocks.push(findAllMocked);

      //When
      const res = await controller.findAll();

      //Then
      expect(findAllMocked).toBeCalled();
      expect(res).toHaveLength(0);
    });
  });

  describe('findOne()', () => {
    it('should return an the cat', async () => {
      //Given
      const expectedCat = CatHelpers.catToCreateCatDto(sylvester);
      const findOneMocked = jest.spyOn(service, 'findOne');
      findOneMocked.mockResolvedValue(expectedCat);
      mocks.push(findOneMocked);

      //When
      const res = await controller.findOne(expectedCat._id);

      //Then
      expect(findOneMocked).toBeCalled();
      expect(res).toStrictEqual(expectedCat);
    });

    it('should return a not found exception', async () => {
      //Given
      const findOneMocked = jest.spyOn(service, 'findOne');
      findOneMocked.mockResolvedValue(null);
      mocks.push(findOneMocked);
      const id = '1';

      //When-Then
      await expect(controller.findOne(id)).rejects.toThrowError(
        new NotFoundException(`Cat ${id} not found.`),
      );
      expect(findOneMocked).toBeCalled();
    });
  });

  describe('update()', () => {
    it('should return a UpdateCatDto', async () => {
      //Given
      const findOneMocked = jest.spyOn(service, 'findOne');
      const expectedCat = CatHelpers.catToCreateCatDto(newBornCat);
      findOneMocked.mockResolvedValue(expectedCat);

      const updateMocked = jest.spyOn(service, 'update');
      updateMocked.mockResolvedValue(expectedCat);
      mocks.push(updateMocked);

      //When
      const cat = await controller.update(expectedCat._id, expectedCat);

      //Then
      expect(findOneMocked).toBeCalled();
      expect(updateMocked).toBeCalled();
      expect(cat).toBeDefined();

      expect(cat).toHaveProperty('_id', expectedCat._id);
      expect(cat).toHaveProperty('name', expectedCat.name);
      expect(cat).toHaveProperty('birthDate', expectedCat.birthDate);
      expect(cat).toHaveProperty('isAlive', expectedCat.isAlive);
      expect(cat).toHaveProperty('gender', expectedCat.gender);
      expect(cat).toHaveProperty('age', expectedCat.age);
    });

    it('should return an notFoundException : already exists', async () => {
      //Given
      const findOne = jest.spyOn(service, 'findOne');
      const expectedCat = CatHelpers.catToCreateCatDto(newBornCat);
      findOne.mockResolvedValue(null);
      mocks.push(findOne);

      //When-Then
      await expect(
        controller.update(expectedCat._id, expectedCat),
      ).rejects.toThrowError(
        new NotFoundException(
          `Cat ${CatHelpers.getCatId(newBornCat)} not found.`,
        ),
      );
      expect(findOne).toBeCalled();
    });
  });

  describe('remove()', () => {
    it('should return true, the cat is removed', async () => {
      //Given
      const expectedCat = CatHelpers.catToCreateCatDto(sylvester);
      const findOneMocked = jest.spyOn(service, 'findOne');
      findOneMocked.mockResolvedValue(expectedCat);
      mocks.push(findOneMocked);

      const removeMocked = jest.spyOn(service, 'remove');
      removeMocked.mockResolvedValue(true);
      mocks.push(removeMocked);

      //When
      const res = await controller.remove(expectedCat._id);

      //Then
      expect(findOneMocked).toBeCalled();
      expect(res).toBeTruthy();
    });

    it('should return a not found exception', async () => {
      //Given
      const findOneMocked = jest.spyOn(service, 'findOne');
      findOneMocked.mockResolvedValue(null);
      mocks.push(findOneMocked);
      const id = '1';

      //When-Then
      await expect(controller.remove(id)).rejects.toThrowError(
        new NotFoundException(`Cat ${id} not found.`),
      );
      expect(findOneMocked).toBeCalled();
    });
  });
});
