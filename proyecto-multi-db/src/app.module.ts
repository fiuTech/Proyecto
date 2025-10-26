import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    // Configuración MySQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'Alfred4321',
      database: process.env.MYSQL_DATABASE || 'bd_usuarios',
      entities: [User],
      synchronize: true,
      logging: true,
    }),
    
    // Configuración MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/'),
    
    AuthModule,
    PetsModule,
  ],
})
export class AppModule {}