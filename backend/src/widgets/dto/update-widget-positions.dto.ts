import { IsUUID, IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePositionDto {
  @IsUUID()
  @IsNotEmpty()
  public id: string;

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
}
