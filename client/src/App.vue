<template>
    <q-layout
        v-if="isAuthorized"
        view="hHh lpR fFf"
        transition-show="jump-down"
    >
        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-toolbar-title>
                    {{ title }}
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer
            :model-value="true"
            side="left"
            elevated
            persistent
            show-if-above
        >
            <q-list class="full-height column">
                <q-item-label
                    header
                >
                    Dashboard
                </q-item-label>

                <EssentialLink
                    v-for="link in linksList"
                    :key="link.title"
                    v-bind="link"
                />
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>

    </q-layout>

    <Login v-else />
</template>

<script setup>
import EssentialLink from 'components/EssentialLink.vue';
import Login from 'components/LoginComponent.vue';
import { useAppStore } from 'stores/app-store';
import { computed, onMounted, ref } from 'vue';

const appStore = useAppStore();

const title = ref('RTMP');

const linksList = [
    {
        title: 'Streams',
        caption: 'Check who\'s live',
        icon: 'tv',
        to: '/',
    },
    {
        title: 'Authorization',
        caption: 'Check and generate stream keys',
        icon: 'key',
        to: '/authorization',
    },
    {
        type: 'space',
    },
    {
        title: 'Logout',
        caption: 'Goodbye!',
        icon: 'logout',
        color: 'red',
        func: () => appStore.logout(),
    },
];

const words = {
    r: [
        'Rare', 'Rainy', 'Ragged', 'Raw', 'Randomized', 'Reachable', 'Reasonless',
        'Red', 'Really', 'Renewed', 'Remaining',
    ],
    t: [
        'Tactical', 'Tactful', 'Tainted', 'Taxing', 'Tangled', 'Taped', 'Talented',
        'Technical', 'Tentactular', 'Terrible',
    ],
    m: [
        'Main', 'Mainframe', 'Macho', 'Magenta', 'Match', 'Meal', 'Mesh',
        'Music', 'Major', 'Milk', 'Mint', 'Mobile',
    ],
    p: [
        'Potato', 'Partner', 'Peach', 'Pearl', 'Pet', 'Pilot', 'Poet', 'Prince',
        'Parcel', 'Pencil', 'Piano', 'Pickaxe',
    ],
};

const isAuthorized = computed(() => appStore.isAuthorized);

onMounted(() => {
    title.value = 'RTMP - ';
    title.value = `${title.value}${words.r[Math.floor(Math.random() * words.r.length)]} `;
    title.value = `${title.value}${words.t[Math.floor(Math.random() * words.t.length)]} `;
    title.value = `${title.value}${words.m[Math.floor(Math.random() * words.m.length)]} `;
    title.value = `${title.value}${words.p[Math.floor(Math.random() * words.p.length)]}`;
    document.title = title.value;

    appStore.getUserData();
});
</script>
