import { Injectable, OnModuleInit } from '@nestjs/common';
import NodeMediaServer from 'node-media-server';
import { AuthService } from 'src/auth/auth.service';
import { StreamsService } from 'src/streams/streams.service';

const rtmpConfig = {
	rtmp: {
		port: Number(process.env.RTMP_PORT),
		chunk_size: 60000,
		gop_cache: true,
		ping: 60,
		ping_timeout: 30,
	},
};

@Injectable()
export class MediaServerService implements OnModuleInit {
	private nms: NodeMediaServer = null;

	constructor(
		private readonly authService: AuthService,
		private readonly streamsService: StreamsService,
	) {
		this.nms = new NodeMediaServer(rtmpConfig);

		this.setupEvents();
	}

	onModuleInit() {
		this.setup();
	}

	setupEvents() {
		this.nms.on('prePublish', this.prePublish.bind(this));
		this.nms.on('donePublish', this.donePublish.bind(this));
	}

	stopSession(id: string) {
		const rtmpSession = this.nms.getSession(id) as any;
		rtmpSession.reject();
	}

	async prePublish(id, streamPath, args) {
		console.log(
			'[NodeEvent on prePublish]',
			`id=${id} StreamPath=${streamPath} args=${JSON.stringify(args)}`,
		);

		const username = this.getUsernameFromPath(streamPath);
		const auth = this.authService.get(username);
		if (!auth) {
			this.stopSession(id);
			console.log(`Invalid username! - ${username}`);
			return;
		}

		if (!args || args.pass !== auth?.password) {
			this.stopSession(id);
			console.log(`Invalid password for username '${username}'!`);
			return;
		}

		this.streamsService.add(username);
	}

	async donePublish(id, streamPath, args) {
		console.log(
			'[NodeEvent on donePublish]',
			`id=${id} StreamPath=${streamPath} args=${JSON.stringify(args)}`,
		);

		const username = this.getUsernameFromPath(streamPath);
		this.streamsService.remove(username);
	}

	setup() {
		this.nms.run();
	}

	getUsernameFromPath(path) {
		return path.substring(path.lastIndexOf('/') + 1);
	}
}
