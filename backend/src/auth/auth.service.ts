import { Injectable } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessToken } from 'src/common/interfaces/access-token.interface';
import { Payload } from 'src/common/interfaces/payload.interface';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class AuthService {
  public constructor(
    private readonly clientsService: ClientsService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<Client> | null> {
    const client: Client | null =
      await this.clientsService.findOneByUsername(username);
    if (client) {
      const hashedPassword = await bcrypt.hash(pass, client.salt);
      if (client.password === hashedPassword) {
        const { password, salt, ...result } = client;
        return result;
      }
    }
    return null;
  }

  public login(client: Client): AccessToken {
    const payload: Payload = {
      id: client.id,
      name: client.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
