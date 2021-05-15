import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";

const mockCredentialsDto = {
    username:'test',
    password: 'randomPassword124.'
}
describe('UserRespository', ()=>{
    let userRepository;

    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ],
        }).compile();
        
        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp', ()=>{
        let save

        beforeEach(()=>{
            save = jest.fn()
            userRepository.create = jest.fn().mockReturnValue({save});
        });

        it('successfully signs up the user', ()=>{
            save.mockResolvedValue(undefined)
            expect(userRepository.Signup(mockCredentialsDto)).resolves.not.toThrow()
        })
        
    })
    
})