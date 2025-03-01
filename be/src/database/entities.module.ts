import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitites/user.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
