import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import type { Dashboard } from './entities/dashboard.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Client } from 'src/clients/entities/client.entity';
import { GetUser } from 'src/common/decorators/user.decorator';

@Controller('dashboards')
@UseGuards(JwtAuthGuard)
export class DashboardsController {
  public constructor(private readonly dashboardsService: DashboardsService) {}

  @Post()
  public async create(
    @Body() createDashboardDto: CreateDashboardDto,
    @GetUser() client: Client,
  ): Promise<Dashboard> {
    return this.dashboardsService.create(createDashboardDto, client);
  }

  @Get()
  public async findAll(@GetUser() client: Client): Promise<Dashboard[]> {
    return this.dashboardsService.findAll(client);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Dashboard> {
    return this.dashboardsService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateDashboardDto: UpdateDashboardDto,
  ): Promise<Dashboard> {
    return this.dashboardsService.update(id, updateDashboardDto);
  }
}
