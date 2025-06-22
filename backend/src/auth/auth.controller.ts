import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { GetUser } from '../common/decorators/user.decorator';
import type { AccessToken } from '../common/interfaces/access-token.interface';
import { Client } from 'src/clients/entities/client.entity';

@Controller()
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  public async login(@GetUser() client: Client): Promise<AccessToken> {
    return this.authService.login(client);
  }
}
