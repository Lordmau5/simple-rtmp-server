import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Database from 'src/db';

async function bootstrap() {
	Database.read();

	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');

	if (process.env.NODE_ENV === 'development') {
		app.enableCors();
	}

	await app.listen(Number(process.env.WEB_PORT));
}
bootstrap();
