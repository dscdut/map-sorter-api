import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MapProvidersEnum } from '@shared/enum/map-providers.enum';
import { Route } from 'src/database/typeorm/entities/route.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RouteSeedService {
  constructor(
    @InjectRepository(Route)
    private repository: Repository<Route>,
  ) {}

  async run() {
    const count = await this.repository.count();
    const filePath = path.join(__dirname, 'cached-gg-map-response.json');
    const routes = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            id: '18c1e2d6-23e6-4f75-980f-b133973eebec',
            name: 'Route 1',
            pathDisplay: routes,
            provider: MapProvidersEnum.GOOGLE_MAP,
            user: {
              id: '18c1e2d6-23e6-4f75-980f-b133973eebec',
            },
          },
        ]),
      );
    }
  }
}
