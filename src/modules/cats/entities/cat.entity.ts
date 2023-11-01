import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Gender } from '../dto/input-cat.dto';

@Entity()
export class Cat {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  birthDate: Date;

  @Column()
  isAlive: boolean;

  @Column()
  gender: Gender;
}
