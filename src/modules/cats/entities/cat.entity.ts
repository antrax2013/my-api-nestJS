import { ObjectId } from 'mongodb';
import { Gender } from '../../commons/enums';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

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
