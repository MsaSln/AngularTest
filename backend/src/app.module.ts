import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { RbacModule } from './rbac/rbac.module';
import { User } from './users/user.entity';
import { MenuGroup } from './menu/entities/menu-group.entity';
import { MenuItem } from './menu/entities/menu-item.entity';
import { Role } from './rbac/entities/role.entity';
import { Permission } from './rbac/entities/permission.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, MenuGroup, MenuItem, Role, Permission],
        synchronize: true, // Set to false in production
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MenuModule,
    RbacModule,
  ],
})
export class AppModule {}
