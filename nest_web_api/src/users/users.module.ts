import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

/**
 * UsersModule registers the `User` and `Role` repositories and wires
 * the `UsersController` with `UsersService`. Other modules can import
 * this module to access user management functionality.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}