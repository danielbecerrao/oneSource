import { IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  public name!: string;

  @IsNotEmpty()
  public username!: string;

  @IsNotEmpty()
  public password!: string;
}
