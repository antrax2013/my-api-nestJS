import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export enum Gender {
  Male = 'm',
  Female = 'f',
}

export class InputCatDto {
  @ApiProperty({
    example: new ObjectId().toString(),
    description: 'the id of cat',
  })
  @IsString()
  readonly _id: string = new ObjectId().toString();

  @ApiProperty({ example: 'Sylvester', description: 'the name of cat' })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'true',
    description: 'true, if cat is alive, false otherwise',
  })
  @IsBoolean()
  readonly isAlive: boolean;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'the birth date of cat',
  })
  @IsDateString()
  readonly birthDate: Date;

  @ApiProperty({
    example: 'm',
    description: 'the gender of cat, m for Male, f for Female',
  })
  @IsEnum(Gender)
  readonly gender: Gender;
}
