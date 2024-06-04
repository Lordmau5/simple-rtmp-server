import { Controller, Get } from '@nestjs/common';
import { StreamsService } from './streams.service';

@Controller('streams')
export class StreamsController {
	constructor(private readonly streamService: StreamsService) {}

	@Get()
	getAll() {
		return this.streamService.getAll();
	}
}
