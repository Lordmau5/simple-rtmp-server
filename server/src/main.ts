import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Database from 'src/db';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { stat, copyFile, readFile } from 'fs/promises';
import { join } from 'path';

async function copyEnvIfNotExists() {
	const envFilePath = join(__dirname, '../.env');
	const defaultEnvFilePath = join(__dirname, '../.env.default');

	try {
		await stat(envFilePath);
	} catch {
		await copyFile(defaultEnvFilePath, envFilePath);
	}
}

async function loadCertificates() {
	// Get the key and cert from the main git folder
	const keyPath = join(__dirname, '../../key.pem');
	const certPath = join(__dirname, '../../cert.pem');

	try {
		await stat(keyPath);
		await stat(certPath);

		const key = await readFile(keyPath);
		const cert = await readFile(certPath);

		return { key, cert };
	} catch {
		return undefined;
	}
}

async function bootstrap() {
	await copyEnvIfNotExists();

	Database.read();

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({
			https: await loadCertificates()
		}),
	);
	app.setGlobalPrefix('api');

	if (process.env.NODE_ENV === 'development') {
		app.enableCors();
	}

	const port = Number(process.env.WEB_PORT);
	await app.listen({
		port,
		host: '0.0.0.0',
	});
	console.log(`Webserver listening on port ${port}`);
}
bootstrap();
