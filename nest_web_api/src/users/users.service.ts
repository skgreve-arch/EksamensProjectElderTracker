import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { CreateUserDto, UpdateUserDto, CreateRoleDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  // User CRUD
  /**
   * Creates a new user in the database.
   * @param dto 
   * @returns A promise resolving to the created User entity.
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    // Validate role exists
    const role = await this.findOneRole(dto.Role_ID);
    if (!role) {
      throw new Error(`Role with ID ${dto.Role_ID} not found`);
    }
    // Create user entity and save to database
    const user = this.userRepository.create({
      ...dto,
      role,
    });
    return this.userRepository.save(user);
  }

  /**
   * Retrieves all users from the database.
   * @returns A promise resolving to an array of User entities.
   */
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['role'],
    });
  }

  /**
   * Retrieves a user by their ID from the database.
   * @param userId 
   * @returns A promise resolving to a User entity or null if not found.
   */
  async findOneUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { User_ID: userId },
      relations: ['role'],
    });
  }

  /**
   * Updates a user in the database.
   * @param userId 
   * @param dto 
   * @returns A promise resolving to the updated User entity or null if not found.
   */
  async updateUser(userId: number, dto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(userId, dto);
    return this.findOneUser(userId);
  }

  /**
   * Removes a user from the database.
   * @param userId 
   */
  async removeUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }

  // Role CRUD
  /**
   * Creates a new role in the database.
   * @param dto 
   * @returns A promise resolving to the created Role entity.
   */
  async createRole(dto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(dto);
    return this.roleRepository.save(role);
  }

  /**
   * Retrieves all roles from the database.
   * @returns A promise resolving to an array of Role entities.
   */
  async findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  /**
   * Retrieves a role by its ID from the database.
   * @param roleId 
   * @returns A promise resolving to a Role entity or null if not found.
   */
  async findOneRole(roleId: number): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { Role_ID: roleId },
    });
  }

  /**
   * Removes a role from the database.
   * @param roleId 
   */
  async removeRole(roleId: number): Promise<void> {
    await this.roleRepository.delete(roleId);
  }
  async login(
    email: string,
    password: string,
  ): Promise<User | null> {

    return this.userRepository.findOne({
      where: {
        Email: email,
        Password: password,
      },
      relations: ['role'],
    });
  }
}