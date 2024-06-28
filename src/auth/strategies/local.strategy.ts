import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ email, password })
    if (!user)
      throw new UnauthorizedException(
        "L'adresse mail ou le mot de passe est incorrect"
      )
    if (user?.status === 'banned')
      throw new UnauthorizedException(
        "Vous avez été banni pour mauvaise conduite, veuillez contacter le support si vous pensez que c'est une erreur."
      )
    return user
  }
}
