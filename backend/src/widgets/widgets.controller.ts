import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import type { Widget } from './entities/widget.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePositionDto } from './dto/update-widget-positions.dto';

@Controller('widgets')
@UseGuards(JwtAuthGuard)
export class WidgetsController {
  public constructor(private readonly widgetsService: WidgetsService) {}

  @Post()
  public async create(
    @Body() createWidgetDto: CreateWidgetDto,
  ): Promise<Widget> {
    return this.widgetsService.create(createWidgetDto);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Widget> {
    return this.widgetsService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.widgetsService.remove(id);
    return { success: true };
  }

  @Patch('positions')
  async bulkPositions(@Body() dto: UpdatePositionDto[]) {
    await this.widgetsService.updatePositions(dto);
    return { success: true };
  }
}
