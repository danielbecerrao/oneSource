import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: AuthService) {
    super();
  }

  public async validate(email: string, password: string): Promise<Client> {
    const client = await this.authService.validateUser(email, password);
    if (!client || client instanceof Error) {
      throw new UnauthorizedException();
    }
    return client as Client;
  }
}
