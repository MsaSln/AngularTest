export class CreateUserDto {
  username: string;
  email: string;
  roleIds: number[]; // Array of role IDs to assign
}
