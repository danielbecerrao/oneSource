import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { WidgetsModule } from './widgets/widgets.module';
import { DashboardsModule } from './dashboards/dashboards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow('typeorm'),
      inject: [ConfigService],
    }),
    AuthModule,
    ClientsModule,
    DashboardsModule,
    WidgetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
