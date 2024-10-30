import { Module } from '@nestjs/common';
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
				WEB_PORT: Joi.number().default(3000),
				RTMP_PORT: Joi.number().default(1995),
				NODE_ENV: Joi.string()
					.valid('development', 'production')
					.default('production'),
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
})
export class AppModule { }
