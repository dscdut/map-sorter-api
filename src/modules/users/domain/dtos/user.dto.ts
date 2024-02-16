import { UniqueEntityID } from '@core/domain/unique-entity-id';

export interface UserDto {
  id: UniqueEntityID;
  fullName: string;
  email: string;
  avatar: string;
}
