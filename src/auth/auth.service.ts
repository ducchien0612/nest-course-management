import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    this.logger.log(`Register attempt for username: ${createUserDto.username}`);
    const existingUser = await this.usersService.findByUsername(createUserDto.username);
    if (existingUser) {
      this.logger.warn(`Registration failed: Username ${createUserDto.username} already exists`);
      throw new ConflictException('Username already exists');
    }
    const existingEmail = await this.usersService.findByEmail(createUserDto.email);
    this.logger.warn(`Registration failed: Email ${createUserDto.email} already exists`);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersService.createUser(
      createUserDto.username,
      createUserDto.email,
      hashedPassword,
    );

    return user;
  }

  async login(loginDto: LoginDto) {
    this.logger.log(`Login attempt for username: ${loginDto.username}`);
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) {
      this.logger.warn(`Login failed: User ${loginDto.username} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }


    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { username: user.username, sub: user._id.toString() };
    const token = this.jwtService.sign(payload);
    this.logger.log(`User ${user.username} logged in successfully`);

    return { access_token: token };
  }
}
