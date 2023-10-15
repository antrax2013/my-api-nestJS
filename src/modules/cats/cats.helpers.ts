import { ObjectId } from 'mongodb';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './entities/cat.entity';
import { InputCatDto } from './dto/input-cat.dto';

export class CatHelpers {
  static getId(id: ObjectId): string {
    return id.toString();
  }

  static getCatId(cat: Cat): string {
    return CatHelpers.getId(cat._id);
  }

  static getObjectId(id: string): ObjectId {
    return new ObjectId(id);
  }

  static getCatObjectId(cat: InputCatDto): ObjectId {
    return CatHelpers.getObjectId(cat._id);
  }

  static getAge(birthDate: Date): number {
    const nbSeconds = new Date().valueOf() - new Date(birthDate).valueOf();

    if (nbSeconds <= 0) {
      return 0;
    }
    const nbSecondsByDay = 1000 * 3600 * 24;
    const nbDays = Math.ceil(nbSeconds / nbSecondsByDay);

    const nbYears = Math.floor(nbDays / 365);

    return nbYears;
  }

  static catToCreateCatDto(cat: Cat): CreateCatDto {
    const res: CreateCatDto = {
      _id: CatHelpers.getId(cat._id),
      name: cat.name,
      birthDate: cat.birthDate,
      isAlive: cat.isAlive,
      gender: cat.gender,
      age: this.getAge(cat.birthDate),
    };
    return res;
  }

  static createCatDtoToCat(cat: CreateCatDto): Cat {
    const res: Cat = {
      _id: CatHelpers.getObjectId(cat._id),
      name: cat.name,
      birthDate: cat.birthDate,
      isAlive: cat.isAlive,
      gender: cat.gender,
    };
    return res;
  }
}
