import { IsEnum, IsInt, IsNotEmpty, IsObject } from 'class-validator';
import { WidgetType } from '../entities/widget.entity';

export class CreateWidgetDto {
  @IsEnum(['info', 'top', 'chart'])
  @IsNotEmpty()
  public type: WidgetType;

  @IsInt()
  @IsNotEmpty()
  public x: number;

  @IsInt()
  @IsNotEmpty()
  public y: number;

  @IsInt()
  @IsNotEmpty()
  public w: number;

  @IsInt()
  @IsNotEmpty()
  public h: number;

  @IsNotEmpty()
  public dashboardId: string;

  @IsObject()
  @IsNotEmpty()
  public config: any;
}
