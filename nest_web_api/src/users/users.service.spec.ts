import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockRoleRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

/**
 * Unit tests for `UsersService` covering user creation, authentication,
 * updates, deletion and role management. Uses repository mocks to avoid
 * touching the database during tests.
 */
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash password and create a user with a role', async () => {
      const dto = { Email: 'test@test.com', Name: 'Test User', Password: 'plainpassword', Role_ID: 1 };
      const role = { Role_ID: 1, Role: 'Admin' };
      const created = {
        User_ID: 1,
        Email: dto.Email,
        Name: dto.Name,
        PasswordHash: 'hashedpassword',
        PasswordSalt: 'salt',
        role,
      };

      mockRoleRepository.findOne.mockResolvedValue(role);
      mockUserRepository.create.mockReturnValue(created);
      mockUserRepository.save.mockResolvedValue(created);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const result = await service.createUser(dto);

      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({ where: { Role_ID: 1 } });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 'salt');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        Email: dto.Email,
        Name: dto.Name,
        PasswordHash: 'hashedpassword',
        PasswordSalt: 'salt',
        role,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });

    it('should throw error if role not found', async () => {
      const dto = { Email: 'test@test.com', Name: 'Test User', Password: 'plainpassword', Role_ID: 999 };
      mockRoleRepository.findOne.mockResolvedValue(null);

      await expect(service.createUser(dto)).rejects.toThrow('Role with ID 999 not found');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllUsers', () => {
    it('should return all users with roles', async () => {
      const users = [
        { User_ID: 1, Email: 'test@test.com', Name: 'Test User', role: { Role_ID: 1, Role: 'Admin' } },
        { User_ID: 2, Email: 'test2@test.com', Name: 'Test User 2', role: { Role_ID: 2, Role: 'User' } },
      ];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAllUsers();

      expect(mockUserRepository.find).toHaveBeenCalledWith({ relations: ['role'] });
      expect(result).toEqual(users);
    });

    it('should return empty array if no users found', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const result = await service.findAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('findOneUser', () => {
    it('should return a user by id with role', async () => {
      const user = { User_ID: 1, Email: 'test@test.com', Name: 'Test User', role: { Role_ID: 1, Role: 'Admin' } };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOneUser(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { User_ID: 1 },
        relations: ['role'],
      });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneUser(999);

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user without changing password', async () => {
      const dto = { Name: 'Updated Name' };
      const updated = { User_ID: 1, Email: 'test@test.com', Name: 'Updated Name', role: { Role_ID: 1, Role: 'Admin' } };

      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue(updated);

      const result = await service.updateUser(1, dto);

      expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
        Email: undefined,
        Name: 'Updated Name',
      });
      expect(result).toEqual(updated);
    });

    it('should rehash password when updating password', async () => {
      const dto = { Password: 'newpassword' };
      const updated = {
        User_ID: 1,
        Email: 'test@test.com',
        PasswordHash: 'newhashedpassword',
        PasswordSalt: 'newsalt',
      };

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('newsalt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashedpassword');
      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue(updated);

      const result = await service.updateUser(1, dto);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 'newsalt');
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
        Email: undefined,
        Name: undefined,
        PasswordHash: 'newhashedpassword',
        PasswordSalt: 'newsalt',
      });
      expect(result).toEqual(updated);
    });
  });

  describe('removeUser', () => {
    it('should delete a user', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await service.removeUser(1);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('login', () => {
    it('should return user if email and password match', async () => {
      const user = {
        User_ID: 1,
        Email: 'test@test.com',
        PasswordHash: 'hashedpassword',
        role: { Role_ID: 1, Role: 'Admin' },
      };
      mockUserRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('test@test.com', 'plainpassword');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { Email: 'test@test.com' },
        relations: ['role'],
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('plainpassword', 'hashedpassword');
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.login('wrong@test.com', 'plainpassword');

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user = {
        User_ID: 1,
        Email: 'test@test.com',
        PasswordHash: 'hashedpassword',
      };
      mockUserRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.login('test@test.com', 'wrongpassword');

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
      expect(result).toBeNull();
    });
  });

  describe('createRole', () => {
    it('should create and save a role', async () => {
      const dto = { Role: 'Admin' };
      const created = { Role_ID: 1, ...dto };

      mockRoleRepository.create.mockReturnValue(created);
      mockRoleRepository.save.mockResolvedValue(created);

      const result = await service.createRole(dto);

      expect(mockRoleRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRoleRepository.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });
  });

  describe('findAllRoles', () => {
    it('should return all roles', async () => {
      const roles = [
        { Role_ID: 1, Role: 'Admin' },
        { Role_ID: 2, Role: 'User' },
      ];
      mockRoleRepository.find.mockResolvedValue(roles);

      const result = await service.findAllRoles();

      expect(mockRoleRepository.find).toHaveBeenCalled();
      expect(result).toEqual(roles);
    });
  });

  describe('findOneRole', () => {
    it('should return a role by id', async () => {
      const role = { Role_ID: 1, Role: 'Admin' };
      mockRoleRepository.findOne.mockResolvedValue(role);

      const result = await service.findOneRole(1);

      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
        where: { Role_ID: 1 },
      });
      expect(result).toEqual(role);
    });

    it('should return null if role not found', async () => {
      mockRoleRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneRole(999);

      expect(result).toBeNull();
    });
  });

  describe('removeRole', () => {
    it('should delete a role', async () => {
      mockRoleRepository.delete.mockResolvedValue({ affected: 1 });

      await service.removeRole(1);

      expect(mockRoleRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});