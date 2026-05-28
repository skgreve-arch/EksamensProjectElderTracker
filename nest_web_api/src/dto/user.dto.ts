export class CreateUserDto {
  Email: string;
  Name: string;
  Password: string;
  Hash?: string;
  Role_ID: number;
}

export class UpdateUserDto {
  Email?: string;
  Name?: string;
  Password?: string;
  Hash?: string;
}

export class CreateRoleDto {
  Role: string;
}