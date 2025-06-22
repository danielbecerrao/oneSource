import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';
import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

config({ path: '.env' });

const configConnection = {
  type: `${process.env.TYPE}`,
  host: `${process.env.HOST}`,
  port: `${process.env.PORT_DB}`,
  username: `${process.env.USERNAME_DB}`,
  password: `${process.env.PASSWORD_DB}`,
  database: `${process.env.DATABASE}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
  autoLoadEntities: `${process.env.AUTOLOADENTITIES}`,
  synchronize: true,
};

export default registerAs('typeorm', () => configConnection);
export const connectionSource = new DataSource(
  configConnection as DataSourceOptions,
);
