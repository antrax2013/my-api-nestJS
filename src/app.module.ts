import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './modules/cats/entities/cat.entity';
import { CatsModule } from './modules/cats/cats.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.DATABASE_URL,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'animals',
      entities: [Cat],
      synchronize: true,
    }),
    CatsModule,
  ],
})
export class AppModule {}
