import { MiddlewareConsumer, Module } from '@nestjs/common';
import { StreamsService } from './streams.service';
import { StreamsController } from './streams.controller';
import { PasswordMiddleware } from 'src/password/password.middleware';

@Module({
	controllers: [StreamsController],
	providers: [StreamsService],
	exports: [StreamsService],
})
export class StreamsModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(PasswordMiddleware).forRoutes(StreamsController);
	}
}
