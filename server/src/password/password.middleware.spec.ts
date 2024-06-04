import { PasswordMiddleware } from './password.middleware';

describe('PasswordMiddleware', () => {
	it('should be defined', () => {
		expect(new PasswordMiddleware()).toBeDefined();
	});
});
