import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InputCatDto } from './dto/input-cat.dto';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({
    status: 200,
    description: 'The cat reccorded',
    type: CreateCatDto,
  })
  @ApiResponse({ status: 400, description: 'Already exists.' })
  async create(@Body() inputCatDto: InputCatDto): Promise<CreateCatDto> {
    const exists = !!(await this.catsService.findOne(inputCatDto._id));

    if (exists) {
      throw new BadRequestException(`Cat ${inputCatDto._id} already exists.`);
    }

    return await this.catsService.create(inputCatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({
    status: 200,
    description: 'Get all cats',
    type: CreateCatDto,
  })
  async findAll(): Promise<CreateCatDto[]> {
    return await this.catsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cat from id' })
  @ApiResponse({
    status: 200,
    description: 'The cat found',
    type: CreateCatDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cat not found',
  })
  async findOne(@Param('id') id: string): Promise<CreateCatDto> {
    const cat = await this.catsService.findOne(id);

    if (!cat) {
      throw new NotFoundException(`Cat ${id} not found.`);
    }
    return cat;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cat' })
  @ApiResponse({
    status: 200,
    description: 'The Cat upadated',
    type: UpdateCatDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cat not found',
  })
  async update(
    @Param('id') id: string,
    @Body() inputCatDto: InputCatDto,
  ): Promise<UpdateCatDto> {
    const cat = await this.catsService.findOne(id);

    if (!cat) {
      throw new NotFoundException(`Cat ${id} not found.`);
    }
    return this.catsService.update(id, inputCatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cat' })
  @ApiResponse({
    status: 204,
    description: 'Cat deleted, no content',
  })
  @ApiResponse({
    status: 404,
    description: 'Cat not found',
  })
  async remove(@Param('id') id: string) {
    const cat = await this.catsService.findOne(id);

    if (!cat) {
      throw new NotFoundException(`Cat ${id} not found.`);
    }
    return await this.catsService.remove(id);
  }
}
