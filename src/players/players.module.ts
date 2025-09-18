import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]),
    HttpModule,
    ConfigModule.forRoot(),
  ],
  controllers: [PlayersController],
  providers: [PlayersService]
})
export class PlayersModule {}
