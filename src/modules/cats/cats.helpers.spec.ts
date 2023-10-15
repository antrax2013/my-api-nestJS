import { ObjectId } from 'mongodb';
import { Cat } from './entities/cat.entity';
import { Gender } from '../commons/enums';
import { CatHelpers } from './cats.helpers';
import { CreateCatDto } from './dto/create-cat.dto';

describe('CatHelpers', () => {
  describe('getAge', () => {
    it.each`
      description                               | addMonth | expectedAge
      ${'should be 6 years old'}                | ${-72}   | ${6}
      ${'should be 6 years old'}                | ${-75}   | ${6}
      ${'should be 0 year old'}                 | ${-1}    | ${0}
      ${'should be 0 year old, born in future'} | ${2}     | ${0}
    `('$description', ({ addMonth, expectedAge }) => {
      //Given
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();
      const birthDate = new Date(year, month + addMonth, day);

      //When
      const actualAge = CatHelpers.getAge(birthDate);

      //Then
      expect(actualAge).toStrictEqual(expectedAge);
    });
  });

  it('should return an adapted createCatDto from Cat', async () => {
    //Given
    const mary: Cat = {
      _id: new ObjectId(),
      name: 'mary',
      birthDate: new Date(),
      isAlive: false,
      gender: Gender.Female,
    };
    const expectedAge = 0;

    //When
    const createCatDto = CatHelpers.catToCreateCatDto(mary);

    //Then
    expect(createCatDto).toHaveProperty('_id', mary._id.toString());
    expect(createCatDto).toHaveProperty('name', mary.name);
    expect(createCatDto).toHaveProperty('birthDate', mary.birthDate);
    expect(createCatDto).toHaveProperty('isAlive', mary.isAlive);
    expect(createCatDto).toHaveProperty('gender', mary.gender);
    expect(createCatDto).toHaveProperty('age', expectedAge);
  });

  it('should return an adapted cat from CreateCateDto', async () => {
    //Given
    const maryDto: CreateCatDto = {
      _id: new ObjectId().toString(),
      name: 'mary',
      birthDate: new Date(),
      isAlive: false,
      gender: Gender.Female,
      age: 0,
    };

    //When
    const cat = CatHelpers.createCatDtoToCat(maryDto);

    //Then
    expect(cat).toHaveProperty('_id', new ObjectId(maryDto._id));
    expect(cat).toHaveProperty('name', maryDto.name);
    expect(cat).toHaveProperty('birthDate', maryDto.birthDate);
    expect(cat).toHaveProperty('isAlive', maryDto.isAlive);
    expect(cat).toHaveProperty('gender', maryDto.gender);
  });
});
