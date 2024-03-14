import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from 'src/database/typeorm/entities/route.entity';
import { RouteSeedService } from './route-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Route])],
  providers: [RouteSeedService],
  exports: [RouteSeedService],
})
export class RouteSeedModule {}
