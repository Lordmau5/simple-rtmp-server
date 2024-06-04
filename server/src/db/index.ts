import { readFile, writeFile } from 'fs/promises';

class Database {
	private filePath = 'auth.json';
	public auths = {};

	async read() {
		try {
			const data = await readFile(this.filePath, 'utf-8');
			this.auths = JSON.parse(data);
		} catch (error) {
			if (error.code === 'ENOENT') {
				// File does not exist
				return {};
			} else {
				throw error;
			}
		}
	}

	async write() {
		try {
			const jsonData = JSON.stringify(this.auths, null, 2);
			await writeFile(this.filePath, jsonData, 'utf-8');
		} catch (error) {
			throw error;
		}
	}
}

export default new Database();
