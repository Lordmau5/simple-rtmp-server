import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class PasswordMiddleware implements NestMiddleware {	
	use(req: Request, res: Response, next: NextFunction) {
		const password = req?.headers?.authorization || null;
		
		if (!password || password !== `Password ${process.env.PASSWORD}`) {
			res.status(HttpStatus.UNAUTHORIZED).send();
			return;
		}

		next();
	}
}
