import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamsService {
	private streams: Set<string> = new Set();

	add(username: string) {
		this.streams.add(username);
	}

	has(username: string) {
		return this.streams.has(username);
	}

	remove(username: string) {
		return this.streams.delete(username);
	}

	getAll() {
		return [...this.streams.values()];
	}
}
