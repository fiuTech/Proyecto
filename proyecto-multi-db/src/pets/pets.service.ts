import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePetDto } from './dto/create-pet.dto';
import { Pet, PetDocument } from './schemas/pet.schema';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet.name) private readonly petModel: Model<PetDocument>,
  ) {}

  async findAll(filters: any = {}): Promise<Pet[]> {
    const query: any = {};
    
    if (filters.mode) {
      query.mode = filters.mode;
    }
    
    if (filters.type) {
      query.type = filters.type;
    }
    
    if (filters.city) {
      query.city = new RegExp(filters.city, 'i');
    }
    
    if (filters.q) {
      query.$or = [
        { name: new RegExp(filters.q, 'i') },
        { description: new RegExp(filters.q, 'i') },
      ];
    }

    return this.petModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const createdPet = new this.petModel(createPetDto);
    return createdPet.save();
  }

  async findByUser(email: string): Promise<Pet[]> {
    return this.petModel.find({ owner_email: email }).sort({ createdAt: -1 }).exec();
  }
}