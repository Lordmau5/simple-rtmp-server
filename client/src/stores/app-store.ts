import { defineStore } from 'pinia';
import { Cookies } from 'quasar';

import { api } from '../boot/axios';

interface User {
	authorized: boolean;
}

export const useAppStore = defineStore('app', {
	state: () => ({ user: null as User | null }),
	getters: {
		isAuthorized: (state) => state.user?.authorized,
	},
	actions: {
		async login(password: string) {
			// Set password cookie, make it expire in 7 days
			const isSecure = window.location.protocol === 'https:';

			Cookies.set('password', password, {
				expires: 7,
				sameSite: 'Lax',
				secure: isSecure ? import.meta.env.PROD : false, // true if in prod, false if in dev
			});

			await this.getUserData();
		},

		async getUserData() {
			try {
				const response = await api.get('user/me');

				this.user = response.data;
			} catch (_) {
				// If we error, the password is usually wrong.
			}
		},

		async logout() {
			try {
				Cookies.remove('password');

				this.user = null;
			} catch (error) {
				console.error(error);
			}
		},
	},
});
