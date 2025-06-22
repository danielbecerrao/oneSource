import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDashboardDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  public name: string;
}
