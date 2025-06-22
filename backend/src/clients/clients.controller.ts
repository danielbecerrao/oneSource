import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ClientsController {
  public constructor(private readonly clientsService: ClientsService) {}

  @Post()
  public async create(
    @Body() createClientDto: CreateClientDto,
  ): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  public async findAll(): Promise<Client[]> {
    return this.clientsService.findAll();
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.update(id, updateClientDto);
  }
}
