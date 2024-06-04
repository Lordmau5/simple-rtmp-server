import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class PasswordMiddleware implements NestMiddleware {
	use(
		req: FastifyRequest['raw'],
		res: FastifyReply['raw'],
		next: () => void,
	) {
		const password = req?.headers?.authorization || null;

		if (!password || password !== `Password ${process.env.PASSWORD}`) {
			res.writeHead(HttpStatus.UNAUTHORIZED, 'Invalid password').end();
			return;
		}

		next();
	}
}
