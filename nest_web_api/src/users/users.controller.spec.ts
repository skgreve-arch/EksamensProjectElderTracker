import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersService = 
{
  createUser: jest.fn(),
  findAllUsers: jest.fn(),
  findOneUser: jest.fn(),
  updateUser: jest.fn(),
  removeUser: jest.fn(),
  createRole: jest.fn(),
  findAllRoles: jest.fn(),
  findOneRole: jest.fn(),
  removeRole: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // User tests
  describe('createUser', () => {
    it('should create a user', async () => {
      const dto = { Email: 'test@test.com', Name: 'Test User', Password: 'password', Role_ID: 1 };
      const created = { User_ID: 1, ...dto, role: { Role_ID: 1, Role: 'Admin' } };

      mockUsersService.createUser.mockResolvedValue(created);

      const result = await controller.createUser(dto);

      expect(mockUsersService.createUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { User_ID: 1, Email: 'test@test.com', Name: 'Test User', role: { Role_ID: 1, Role: 'Admin' } },
        { User_ID: 2, Email: 'test2@test.com', Name: 'Test User 2', role: { Role_ID: 2, Role: 'User' } },
      ];
      mockUsersService.findAllUsers.mockResolvedValue(users);

      const result = await controller.findAllUsers();

      expect(mockUsersService.findAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return empty array if no users', async () => {
      mockUsersService.findAllUsers.mockResolvedValue([]);

      const result = await controller.findAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('findOneUser', () => {
    it('should return a user by id', async () => {
      const user = { User_ID: 1, Email: 'test@test.com', Name: 'Test User', role: { Role_ID: 1, Role: 'Admin' } };
      mockUsersService.findOneUser.mockResolvedValue(user);

      const result = await controller.findOneUser(1);

      expect(mockUsersService.findOneUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUsersService.findOneUser.mockResolvedValue(null);

      const result = await controller.findOneUser(999);

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const dto = { Name: 'Updated Name' };
      const updated = { User_ID: 1, Email: 'test@test.com', Name: 'Updated Name', role: { Role_ID: 1, Role: 'Admin' } };

      mockUsersService.updateUser.mockResolvedValue(updated);

      const result = await controller.updateUser(1, dto);

      expect(mockUsersService.updateUser).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('removeUser', () => {
    it('should delete a user', async () => {
      mockUsersService.removeUser.mockResolvedValue(undefined);

      await controller.removeUser(1);

      expect(mockUsersService.removeUser).toHaveBeenCalledWith(1);
    });
  });

  // Role tests
  describe('createRole', () => {
    it('should create a role', async () => {
      const dto = { Role: 'Admin' };
      const created = { Role_ID: 1, ...dto };

      mockUsersService.createRole.mockResolvedValue(created);

      const result = await controller.createRole(dto);

      expect(mockUsersService.createRole).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('findAllRoles', () => {
    it('should return all roles', async () => {
      const roles = [
        { Role_ID: 1, Role: 'Admin' },
        { Role_ID: 2, Role: 'User' },
      ];
      mockUsersService.findAllRoles.mockResolvedValue(roles);

      const result = await controller.findAllRoles();

      expect(mockUsersService.findAllRoles).toHaveBeenCalled();
      expect(result).toEqual(roles);
    });
  });

  describe('findOneRole', () => {
    it('should return a role by id', async () => {
      const role = { Role_ID: 1, Role: 'Admin' };
      mockUsersService.findOneRole.mockResolvedValue(role);

      const result = await controller.findOneRole(1);

      expect(mockUsersService.findOneRole).toHaveBeenCalledWith(1);
      expect(result).toEqual(role);
    });

    it('should return null if role not found', async () => {
      mockUsersService.findOneRole.mockResolvedValue(null);

      const result = await controller.findOneRole(999);

      expect(result).toBeNull();
    });
  });

  describe('removeRole', () => {
    it('should delete a role', async () => {
      mockUsersService.removeRole.mockResolvedValue(undefined);

      await controller.removeRole(1);

      expect(mockUsersService.removeRole).toHaveBeenCalledWith(1);
    });
  });
});