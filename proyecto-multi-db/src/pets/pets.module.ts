import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { Pet, PetSchema } from './schemas/pet.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
    AuthModule,
  ],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}