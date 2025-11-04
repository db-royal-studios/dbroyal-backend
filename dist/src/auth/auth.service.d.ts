import { JwtService } from '@nestjs/jwt';
import { SignUpDto, LoginDto } from './dto/create-auth.dto';
export declare class AuthService {
    private jwtService;
    private users;
    constructor(jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    validateUser(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
    }>;
}
