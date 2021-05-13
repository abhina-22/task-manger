import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('/signup')
    singUp(@Body(ValidationPipe) credetialsDto: AuthCredentialsDto): Promise<void>{
        return this.authService.signUp(credetialsDto)
    }

    @Post('/signin')
    singnIn(@Body(ValidationPipe) credetialsDto: AuthCredentialsDto):Promise<{authToken: string}>{
        return this.authService.signIn(credetialsDto)
    }
}
