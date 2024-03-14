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
            id: '18c1e2d6-23e6-4f75-980f-b133973eebec',
            fullName: 'User 1',
            email: 'user1@gmail.com',
          },
          {
            id: '0ff99ad3-7dac-40fb-a5cc-f3d884a87198',
            fullName: 'User 2',
            email: 'user2@gmail.com',
          },
          {
            id: '3187ed4d-3ebc-4b95-9a7d-0cb3b7cc3914',
            fullName: 'User 3',
            email: 'user3@gmail.com',
          },
        ]),
      );
    }
  }
}
