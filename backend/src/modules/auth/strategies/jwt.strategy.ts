import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// En un ambiente real, esto vendría de variables de entorno y no de lectura de archivos síncrona
const publicKey = fs.readFileSync(path.join(process.cwd(), 'keys/jwtRS256.key.pub'), 'utf8');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, permissions: payload.permissions };
  }
}
