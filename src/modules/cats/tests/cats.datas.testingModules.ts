import { ObjectId } from 'mongodb';
import { Cat } from '../entities/cat.entity';
import { Gender } from '../dto/input-cat.dto';

export const newBornCat: Cat = {
  _id: new ObjectId('650e08eaec48713df8a05bf5'),
  name: 'Minou',
  birthDate: new Date(),
  isAlive: true,
  gender: Gender.Male,
};

export const sylvester: Cat = {
  _id: new ObjectId('6529bde00000000000000000'),
  name: 'Sylvester',
  birthDate: new Date(1942, 0),
  isAlive: true,
  gender: Gender.Male,
};

export const duchess: Cat = {
  _id: new ObjectId('650e029ff83efa292a5dffd6'),
  name: 'Duchess',
  birthDate: new Date(1908, 0),
  isAlive: false,
  gender: Gender.Female,
};

export const cartoonCats: Cat[] = [
  { ...duchess },
  { ...sylvester },
  { ...newBornCat },
];
