import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'streams',
        component: () => import('pages/StreamsPage.vue'),
    },
    {
        path: '/authorization',
        name: 'authorization',
        component: () => import('pages/AuthPage.vue'),
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
