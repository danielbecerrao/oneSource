import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { CreateDashboardDto } from './dto/create-dashboard.dto';
import type { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { Dashboard } from './entities/dashboard.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class DashboardsService {
  public constructor(
    @InjectRepository(Dashboard)
    private readonly dashboardsRepository: Repository<Dashboard>,
  ) {}

  public async create(
    createDashboardDto: CreateDashboardDto,
    client: Client,
  ): Promise<Dashboard> {
    const dashboard: Dashboard =
      this.dashboardsRepository.create(createDashboardDto);
    dashboard.clientId = client.id;
    return this.dashboardsRepository.save(dashboard);
  }

  public async findAll(client: Client): Promise<Dashboard[]> {
    return this.dashboardsRepository.find({
      where: {
        clientId: client.id,
      },
      relations: ['widgets'],
    });
  }

  public async findOne(id: string): Promise<Dashboard> {
    return await this.dashboardsRepository.findOneOrFail({
      where: { id },
      relations: ['widgets'],
    });
  }

  public async update(
    id: string,
    updateDashboardDto: UpdateDashboardDto,
  ): Promise<Dashboard> {
    const dashboard: Dashboard = await this.findOne(id);
    return this.dashboardsRepository.save(
      Object.assign(dashboard, updateDashboardDto),
    );
  }
}
