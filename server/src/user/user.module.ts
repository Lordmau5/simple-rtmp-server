import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordMiddleware } from 'src/password/password.middleware';

@Module({
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(PasswordMiddleware)
			.forRoutes(UserController);
	}
}
