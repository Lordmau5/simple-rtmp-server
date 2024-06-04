import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import Database from 'src/db';

import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
	create(createAuthDto: CreateAuthDto) {
		if (Database.auths[createAuthDto.username]) {
			return { error: 'ALREADY_EXISTS' };
		}

		Database.auths[createAuthDto.username] = nanoid(8);
		Database.write();

		return this.getAll();
	}

	get(username: string) {
		const auth = Database.auths[username];

		if (!auth) return false;

		return { username, password: auth };
	}

	getAll() {
		return Database.auths;
	}

	remove(username: string) {
		if (!Database.auths[username]) {
			return { error: 'DOES_NOT_EXIST' };
		}

		delete Database.auths[username];
		Database.write();

		return this.getAll();
	}
}
