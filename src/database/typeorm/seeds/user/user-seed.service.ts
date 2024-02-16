import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@database/typeorm/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            fullName: 'User 1',
            email: 'user1@gmail.com',
          },
          {
            fullName: 'User 2',
            email: 'user2@gmail.com',
          },
          {
            fullName: 'User 3',
            email: 'user3@gmail.com',
          },
        ]),
      );
    }
  }
}
