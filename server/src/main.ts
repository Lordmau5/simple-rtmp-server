import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Database from 'src/db';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
	Database.read();

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);
	app.setGlobalPrefix('api');

	if (process.env.NODE_ENV === 'development') {
		app.enableCors();
	}

	const port = Number(process.env.WEB_PORT);
	await app.listen(port, '0.0.0.0');
	console.log(`Webserver listening on port ${port}`);
}
bootstrap();
