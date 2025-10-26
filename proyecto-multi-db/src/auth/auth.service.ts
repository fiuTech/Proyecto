import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.userRepo.findOne({
      where: [{ username: registerDto.username }, { email: registerDto.email }],
    });

    if (existingUser) {
      throw new UnauthorizedException('El usuario o email ya existe');
    }

    const user = this.userRepo.create(registerDto);
    await this.userRepo.save(user);

    return { message: 'Usuario registrado exitosamente' };
  }

  async login(loginDto: LoginDto): Promise<{ user: any; token: string }> {
    const user = await this.userRepo.findOne({
      where: { 
        username: loginDto.username, 
        password: loginDto.password 
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // En una aplicación real, aquí generarías un JWT token
    const token = `token-${user.id}-${Date.now()}`;

    // Excluir la contraseña de la respuesta
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async validateToken(token: string): Promise<any> {
    // Simulación de validación de token
    if (token.startsWith('token-')) {
      const userId = token.split('-')[1];
      const user = await this.userRepo.findOne({ where: { id: parseInt(userId) } });
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    
    return null;
  }
}