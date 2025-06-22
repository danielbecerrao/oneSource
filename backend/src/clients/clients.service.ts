import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { CreateClientDto } from './dto/create-client.dto';
import type { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  public constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  public async create(createClientDto: CreateClientDto): Promise<Client> {
    const existingClient: Client | null = await this.findOneByUsername(
      createClientDto.username,
    );
    if (existingClient) {
      throw new BadRequestException(
        'Ya existe un usuario registrado con ese usuario.',
      );
    }
    const client: Client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  public async findAll(): Promise<Client[]> {
    return this.clientsRepository.createQueryBuilder('clients').getMany();
  }

  public async findOne(id: string): Promise<Client> {
    return this.clientsRepository.findOneOrFail({
      where: { id },
    });
  }

  public async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    const client: Client = await this.findOne(id);
    if (
      updateClientDto.username &&
      updateClientDto.username !== client.username
    ) {
      const existingClient: Client | null = await this.findOneByUsername(
        updateClientDto.username,
      );
      if (existingClient) {
        throw new BadRequestException(
          'Ya existe un usuario registrado con ese usuario.',
        );
      }
    }
    return this.clientsRepository.save(Object.assign(client, updateClientDto));
  }

  public async findOneByUsername(username: string): Promise<Client | null> {
    return this.clientsRepository
      .createQueryBuilder('clients')
      .where('clients.username = :username', { username })
      .getOne();
  }
}
