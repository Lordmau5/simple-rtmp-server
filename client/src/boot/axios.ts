import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Cookies } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const baseURL = import.meta.env.PROD
    ? '/api'
    : `${import.meta.env.VITE_APP_API_SERVER}/api`;

const api = axios.create({
    baseURL,
    timeout: 5000,
    transformRequest: (data, headers) => {
        const password = Cookies.get('password');
        if (password) {
            headers.Authorization = `Password ${password}`;
        }

        if (!data || data instanceof FormData) return data;

        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(data)) {
            params.append(key, value as string);
        }

        return params;
    },
});

export default boot(({ app }) => {
    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axios = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = api;
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API
});

export { api };
