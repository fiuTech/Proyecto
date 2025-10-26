import { Body, Controller, Get, Post, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { AuthService } from '../auth/auth.service';

@Controller('pets')
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAll(@Query() filters: any) {
    const pets = await this.petsService.findAll(filters);
    return {
      success: true,
      data: pets,
      total: pets.length,
    };
  }

  @Post()
  async create(@Body() createPetDto: CreatePetDto, @Headers('authorization') authHeader: string) {
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const user = await this.authService.validateToken(token);
      
      if (user) {
        createPetDto.owner_email = user.email;
      }
    }

    const pet = await this.petsService.create(createPetDto);
    return {
      success: true,
      message: 'Mascota publicada exitosamente',
      data: pet,
    };
  }

  @Get('my-pets')
  async findMyPets(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token requerido');
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.validateToken(token);
    
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    const pets = await this.petsService.findByUser(user.email);
    return {
      success: true,
      data: pets,
      total: pets.length,
    };
  }
}