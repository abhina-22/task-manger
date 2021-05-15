import * as bcrypt from 'bcrypt'

import { ConflictException, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth.credentials.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async Signup(credentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password} = credentialsDto
        const user = this.create()
        user.username = username
        user.salt = await bcrypt.genSalt()
        user.password =  await this.hashPassword(user.salt, password)

        try{
            await user.save()

        }catch(error){
            if(error.code === '23505'){ //duplicate user name
                throw new ConflictException('username already exists')
            }
            throw new InternalServerErrorException()
        }
    }
    

    async ValidatePw(credentialsDto: AuthCredentialsDto): Promise<string>{
        const { username, password} = credentialsDto
        const user = await this.findOne({username})
        if(user && await user.validatePW(password)){
            return user.username
        }
        else {
            return 
        }
    }

    private async hashPassword(salt: string, password: string): Promise<string>{
        return bcrypt.hash(password, salt)
    }
}