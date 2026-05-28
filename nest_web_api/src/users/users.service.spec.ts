import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

const mockUserRepository = 
{
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockRoleRepository = 
{
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

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

  // User tests
  describe('createUser', () => {
    it('should create and save a user with a role', async () => {
      const dto = { Email: 'test@test.com', Name: 'Test User', Password: 'password', Role_ID: 1 };
      const role = { Role_ID: 1, Role: 'Admin' };
      const created = { User_ID: 1, ...dto, role };

      mockRoleRepository.findOne.mockResolvedValue(role); // findOneRole still hits the repo
      mockUserRepository.create.mockReturnValue(created);
      mockUserRepository.save.mockResolvedValue(created);

      const result = await service.createUser(dto);

      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
        where: { Role_ID: dto.Role_ID },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...dto,
        role,
      });
      expect(result).toEqual(created);
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
    it('should update and return the user', async () => {
      const dto = { Name: 'Updated Name' };
      const updated = { User_ID: 1, Email: 'test@test.com', Name: 'Updated Name', role: { Role_ID: 1, Role: 'Admin' } };

      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue(updated);

      const result = await service.updateUser(1, dto);

      expect(mockUserRepository.update).toHaveBeenCalledWith(1, dto);
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

  // Role tests
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