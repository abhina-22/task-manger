import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}

    async signUp(credentialsDto: AuthCredentialsDto): Promise<void>{
       return this.userRepository.Signup(credentialsDto)
    }

    async signIn(credentialsDto: AuthCredentialsDto): Promise<{authToken: string}>{
        const username =  await this.userRepository.ValidatePw(credentialsDto)
        if (!username){
            throw new UnauthorizedException('Invalid credentials')
        }
        const payload: JwtPayload = {username}
        const authToken = await this.jwtService.sign(payload)
        return {authToken}
     }
}
