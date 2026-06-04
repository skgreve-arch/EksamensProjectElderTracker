import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, CreateRoleDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // User endpoints
  // POST /users
  @Post()
  createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }

  // GET /users
  @Get()
  findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  // GET /users/:id
  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.usersService.findOneUser(id);
  }

  // PATCH /users/:id
  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto,)
    : Promise<User | null> {
    return this.usersService.updateUser(id, dto);
  }

  // DELETE /users/:id
  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.removeUser(id);
  }

  // Role endpoints
  // POST /users/roles
  @Post('roles')
  createRole(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.usersService.createRole(dto);
  }

  // GET /users/roles
  @Get('roles')
  findAllRoles(): Promise<Role[]> {
    return this.usersService.findAllRoles();
  }

  // GET /users/roles/:id
  @Get('roles/:id')
  findOneRole(@Param('id', ParseIntPipe) id: number): Promise<Role | null> {
    return this.usersService.findOneRole(id);
  }

  // DELETE /users/roles/:id
  @Delete('roles/:id')
  removeRole(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.removeRole(id);
  }
  @Post('login')
  login(
    @Body() body: {
      email: string;
      password: string;
    },
  ) {
    return this.usersService.login(
      body.email,
      body.password,
    );
  }
}