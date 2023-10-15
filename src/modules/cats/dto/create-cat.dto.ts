import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InputCatDto } from './input-cat.dto';

export class CreateCatDto extends InputCatDto {
  @ApiProperty({
    example: 11,
    description: 'the age of cat (compute field)',
    default: null,
  })
  @IsInt()
  @IsPositive()
  readonly age: number;
}
