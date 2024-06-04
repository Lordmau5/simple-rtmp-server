import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StreamsModule } from './streams/streams.module';
import { ConfigModule } from '@nestjs/config';

import Joi from 'joi';
import { MediaServerModule } from 'src/media-server/media-server.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env'],
			validationSchema: Joi.object({
				WEB_PORT: Joi.number().required(),
				RTMP_PORT: Joi.number().required(),
				NODE_ENV: Joi.string()
					.valid('development', 'production')
					.default('development'),
				PASSWORD: Joi.string().default('admin'),
			}),
			validationOptions: {
				abortEarly: true,
			},
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '../..', 'client/dist/spa'),
		}),
		UserModule,
		AuthModule,
		StreamsModule,
		MediaServerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
