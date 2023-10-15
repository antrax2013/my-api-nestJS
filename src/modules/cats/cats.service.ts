import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { MongoRepository } from 'typeorm';
import { CatHelpers } from './cats.helpers';
import { MongoError, ObjectId } from 'mongodb';
import { InputCatDto } from './dto/input-cat.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly repository: MongoRepository<Cat>,
  ) {}

  async findAll(): Promise<CreateCatDto[]> {
    const cats = await this.repository.find();
    return cats.map((cat) => CatHelpers.catToCreateCatDto(cat));
  }

  async findOne(id: string): Promise<CreateCatDto> {
    const cat = await this.repository.findOneBy({
      _id: CatHelpers.getObjectId(id),
    });
    return !cat ? null : CatHelpers.catToCreateCatDto(cat);
  }

  private async save(inputCatDto: InputCatDto): Promise<Cat> {
    const id = inputCatDto._id
      ? CatHelpers.getCatObjectId(inputCatDto)
      : new ObjectId();
    const cat: Cat = {
      _id: id,
      name: inputCatDto.name,
      birthDate: inputCatDto.birthDate,
      gender: inputCatDto.gender,
      isAlive: inputCatDto.isAlive,
    };
    return this.repository.save(cat);
  }

  async create(inputCatDto: InputCatDto): Promise<CreateCatDto> {
    if (inputCatDto._id) {
      if (
        await this.repository.findOneBy({
          _id: CatHelpers.getCatObjectId(inputCatDto),
        })
      ) {
        throw new MongoError(`Cat ${inputCatDto._id} already exists.`);
      }
    }
    const res = await this.save(inputCatDto);
    return !!res ? CatHelpers.catToCreateCatDto(res) : null;
  }

  private async checkUnicity(id: string): Promise<void> {
    const found = await this.repository.findBy({
      _id: CatHelpers.getObjectId(id),
    });
    if (!found || found.length === 0) {
      throw new MongoError(`Cat ${id} not found.`);
    }
    if (found.length !== 1) {
      throw new MongoError(`${found.length} cats found with id : ${id}`);
    }
  }

  async update(id: string, inputCatDto: InputCatDto): Promise<UpdateCatDto> {
    if (inputCatDto._id) {
      await this.checkUnicity(id);
    }
    const res = await this.save({ ...inputCatDto, _id: id });
    return !!res ? CatHelpers.catToCreateCatDto(res) : null;
  }

  async remove(id: string): Promise<boolean> {
    await this.checkUnicity(id);
    const res = await this.repository.delete(id);
    return res?.affected === 1;
  }
}
