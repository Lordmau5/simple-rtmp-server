import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	create(@Body() createAuthDto: CreateAuthDto) {
		return this.authService.create(createAuthDto);
	}

	@Get()
	getAll() {
		return this.authService.getAll();
	}

	@Delete(':username')
	remove(@Param('username') username: string) {
		return this.authService.remove(username);
	}
}
