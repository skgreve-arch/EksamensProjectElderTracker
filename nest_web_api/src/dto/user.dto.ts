export class CreateUserDto {
  Email: string;
  Name: string;
  Password: string; // plain text input, hashed in service
  Role_ID: number;
}

export class UpdateUserDto {
  Email?: string;
  Name?: string;
  Password?: string; // plain text input, rehashed in service if provided
}

export class CreateRoleDto {
  Role: string;
}

export class LoginDto {
  Email: string;
  Password: string;
}