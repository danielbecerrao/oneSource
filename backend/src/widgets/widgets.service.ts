import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { CreateWidgetDto } from './dto/create-widget.dto';
import type { UpdateWidgetDto } from './dto/update-widget.dto';
import { Widget } from './entities/widget.entity';
import { In, Repository } from 'typeorm';
import { UpdatePositionDto } from './dto/update-widget-positions.dto';

@Injectable()
export class WidgetsService {
  public constructor(
    @InjectRepository(Widget)
    private readonly widgetsRepository: Repository<Widget>,
  ) {}

  public async create(createWidgetDto: CreateWidgetDto): Promise<Widget> {
    const dashboard: Widget = this.widgetsRepository.create(createWidgetDto);
    return this.widgetsRepository.save(dashboard);
  }

  public async findOne(id: string): Promise<Widget> {
    return this.widgetsRepository.findOneByOrFail({
      id,
    });
  }

  public async update(
    id: string,
    updateWidgetDto: UpdateWidgetDto,
  ): Promise<Widget> {
    const dashboard: Widget = await this.findOne(id);
    return this.widgetsRepository.save(
      Object.assign(dashboard, updateWidgetDto),
    );
  }

  async remove(id: string): Promise<void> {
    await this.widgetsRepository.findOneByOrFail({
      id,
    });
    await this.widgetsRepository.softDelete(id);
  }

  async updatePositions(items: UpdatePositionDto[]): Promise<void> {
    if (!items.length) return;
    const ids = items.map((i) => i.id);

    const widgets = await this.widgetsRepository.find({
      where: { id: In(ids) },
    });

    const map = new Map(widgets.map((w) => [w.id, w]));
    for (const p of items) {
      const w = map.get(p.id);
      if (!w) continue;
      w.x = p.x;
      w.y = p.y;
      w.w = p.w;
      w.h = p.h;
    }
    await this.widgetsRepository.save([...map.values()]);
  }
}
