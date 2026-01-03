import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/users.entity';
import { StudentsAuthService } from '../students/students-auth.service';
import { TeachersAuthService } from '../teachers/teachers-auth.service';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly studentsAuth: StudentsAuthService,
    private readonly teachersAuth: TeachersAuthService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ access_token: string }> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(signupDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    // Create user
    const user = await this.usersService.create({
      ...signupDto,
      password: hashedPassword,
    });

    await this.setNewUserAsTeacherOrStudent(user);

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      lname: user.lname,
      role: user.role,
      locale: user.locale,
      avatar: user.avatar,
    };
    const access_token = this.jwtService.sign(payload);

    this.logger.warn(`New user with email: ${user.email} signed up`);

    return { access_token };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    // Find user by email
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      lname: user.lname,
      role: user.role,
      locale: user.locale,
      avatar: user.avatar,
    };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.usersService.findById(userId);
  }

  async setNewUserAsTeacherOrStudent(user: User) {
    switch (user.role) {
      case UserRole.TEACHER:
        return this.teachersAuth.addUserAsTeacher(user);
      case UserRole.STUDENT:
        return this.studentsAuth.addUserAsStudent(user);
      default:
        throw new Error(`Invalid role: ${user.role}`);
    }
  }
}
