import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MediaServerService } from 'src/media-server/media-server.service';
import { StreamsModule } from 'src/streams/streams.module';

@Module({
	imports: [AuthModule, StreamsModule],
	providers: [MediaServerService],
	exports: [MediaServerService],
})
export class MediaServerModule {}
